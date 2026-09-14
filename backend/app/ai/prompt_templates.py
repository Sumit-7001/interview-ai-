"""
Centralised prompt templates for all AI tasks.

All prompts:
- Use /nothink to disable Qwen3 chain-of-thought (faster responses)
- Instruct the model to return ONLY valid JSON
- Are reusable functions with typed parameters
"""

import json
from typing import List, Optional


# ── Question Generation ────────────────────────────────────────────────────────

def technical_question_prompt(
    role: str,
    experience_level: str,
    resume_skills: Optional[str],
    num_questions: int,
) -> str:
    skills_block = ""
    if resume_skills and resume_skills.strip():
        skills_block = f"\nCandidate's Key Skills from Resume:\n{resume_skills.strip()[:600]}\n"

    return f"""/nothink
You are a senior technical interviewer. Generate exactly {num_questions} technical interview questions.

Job Role: {role}
Experience Level: {experience_level}{skills_block}

Rules:
- Questions must test technical depth, system design, and problem-solving
- Mix conceptual and practical questions
- Tailor at least 2 questions to the candidate's resume skills if provided
- Each question must be standalone and clear

Output ONLY a JSON object in this exact format, nothing else:
{{
  "questions": [
    "Question 1 text here",
    "Question 2 text here"
  ]
}}"""


def hr_question_prompt(role: str, num_questions: int) -> str:
    return f"""/nothink
You are an experienced HR interviewer. Generate exactly {num_questions} HR interview questions.

Job Role: {role}

Rules:
- Focus on motivation, culture fit, career goals, and soft skills
- Include questions about strengths, weaknesses, and work style
- Keep questions professional and open-ended

Output ONLY a JSON object in this exact format, nothing else:
{{
  "questions": [
    "Question 1 text here",
    "Question 2 text here"
  ]
}}"""


def behavioral_question_prompt(role: str, num_questions: int) -> str:
    return f"""/nothink
You are a behavioral interviewer using the STAR method. Generate exactly {num_questions} behavioral interview questions.

Job Role: {role}

Rules:
- Use "Tell me about a time when..." or "Describe a situation where..." format
- Focus on teamwork, conflict resolution, leadership, and decision-making
- Each question should elicit a story-based answer

Output ONLY a JSON object in this exact format, nothing else:
{{
  "questions": [
    "Question 1 text here",
    "Question 2 text here"
  ]
}}"""


def resume_question_prompt(
    resume_text: str,
    role: str,
    num_questions: int,
) -> str:
    resume_excerpt = resume_text.strip()[:1000]
    return f"""/nothink
You are a technical interviewer. Generate exactly {num_questions} interview questions based on this candidate's resume.

Target Role: {role}

Resume Content:
{resume_excerpt}

Rules:
- Reference specific skills, projects, and experiences from the resume
- Ask candidates to elaborate on listed achievements
- Mix technical and situational questions

Output ONLY a JSON object in this exact format, nothing else:
{{
  "questions": [
    "Question 1 text here",
    "Question 2 text here"
  ]
}}"""


def followup_question_prompt(
    prev_question: str,
    prev_answer: str,
    role: str,
) -> str:
    return f"""/nothink
You are a technical interviewer conducting a follow-up.

Role: {role}
Previous Question: {prev_question}
Candidate's Answer: {prev_answer[:500]}

Generate ONE precise follow-up question that digs deeper into the candidate's answer.

Output ONLY a JSON object in this exact format, nothing else:
{{
  "question": "Your follow-up question here"
}}"""


# ── Answer Evaluation ──────────────────────────────────────────────────────────

