"""
AI Router — /api/ai/* endpoints

Provides:
  GET  /api/ai/health           — AI service availability status
  POST /api/ai/generate-question — On-demand question generation (testing/preview)

SECURITY: No secrets are ever returned in responses.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.ai.hf_client import hf_client
from app.ai.question_generator import generate_questions
from app.config import settings
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI Services"])
logger = logging.getLogger(__name__)


# ── Health Check ──────────────────────────────────────────────────────────────

@router.get("/health")
async def ai_health_check():
    """
    Check availability of all AI/ML services.
    Returns status labels: 'available' | 'loading' | 'unavailable' | 'mock'
    Never exposes tokens, model internal details, or stack traces.
    """
    has_token = bool(settings.HF_TOKEN and settings.HF_TOKEN.strip())
    mock_mode = settings.AI_MOCK_MODE

    if mock_mode:
        return {
            "llm": "mock",
            "fallback_llm": "mock",
            "whisper": "mock",
            "embedding": "mock",
            "emotion_detection": "checking",
            "eye_contact": "available",
            "mock_mode": True,
        }

    if not has_token:
        return {
            "llm": "unavailable",
            "fallback_llm": "unavailable",
            "whisper": "unavailable",
            "embedding": "unavailable",
            "emotion_detection": "checking",
            "eye_contact": "available",
            "mock_mode": False,
            "note": "HF_TOKEN not configured. AI services running in fallback mode.",
        }

    # Ping each model with appropriate endpoint type
    llm_status = await hf_client.health_check(settings.HF_LLM_MODEL, model_type="llm")
    fallback_status = await hf_client.health_check(settings.HF_LLM_FALLBACK_MODEL, model_type="llm")
    whisper_status = await hf_client.health_check(settings.HF_WHISPER_MODEL, model_type="whisper")
    embed_status = await hf_client.health_check(settings.HF_EMBEDDING_MODEL, model_type="embedding")

    # Check DeepFace availability locally
    try:
        from app.services.cv_service import CV_LIBS_AVAILABLE
        emotion_status = "available" if CV_LIBS_AVAILABLE else "unavailable"
    except Exception:
        emotion_status = "unavailable"

    return {
        "llm": llm_status,
        "fallback_llm": fallback_status,
        "whisper": whisper_status,
        "embedding": embed_status,
        "emotion_detection": emotion_status,
        "eye_contact": "available",
        "mock_mode": False,
    }


# ── Question Preview Endpoint ─────────────────────────────────────────────────

class QuestionRequest(BaseModel):
    role: str = "Software Engineer"
    experience_level: str = "Mid"
    interview_type: str = "Technical"
    resume_text: Optional[str] = None
    num_questions: int = 3


@router.post("/generate-question")
async def preview_questions(
    payload: QuestionRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Preview-generate questions using the full AI pipeline.
    Useful for testing Qwen3 connectivity before starting a full session.
    """
    try:
        questions = await generate_questions(
            role=payload.role,
            experience_level=payload.experience_level,
            interview_type=payload.interview_type,
            resume_text=payload.resume_text,
            num_questions=payload.num_questions,
        )
        return {
            "questions": questions,
            "count": len(questions),
            "model": settings.HF_LLM_MODEL,
        }
    except Exception as exc:
        logger.error("Question preview endpoint error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="AI service temporarily unavailable. Please try again.",
        )
