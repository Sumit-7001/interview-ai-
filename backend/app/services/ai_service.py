import json
import logging
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)

# Fallback Database of realistic questions for mock mode
FALLBACK_QUESTIONS = {
    "Technical": {
        "Software Engineer": [
            "Explain the difference between a process and a thread, and how they share resources.",
            "What is a hash table? Explain how collision resolution works in hash tables.",
            "Describe the REST architectural style and its key constraints.",
            "What are the differences between SQL and NoSQL databases? When would you use which?",
            "Explain the concept of Big O notation and analyze the complexity of quicksort."
        ],
        "React Developer": [
            "Explain the virtual DOM and how React's reconciliation algorithm works.",
            "What are React Hooks? Describe the rules of hooks and explain the useEffect hook.",
            "How do you manage global state in a large-scale React application? Compare Redux with Context API.",
            "Explain the difference between class components and functional components in React.",
            "What are Server Components in React/Next.js, and how do they differ from Client Components?"
        ],
        "Python Developer": [
            "What is the GIL (Global Interpreter Lock) in Python, and how does it affect multi-threading?",
            "Explain the difference between list comprehensions and generators. When would you use a generator?",
            "How does memory management work in Python? Describe garbage collection and reference counting.",
            "What are decorators in Python? Write a simple execution-time decorator.",
            "Explain the difference between shallow copy and deep copy in Python."
        ]
    },
    "HR": [
        "Tell me about yourself and why you are interested in this position.",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why should we hire you over other candidates?",
        "Describe a time you had a conflict with a coworker and how you resolved it."
    ],
    "Behavioral": [
        "Describe a challenging project you worked on. What was your role, and how did you handle difficulties?",
        "Tell me about a time you made a mistake at work. How did you address it, and what did you learn?",
        "Give an example of a time you had to meet a tight deadline under high pressure.",
        "Describe a situation where you had to persuade others to adopt your point of view.",
        "Tell me about a time you took the initiative to improve a process or solve a problem."
    ]
}

def get_client() -> Optional[OpenAI]:
    if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip():
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    return None

async def generate_questions(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_text: Optional[str] = None,
    num_questions: int = 5
) -> List[str]:
    client = get_client()
    if not client:
        # Fallback Mock Mode
        logger.info("Using Mock Mode for Question Generation (No API Key)")
        
        # Determine standard category
        category = interview_type if interview_type in ["Technical", "HR", "Behavioral"] else "Technical"
        
        if category == "Technical":
            role_key = "Software Engineer"
            for k in FALLBACK_QUESTIONS["Technical"].keys():
                if k.lower() in role.lower():
                    role_key = k
                    break
            questions = FALLBACK_QUESTIONS["Technical"][role_key]
        else:
            questions = FALLBACK_QUESTIONS[category]
            
        # Add resume touch if resume is supplied
        final_qs = []
        if resume_text and len(resume_text.strip()) > 50:
            final_qs.append(f"Looking at your resume, we see experience in this domain. Can you tell us about a specific challenge you overcame in your last role?")
            
        final_qs.extend(questions)
        return final_qs[:num_questions]

    # OpenAI GPT Mode
    prompt = f"""
    You are an expert tech recruiter. Generate exactly {num_questions} interview questions for:
    Job Role: {role}
    Experience Level: {experience_level}
    Interview Type: {interview_type}
    """
    if resume_text:
        prompt += f"\nCandidate's Parsed Resume Text:\n{resume_text}\nGenerate questions customized to their background where appropriate."
        
    prompt += "\nOutput your response ONLY as a JSON list of strings, for example: [\"Question 1\", \"Question 2\"]."

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional HR assistant that outputs valid JSON lists."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and "questions" in data:
            return data["questions"]
        elif isinstance(data, dict):
            # Key might be anything, search for lists
            for val in data.values():
                if isinstance(val, list):
                    return val
        return list(data.values())[:num_questions]
    except Exception as e:
        logger.error(f"Error calling OpenAI API for questions: {e}")
        # Fallback to local
        return FALLBACK_QUESTIONS["HR"][:num_questions]