def answer_evaluation_prompt(
    question: str,
    answer: str,
    interview_type: str,
    role: str,
) -> str:
    focus = {
        "Technical": "technical accuracy, depth, and practical knowledge",
        "HR": "communication clarity, self-awareness, and cultural fit",
        "Behavioral": "structured storytelling (STAR method), outcomes, and lessons learned",
    }.get(interview_type, "overall quality, clarity, and relevance")

    return f"""/nothink
You are an expert {interview_type} interviewer evaluating a candidate's response.

Role: {role}
Interview Type: {interview_type}
Evaluation Focus: {focus}

Question:
{question}

Candidate's Answer:
{answer[:1500]}

Evaluate the answer critically but fairly. Score each dimension out of 100.

Output ONLY a JSON object in this exact format, nothing else:
{{
  "score": <integer 0-100, weighted composite>,
  "relevance": <integer 0-100>,
  "correctness": <integer 0-100>,
  "clarity": <integer 0-100>,
  "technical_depth": <integer 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback": "Detailed, actionable 2-3 sentence feedback paragraph."
}}"""


# ── Final Overall Feedback ────────────────────────────────────────────────────

def final_feedback_prompt(
    eval_summary: str,
    role: str,
    interview_type: str,
    eye_contact_avg: float,
    overall_score: int,
) -> str:
    return f"""/nothink
You are a professional interview coach generating a final performance report.

Candidate Role: {role}
Interview Type: {interview_type}
Overall Score: {overall_score}/100
Average Eye Contact: {eye_contact_avg:.0f}%

Per-Question Evaluation Summary:
{eval_summary[:2000]}

Generate honest, constructive, and encouraging final feedback.

Output ONLY a JSON object in this exact format, nothing else:
{{
  "what_went_well": [
    "Specific positive observation 1",
    "Specific positive observation 2",
    "Specific positive observation 3"
  ],
  "areas_to_improve": [
    "Specific improvement area 1",
    "Specific improvement area 2",
    "Specific improvement area 3"
  ],
  "recommendations": "A detailed paragraph with specific resources, study topics, and practical steps the candidate should take to improve for their next interview."
}}"""


# ── Dynamic Interview Prompts (NEW) ───────────────────────────────────────────

# ── Dynamic Resume-Driven Interview Prompts ───────────────────────────────────

def resume_opening_question_prompt(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_context: dict,
) -> str:
    """
    Generate the very FIRST question directly based on the candidate's resume.
    Strictly forbids generic openers like 'Tell me about yourself'.
    Directly references an actual project or experience from the resume.
    """
    candidate_name = resume_context.get("candidate_name", "the candidate")
    projects = resume_context.get("projects", [])
    experience = resume_context.get("experience", [])
    skills = resume_context.get("skills", {})

    # Full structured resume context representation
    resume_context_json = json.dumps(resume_context, indent=2, default=str)

    return f"""/nothink
You are a senior technical interviewer opening an interview for the {role} position ({experience_level} level, {interview_type} format).

CANDIDATE'S FULL STRUCTURED RESUME CONTEXT:
{resume_context_json}

CRITICAL RULES FOR FIRST QUESTION:
1. STRICTLY FORBIDDEN: NEVER ask generic questions like "Tell me about yourself", "What are your strengths?", or "Walk me through your resume."
2. DIRECT RESUME CITATION: Your opening question MUST directly reference a SPECIFIC project, system, or work experience from their resume, including the actual technologies used.
3. ARCHITECTURE & CONTRIBUTION: Ask the candidate to explain the architecture of that specific project and what parts they personally designed and built.
4. REQUIRED FORMAT EXAMPLE:
   "I noticed you built an [Project Name] using [Tech 1, Tech 2, and Tech 3]. Can you explain its architecture and your personal contribution to it?"
5. Keep the tone professional, welcoming, and directly focused on their technical work.

Output ONLY a valid JSON object in this exact format:
{{
  "question": "I noticed you built [Project Name] using [Technologies]. Can you explain the architecture and your personal contribution?",
  "target_topic": "The exact project name or primary topic",
  "reasoning": "Why this opening question was chosen based on the resume"
}}"""


