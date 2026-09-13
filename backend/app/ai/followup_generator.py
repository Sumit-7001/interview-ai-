"""
Follow-up Question Generator — Context-aware dynamic interview question engine.

This is the core of the dynamic interview behavior. Instead of using a fixed
list of pre-generated questions, this module generates each next question based on:
  1. The candidate's previous answer
  2. The full conversation history
  3. The resume content
  4. The answer quality score
  5. The current interview stage/difficulty

The AI behaves like a real human interviewer:
  - Weak answer → asks for clarification or an example
  - Strong answer → digs deeper or raises difficulty
  - Mentions specific tech → asks a follow-up about that tech
  - Resume project mentioned → asks about specific details
"""

import logging
import random
from typing import Any, Dict, List, Optional

from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import dynamic_followup_prompt, initial_question_prompt

logger = logging.getLogger(__name__)


# ── Topic-Aware Fallback Bank ─────────────────────────────────────────────────

FOLLOWUP_BY_TOPIC: Dict[str, List[str]] = {
    "machine learning": [
        "Why did you choose that specific algorithm for this problem?",
        "How did you evaluate the model's performance? What metrics did you use?",
        "What would you do differently if you had 10x more training data?",
        "How would you handle class imbalance in this dataset?",
        "How would you deploy this model to production with low latency?",
    ],
    "python": [
        "How do you manage dependencies and virtual environments in Python projects?",
        "Can you explain how Python's asyncio event loop works?",
        "What tools do you use for profiling and debugging Python performance issues?",
        "How do you structure a large Python project for maintainability?",
    ],
    "react": [
        "How do you optimize a React app that is rendering slowly?",
        "Can you explain how React's reconciliation (diffing) algorithm works?",
        "When would you use useCallback vs useMemo vs React.memo?",
        "How do you handle side effects that need cleanup in functional components?",
    ],
    "database": [
        "How would you optimize a slow SQL query with a large dataset?",
        "When would you choose a NoSQL database over a relational one?",
        "Can you explain database indexing and how it affects query performance?",
        "How would you design a database schema to avoid N+1 query problems?",
    ],
    "system design": [
        "How would you scale this system to handle 10x the current load?",
        "What caching strategy would you use, and at which layer?",
        "How would you ensure high availability and fault tolerance in this design?",
        "What are the trade-offs between consistency and availability in your design?",
    ],
    "api": [
        "How do you handle authentication and authorization in your APIs?",
        "How do you version an API without breaking existing clients?",
        "What strategies do you use for API rate limiting and throttling?",
        "How would you design this API to be idempotent?",
    ],
    "docker": [
        "How do you minimize Docker image size in production?",
        "Can you explain the difference between COPY and ADD in a Dockerfile?",
        "How do you handle secrets and environment variables in Docker containers?",
        "How would you use Docker Compose for a multi-service local development setup?",
    ],
    "testing": [
        "What is your testing strategy — unit, integration, end-to-end? When do you use each?",
        "How do you write tests for code that has external dependencies (API calls, DB)?",
        "Can you explain test-driven development and when it is most useful?",
    ],
    "performance": [
        "How do you profile and identify performance bottlenecks in a production system?",
        "What caching strategies have you implemented and what impact did they have?",
        "How do you measure and set performance benchmarks for a new feature?",
    ],
    "default_weak": [
        "Could you walk me through that with a concrete, real-world example from your experience?",
        "Can you elaborate on that? Specifically, what was your individual contribution?",
        "That's interesting — how would you apply that concept in a production environment?",
        "Can you explain the trade-offs you considered when making that decision?",
        "What challenges did you face with that approach, and how did you overcome them?",
    ],
    "default_strong": [
        "Excellent. Now let's push the difficulty up — how would you design this to handle global scale?",
        "Building on what you said — how would you make this fault-tolerant?",
        "Great answer. What would you improve if you were starting this from scratch today?",
        "Impressive depth. Can you compare this approach to an alternative you considered?",
    ],
    "general": [
        "Tell me more about the technical decisions you made in that project.",
        "What was the most challenging part of that, and how did you work through it?",
        "How did this experience change your approach to similar problems in the future?",
        "What metrics did you use to define success in that work?",
    ],
}

# Interview stage topics (to progress through different domains)
INTERVIEW_PROGRESSION = [
    "introduction",      # Stage 1: Tell me about yourself / overview
    "technical_depth",   # Stage 2: Deep-dive on core technical skills
    "project_detail",    # Stage 3: Specific project from resume
    "problem_solving",   # Stage 4: Hypothetical system design / coding scenario
    "behavioral",        # Stage 5: Behavioral / situational
    "closing",           # Stage 6: Questions about the candidate's goals
]


# ── Topic Detection ────────────────────────────────────────────────────────────

def _detect_topics(text: str) -> List[str]:
    """Detect technical topics mentioned in the answer."""
    text_lower = text.lower()
    detected = []
    topic_signals = {
        "machine learning": ["machine learning", "neural", "model", "train", "dataset", "sklearn", "pytorch", "tensorflow", "gradient", "random forest", "classification", "regression"],
        "python": ["python", "flask", "django", "fastapi", "pandas", "numpy", "asyncio"],
        "react": ["react", "component", "hook", "usestate", "useeffect", "redux", "next.js"],
        "database": ["database", "sql", "query", "mongodb", "postgres", "mysql", "schema", "index"],
        "system design": ["scale", "distributed", "microservice", "load balancer", "cache", "architecture"],
        "api": ["api", "rest", "endpoint", "request", "response", "http", "graphql"],
        "docker": ["docker", "container", "kubernetes", "k8s", "deployment", "image"],
        "testing": ["test", "unit test", "pytest", "jest", "mock", "coverage", "tdd"],
        "performance": ["performance", "latency", "throughput", "optimize", "bottleneck", "profil"],
    }
    for topic, signals in topic_signals.items():
        if any(sig in text_lower for sig in signals):
            detected.append(topic)
    return detected[:3]  # Limit to top 3 topics