async def evaluate_answer(question_text: str, answer_text: str) -> Dict[str, Any]:
    client = get_client()
    if not client:
        # High fidelity mock grading
        logger.info("Using Mock Mode for Answer Evaluation (No API Key)")
        word_count = len(answer_text.split())
        score = 50
        if word_count > 40:
            score = 85
        elif word_count > 15:
            score = 70
        else:
            score = 45
            
        return {
            "score": score,
            "relevance": "Direct answer structure" if word_count > 20 else "Somewhat short answer",
            "correctness": "Conceptually sound" if word_count > 30 else "Incomplete explanation",
            "completeness": "Covers primary definitions" if word_count > 40 else "Needs more elaboration",
            "clarity": "Highly articulate" if word_count > 25 else "Vague or lacks details",
            "feedback": f"Your response is {word_count} words long. You described the concepts, but adding a practical code or system example would enhance depth."
        }

    # OpenAI API evaluation
    prompt = f"""
    Analyze the interview answer against the question:
    Question: "{question_text}"
    Answer: "{answer_text}"
    
    Evaluate and score the answer out of 100.
    Output ONLY a JSON object with this exact structure:
    {{
        "score": integer (between 0 and 100),
        "relevance": "brief explanation",
        "correctness": "brief explanation",
        "completeness": "brief explanation",
        "clarity": "brief explanation",
        "feedback": "detailed helpful feedback telling the user what they did well and how they could improve their answer"
    }}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional coding interviewer grading responses."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}")
        return {
            "score": 75,
            "relevance": "Good",
            "correctness": "Fair",
            "completeness": "Partial",
            "clarity": "Moderate",
            "feedback": "Unable to evaluate answer via OpenAI. Default grading applied."
        }

async def generate_overall_feedback(
    questions_evaluations: List[Dict[str, Any]],
    role: str,
    interview_type: str,
    eye_contact_avg: float
) -> Dict[str, Any]:
    client = get_client()
    
    # Calculate average answer score
    scores = [q["evaluation"]["score"] for q in questions_evaluations if q.get("evaluation")]
    avg_answer_score = sum(scores) / len(scores) if scores else 70
    
    # Base computations for scores
    tech_score = int(avg_answer_score + 2) if "technical" in interview_type.lower() else int(avg_answer_score)
    comm_score = int(avg_answer_score - 2) if avg_answer_score > 50 else 60
    conf_score = int(avg_answer_score + 1)
    clarity_score = int(avg_answer_score - 1)
    
    overall = int((tech_score + comm_score + conf_score + clarity_score + eye_contact_avg) / 5)
    
    scores_breakdown = {
        "technical": min(100, max(0, tech_score)),
        "communication": min(100, max(0, comm_score)),
        "answer_quality": min(100, max(0, int(avg_answer_score))),
        "confidence": min(100, max(0, conf_score)),
        "eye_contact": min(100, max(0, int(eye_contact_avg))),
        "speech_clarity": min(100, max(0, clarity_score))
    }

    if not client:
        # Mock feedback
        return {
            "overall_score": overall,
            "scores_breakdown": scores_breakdown,
            "feedback": {
                "what_went_well": [
                    "Demonstrated good baseline knowledge of core roles and concepts.",
                    "Kept answer structure concise and direct to the point.",
                    f"Maintained reasonable eye contact posture ({int(eye_contact_avg)}%)."
                ],
                "areas_to_improve": [
                    "Incorporate more real-world examples (like specific databases, libraries, or system details).",
                    "Slow down your speaking speed to ensure technical terms are fully articulated.",
                    "Avoid pausing abruptly during complex explanations; complete the thread of thought."
                ],
                "recommendations": f"For {role} roles, focus on building depth. Practice explaining the 'why' behind choices, not just the definitions. Work on maintaining consistent eye contact above 80% to project confidence."
            }
        }

    # Generate via LLM
    eval_summary = "\n".join([f"Q: {q['question_text']}\nScore: {q['evaluation']['score']}\nFeedback: {q['evaluation']['feedback']}" for q in questions_evaluations if q.get("evaluation")])
    
    prompt = f"""
    Synthesize the mock interview results and generate a premium evaluation feedback report.
    Role: {role}
    Interview Type: {interview_type}
    Average Eye Contact: {eye_contact_avg}%
    
    Evaluation Summary of questions:
    {eval_summary}
    
    Generate detailed feedback with what they did well, areas to improve, and concrete recommendations.
    Output ONLY a JSON object with this exact structure:
    {{
        "what_went_well": ["bullet 1", "bullet 2", "bullet 3"],
        "areas_to_improve": ["bullet 1", "bullet 2", "bullet 3"],
        "recommendations": "detailed paragraph recommending resources, style shifts, and specific topics to study"
    }}
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional interview mentor summarizing scores."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        feedback_data = json.loads(content)
        return {
            "overall_score": overall,
            "scores_breakdown": scores_breakdown,
            "feedback": feedback_data
        }
    except Exception as e:
        logger.error(f"Error generating overall feedback: {e}")
        return {
            "overall_score": overall,
            "scores_breakdown": scores_breakdown,
            "feedback": {
                "what_went_well": ["Provided relevant descriptions in answers.", "Covered primary questions."],
                "areas_to_improve": ["Add more code/practical examples.", "Maintain consistent eye contact."],
                "recommendations": "Keep practicing core interview definitions."
            }
        }