def initial_question_prompt(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_text: Optional[str] = None,
) -> str:
    """Legacy compatibility wrapper — delegates to resume-based opening if text available."""
    from app.ai.resume_parser import parse_resume_heuristics
    context = parse_resume_heuristics(resume_text) if resume_text else {}
    return resume_opening_question_prompt(role, experience_level, interview_type, context)


def counter_question_analysis_prompt(
    prev_question: str,
    candidate_answer: str,
    role: str,
    current_topic: str,
    turns_on_topic: int,
    conversation_history: List[dict],
    resume_context: dict,
    topics_discussed: Optional[List[str]] = None,
    current_difficulty: str = "medium",
) -> str:
    """
    Core dynamic interview intelligence prompt.
    Analyzes the candidate's answer, checks technical accuracy, evaluates missing concepts,
    detects claims made, and formulates a direct, connected COUNTER-QUESTION or DEEPER FOLLOW-UP.
    """
    candidate_name = resume_context.get("candidate_name", "Candidate")
    full_resume_json = json.dumps(resume_context, indent=2, default=str)

    # Format history turns
    history_lines = []
    if conversation_history:
        for idx, turn in enumerate(conversation_history, 1):
            q = turn.get("question", "")
            a = turn.get("answer", "")
            history_lines.append(f"Turn {idx}:\n  Interviewer: {q}\n  Candidate: {a}")
    history_block = "\n".join(history_lines) if history_lines else "(No prior turns — this is the first answer)"

    # Format topics discussed
    topics_list = topics_discussed or [current_topic]
    topics_block = "\n".join(f"- {t}" for t in topics_list) if topics_list else f"- {current_topic}"

    return f"""/nothink
You are an expert technical interviewer conducting an interview for the {role} position.

CANDIDATE'S FULL STRUCTURED RESUME CONTEXT:
{full_resume_json}

TOPICS ALREADY DISCUSSED (DO NOT REPEAT UNLESS DRILLING DEEPER):
{topics_block}

PREVIOUS CONVERSATION HISTORY:
{history_block}

MOST RECENT QUESTION ASKED:
"{prev_question}"

CANDIDATE'S LATEST ANSWER:
"{candidate_answer}"

CURRENT TOPIC: {current_topic} (Turn {turns_on_topic} on this topic)

CRITICAL CONVERSATIONAL DEPENDENCY & COUNTER-QUESTIONING RULES:
1. GENERATE NEXT QUESTION BASED PRIMARILY ON THE CANDIDATE'S LATEST ANSWER:
   - Carefully inspect what the candidate JUST said in their latest answer: "{candidate_answer}".
   - Identify the explicit technical claims, choices, frameworks, or mechanisms they just named.
   - You MUST continue the exact same conversational thread and drill into their specific answer:
     • If candidate stated: "I used React for the frontend and FastAPI for the backend."
       → You MUST ask a counter-question on their choice: "Why did you choose FastAPI for the backend?" (or why React for frontend).
     • If candidate stated: "Because it is fast and supports asynchronous APIs."
       → You MUST ask a deeper follow-up exploring that exact claim: "You mentioned asynchronous APIs. Where did you use asynchronous processing in your project, and what benefit did it provide?"
     • If candidate stated: "I used it for real-time communication."
       → You MUST drill deeper into that exact mechanism: "How did you implement real-time communication in your application, and why did you choose WebSockets?"
2. STRICTLY FORBIDDEN — NO GENERIC RESET QUESTIONS:
   - Do NOT ask generic reset questions like "What does your project do?", "Can you explain what the system does?", or "What are your strengths?" when the candidate has already answered.
   - Do NOT ignore what the candidate just said. Every follow-up question must be an organic consequence of their previous response.
3. DRILL PROGRESSIVELY DEEPER:
   - Turn 1: High-level architecture / components.
   - Turn 2: Counter-question on specific technology or design choice they claimed.
   - Turn 3: Deep-dive into the underlying mechanism, concurrency, performance, or trade-offs they brought up.
4. HONEST EVALUATION:
   - Score the candidate's latest answer fairly based on relevance, technical accuracy, clarity, and completeness (0-100).
   - If the answer is direct and factual, score it accurately (do not penalize concise answers if technically sound).

Output ONLY valid JSON in this exact structure, with no markdown fences:
{{
  "answer_analysis": {{
    "relevance": <integer 0-100>,
    "technical_accuracy": <integer 0-100>,
    "clarity": <integer 0-100>,
    "completeness": <integer 0-100>
  }},
  "candidate_behavior": "strong" | "satisfactory" | "weak" | "vague" | "dont_know",
  "detected_topics": ["topic or technology 1", "topic or technology 2"],
  "missing_concepts": ["concept to explore further"],
  "feedback": "1-2 sentence spoken interviewer feedback acknowledging what the candidate just said.",
  "next_question": "Your dynamic counter-question or deeper follow-up directly drilling into their latest answer",
  "question_type": "counter_question" | "deep_dive" | "clarification",
  "difficulty": "{current_difficulty}",
  "current_topic": "{current_topic}",
  "switch_topic": false
}}"""


