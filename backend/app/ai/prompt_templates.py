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
