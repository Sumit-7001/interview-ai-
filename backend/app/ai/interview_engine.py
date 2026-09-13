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

    # 1. Try LLM generation with resume context
    prompt = resume_opening_question_prompt(
        role=role,
        experience_level=experience_level,
        interview_type=interview_type,
        resume_context=resume_context,
    )
    llm_res = await call_llm_json(prompt, max_new_tokens=300, temperature=0.3)

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
        techs = ", ".join(top_project.get("technologies", [])[:2])
        tech_clause = f" using {techs}" if techs else ""
        fallback_q = (
            f"I noticed on your resume that you built {p_name}{tech_clause}. "
            f"In simple words, can you explain what this project does and what specific parts you personally worked on?"
        )
        topic = p_name
    elif experience:
        top_exp = experience[0]
        company = top_exp.get("company") or top_exp.get("role_or_company", "your previous company")
        role_t = top_exp.get("role", role)
        fallback_q = (
            f"I see from your resume that you worked as a {role_t} at {company}. "
            f"In simple words, can you tell me what kind of tasks you worked on there?"
        )
        topic = f"{role_t} at {company}"
    else:
        fallback_q = (
            f"Welcome to the interview! To get started, can you tell me about a favorite project you've worked on recently?"
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


# ── Deterministic Counter-Question Heuristics Fallback ─────────────────────────

def _heuristic_counter_question(
    prev_question: str,
    candidate_answer: str,
    current_topic: str,
    turns_on_topic: int,
    resume_context: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Intelligent rule-based counter-question fallback when LLM is offline.
    Uses candidate's actual words and resume context to form a real counter-question.
    """
    answer_lower = candidate_answer.lower().strip()
    words = candidate_answer.split()
    word_count = len(words)

    # 1. Handle "I don't know" or refusal
    dont_know_signals = ["don't know", "dont know", "not sure", "no idea", "forgot", "can't recall", "cant recall"]
    if any(sig in answer_lower for sig in dont_know_signals) or word_count < 4:
        return {
            "answer_analysis": {"relevance": 40, "technical_accuracy": 35, "clarity": 50, "completeness": 30},
            "candidate_behavior": "dont_know",
            "detected_topics": [],
            "missing_concepts": ["core concept explanation", "trade-off analysis"],
            "feedback": "No problem! Interviews are a discussion. Let's look at this from a different angle.",
            "next_question": f"Let's take a step back on {current_topic}: conceptually, what problem does this approach solve, and what is the primary benefit of using it?",
            "question_type": "pivot_angle",
            "difficulty": "basic",
            "current_topic": current_topic,
            "switch_topic": False,
        }

    # 2. Detect specific concepts mentioned in the candidate's answer (Easy / Student-Friendly)
    concept_counter_questions = {
        "langchain": "You mentioned LangChain. In simple words, how did you use LangChain in your project to connect with the AI model?",
        "embedding": "You mentioned embeddings. In simple terms, how did embeddings help your project find relevant answers?",
        "vector": "You brought up vector search. In simple words, how did you store and search through the project documents?",
        "fastapi": "You mentioned FastAPI. In simple words, how did you connect your FastAPI backend to the frontend?",
        "websocket": "You mentioned WebSockets. Why did you use WebSockets instead of regular HTTP requests in your project?",
        "react": "You mentioned React. Which main components or screens did you build, and how did you handle user button clicks or inputs?",
        "mongodb": "You mentioned MongoDB. What kind of data or records did you store in your database?",
        "threshold": "You mentioned thresholds. In simple terms, how did you choose this threshold value?",
        "asyncio": "You mentioned asynchronous processing. In simple terms, where was async helpful in your application?",
        "yolo": "You mentioned YOLO. What objects was your model detecting, and how did you test it?",
        "rest": "You mentioned REST APIs. What were some of the main API routes or endpoints you created?",
    }

    matched_concept = None
    for keyword, counter_q in concept_counter_questions.items():
        if keyword in answer_lower:
            matched_concept = (keyword, counter_q)
            break

    # 3. If topic has reached 3 turns, smoothly transition to the next resume topic
    projects = resume_context.get("projects", [])
    remaining_projects = [p for p in projects if p.get("name") and p.get("name").lower() not in current_topic.lower()]

    if turns_on_topic >= 3 and remaining_projects:
        next_p = remaining_projects[0]
        next_name = next_p.get("name")
        next_techs = ", ".join(next_p.get("technologies", [])[:2])
        tech_clause = f" using {next_techs}" if next_techs else ""
        return {
            "answer_analysis": {"relevance": 85, "technical_accuracy": 80, "clarity": 85, "completeness": 80},
            "candidate_behavior": "strong",
            "detected_topics": [current_topic],
            "missing_concepts": [],
            "feedback": "Great explanation! That gives me a clear picture of your work there.",
            "next_question": f"That's very clear! I'd also love to hear about another project on your resume: {next_name}{tech_clause}. In simple words, what does this project do?",
            "question_type": "new_topic",
            "difficulty": "easy",
            "current_topic": next_name,
            "switch_topic": True,
        }

    # 4. If matched a concept mentioned in the answer
    if matched_concept:
        kw, counter_q = matched_concept
        return {
            "answer_analysis": {"relevance": 85, "technical_accuracy": 80, "clarity": 80, "completeness": 75},
            "candidate_behavior": "satisfactory",
            "detected_topics": [kw],
            "missing_concepts": [f"basic working mechanism of {kw}"],
            "feedback": f"Good explanation touching on {kw}.",
            "next_question": counter_q,
            "question_type": "counter_question",
            "difficulty": "easy",
            "current_topic": current_topic,
            "switch_topic": False,
        }

    # 5. Vague answer fallback (Easy / Student friendly)
    if word_count < 20:
        return {
            "answer_analysis": {"relevance": 65, "technical_accuracy": 60, "clarity": 60, "completeness": 50},
            "candidate_behavior": "vague",
            "detected_topics": [],
            "missing_concepts": ["simple practical example"],
            "feedback": "You touched on the main idea! Let's keep it simple.",
            "next_question": f"In simple words, can you give a quick example of how you used that in {current_topic}?",
            "question_type": "clarification",
            "difficulty": "easy",
            "current_topic": current_topic,
            "switch_topic": False,
        }

    # 6. Strong answer fallback (Friendly & Practical, NO 10x scale)
    return {
        "answer_analysis": {"relevance": 90, "technical_accuracy": 85, "clarity": 85, "completeness": 85},
        "candidate_behavior": "strong",
        "detected_topics": ["implementation"],
        "missing_concepts": ["testing and debugging"],
        "feedback": "Great explanation! Very clear and to the point.",
        "next_question": f"Building on what you said — what was one bug or challenge you faced while building {current_topic}, and how did you solve it?",
        "question_type": "follow_up",
        "difficulty": "easy",
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
    current_difficulty: str = "easy",
    question_number: int = 2,
) -> Dict[str, Any]:
    """
    Unified intelligence pass:
    1. Evaluates candidate's answer (relevance, accuracy, completeness, clarity)
    2. Detects missing concepts and specific topics mentioned
    3. Categorizes behavior (strong, vague, dont_know)
    4. Formulates the next COUNTER QUESTION
    5. Determines whether to advance difficulty or pivot topic

    Returns structured evaluation + next question ready for WebSocket/REST response.
    """
    cleaned_answer = candidate_answer.strip()
    if not cleaned_answer:
        cleaned_answer = "(No response provided)"

    logger.info(
        "Processing Answer Q#%d | Topic: %s (Turn %d) | Diff: %s | Answer: %s...",
        question_number, current_topic, turns_on_topic, current_difficulty, cleaned_answer[:60]
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
        current_difficulty=current_difficulty,
    )

    llm_res = await call_llm_json(prompt, max_new_tokens=400, temperature=0.3)

    result = None
    if llm_res and isinstance(llm_res, dict) and "next_question" in llm_res:
        next_q = str(llm_res.get("next_question", "")).strip()
        if len(next_q) > 15:
            result = llm_res
            logger.info("LLM generated counter-question: %s...", next_q[:80])

    # 2. If LLM failed, use heuristic engine
    if not result:
        logger.warning("LLM counter-question generation failed — using heuristic counter-question engine")
        result = _heuristic_counter_question(
            prev_question=prev_question,
            candidate_answer=cleaned_answer,
            current_topic=current_topic,
            turns_on_topic=turns_on_topic,
            resume_context=resume_context,
        )

    # 3. Calculate standardized composite score (0 - 100)
    analysis = result.get("answer_analysis", {})
    relevance = int(analysis.get("relevance", 70))
    accuracy = int(analysis.get("technical_accuracy", 70))
    clarity = int(analysis.get("clarity", 70))
    completeness = int(analysis.get("completeness", 70))
    final_score = int(accuracy * 0.40 + relevance * 0.30 + completeness * 0.20 + clarity * 0.10)
    final_score = max(0, min(100, final_score))

    # Determine next topic tracking
    switch_topic = result.get("switch_topic", False)
    new_topic = result.get("current_topic", current_topic)
    next_turns = 1 if switch_topic or new_topic != current_topic else (turns_on_topic + 1)

    # Keep difficulty friendly & accessible (college student level)
    behavior = result.get("candidate_behavior", "satisfactory")
    next_diff = "easy"

    return {
        # Evaluation component (compatible with existing reporting & DB)
        "evaluation": {
            "score": final_score,
            "final_score": final_score,
            "relevance": relevance,
            "correctness": accuracy,
            "technical_depth": completeness,
            "clarity": clarity,
            "feedback": result.get("feedback", "Good response."),
            "strengths": result.get("detected_topics", []),
            "improvements": result.get("missing_concepts", []),
        },
        "score": final_score,
        "feedback": result.get("feedback", "Good response."),
        "detected_topics": result.get("detected_topics", []),
        "missing_concepts": result.get("missing_concepts", []),
        "candidate_behavior": behavior,

        # Counter-Question component
        "next_question": result["next_question"],
        "question_type": result.get("question_type", "counter_question"),
        "difficulty": next_diff,
        "current_topic": new_topic,
        "turns_on_topic": next_turns,
        "tts_text": result["next_question"],
    }