def dynamic_followup_prompt(
    prev_question: str,
    prev_answer: str,
    role: str,
    interview_type: str,
    conversation_history: List[dict],
    answer_score: int,
    difficulty: str,
    resume_excerpt: Optional[str] = None,
    question_number: int = 2,
) -> str:
    """
    Generate the next dynamic interview question based on the candidate's answer.
    The AI behaves like a HUMAN interviewer adapting to the candidate's responses.
    """
    history_block = ""
    if conversation_history:
        history_lines = []
        for turn in conversation_history[-4:]:
            history_lines.append(f"Q: {turn.get('question', '')}")
            history_lines.append(f"A: {turn.get('answer', '')[:200]}")
        history_block = "\nPrevious Conversation:\n" + "\n".join(history_lines) + "\n"

    resume_block = ""
    if resume_excerpt:
        resume_block = f"\nResume Context:\n{resume_excerpt[:500]}\n"

    difficulty_instruction = {
        "basic": "The candidate needs more support. Ask a simpler follow-up or ask for a concrete example.",
        "intermediate": "The candidate has a decent foundation. Push them one level deeper on a specific aspect they mentioned.",
        "advanced": "The candidate is performing well. Challenge them with a harder follow-up about edge cases, trade-offs, or scale.",
    }.get(difficulty, "Ask a natural follow-up based on what they said.")

    return f"""/nothink
You are an experienced {interview_type} interviewer conducting question #{question_number}.

Role Interviewing For: {role}
Candidate Answer Quality: {answer_score}/100 ({difficulty} level)
{resume_block}{history_block}

Most Recent Question Asked:
{prev_question}

Candidate's Answer:
{prev_answer[:800]}

Your Task:
Generate ONE natural follow-up question.
{difficulty_instruction}

Rules:
- Reference something SPECIFIC from the candidate's answer (not generic)
- Sound like a real human interviewer, not a chatbot
- Do NOT repeat a question already asked
- If they mentioned a specific technology or concept, ask about that specifically
- Keep it to ONE clear question

Output ONLY a JSON object in this exact format, nothing else:
{{
  "question": "Your specific follow-up question here",
  "reasoning": "Brief internal note about why this follow-up (not shown to candidate)"
}}"""


def ats_analysis_prompt(resume_text: str, role: str) -> str:
    """LLM-enhanced ATS analysis prompt (optional enhancement)."""
    return f"""/nothink
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Target Role: {role}

Resume Content:
{resume_text[:2000]}

Analyze this resume for ATS compatibility and role fit.

Output ONLY a JSON object in this exact format, nothing else:
{{
  "ats_score": <integer 0-100>,
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "missing_skills": ["skill 1", "skill 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "summary": "2-3 sentence overall assessment of the resume for this role."
}}"""