def _get_difficulty_label(score: int) -> str:
    if score >= 80:
        return "advanced"
    elif score >= 60:
        return "intermediate"
    else:
        return "basic"


# ── Fallback Question Selection ────────────────────────────────────────────────

def _fallback_followup(
    prev_answer: str,
    score: int,
    topics: List[str],
    question_number: int,
    resume_text: Optional[str] = None,
) -> str:
    """Generate a fallback follow-up question without LLM."""
    # Use topic-aware follow-ups if topics detected
    if topics:
        topic = topics[0]
        bank = FOLLOWUP_BY_TOPIC.get(topic, FOLLOWUP_BY_TOPIC["general"])
        return random.choice(bank)

    # Based on score quality
    if score >= 75:
        return random.choice(FOLLOWUP_BY_TOPIC["default_strong"])
    elif score < 55:
        return random.choice(FOLLOWUP_BY_TOPIC["default_weak"])

    return random.choice(FOLLOWUP_BY_TOPIC["general"])


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_initial_question(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Generate the very FIRST question of the interview session.
    This replaces the old fixed-list approach with a single tailored opener.

    Returns: {question, stage, difficulty}
    """
    logger.info("Generating initial question for %s (%s, %s)", role, experience_level, interview_type)

    prompt = initial_question_prompt(role, experience_level, interview_type, resume_text)
    data = await call_llm_json(prompt, max_new_tokens=256)

    if data and "question" in data:
        return {
            "question": str(data["question"]).strip(),
            "stage": "introduction",
            "difficulty": "opening",
        }

    # Fallback openers
    fallback_openers = {
        "Technical": f"Let's start with an overview. Can you walk me through your technical background and the most complex system you've built?",
        "HR": f"Tell me about yourself — your background, what brought you to a {role} career, and what excites you most about this opportunity.",
        "Behavioral": "Tell me about a project you're most proud of. What was your specific role and what impact did your work have?",
        "Resume-Based": f"I've reviewed your resume. Let's start with what you consider your strongest technical project — walk me through it from problem to solution.",
        "Mixed": f"To get us started — tell me about your background as a {role} and the most impactful technical work you've done recently.",
    }
    question = fallback_openers.get(interview_type, fallback_openers["Mixed"])
    return {"question": question, "stage": "introduction", "difficulty": "opening"}


async def generate_followup_question(
    prev_question: str,
    prev_answer: str,
    role: str,
    interview_type: str,
    conversation_history: List[Dict[str, str]],
    answer_score: int = 70,
    resume_text: Optional[str] = None,
    question_number: int = 2,
) -> Dict[str, Any]:
    """
    Generate a contextual follow-up question based on the candidate's answer.

    Logic:
    - Detects topics in the answer
    - Adjusts difficulty based on answer quality score
    - Uses LLM with full conversation context
    - Falls back gracefully to topic-aware question bank

    Returns: {question, reasoning, difficulty, stage, topics_detected}
    """
    topics = _detect_topics(prev_answer)
    difficulty = _get_difficulty_label(answer_score)

    logger.info(
        "Generating follow-up Q#%d | Role: %s | Topics: %s | Score: %d | Difficulty: %s",
        question_number, role, topics, answer_score, difficulty
    )

    # Build LLM prompt
    prompt = dynamic_followup_prompt(
        prev_question=prev_question,
        prev_answer=prev_answer,
        role=role,
        interview_type=interview_type,
        conversation_history=conversation_history[-6:],  # Last 6 exchanges for context
        answer_score=answer_score,
        difficulty=difficulty,
        resume_excerpt=resume_text[:800] if resume_text else None,
        question_number=question_number,
    )

    data = await call_llm_json(prompt, max_new_tokens=300, temperature=0.4)

    if data and "question" in data:
        question_text = str(data.get("question", "")).strip()
        if question_text and len(question_text) > 10:
            logger.info("LLM generated follow-up: %s...", question_text[:80])
            return {
                "question": question_text,
                "reasoning": str(data.get("reasoning", "")),
                "difficulty": difficulty,
                "stage": "dynamic",
                "topics_detected": topics,
            }

    # Fallback
    logger.warning("LLM follow-up generation failed — using topic-aware fallback")
    fallback_q = _fallback_followup(prev_answer, answer_score, topics, question_number, resume_text)
    return {
        "question": fallback_q,
        "reasoning": "Topic-aware fallback used",
        "difficulty": difficulty,
        "stage": "dynamic",
        "topics_detected": topics,
    }


async def generate_closing_question(role: str) -> str:
    """Return a standard closing/wrap-up question."""
    closing_questions = [
        f"As we wrap up — what aspect of the {role} role excites you most, and where do you see yourself growing in the next 2 years?",
        "Do you have any questions for me about the team, the engineering culture, or the challenges we're working on?",
        f"Looking back at this interview, is there anything about your {role} background that you feel you didn't get a chance to showcase that you'd like to highlight?",
    ]
    return random.choice(closing_questions)
