"""
Question Bank Router — /api/question-bank/*

Provides curated interview question sets for top recruiters:
  - TCS (NQT, Digital, Ninja)
  - Capgemini (Pseudo-code, Technical, Behavioral HR)
  - Infosys (DSE, Specialist, SE)
  - Wipro (Elite, Turbo)
  - Accenture (Cognitive & Technical)
  - Cognizant (GenC, GenC Next)
  - Top Tech / Product (Amazon, Google, Microsoft)
  - Core CS (DSA, DBMS, OOPs, OS, CN)

Includes AI-powered instant question explanation & on-demand practice question generation.
"""

import logging
from typing import Optional
from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel

from app.ai.llm_service import call_llm
from app.services.auth_service import get_current_user
from app.routes.questions_data import CURATED_QUESTION_BANK, COMPANIES_METADATA

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/question-bank", tags=["Question Bank"])


# ── Route Handlers ────────────────────────────────────────────────────────────

@router.get("")
async def get_questions(
    company: Optional[str] = Query(None, description="Filter by company name (e.g. TCS, Capgemini)"),
    round: Optional[str] = Query(None, description="Filter by round name (e.g. Technical, Pseudocode, HR)"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. OOPs, DBMS, Core CS)"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (Easy, Medium, Hard)"),
    search: Optional[str] = Query(None, description="Search term in question text or answer"),
):
    """
    Retrieve curated interview questions with multi-parameter filtering.
    """
    results = CURATED_QUESTION_BANK

    if company and company.lower() != "all":
        c_low = company.lower()
        results = [
            q for q in results 
            if c_low in q["company"].lower() 
            or c_low in q.get("company_tag", "").lower()
        ]

    if round and round.lower() != "all":
        r_low = round.lower()
        results = [q for q in results if r_low in q.get("round", "").lower()]

    if category and category.lower() != "all":
        cat_low = category.lower()
        results = [q for q in results if cat_low in q.get("category", "").lower()]

    if difficulty and difficulty.lower() != "all":
        diff_low = difficulty.lower()
        results = [q for q in results if q.get("difficulty", "").lower() == diff_low]

    if search and search.strip():
        q_term = search.strip().lower()
        results = [
            q for q in results
            if q_term in q["question"].lower()
            or q_term in q.get("summary", "").lower()
            or q_term in q.get("answer", "").lower()
            or q_term in q["company"].lower()
            or q_term in q.get("category", "").lower()
        ]

    return {
        "total": len(results),
        "questions": results,
    }


@router.get("/companies")
async def get_companies():
    """
    Retrieve metadata for all supported target recruitment companies.
    """
    return {
        "companies": COMPANIES_METADATA,
        "total_companies": len(COMPANIES_METADATA),
        "total_questions": len(CURATED_QUESTION_BANK),
    }


class ExplainRequest(BaseModel):
    question_id: Optional[str] = None
    question_text: str
    company: Optional[str] = "General"
    language_preference: Optional[str] = "Java"


@router.post("/explain")
async def explain_question(
    payload: ExplainRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Use AI (Qwen/LLM or fallback) to explain a question in simple terms,
    providing edge cases, mental model, and a code example in the user's preferred language.
    """
    prompt = f"""You are an elite senior technical interview coach preparing a candidate for a {payload.company} interview.

Please explain the following interview question clearly, intuitively, and comprehensively:
Question: "{payload.question_text}"

Target Company: {payload.company}
Preferred Language for Code: {payload.language_preference}

Provide your response in structured markdown with the following sections:
1. **Core Concept in Plain English** (Simple intuitive analogy)
2. **Step-by-step Technical Deep-Dive**
3. **Clean Code Example in {payload.language_preference}** (with concise comments)
4. **What {payload.company} Interviewers Specifically Look For**
5. **Common Pitfalls & Edge Cases Candidates Fail On**
"""
    try:
        explanation = await call_llm(prompt, max_new_tokens=700)
        if explanation and len(explanation.strip()) > 50:
            return {
                "explanation": explanation.strip(),
                "source": "ai",
                "company": payload.company,
                "language": payload.language_preference
            }
    except Exception as e:
        logger.warning("AI explanation failed, falling back to static insight: %s", e)

    # Fallback explanation if LLM is unavailable
    fallback_text = f"""### 1. Core Concept in Plain English
This question is a cornerstone of {payload.company}'s recruitment drive. Interviewers use it to assess whether you grasp fundamental programming concepts rather than just memorizing syntax.

### 2. Key Highlights to Mention in Your Interview
- Explain the underlying memory behavior (Stack vs Heap or CPU cycle execution).
- Discuss time and space complexity clearly ($O(N)$ or $O(1)$).
- Walk through at least one real-world trade-off.

### 3. Interviewer Mindset at {payload.company}
In technical drives, panels pay close attention to your communication clarity:
- Always state your assumptions first.
- Mention edge cases (null inputs, empty arrays, integer overflows).
- Offer alternative approaches before diving into code."""

    return {
        "explanation": fallback_text,
        "source": "fallback",
        "company": payload.company,
        "language": payload.language_preference
    }
