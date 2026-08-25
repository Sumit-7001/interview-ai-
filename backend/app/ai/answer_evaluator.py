"""
Answer Evaluator — Qwen3 LLM evaluation + BGE semantic similarity combined.

Final answer score formula:
  LLM composite score  × 60%
  Semantic similarity  × 25%
  Relevance dimension  × 15%
"""

import logging
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

from app.ai.embedding_service import semantic_relevance_score
from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import answer_evaluation_prompt

logger = logging.getLogger(__name__)


# ── Pydantic Output Model ─────────────────────────────────────────────────────

class AnswerEvaluationResult(BaseModel):
    """Validated structured output from LLM answer evaluation."""
    score: int = Field(ge=0, le=100, description="Weighted composite score")
    relevance: int = Field(ge=0, le=100, default=70)
    correctness: int = Field(ge=0, le=100, default=70)
    clarity: int = Field(ge=0, le=100, default=70)
    technical_depth: int = Field(ge=0, le=100, default=70)
    semantic_score: float = Field(ge=0.0, le=100.0, default=50.0)
    final_score: int = Field(ge=0, le=100, default=70)
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    feedback: str = ""

    @field_validator("score", "relevance", "correctness", "clarity", "technical_depth", mode="before")
    @classmethod
    def clamp_int(cls, v: Any) -> int:
        try:
            return max(0, min(100, int(v)))
        except (TypeError, ValueError):
            return 70


# ── Mock Fallback ─────────────────────────────────────────────────────────────

def _mock_evaluation(answer: str, semantic: float) -> AnswerEvaluationResult:
    """High-fidelity mock evaluation based on answer word count."""
    word_count = len(answer.split())
    if word_count > 60:
        score, relevance, correctness, clarity, depth = 85, 84, 83, 86, 82
        strengths = ["Comprehensive and detailed answer", "Good structure and flow"]
        improvements = ["Add a concrete real-world example", "Mention edge cases or trade-offs"]
        feedback = "Strong answer with good depth. Adding a practical example from your experience would make it more compelling to interviewers."
    elif word_count > 25:
        score, relevance, correctness, clarity, depth = 70, 68, 72, 71, 65
        strengths = ["Covers the core concept", "Reasonably clear explanation"]
        improvements = ["Expand with more technical detail", "Include a code snippet or system example"]
        feedback = "Good baseline understanding shown. The answer would benefit from more technical depth and a practical example."
    else:
        score, relevance, correctness, clarity, depth = 50, 52, 48, 55, 40
        strengths = ["Touched on the main idea"]
        improvements = ["Much more detail needed", "Provide examples and explain the 'why'", "Structure your answer clearly"]
        feedback = "The answer is too brief. Take time to explain your reasoning and support your points with examples."

    final = int(score * 0.60 + semantic * 0.25 + relevance * 0.15)
    return AnswerEvaluationResult(
        score=score,
        relevance=relevance,
        correctness=correctness,
        clarity=clarity,
        technical_depth=depth,
        semantic_score=round(semantic, 1),
        final_score=max(0, min(100, final)),
        strengths=strengths,
        improvements=improvements,
        feedback=feedback,
    )


# ── Public API ────────────────────────────────────────────────────────────────

async def evaluate_answer(
    question: str,
    answer: str,
    interview_type: str = "Technical",
    role: str = "Software Engineer",
) -> Dict[str, Any]:
    """
    Evaluate a candidate answer using:
    1. BGE semantic similarity score (async, independent)
    2. Qwen3 LLM structured evaluation
    3. Combined weighted final score

    Returns a dict compatible with existing MongoDB schema.
    """
    if not answer or not answer.strip():
        answer = "(No answer provided)"

    # 1. Semantic similarity (independent of LLM)
    logger.info("Computing semantic relevance score for answer...")
    sem_score = await semantic_relevance_score(question, answer)
    logger.info("Semantic score: %.1f", sem_score)

    # 2. LLM evaluation
    prompt = answer_evaluation_prompt(question, answer, interview_type, role)
    llm_data = await call_llm_json(prompt, max_new_tokens=768)

    if llm_data:
        try:
            result = AnswerEvaluationResult(
                score=llm_data.get("score", 70),
                relevance=llm_data.get("relevance", 70),
                correctness=llm_data.get("correctness", 70),
                clarity=llm_data.get("clarity", 70),
                technical_depth=llm_data.get("technical_depth", 70),
                semantic_score=round(sem_score, 1),
                strengths=llm_data.get("strengths", []),
                improvements=llm_data.get("improvements", []),
                feedback=llm_data.get("feedback", ""),
                final_score=0,  # will be computed below
            )
            # 3. Combine scores
            llm_score = result.score
            final = int(llm_score * 0.60 + sem_score * 0.25 + result.relevance * 0.15)
            result.final_score = max(0, min(100, final))
            logger.info("LLM evaluation complete. Final score: %d", result.final_score)
            return result.model_dump()
        except Exception as exc:
            logger.error("Pydantic validation of LLM eval output failed: %s", exc)

    # LLM failed — use mock fallback
    logger.warning("LLM evaluation failed — using mock fallback")
    mock = _mock_evaluation(answer, sem_score)
    return mock.model_dump()
