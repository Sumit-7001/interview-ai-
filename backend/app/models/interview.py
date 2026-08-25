from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.utils.bson_util import PyObjectId

class QuestionDB(BaseModel):
    id: int  # 1-indexed question number
    question_text: str
    answer_text: Optional[str] = None  # User's response transcription
    audio_path: Optional[str] = None  # Local filesystem path or URL to recorded response
    emotion_summary: Optional[Dict[str, float]] = None  # Avg of webcam emotion frames {"neutral": 0.5, ...}
    eye_contact_score: Optional[float] = None  # Average eye contact percentage during this question
    voice_metrics: Optional[Dict[str, Any]] = None  # Speech speed, filler words, pause duration, etc.
    evaluation: Optional[Dict[str, Any]] = None  # AI evaluation breakdown: score, feedback, relevance, correctness...

class InterviewDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId
    role: str
    experience_level: str  # e.g., "Entry", "Mid", "Senior"
    interview_type: str  # e.g., "Technical", "HR", "Behavioral", "Resume-Based", "Mixed"
    status: str = "pending"  # "pending", "active", "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    questions: List[QuestionDB] = Field(default_factory=list)
    
    # Aggregated metrics (calculated when status changes to completed)
    overall_score: Optional[float] = None
    scores_breakdown: Optional[Dict[str, float]] = None  # {"technical": ..., "communication": ..., "answer_quality": ..., "confidence": ..., "eye_contact": ..., "speech_clarity": ...}
    feedback: Optional[Dict[str, Any]] = None  # {"what_went_well": [], "areas_to_improve": [], "recommendations": ""}
    duration_seconds: Optional[int] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
