"""
Interview Scorer — Type-weighted final scoring engine.

Different interview types use different score weights:
  Technical:  emphasises technical knowledge & answer quality
  HR:         emphasises communication & confidence
  Behavioral: emphasises answer structure & semantic relevance

Weights are fully configurable via the SCORE_WEIGHTS dict.
"""

import logging
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import final_feedback_prompt

logger = logging.getLogger(__name__)


# ── Configurable Weight Tables ────────────────────────────────────────────────

SCORE_WEIGHTS: Dict[str, Dict[str, float]] = {
    "Technical": {
        "technical_knowledge": 0.25,
        "answer_quality": 0.20,
        "semantic_relevance": 0.15,
        "communication": 0.10,
        "confidence": 0.10,
        "eye_contact": 0.10,
        "speech_quality": 0.10,
    },
    "HR": {
        "communication": 0.25,
        "answer_quality": 0.20,
        "confidence": 0.15,
        "semantic_relevance": 0.15,
        "eye_contact": 0.10,
        "speech_quality": 0.10,
        "technical_knowledge": 0.05,
    },
    "Behavioral": {
        "answer_quality": 0.25,
        "semantic_relevance": 0.20,
        "communication": 0.20,
        "confidence": 0.10,
        "eye_contact": 0.10,
        "speech_quality": 0.10,
        "technical_knowledge": 0.05,
    },
}

# Default weights if interview_type is unrecognised
_DEFAULT_WEIGHTS = {
    "technical_knowledge": 0.20,
    "answer_quality": 0.20,
    "semantic_relevance": 0.15,
    "communication": 0.15,
    "confidence": 0.10,
    "eye_contact": 0.10,
    "speech_quality": 0.10,
}


# ── Pydantic Models ────────────────────────────────────────────────────────────

