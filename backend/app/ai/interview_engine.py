"""
Interview Engine — Dynamic, Resume-Centric Human Interview Intelligence.

This engine transforms the interview into an authentic, human-like dialogue:
1. RESUME-DRIVEN OPENING: Never asks generic 'tell me about yourself'.
   Directly picks a real project or internship from the candidate's resume.
2. ANSWER-AWARE COUNTER-QUESTIONS: Evaluates what the candidate said, detects
   missing concepts, and generates counter-questions drilling into their specific claims.
3. ADAPTIVE BEHAVIOR:
   - "I don't know" / weak → Guides from another angle with a simpler conceptual question.
   - Vague → Asks for a concrete example or individual contribution.
   - Strong → Raises difficulty, asks trade-offs, edge cases, 10x scale.
   - Mentions tech → Drills into that exact technology.
4. TOPIC CONTINUITY: Spends 2-3 turns exploring a project in depth before
   smoothly pivoting to the next resume topic.
"""

import re
import json
import random
import logging
from typing import Any, Dict, List, Optional

from app.ai.llm_service import call_llm_json
from app.ai.prompt_templates import (
    resume_opening_question_prompt,
    counter_question_analysis_prompt,
)

logger = logging.getLogger(__name__)


# ── Opening Question Generator ────────────────────────────────────────────────

