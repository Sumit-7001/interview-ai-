"""
Question Generator — Uses Qwen3 via LLM service to generate interview questions.

Falls back to FALLBACK_QUESTIONS dict when LLM is unavailable.
"""

import logging
from typing import List, Optional

from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import (
    behavioral_question_prompt,
    hr_question_prompt,
    resume_question_prompt,
    technical_question_prompt,
)

logger = logging.getLogger(__name__)

# ── Fallback Question Bank ────────────────────────────────────────────────────
# Used when LLM is unavailable (no token, API down, AI_MOCK_MODE=true)

FALLBACK_QUESTIONS = {
    "Technical": {
        "Software Engineer": [
            "Explain the difference between a process and a thread, and how they share resources.",
            "What is a hash table? Explain how collision resolution works in hash tables.",
            "Describe the REST architectural style and its six key constraints.",
            "What are the differences between SQL and NoSQL databases? When would you choose each?",
            "Explain Big O notation and analyze the time complexity of merge sort.",
        ],
        "React Developer": [
            "Explain the virtual DOM and how React's reconciliation algorithm works.",
            "What are React Hooks? Describe the rules of hooks and explain useEffect.",
            "How do you manage global state in a large React app? Compare Redux with Context API.",
            "What is the difference between controlled and uncontrolled components in React?",
            "Explain Server Components in Next.js and how they differ from Client Components.",
        ],
        "Python Developer": [
            "What is the GIL in Python, and how does it affect multi-threading performance?",
            "Explain list comprehensions vs generators — when would you use a generator?",
            "How does Python's garbage collection and reference counting work?",
            "What are decorators in Python? Write a simple logging decorator.",
            "Explain the difference between shallow copy and deep copy in Python.",
        ],
        "Data Scientist": [
            "Explain the bias-variance tradeoff and how it affects model selection.",
            "What is gradient descent and how does learning rate affect convergence?",
            "Describe the differences between precision, recall, and F1 score.",
            "How do you handle class imbalance in a classification problem?",
            "Explain regularization (L1 vs L2) and when to use each.",
        ],
        "DevOps Engineer": [
            "Explain the difference between Docker containers and virtual machines.",
            "What is Kubernetes and how does it orchestrate containerized applications?",
            "Describe a CI/CD pipeline and the key stages involved.",
            "What is infrastructure as code and how does Terraform implement it?",
            "Explain blue-green deployment and canary releases.",
        ],
    },
    "HR": [
        "Tell me about yourself and why you are interested in this position.",
        "What are your greatest professional strengths and one area you are actively improving?",
        "Where do you see yourself professionally in three to five years?",
        "Why should we choose you over other qualified candidates?",
        "Describe a time you had a disagreement with a colleague and how you resolved it.",
    ],
    "Behavioral": [
        "Describe a challenging project you worked on. What was your role and how did you handle obstacles?",
        "Tell me about a time you made a significant mistake at work. How did you handle it and what did you learn?",
        "Give an example of when you had to deliver results under extreme time pressure.",
        "Describe a situation where you had to influence others without formal authority.",
        "Tell me about a time you proactively identified and solved a problem before it escalated.",
    ],
}


def _get_fallback_questions(
    role: str,
    interview_type: str,
    num_questions: int,
    resume_text: Optional[str],
) -> List[str]:
    """Return fallback questions from the hardcoded bank."""
    questions: List[str] = []

    if interview_type == "Technical":
        # Find best matching role
        role_key = "Software Engineer"
        role_lower = role.lower()
        for k in FALLBACK_QUESTIONS["Technical"]:
            if k.lower() in role_lower or any(
                w in role_lower for w in k.lower().split()
            ):
                role_key = k
                break
        questions = list(FALLBACK_QUESTIONS["Technical"][role_key])
    elif interview_type in FALLBACK_QUESTIONS:
        questions = list(FALLBACK_QUESTIONS[interview_type])
    else:
        questions = list(FALLBACK_QUESTIONS["HR"])

    # Prepend a resume-specific question if resume is available
    if resume_text and len(resume_text.strip()) > 50:
        questions.insert(
            0,
            "Based on your resume, could you walk me through the most technically challenging project you've listed and what your specific contributions were?",
        )

    return questions[:num_questions]


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_questions(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_text: Optional[str] = None,
    num_questions: int = 5,
) -> List[str]:
    """
    Generate interview questions using Qwen3 via LLM service.
    Falls back to FALLBACK_QUESTIONS on LLM failure.

    interview_type: "Technical" | "HR" | "Behavioral"
    """
    logger.info(
        "Generating %d %s questions for role: %s (%s level)",
        num_questions,
        interview_type,
        role,
        experience_level,
    )

    # Build the appropriate prompt
    if interview_type == "Technical":
        # Summarise resume skills (first 600 chars) for the prompt
        resume_skills = None
        if resume_text and resume_text.strip():
            resume_skills = resume_text.strip()[:600]
        prompt = technical_question_prompt(role, experience_level, resume_skills, num_questions)
    elif interview_type == "HR":
        prompt = hr_question_prompt(role, num_questions)
    elif interview_type == "Behavioral":
        prompt = behavioral_question_prompt(role, num_questions)
    else:
        # Mixed / custom: use resume if available, otherwise HR
        if resume_text and resume_text.strip():
            prompt = resume_question_prompt(resume_text, role, num_questions)
        else:
            prompt = hr_question_prompt(role, num_questions)

    # Call LLM
    data = await call_llm_json(prompt, max_new_tokens=512)

    if data:
        # Extract list from common keys
        questions: List[str] = []
        if isinstance(data, list):
            questions = data
        elif "questions" in data and isinstance(data["questions"], list):
            questions = data["questions"]
        else:
            # Search for any list value
            for v in data.values():
                if isinstance(v, list):
                    questions = v
                    break

        questions = [str(q).strip() for q in questions if str(q).strip()]
        if questions:
            logger.info("LLM generated %d questions successfully", len(questions))
            return questions[:num_questions]

    # LLM failed or returned invalid data — use fallback
    logger.warning("LLM question generation failed or returned empty — using fallback bank")
    return _get_fallback_questions(role, interview_type, num_questions, resume_text)
