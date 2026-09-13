"""
Interview WebSocket Router — Real-time dynamic interview session.

WebSocket endpoint: ws://localhost:8000/ws/interview/{session_id}?token=<JWT>

Protocol:
  Client → Server messages:
    {"type": "answer", "text": "...", "emotion": {...}, "eye_contact": 0.85, "audio_b64": "..."}
    {"type": "start"}   — request first question
    {"type": "end"}     — end the interview

  Server → Client messages:
    {"type": "question", "question": "...", "question_number": 1, "stage": "...", "tts_text": "..."}
    {"type": "feedback", "feedback": "...", "score": 78, "strengths": [...]}
    {"type": "thinking"}  — AI is generating next question
    {"type": "complete", "redirect_url": "/reports/<id>"}
    {"type": "error", "message": "..."}

The WebSocket maintains conversation context in memory per session.
"""

import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from fastapi.websockets import WebSocketState

from app.ai.answer_evaluator import evaluate_answer
from app.ai.followup_generator import generate_closing_question
from app.ai.resume_parser import get_or_create_resume_context
from app.ai.interview_engine import (
    generate_opening_question,
    process_candidate_answer_and_next_question,
)
from app.ai.speech_service import transcribe_audio_hf
from app.config import settings
from app.database import get_database
from app.services.auth_service import decode_token
from app.services.audio_service import analyze_voice

import os
import base64
import tempfile

router = APIRouter(tags=["Interview WebSocket"])
logger = logging.getLogger(__name__)

# In-memory conversation state (cleared on server restart — acceptable for college project)
# For production, use Redis. Maps session_id → list of {question, answer} dicts
_session_contexts: Dict[str, List[Dict[str, str]]] = {}


async def _send(ws: WebSocket, data: dict):
    """Safe send that checks connection state."""
    try:
        if ws.client_state == WebSocketState.CONNECTED:
            await ws.send_json(data)
    except Exception as e:
        logger.warning("WebSocket send failed: %s", e)


async def _authenticate_ws(token: Optional[str]) -> Optional[dict]:
    """Validate JWT token from WebSocket query param."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        db = get_database()
        user = await db["users"].find_one({"email": payload.get("sub")})
        if user:
            user["id"] = str(user["_id"])
        return user
    except Exception as e:
        logger.warning("WS auth failed: %s", e)
        return None


async def _save_question_to_db(
    db,
    interview_id: str,
    question_number: int,
    question_text: str,
):
    """Append a new dynamic question to the interview's questions array."""
    new_q = {
        "id": question_number,
        "question_text": question_text,
        "answer_text": None,
        "audio_path": None,
        "emotion_summary": None,
        "eye_contact_score": None,
        "voice_metrics": None,
        "evaluation": None,
    }
    await db["interviews"].update_one(
        {"_id": ObjectId(interview_id)},
        {"$push": {"questions": new_q}}
    )


async def _update_answer_in_db(
    db,
    interview_id: str,
    question_number: int,
    answer_text: str,
    emotion_summary: dict,
    eye_contact_score: float,
    voice_metrics: dict,
    evaluation: dict,
):
    """Update a specific question's answer in MongoDB."""
    await db["interviews"].update_one(
        {"_id": ObjectId(interview_id), "questions.id": question_number},
        {"$set": {
            "questions.$.answer_text": answer_text,
            "questions.$.emotion_summary": emotion_summary,
            "questions.$.eye_contact_score": eye_contact_score,
            "questions.$.voice_metrics": voice_metrics,
            "questions.$.evaluation": evaluation,
        }}
    )


