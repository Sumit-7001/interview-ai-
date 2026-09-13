"""
Centralised prompt templates for all AI tasks.

All prompts:
- Use /nothink to disable Qwen3 chain-of-thought (faster responses)
- Instruct the model to return ONLY valid JSON
- Are reusable functions with typed parameters
"""

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
    Picks a real project or internship from the resume to open with.
    """
    candidate_name = resume_context.get("candidate_name", "the candidate")
    projects = resume_context.get("projects", [])
    experience = resume_context.get("experience", [])
    skills = resume_context.get("skills", {})

    project_lines = []
    for p in projects:
        techs = ", ".join(p.get("technologies", [])) if p.get("technologies") else "tech stack"
        desc = p.get("description", "")
        project_lines.append(f"• Project: {p.get('name')} | Technologies: {techs} | Description: {desc}")
    project_summary = "\n".join(project_lines) if project_lines else "No specific projects found."

    exp_lines = []
    for e in experience:
        comp = e.get("company") or e.get("role_or_company", "Organization")
        role_t = e.get("role", "Role")
        techs = ", ".join(e.get("technologies", [])) if e.get("technologies") else ""
        exp_lines.append(f"• {role_t} at {comp} | Tech: {techs}")
    exp_summary = "\n".join(exp_lines) if exp_lines else "No work experience listed."

    all_skills = ", ".join(skills.get("all_skills", [])) if isinstance(skills, dict) else ""

    return f"""/nothink
You are a senior technical interviewer opening an interview for the {role} position.

Candidate: {candidate_name}
Experience Level: {experience_level}
Interview Type: {interview_type}

Candidate's Resume Highlights:
Key Skills: {all_skills}

Projects on Resume:
{project_summary}

Work Experience / Internships on Resume:
{exp_summary}

CRITICAL RULES (EASY / FRESHER LEVEL):
1. The candidate is a college student / fresher. Keep questions at an EASY, BEGINNER-FRIENDLY, and ENCOURAGING level.
2. DO NOT ask generic questions like "Tell me about yourself" or "What are your strengths?"
3. DO NOT ask complex architecture, enterprise system design, microservices, or high-scale distributed systems questions.
4. Your opening question MUST directly reference a SPECIFIC project or internship from their resume, asking in simple words what it does and what they worked on.
5. Example of required easy question format:
   "I noticed on your resume that you built [Project Name] using [Tech 1]. In simple words, can you explain what this project does and what specific parts you personally developed?"
6. Keep the tone friendly, clear, and conversational.

Output ONLY a JSON object in this exact format:
{{
  "question": "Your easy, friendly project-based opening question here",
  "target_topic": "The exact project or technology you are asking about",
  "reasoning": "Why this opening question was chosen"
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
    current_difficulty: str = "easy",
) -> str:
    """
    Core dynamic interview intelligence prompt.
    Analyzes the candidate's answer, checks technical accuracy, evaluates missing concepts,
    detects weak vs strong answers, and formulates a direct, EASY, student-friendly COUNTER QUESTION.
    """
    candidate_name = resume_context.get("candidate_name", "Candidate")
    projects = resume_context.get("projects", [])
    skills = resume_context.get("skills", {})
    all_skills = ", ".join(skills.get("all_skills", [])) if isinstance(skills, dict) else ""

    # Format history turns
    history_lines = []
    for turn in conversation_history[-4:]:
        q = turn.get("question", "")
        a = turn.get("answer", "")[:180]
        history_lines.append(f"Interviewer: {q}")
        history_lines.append(f"Candidate: {a}")
    history_block = "\n".join(history_lines) if history_lines else "(First answer in interview)"

    # Candidate projects summary for topic transition if current topic exhausted
    remaining_projects = [p.get("name") for p in projects if p.get("name") and p.get("name").lower() not in current_topic.lower()]
    next_topic_candidate = remaining_projects[0] if remaining_projects else "core programming fundamentals"

    return f"""/nothink
You are a friendly, encouraging technical interviewer interviewing {candidate_name} (a college student / fresher) for a {role} role.

INTERVIEW STATE:
- Current Topic Being Explored: {current_topic}
- Consecutive Turns on This Topic: {turns_on_topic}
- Target Difficulty Level: EASY / FRESHER / STUDENT-FRIENDLY
- Candidate Claimed Skills: {all_skills}
- Next Potential Resume Topic (if switching): {next_topic_candidate}

RECENT CONVERSATION:
{history_block}

MOST RECENT QUESTION ASKED:
"{prev_question}"

CANDIDATE'S ACTUAL ANSWER:
"{candidate_answer}"

CRITICAL DIFFICULTY INSTRUCTIONS (KEEP QUESTIONS EASY & PRACTICAL):
1. The candidate is a college student / fresher. All questions MUST be at an EASY, PRACTICAL, AND ACCESSIBLE level.
2. STRICTLY AVOID:
   - High-level enterprise architecture, microservices, or distributed systems.
   - 10x scalability, high-concurrency traffic bottlenecks, or cluster management.
   - Intimidating mathematical proofs or complex theoretical formulas.
3. INSTEAD, ASK SIMPLE, DIRECT, PRACTICAL QUESTIONS:
   - "How did you connect your frontend to your backend in this project?"
   - "What is the purpose of [Technology/Library mentioned] in your application?"
   - "Can you explain step-by-step what happens when a user uses this feature?"
   - "What was a simple bug or error you ran into while coding this, and how did you solve it?"
   - "How did you store or retrieve data from the database?"
4. IF THE ANSWER IS STRONG:
   Acknowledge it nicely and ask another simple, practical feature or testing question. DO NOT jump to 10x scale or complex enterprise design.
5. IF THE CANDIDATE SAYS "I don't know" OR GIVES A VAGUE ANSWER:
   Be very warm and supportive:
   "No problem at all! Let's keep it simple: [ask a very basic question about their project or feature]"
6. TOPIC PROGRESSION:
   If you have spent 2-3 turns on {current_topic}, you can smoothly transition to another project: {next_topic_candidate}.
   Otherwise, ask an easy follow-up on {current_topic}.

Output ONLY valid JSON in this exact structure, with no markdown code blocks:
{{
  "answer_analysis": {{
    "relevance": <integer 0-100>,
    "technical_accuracy": <integer 0-100>,
    "clarity": <integer 0-100>,
    "completeness": <integer 0-100>
  }},
  "candidate_behavior": "strong" | "satisfactory" | "weak" | "vague" | "dont_know",
  "detected_topics": ["topic 1", "topic 2"],
  "missing_concepts": ["concept 1", "concept 2"],
  "feedback": "Short 1-2 sentence friendly, encouraging spoken feedback acknowledging what they said.",
  "next_question": "Your easy, friendly, practical counter-question here",
  "question_type": "counter_question" | "deep_dive" | "clarification" | "pivot_angle" | "new_topic",
  "difficulty": "easy",
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
