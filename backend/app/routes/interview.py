import os
import json
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import StreamingResponse
from bson import ObjectId
from typing import List, Optional
from app.database import get_database
from app.schemas.interview import InterviewCreate, InterviewOut, QuestionOut, EmotionRequest, EmotionResponse
from app.services.auth_service import get_current_user
from app.ai.emotion_service import analyze_emotion
from app.ai.speech_service import transcribe_audio_hf
from app.ai.question_generator import generate_questions
from app.ai.answer_evaluator import evaluate_answer
from app.ai.interview_scorer import calculate_final_score
from app.services.audio_service import analyze_voice
from app.services.pdf_service import generate_pdf_report

router = APIRouter(tags=["Interviews"])
logger = logging.getLogger(__name__)

# Ensure media directory exists
AUDIO_UPLOAD_DIR = "uploads/audio"
os.makedirs(AUDIO_UPLOAD_DIR, exist_ok=True)

@router.post("/api/interviews", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
async def create_interview(
    payload: InterviewCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    # Check if user has an uploaded resume
    resume = await db["resumes"].find_one({"user_id": ObjectId(current_user["id"])})
    resume_text = resume.get("parsed_text") if resume else None
    
    # Generate Questions using Qwen3 AI Service
    try:
        question_list = await generate_questions(
            role=payload.role,
            experience_level=payload.experience_level,
            interview_type=payload.interview_type,
            resume_text=resume_text,
            num_questions=5
        )
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        question_list = [
            "What is your understanding of the role, and how do your skills align with the description?",
            "Tell me about a technical project you completed that you are particularly proud of.",
            "How do you handle debugging or identifying errors under tight deadlines?",
            "Describe how you coordinate with engineers, product managers, and designers.",
            "Where do you see the industry heading, and how do you keep up with changes?"
        ]
        
    # Build questions array DB structure
    db_questions = []
    for idx, q_text in enumerate(question_list):
        db_questions.append({
            "id": idx + 1,
            "question_text": q_text,
            "answer_text": None,
            "audio_path": None,
            "emotion_summary": None,
            "eye_contact_score": None,
            "voice_metrics": None,
            "evaluation": None
        })
        
    interview_doc = {
        "user_id": ObjectId(current_user["id"]),
        "role": payload.role,
        "experience_level": payload.experience_level,
        "interview_type": payload.interview_type,
        "status": "active",
        "created_at": datetime.utcnow(),
        "completed_at": None,
        "questions": db_questions,
        "overall_score": None,
        "scores_breakdown": None,
        "feedback": None,
        "duration_seconds": None
    }
    
    result = await db["interviews"].insert_one(interview_doc)
    created = await db["interviews"].find_one({"_id": result.inserted_id})
    created["id"] = str(created["_id"])
    return created

@router.get("/api/interviews", response_model=List[InterviewOut])
async def get_interviews_history(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db["interviews"].find({"user_id": ObjectId(current_user["id"])}).sort("created_at", -1)
    interviews = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        interviews.append(doc)
    return interviews

@router.get("/api/interviews/{id}", response_model=InterviewOut)
async def get_interview(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid interview ID format.")
        
    doc = await db["interviews"].find_one({"_id": ObjectId(id), "user_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Interview session not found.")
        
    doc["id"] = str(doc["_id"])
    return doc

@router.post("/api/interviews/{id}/answer")
async def answer_question(
    id: str,
    question_id: int = Form(...),
    eye_contact_score: float = Form(...),
    emotion_summary_json: str = Form(...),
    audio: UploadFile = File(...),
    browser_transcript: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid interview ID format.")
        
    interview = await db["interviews"].find_one({"_id": ObjectId(id), "user_id": ObjectId(current_user["id"])})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found.")
        
    # Check if question exists
    target_q = None
    for q in interview["questions"]:
        if q["id"] == question_id:
            target_q = q
            break
            
    if not target_q:
        raise HTTPException(status_code=400, detail="Question number does not exist in this session.")
        
    # Parse emotion summary
    try:
        emotion_summary = json.loads(emotion_summary_json)
    except Exception:
        emotion_summary = {"neutral": 100.0}
        
    # Save audio file
    filename = f"{id}_q{question_id}_{int(datetime.utcnow().timestamp())}.wav"
    audio_path = os.path.join(AUDIO_UPLOAD_DIR, filename)
    try:
        with open(audio_path, "wb") as f:
            f.write(await audio.read())
    except Exception as e:
        logger.error(f"Failed to write audio file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save audio file.")
        
    # 1. Transcribe via HuggingFace Whisper (with smart fallback)
    answer_text = await transcribe_audio_hf(audio_path, target_q["question_text"], browser_transcript)
    
    # 2. Analyze voice characteristics (Librosa — unchanged)
    voice_metrics = await analyze_voice(audio_path)
    
    # 3. Grade answer: Qwen3 LLM + BGE semantic similarity combined
    evaluation = await evaluate_answer(
        question=target_q["question_text"],
        answer=answer_text,
        interview_type=interview.get("interview_type", "Technical"),
        role=interview.get("role", "Software Engineer"),
    )
    
    # Update question details in MongoDB
    update_data = {
        "questions.$.answer_text": answer_text,
        "questions.$.audio_path": audio_path,
        "questions.$.emotion_summary": emotion_summary,
        "questions.$.eye_contact_score": eye_contact_score,
        "questions.$.voice_metrics": voice_metrics,
        "questions.$.evaluation": evaluation
    }
    
    await db["interviews"].update_one(
        {"_id": ObjectId(id), "questions.id": question_id},
        {"$set": update_data}
    )
    
    # Return full evaluation data including transcript
    return {
        "question_id": question_id,
        "answer_text": answer_text,
        "eye_contact_score": eye_contact_score,
        "emotion_summary": emotion_summary,
        "voice_metrics": voice_metrics,
        "evaluation": evaluation
    }

@router.post("/api/interviews/{id}/complete", response_model=InterviewOut)
async def complete_interview(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid interview ID format.")
        
    interview = await db["interviews"].find_one({"_id": ObjectId(id), "user_id": ObjectId(current_user["id"])})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found.")
        
    # Aggregate evaluations
    valid_qs = [q for q in interview["questions"] if q.get("evaluation") is not None]
    if not valid_qs:
        raise HTTPException(status_code=400, detail="Cannot complete an interview without answering any questions.")
        
    # Average eye contact
    eye_scores = [q["eye_contact_score"] for q in valid_qs if q.get("eye_contact_score") is not None]
    eye_avg = sum(eye_scores) / len(eye_scores) if eye_scores else 80.0
    
    # Use weighted scoring engine (type-specific weights)
    feedback_report = await calculate_final_score(
        questions_data=valid_qs,
        interview_type=interview.get("interview_type", "Technical"),
        eye_contact_avg=eye_avg,
        role=interview.get("role", "Software Engineer"),
    )
    
    # Calculate session duration
    completed_at = datetime.utcnow()
    duration = int((completed_at - interview["created_at"]).total_seconds())
    
    # Persist results
    update_doc = {
        "status": "completed",
        "completed_at": completed_at,
        "overall_score": feedback_report["overall_score"],
        "scores_breakdown": feedback_report["scores_breakdown"],
        "feedback": feedback_report["feedback"],
        "duration_seconds": duration
    }
    
    await db["interviews"].update_one(
        {"_id": ObjectId(id)},
        {"$set": update_doc}
    )
    
    updated = await db["interviews"].find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated["_id"])
    return updated

@router.get("/api/reports/{id}/pdf")
async def get_pdf_report(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid report/interview ID format.")
        
    interview = await db["interviews"].find_one({"_id": ObjectId(id), "user_id": ObjectId(current_user["id"])})
    if not interview or interview["status"] != "completed":
        raise HTTPException(status_code=404, detail="Completed report not found.")
        
    pdf_buffer = generate_pdf_report(interview)
    
    filename = f"InterviewAI_Report_{id[:8]}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/api/emotion/analyze", response_model=EmotionResponse)
async def analyze_frame(
    payload: EmotionRequest,
    current_user: dict = Depends(get_current_user)
):
    """Real-time endpoint called periodically during interview to detect facial expression signals."""
    try:
        dominant, probs, eyes_detected = await analyze_emotion(payload.frame)
        return {
            "dominant_emotion": dominant,
            "emotion_probabilities": probs,
            "eyes_detected": eyes_detected
        }
    except Exception as e:
        logger.error(f"Emotion analysis route failed: {e}")
        return {
            "dominant_emotion": "neutral",
            "emotion_probabilities": {"neutral": 100.0},
            "eyes_detected": True
        }
