from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class InterviewCreate(BaseModel):
    role: str = Field(..., example="Software Engineer")
    experience_level: str = Field(..., example="Mid")  # Entry, Mid, Senior
    interview_type: str = Field(..., example="Technical")  # Technical, HR, Behavioral, Resume-Based, Mixed

class QuestionOut(BaseModel):
    id: int
    question_text: str
    answer_text: Optional[str] = None
    emotion_summary: Optional[Dict[str, float]] = None
    eye_contact_score: Optional[float] = None
    voice_metrics: Optional[Dict[str, Any]] = None
    evaluation: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class InterviewOut(BaseModel):
    id: str
    role: str
    experience_level: str
    interview_type: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[QuestionOut]
    overall_score: Optional[float] = None
    scores_breakdown: Optional[Dict[str, float]] = None
    feedback: Optional[Dict[str, Any]] = None
    duration_seconds: Optional[int] = None

    class Config:
        from_attributes = True

class EmotionRequest(BaseModel):
    frame: str  # Base64 string of webcam snapshot

class EmotionResponse(BaseModel):
    dominant_emotion: str
    emotion_probabilities: Dict[str, float]
    eyes_detected: Optional[bool] = None