class FinalScoreResult(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    scores_breakdown: Dict[str, int]
    feedback: Dict[str, Any]


# ── Helper: derive individual dimension scores from question data ──────────────

def _derive_dimension_scores(
    questions: List[Dict[str, Any]],
    eye_contact_avg: float,
) -> Dict[str, float]:
    """
    Extract raw dimension scores from per-question evaluation data.
    Returns float values in [0, 100] for each weight key.
    """
    answered = [q for q in questions if q.get("evaluation")]

    if not answered:
        return {k: 65.0 for k in _DEFAULT_WEIGHTS}

    # Aggregate per-question scores
    llm_scores: List[float] = []
    semantic_scores: List[float] = []
    clarity_scores: List[float] = []
    technical_scores: List[float] = []
    speech_quality_scores: List[float] = []
    confidence_scores: List[float] = []

    for q in answered:
        ev = q.get("evaluation", {})
        vm = q.get("voice_metrics", {})

        llm_scores.append(float(ev.get("score", 70)))
        semantic_scores.append(float(ev.get("semantic_score", 55)))
        clarity_scores.append(float(ev.get("clarity", 70)))
        technical_scores.append(float(ev.get("technical_depth", 70)))

        # Speech quality from voice metrics
        speed = vm.get("speaking_speed", 130) if vm else 130
        fillers = vm.get("filler_words_count", 3) if vm else 3
        # Ideal speed ~120-150 wpm, fewer fillers = better
        speed_score = max(0, 100 - abs(speed - 135) * 0.5)
        filler_penalty = min(40, fillers * 5)
        speech_quality_scores.append(max(0, speed_score - filler_penalty))

        # Confidence approximation from emotion (neutral/happy = confident)
        em = q.get("emotion_summary", {})
        if em:
            confidence_val = em.get("neutral", 0) + em.get("happy", 0)
            confidence_scores.append(min(100.0, float(confidence_val)))
        else:
            confidence_scores.append(65.0)

    def avg(lst: List[float]) -> float:
        return sum(lst) / len(lst) if lst else 65.0

    return {
        "technical_knowledge": avg(technical_scores),
        "answer_quality": avg(llm_scores),
        "semantic_relevance": avg(semantic_scores),
        "communication": avg(clarity_scores),
        "confidence": avg(confidence_scores),
        "eye_contact": float(eye_contact_avg),
        "speech_quality": avg(speech_quality_scores),
    }


def _apply_weights(
    dimensions: Dict[str, float],
    interview_type: str,
) -> int:
    """Apply type-specific weights to dimension scores → overall score."""
    weights = SCORE_WEIGHTS.get(interview_type, _DEFAULT_WEIGHTS)
    weighted_sum = sum(
        dimensions.get(dim, 65.0) * weight
        for dim, weight in weights.items()
    )
    return max(0, min(100, round(weighted_sum)))


# ── Mock Feedback ─────────────────────────────────────────────────────────────

def _mock_feedback(
    role: str,
    interview_type: str,
    overall_score: int,
    eye_contact_avg: float,
) -> Dict[str, Any]:
    return {
        "what_went_well": [
            "Demonstrated solid foundational knowledge across the key question areas.",
            "Maintained a clear and structured approach to answering most questions.",
            f"Showed good presence with approximately {eye_contact_avg:.0f}% eye contact throughout.",
        ],
        "areas_to_improve": [
            "Incorporate more real-world, production-level examples to back up theoretical answers.",
            "Reduce filler words (um, uh, like) to project greater confidence and clarity.",
            "Work on developing more comprehensive answers — aim for the STAR structure.",
        ],
        "recommendations": (
            f"For a {role} role in a {interview_type} interview, focus on building practical depth. "
            "Review system design fundamentals and practice explaining your past projects with specific metrics "
            "(e.g. reduced latency by X%, improved throughput by Y%). "
            "Tools like Pramp or interviewing.io offer mock interview practice with real engineers."
        ),
    }


# ── Public API ────────────────────────────────────────────────────────────────

async def calculate_final_score(
    questions_data: List[Dict[str, Any]],
    interview_type: str,
    eye_contact_avg: float,
    role: str = "Software Engineer",
) -> Dict[str, Any]:
    """
    Calculate weighted final interview score and generate overall feedback.

    Returns a dict with:
      - overall_score: int
      - scores_breakdown: Dict[str, int]
      - feedback: Dict (what_went_well, areas_to_improve, recommendations)
    """
    logger.info(
        "Calculating final score for %s interview (type=%s, eye=%.1f%%)",
        role,
        interview_type,
        eye_contact_avg,
    )

    # Derive dimension scores
    dimensions = _derive_dimension_scores(questions_data, eye_contact_avg)

    # Apply type-specific weights
    overall_score = _apply_weights(dimensions, interview_type)

    # Build breakdown (round to int, clamp 0-100)
    scores_breakdown = {
        dim: max(0, min(100, round(val)))
        for dim, val in dimensions.items()
    }

    logger.info(
        "Score breakdown: %s → overall %d",
        scores_breakdown,
        overall_score,
    )

    # Generate LLM feedback
    answered = [q for q in questions_data if q.get("evaluation")]
    eval_summary = "\n\n".join(
        f"Q: {q.get('question_text', 'N/A')}\n"
        f"Score: {q.get('evaluation', {}).get('score', '?')}/100\n"
        f"Semantic: {q.get('evaluation', {}).get('semantic_score', '?')}\n"
        f"Feedback: {q.get('evaluation', {}).get('feedback', 'N/A')}"
        for q in answered[:5]  # Limit to 5 to keep prompt concise
    )

    prompt = final_feedback_prompt(
        eval_summary=eval_summary,
        role=role,
        interview_type=interview_type,
        eye_contact_avg=eye_contact_avg,
        overall_score=overall_score,
    )
    llm_data = await call_llm_json(prompt, max_new_tokens=768)

    if llm_data and all(k in llm_data for k in ("what_went_well", "areas_to_improve", "recommendations")):
        feedback = {
            "what_went_well": llm_data.get("what_went_well", []),
            "areas_to_improve": llm_data.get("areas_to_improve", []),
            "recommendations": llm_data.get("recommendations", ""),
        }
    else:
        logger.warning("LLM feedback generation failed — using mock feedback")
        feedback = _mock_feedback(role, interview_type, overall_score, eye_contact_avg)

    return {
        "overall_score": overall_score,
        "scores_breakdown": scores_breakdown,
        "feedback": feedback,
    }