@router.websocket("/ws/interview/{session_id}")
async def interview_websocket(
    websocket: WebSocket,
    session_id: str,
    token: Optional[str] = Query(None),
):
    """
    Real-time dynamic interview WebSocket.
    Generates contextual follow-up questions based on candidate answers.
    """
    await websocket.accept()
    logger.info("WebSocket connection accepted for session: %s", session_id)

    # ── Auth ──────────────────────────────────────────────────────────────────
    current_user = await _authenticate_ws(token)
    if not current_user:
        await _send(websocket, {"type": "error", "message": "Authentication failed. Please log in again."})
        await websocket.close(code=4001)
        return

    # ── Load Interview Session ─────────────────────────────────────────────────
    db = get_database()
    if not ObjectId.is_valid(session_id):
        await _send(websocket, {"type": "error", "message": "Invalid session ID."})
        await websocket.close(code=4002)
        return

    interview = await db["interviews"].find_one({
        "_id": ObjectId(session_id),
        "user_id": ObjectId(current_user["id"])
    })
    if not interview:
        await _send(websocket, {"type": "error", "message": "Interview session not found."})
        await websocket.close(code=4003)
        return

    if interview["status"] == "completed":
        await _send(websocket, {
            "type": "complete",
            "message": "This interview is already completed.",
            "redirect_url": f"/reports/{session_id}"
        })
        await websocket.close()
        return

    # Load structured resume context for candidate
    resume_context = await get_or_create_resume_context(current_user["id"], db)

    # Initialize conversational state
    context_key = session_id
    if context_key not in _session_contexts or not isinstance(_session_contexts[context_key], dict):
        _session_contexts[context_key] = {
            "history": [],
            "resume_context": resume_context,
            "current_topic": "Project Overview",
            "turns_on_topic": 1,
            "difficulty": "easy",
            "current_question": "",
        }

    session_state = _session_contexts[context_key]
    role = interview.get("role", "Software Engineer")
    interview_type = interview.get("interview_type", "Technical")
    experience_level = interview.get("experience_level", "Entry")

    # Track question number (continue from where we left off)
    question_number = len(interview.get("questions", [])) + 1
    max_questions = settings.MAX_INTERVIEW_QUESTIONS or 10

    current_question_text = session_state.get("current_question", "")

    logger.info(
        "WS Interview active: session=%s user=%s role=%s type=%s Q#%d",
        session_id, current_user["id"], role, interview_type, question_number
    )

    try:
        async for raw_message in websocket.iter_text():
            try:
                message = json.loads(raw_message)
            except json.JSONDecodeError:
                await _send(websocket, {"type": "error", "message": "Invalid JSON message."})
                continue

            msg_type = message.get("type", "")

            # ── START: Generate resume-driven opening question ───────────────
            if msg_type == "start":
                await _send(websocket, {"type": "thinking"})

                opening_res = await generate_opening_question(
                    role=role,
                    experience_level=experience_level,
                    interview_type=interview_type,
                    resume_context=resume_context,
                )
                current_question_text = opening_res["question"]

                # Update state
                session_state["current_question"] = current_question_text
                session_state["current_topic"] = opening_res["current_topic"]
                session_state["turns_on_topic"] = 1
                session_state["difficulty"] = opening_res.get("difficulty", "medium")
                _session_contexts[context_key] = session_state

                # Save to DB
                await _save_question_to_db(db, session_id, question_number, current_question_text)

                await _send(websocket, {
                    "type": "question",
                    "question": current_question_text,
                    "question_number": question_number,
                    "stage": opening_res.get("stage", "project_deep_dive"),
                    "difficulty": opening_res.get("difficulty", "opening"),
                    "question_type": opening_res.get("question_type", "project_opening"),
                    "current_topic": opening_res["current_topic"],
                    "tts_text": opening_res["tts_text"],
                })
                logger.info("Opening Q#%d sent: %s...", question_number, current_question_text[:70])

            # ── ANSWER: Understand answer, evaluate & generate counter-question ──
            elif msg_type == "answer":
                raw_text = message.get("text", "").strip()
                # Ignore placeholder strings so we don't treat them as real answers
                placeholders = [
                    "(no transcript — audio submitted)",
                    "(no transcript)",
                    "(audio was recorded but could not be transcribed. speech-to-text requires an internet connection.)",
                    "(no answer provided)",
                    "(transcription failed)",
                ]
                answer_text = "" if raw_text.lower() in placeholders else raw_text

                emotion_summary = message.get("emotion", {"neutral": 100.0})
                eye_contact_score = float(message.get("eye_contact", 85.0))
                audio_b64 = message.get("audio_b64", "")

                if not answer_text and not audio_b64:
                    await _send(websocket, {"type": "error", "message": "No answer or audio received. Please try speaking again."})
                    continue

                # Process audio if provided
                voice_metrics = {"duration_seconds": 0, "speaking_speed": 120, "filler_words_count": 0}
                if audio_b64:
                    try:
                        audio_bytes = base64.b64decode(audio_b64)
                        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                            tmp.write(audio_bytes)
                            tmp_path = tmp.name
                        if not answer_text:
                            answer_text = await transcribe_audio_hf(tmp_path, current_question_text)
                        voice_metrics = await analyze_voice(tmp_path)
                        os.unlink(tmp_path)
                    except Exception as e:
                        logger.error("WS audio processing failed: %s", e)

                if not answer_text or answer_text.strip() == "":
                    answer_text = "(Candidate did not speak or audio was inaudible)"

                # Signal thinking
                await _send(websocket, {"type": "thinking"})

                # Fetch active session state
                curr_state = _session_contexts.get(context_key, session_state)
                curr_topic = curr_state.get("current_topic", "Project Overview")
                curr_turns = curr_state.get("turns_on_topic", 1)
                curr_diff = curr_state.get("difficulty", "easy")
                history = curr_state.get("history", [])

                # Process answer with unified interview engine
                result = await process_candidate_answer_and_next_question(
                    prev_question=current_question_text,
                    candidate_answer=answer_text,
                    role=role,
                    interview_type=interview_type,
                    current_topic=curr_topic,
                    turns_on_topic=curr_turns,
                    conversation_history=history,
                    resume_context=resume_context,
                    current_difficulty=curr_diff,
                    question_number=question_number,
                )

                evaluation = result["evaluation"]
                answer_score = result["score"]

                # Update answer details in MongoDB
                await _update_answer_in_db(
                    db=db,
                    interview_id=session_id,
                    question_number=question_number,
                    answer_text=answer_text,
                    emotion_summary=emotion_summary,
                    eye_contact_score=eye_contact_score,
                    voice_metrics=voice_metrics,
                    evaluation=evaluation,
                )

                # Send rich feedback for this answer
                await _send(websocket, {
                    "type": "feedback",
                    "question_number": question_number,
                    "answer_text": answer_text,
                    "score": answer_score,
                    "feedback": result["feedback"],
                    "strengths": result["detected_topics"],
                    "improvements": result["missing_concepts"],
                    "candidate_behavior": result["candidate_behavior"],
                    "evaluation": evaluation,
                })

                # Append turn to history
                history.append({
                    "question": current_question_text,
                    "answer": answer_text,
                    "score": answer_score,
                    "detected_topics": result["detected_topics"],
                    "missing_concepts": result["missing_concepts"],
                })

                # Update session state with new topic & difficulty progression
                curr_state["history"] = history
                curr_state["current_topic"] = result["current_topic"]
                curr_state["turns_on_topic"] = result["turns_on_topic"]
                curr_state["difficulty"] = result["difficulty"]
                _session_contexts[context_key] = curr_state

                question_number += 1

                # Check if we should end interview or ask the counter-question
                if question_number > max_questions:
                    closing_q = await generate_closing_question(role)
                    curr_state["current_question"] = closing_q
                    await _send(websocket, {
                        "type": "question",
                        "question": closing_q,
                        "question_number": question_number,
                        "stage": "closing",
                        "difficulty": "closing",
                        "question_type": "closing",
                        "tts_text": closing_q,
                        "is_last": True,
                    })
                    current_question_text = closing_q
                else:
                    counter_q = result["next_question"]
                    current_question_text = counter_q
                    curr_state["current_question"] = counter_q

                    # Save next counter-question to DB
                    await _save_question_to_db(db, session_id, question_number, counter_q)

                    await _send(websocket, {
                        "type": "question",
                        "question": counter_q,
                        "question_number": question_number,
                        "stage": "dynamic",
                        "difficulty": result["difficulty"],
                        "question_type": result["question_type"],
                        "current_topic": result["current_topic"],
                        "topics_detected": result["detected_topics"],
                        "missing_concepts": result["missing_concepts"],
                        "tts_text": counter_q,
                    })
                    logger.info("Counter Q#%d sent: %s...", question_number, counter_q[:70])

            # ── END: Complete the interview ───────────────────────────────────
            elif msg_type == "end":
                from app.ai.interview_scorer import calculate_final_score

                # Reload interview to get all answered questions
                interview_fresh = await db["interviews"].find_one({"_id": ObjectId(session_id)})
                valid_qs = [q for q in interview_fresh.get("questions", []) if q.get("evaluation")]

                if not valid_qs:
                    await _send(websocket, {"type": "error", "message": "Please answer at least one question before ending."})
                    continue

                eye_scores = [q["eye_contact_score"] for q in valid_qs if q.get("eye_contact_score") is not None]
                eye_avg = sum(eye_scores) / len(eye_scores) if eye_scores else 80.0

                feedback_report = await calculate_final_score(
                    questions_data=valid_qs,
                    interview_type=interview_type,
                    eye_contact_avg=eye_avg,
                    role=role,
                )

                completed_at = datetime.utcnow()
                created_at = interview.get("created_at") or completed_at
                duration = max(0, int((completed_at - created_at).total_seconds()))

                await db["interviews"].update_one(

                    {"_id": ObjectId(session_id)},
                    {"$set": {
                        "status": "completed",
                        "completed_at": completed_at,
                        "overall_score": feedback_report["overall_score"],
                        "scores_breakdown": feedback_report["scores_breakdown"],
                        "feedback": feedback_report["feedback"],
                        "duration_seconds": duration,
                    }}
                )

                # Clean up session context
                _session_contexts.pop(context_key, None)

                await _send(websocket, {
                    "type": "complete",
                    "overall_score": feedback_report["overall_score"],
                    "redirect_url": f"/reports/{session_id}",
                })
                logger.info("Interview %s completed. Score: %d", session_id, feedback_report["overall_score"])
                break

            else:
                await _send(websocket, {"type": "error", "message": f"Unknown message type: {msg_type}"})

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected for session: %s", session_id)
    except Exception as e:
        logger.error("WebSocket error for session %s: %s", session_id, e, exc_info=True)
        await _send(websocket, {"type": "error", "message": "An unexpected server error occurred."})
    finally:
        logger.info("WebSocket session %s closed", session_id)