async def generate_opening_question(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_context: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Generate the first question of the interview based directly on resume projects.
    Strictly avoids generic questions.
    """
    projects = resume_context.get("projects", [])
    experience = resume_context.get("experience", [])
    candidate_name = resume_context.get("candidate_name", "Candidate")

    # Log opening question context
    logger.info(
        "\n[OPENING QUESTION LLM CONTEXT]\n"
        "Resume Context: %s\n"
        "Role: %s\n"
        "Experience Level: %s\n"
        "Interview Type: %s\n",
        json.dumps(resume_context, default=str),
        role,
        experience_level,
        interview_type,
    )

    # 1. Try LLM generation with resume context
    prompt = resume_opening_question_prompt(
        role=role,
        experience_level=experience_level,
        interview_type=interview_type,
        resume_context=resume_context,
    )
    llm_res = await call_llm_json(prompt, max_new_tokens=350, temperature=0.2)

    if llm_res and isinstance(llm_res, dict) and "question" in llm_res:
        q_text = str(llm_res["question"]).strip()
        if len(q_text) > 15:
            topic = llm_res.get("target_topic") or (projects[0]["name"] if projects else "Background")
            logger.info("Generated resume-driven opening question: %s...", q_text[:80])
            return {
                "question": q_text,
                "current_topic": topic,
                "stage": "project_overview",
                "difficulty": "easy",
                "question_type": "project_opening",
                "tts_text": q_text,
            }

    # 2. Deterministic Fallback if LLM fails
    if projects:
        top_project = projects[0]
        p_name = top_project.get("name", "your project")
        techs = ", ".join(top_project.get("technologies", [])[:3])
        tech_clause = f" using {techs}" if techs else ""
        fallback_q = (
            f"I noticed you built an {p_name}{tech_clause}. "
            f"Can you explain the architecture and your personal contribution to it?"
        )
        topic = p_name
    elif experience:
        top_exp = experience[0]
        company = top_exp.get("company") or top_exp.get("role_or_company", "your previous company")
        role_t = top_exp.get("role", role)
        fallback_q = (
            f"I see from your resume that you worked as a {role_t} at {company}. "
            f"Can you walk me through the system architecture and responsibilities you had there?"
        )
        topic = f"{role_t} at {company}"
    else:
        fallback_q = (
            f"Welcome to the interview! To get started, can you tell me about the architecture of a technical project you built recently?"
        )
        topic = "Recent Project"

    return {
        "question": fallback_q,
        "current_topic": topic,
        "stage": "project_overview",
        "difficulty": "easy",
        "question_type": "project_opening",
        "tts_text": fallback_q,
    }


# ── Intelligent Answer-Driven Counter-Question Heuristic Fallback ────────────

def _heuristic_counter_question(
    prev_question: str,
    candidate_answer: str,
    current_topic: str,
    turns_on_topic: int,
    resume_context: Dict[str, Any],
    topics_discussed: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Intelligent answer-driven counter-question fallback when LLM is offline or invalid.
    Extracts explicit claims, technologies, and reasoning directly from candidate's answer.
    """
    answer_lower = candidate_answer.lower().strip()
    words = candidate_answer.split()
    word_count = len(words)

    # 1. Handle "I don't know" or empty refusal
    dont_know_signals = ["don't know", "dont know", "not sure", "no idea", "forgot", "can't recall", "cant recall"]
    if any(sig in answer_lower for sig in dont_know_signals) or word_count < 3:
        return {
            "answer_analysis": {"relevance": 45, "technical_accuracy": 40, "clarity": 50, "completeness": 30},
            "candidate_behavior": "dont_know",
            "detected_topics": [],
            "missing_concepts": ["core concept explanation"],
            "feedback": "No problem! Interviews are a discussion. Let's look at this from a different angle.",
            "next_question": f"Let's take a step back on {current_topic}: conceptually, what problem does this approach solve, and what is the primary benefit of using it?",
            "question_type": "pivot_angle",
            "difficulty": "basic",
            "current_topic": current_topic,
            "switch_topic": False,
        }

    # 2. Extract technologies mentioned
    known_techs = [
        "FastAPI", "React", "MongoDB", "Python", "JavaScript", "TypeScript", "Node.js", "Express",
        "Django", "Flask", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "WebSockets",
        "GraphQL", "REST", "LangChain", "PyTorch", "TensorFlow", "OpenCV", "Whisper", "Next.js"
    ]
    mentioned_techs = [tech for tech in known_techs if re.search(r'\b' + re.escape(tech.lower()) + r'\b', answer_lower)]

    # 3. Detect explicit claims and conversational intent
    has_async = any(w in answer_lower for w in ["async", "asynchronous", "asyncio"])
    has_realtime = any(w in answer_lower for w in ["real-time", "realtime", "websocket", "streaming"])
    has_backend_choice = any(w in answer_lower for w in ["backend", "server", "api"]) and any(t in answer_lower for t in ["fastapi", "flask", "django", "express", "node"])
    because_match = re.search(r'because\s+(.+)', candidate_answer, re.IGNORECASE)

    next_q = None
    detected = mentioned_techs[:]
    missing = []
    question_type = "counter_question"

    if has_async:
        next_q = "You mentioned asynchronous APIs. Where did you use asynchronous processing in your project, and what benefit did it provide?"
        detected.append("asynchronous processing")
        missing.append("concurrency handling and non-blocking I/O")
        question_type = "deep_dive"
    elif has_realtime:
        next_q = "You mentioned real-time communication. How did you implement that in your application, and why did you choose WebSockets?"
        detected.append("real-time communication")
        missing.append("socket connection lifecycle and event handling")
        question_type = "deep_dive"
    elif has_backend_choice:
        backend_tech = next((t for t in ["FastAPI", "Django", "Flask", "Express", "Node.js"] if t.lower() in answer_lower), "your backend framework")
        next_q = f"Why did you choose {backend_tech} for the backend?"
        detected.append(backend_tech)
        missing.append(f"architectural rationale for {backend_tech}")
        question_type = "counter_question"
    elif because_match and mentioned_techs:
        tech = mentioned_techs[0]
        reason_clause = because_match.group(1).strip().rstrip(".")
        next_q = f"You mentioned that {reason_clause}. Why was {tech} a better choice for this in your project compared to alternatives?"
        missing.append(f"evaluation of {tech}")
        question_type = "counter_question"
    elif because_match:
        reason_clause = because_match.group(1).strip().rstrip(".")
        next_q = f"You mentioned that {reason_clause}. Can you elaborate on how that was implemented in {current_topic}?"
        missing.append("implementation details")
        question_type = "counter_question"
    elif mentioned_techs:
        tech = mentioned_techs[0]
        next_q = f"What specific role did {tech} play in {current_topic}, and how did you handle data flow through it?"
        missing.append(f"{tech} architecture")
        question_type = "counter_question"
    else:
        # Quote a key phrase directly from the candidate's words
        key_phrase = " ".join(words[:6]).rstrip(",.")
        next_q = f"Building directly on your point about '{key_phrase}' — how did you implement this in {current_topic}?"
        missing.append("implementation specifics")
        question_type = "follow_up"

    return {
        "answer_analysis": {"relevance": 85, "technical_accuracy": 80, "clarity": 85, "completeness": 75},
        "candidate_behavior": "strong" if word_count > 8 else "satisfactory",
        "detected_topics": list(dict.fromkeys(detected)),
        "missing_concepts": missing,
        "feedback": "Clear explanation acknowledging your technical decisions.",
        "next_question": next_q,
        "question_type": question_type,
        "difficulty": "medium",
        "current_topic": current_topic,
        "switch_topic": False,
    }


# ── Answer Processing & Counter-Question Engine ───────────────────────────────

async def process_candidate_answer_and_next_question(
    prev_question: str,
    candidate_answer: str,
    role: str,
    interview_type: str,
    current_topic: str,
    turns_on_topic: int,
    conversation_history: List[Dict[str, Any]],
    resume_context: Dict[str, Any],
    topics_discussed: Optional[List[str]] = None,
    current_difficulty: str = "medium",
    question_number: int = 2,
) -> Dict[str, Any]:
    """
    Unified intelligence pass:
    1. Evaluates candidate's answer (relevance, accuracy, completeness, clarity)
    2. Detects missing concepts and specific topics mentioned
    3. Categorizes behavior (strong, vague, dont_know)
    4. Formulates the next COUNTER QUESTION or DEEP-DIVE
    5. Returns evaluation, next question, and updated topics_discussed
    """
    cleaned_answer = candidate_answer.strip()
    if not cleaned_answer:
        cleaned_answer = "(No response provided)"

    topics_list = list(topics_discussed or [])
    if current_topic and current_topic not in topics_list:
        topics_list.append(current_topic)

    # ── LOG CONTEXT BEFORE LLM CALL (Requirement H) ───────────────────────────
    logger.info(
        "\n[INTERVIEW LLM CONTEXT]\n"
        "Resume Context: %s\n"
        "Current Question: %s\n"
        "Candidate Answer: %s\n"
        "Conversation History: %s\n"
        "Topics Discussed: %s\n",
        json.dumps(resume_context, default=str),
        prev_question,
        cleaned_answer,
        json.dumps(conversation_history, default=str),
        json.dumps(topics_list, default=str),
    )

    # 1. Try high-intelligence LLM pass
    prompt = counter_question_analysis_prompt(
        prev_question=prev_question,
        candidate_answer=cleaned_answer,
        role=role,
        current_topic=current_topic,
        turns_on_topic=turns_on_topic,
        conversation_history=conversation_history,
        resume_context=resume_context,
        topics_discussed=topics_list,
        current_difficulty=current_difficulty,
    )

    llm_res = await call_llm_json(prompt, max_new_tokens=450, temperature=0.2)

    result = None
    if llm_res and isinstance(llm_res, dict) and "next_question" in llm_res:
        next_q = str(llm_res.get("next_question", "")).strip()
        # Verify next_question is non-empty and not a generic reset
        generic_resets = [
            "what does your project do",
            "what does the system do",
            "can you explain what this project does",
            "tell me about yourself",
            "what are your strengths",
        ]
        is_generic_reset = any(gr in next_q.lower() for gr in generic_resets)
        if len(next_q) > 15 and not (is_generic_reset and len(cleaned_answer) > 10):
            result = llm_res
            logger.info("LLM generated counter-question: %s...", next_q[:80])
        else:
            logger.warning("LLM returned generic reset or too short question: %s. Using answer-driven fallback.", next_q)

    # 2. If LLM failed or generated invalid question, use answer-driven fallback
    if not result:
        logger.warning("Using intelligent answer-driven counter-question fallback")
        result = _heuristic_counter_question(
            prev_question=prev_question,
            candidate_answer=cleaned_answer,
            current_topic=current_topic,
            turns_on_topic=turns_on_topic,
            resume_context=resume_context,
            topics_discussed=topics_list,
        )

    # 3. Calculate standardized composite score (0 - 100)
    analysis = result.get("answer_analysis", {})
    relevance = int(analysis.get("relevance", 75))
    accuracy = int(analysis.get("technical_accuracy", 75))
    clarity = int(analysis.get("clarity", 75))
    completeness = int(analysis.get("completeness", 75))
    final_score = int(accuracy * 0.40 + relevance * 0.30 + completeness * 0.20 + clarity * 0.10)
    final_score = max(0, min(100, final_score))

    # Determine next topic tracking and topic progression
    switch_topic = result.get("switch_topic", False)
    new_topic = result.get("current_topic", current_topic)
    next_turns = 1 if switch_topic or new_topic != current_topic else (turns_on_topic + 1)

    # Update topics_discussed
    updated_topics = list(topics_list)
    for topic_item in result.get("detected_topics", []):
        if topic_item and topic_item not in updated_topics:
            updated_topics.append(topic_item)
    if new_topic and new_topic not in updated_topics:
        updated_topics.append(new_topic)

    behavior = result.get("candidate_behavior", "satisfactory")
    next_diff = result.get("difficulty", current_difficulty)

    return {
        # Evaluation component (compatible with reporting & DB)
        "evaluation": {
            "score": final_score,
            "final_score": final_score,
            "relevance": relevance,
            "correctness": accuracy,
            "technical_depth": completeness,
            "clarity": clarity,
            "feedback": result.get("feedback", "Good explanation."),
            "strengths": result.get("detected_topics", []),
            "improvements": result.get("missing_concepts", []),
        },
        "score": final_score,
        "feedback": result.get("feedback", "Good explanation."),
        "detected_topics": result.get("detected_topics", []),
        "missing_concepts": result.get("missing_concepts", []),
        "candidate_behavior": behavior,

        # Counter-Question component
        "next_question": result["next_question"],
        "question_type": result.get("question_type", "counter_question"),
        "difficulty": next_diff,
        "current_topic": new_topic,
        "turns_on_topic": next_turns,
        "topics_discussed": updated_topics,
        "tts_text": result["next_question"],
    }
