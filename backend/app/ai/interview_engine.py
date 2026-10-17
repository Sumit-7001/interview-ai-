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

# ── Authentic TCS Data Analyst Question Bank ──────────────────────────────────
# Extracted from AmbitionBox TCS Data Analyst Interview Guide
TCS_DATA_ANALYST_QUESTIONS = [
    {
        "question": "Can you describe your basic computer skills and analytical toolkit with MS Excel, SQL, and Python for data analysis and enterprise reporting?",
        "topic": "TCS Analytical Toolkit & Data Fundamentals",
        "stage": "analytical_toolkit",
        "category": "Excel & Analytics",
    },
    {
        "question": "What is SAP MM and what are its main functions in enterprise procurement and inventory management?",
        "topic": "SAP MM & Enterprise ERP",
        "stage": "enterprise_erp",
        "category": "Business Analytics",
    },
    {
        "question": "What is the difference between a Purchase Requisition (PR) and a Purchase Order (PO) in enterprise business systems?",
        "topic": "Procurement Lifecycle (PR vs PO)",
        "stage": "procurement_lifecycle",
        "category": "Business Analytics",
    },
    {
        "question": "What is the difference between a Purchase Order (PO) and a Goods Receipt (GR), and how does 3-way matching prevent invoice discrepancies?",
        "topic": "3-Way Matching & Procurement",
        "stage": "procurement_audit",
        "category": "Business Analytics",
    },
    {
        "question": "What is data and what are its main classifications: Structured, Semi-structured, and Unstructured?",
        "topic": "Data Architectures & Classifications",
        "stage": "data_classifications",
        "category": "Data Analysis",
    },
    {
        "question": "What are the key roles & responsibilities of a Data Analyst at TCS when delivering solutions to enterprise clients?",
        "topic": "TCS Data Analyst Responsibilities",
        "stage": "role_responsibilities",
        "category": "Data Analysis",
    },
    {
        "question": "Explain the functions in SQL (Aggregate vs Scalar) and write an example combining both in a single query.",
        "topic": "SQL Functions & Query Design",
        "stage": "sql_functions",
        "category": "SQL & DBMS",
    },
    {
        "question": "What is the difference between Power BI and Tableau: what are the key advantages and limitations of both?",
        "topic": "Power BI vs Tableau",
        "stage": "bi_tools",
        "category": "Power BI & Visualization",
    },
    {
        "question": "What is Row-Level Security (RLS) in Power BI and how do you implement Dynamic RLS using USERPRINCIPALNAME()?",
        "topic": "Power BI Row-Level Security",
        "stage": "bi_security",
        "category": "Power BI & Security",
    },
    {
        "question": "Explain SQL Constraints (Primary Key, Foreign Key, Unique) and types of Joins (Inner, Left, Right, Full Outer).",
        "topic": "SQL Joins & Constraints",
        "stage": "sql_joins",
        "category": "SQL & Relational Models",
    },
    {
        "question": "Write a SQL query to find the 2nd highest salary from an Employee table without using LIMIT or TOP.",
        "topic": "SQL Subqueries & Ranking (DENSE_RANK)",
        "stage": "sql_ranking",
        "category": "SQL & DBMS",
    },
    {
        "question": "How do you perform data cleaning and validation in Python using Pandas (handling missing values, deduplication, IQR outliers)?",
        "topic": "Data Cleaning & Anomaly Detection",
        "stage": "data_cleaning",
        "category": "Python & Pandas",
    },
    {
        "question": "Why do you want to join TCS as a Data Analyst?",
        "topic": "TCS Enterprise Fit & Motivation",
        "stage": "tcs_motivation",
        "category": "HR & Culture",
    },
]


# ── Opening Question Generator ────────────────────────────────────────────────

async def generate_opening_question(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_context: Dict[str, Any],
    company_domain: Optional[str] = None,
    focus_question: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Generate the first question of the interview based on resume or domain curriculum.
    Strictly avoids asking web dev questions when interviewing for Data Analyst roles.
    """
    domain_str = (company_domain or "").lower()
    role_lower = (role or "").lower()
    is_data_analyst = "analyst" in role_lower or "data" in role_lower or "analytics" in role_lower or "bi" in role_lower
    is_tcs = "tcs" in domain_str

    # If focus question explicitly provided (e.g. from Question Bank practice click)
    if focus_question and len(focus_question.strip()) > 10:
        clean_fq = focus_question.strip()
        topic = "TCS Data Analyst Assessment" if is_tcs else f"{role} Assessment"
        q_type = "tcs_data_analyst" if (is_tcs and is_data_analyst) else "company_curated"
        return {
            "question": clean_fq,
            "current_topic": topic,
            "stage": "question_bank",
            "difficulty": "medium",
            "question_type": q_type,
            "tts_text": clean_fq,
        }

    projects = resume_context.get("projects", [])
    experience = resume_context.get("experience", [])
    skills_data = resume_context.get("skills", {})
    all_skills = skills_data.get("all_skills", []) if isinstance(skills_data, dict) else []
    has_resume_data = bool(projects or experience or all_skills)

    # Check for data/analytics relevant projects
    data_keywords = ["sql", "data", "analytics", "analysis", "pandas", "tableau", "power bi", "bi", "etl", "warehouse", "excel", "reporting", "dashboard", "spark"]
    has_data_project = any(
        any(k in str(p.get("name", "")).lower() or k in str(p.get("description", "")).lower() or any(k in str(t).lower() for t in p.get("technologies", [])) for k in data_keywords)
        for p in projects
    )

    # If candidate is interviewing for TCS Data Analyst and has no dedicated data project in resume,
    # directly use the authentic TCS Data Analyst Question Bank to avoid asking about unrelated web/e-commerce apps!
    if is_tcs and is_data_analyst and not has_data_project:
        q_first = TCS_DATA_ANALYST_QUESTIONS[0]
        logger.info("Using authentic TCS Data Analyst question bank opener: %s", q_first["question"])
        return {
            "question": q_first["question"],
            "current_topic": q_first["topic"],
            "stage": q_first["stage"],
            "difficulty": "easy",
            "question_type": "tcs_data_analyst",
            "tts_text": q_first["question"],
        }

    # Log opening question context
    logger.info(
        "\n[OPENING QUESTION LLM CONTEXT]\n"
        "Has Resume Data: %s | Has Data Project: %s\n"
        "Projects: %d, Experience: %d, Skills: %d\n"
        "Role: %s | Experience Level: %s | Interview Type: %s | Company Domain: %s\n",
        has_resume_data,
        has_data_project,
        len(projects),
        len(experience),
        len(all_skills),
        role,
        experience_level,
        interview_type,
        company_domain,
    )

    # 1. Try LLM generation
    prompt = resume_opening_question_prompt(
        role=role,
        experience_level=experience_level,
        interview_type=interview_type,
        resume_context=resume_context,
        company_domain=company_domain,
    )
    llm_res = await call_llm_json(prompt, max_new_tokens=350, temperature=0.2)

    if llm_res and isinstance(llm_res, dict) and "question" in llm_res:
        q_text = str(llm_res["question"]).strip()
        # Safety guard: if LLM still says "I noticed you built" but there is no resume or no data project for DA, reject
        if not has_resume_data and "i noticed you built" in q_text.lower():
            logger.warning(
                "LLM hallucinated a resume-based question despite no resume data. Rejecting. Q=%s",
                q_text[:80]
            )
        elif is_data_analyst and any(web_kw in q_text.lower() for web_kw in ["react", "frontend components", "css", "html", "vue"]):
            logger.warning("LLM generated frontend web question for Data Analyst role. Overriding with TCS Data Analyst bank.")
            q_first = TCS_DATA_ANALYST_QUESTIONS[0]
            return {
                "question": q_first["question"],
                "current_topic": q_first["topic"],
                "stage": q_first["stage"],
                "difficulty": "easy",
                "question_type": "tcs_data_analyst" if is_tcs else "data_analyst",
                "tts_text": q_first["question"],
            }
        elif len(q_text) > 15:
            topic = llm_res.get("target_topic") or (projects[0]["name"] if projects else "Technical Fundamentals")
            q_type = "tcs_data_analyst" if (is_tcs and is_data_analyst) else ("project_opening" if has_resume_data else "general_technical")
            logger.info("Generated opening question (has_resume=%s): %s...", has_resume_data, q_text[:80])
            return {
                "question": q_text,
                "current_topic": topic,
                "stage": "project_overview" if (has_resume_data and has_data_project) else "tcs_data_analyst",
                "difficulty": "easy",
                "question_type": q_type,
                "tts_text": q_text,
            }

    # 2. Deterministic Fallback
    if "tcs" in domain_str and is_data_analyst:
        fallback_q = TCS_DATA_ANALYST_QUESTIONS[0]["question"]
        topic = TCS_DATA_ANALYST_QUESTIONS[0]["topic"]
        q_type = "tcs_data_analyst"
    elif "tcs" in domain_str:
        fallback_q = "Welcome to the TCS Technical Round! Can you explain the difference between Call by Value and Call by Reference in programming languages, and how memory (Stack vs Heap) is managed?"
        topic = "TCS Core Technical & Memory Management"
        q_type = "company_curated"
    elif "wipro" in domain_str:
        fallback_q = "Welcome to the Wipro Technical Assessment! Can you explain the difference between method overloading and overriding in OOP, and how garbage collection operates in your primary language?"
        topic = "Wipro Core Technical & OOP"
    elif "infosys" in domain_str:
        fallback_q = "Welcome to the Infosys Technical Round! Can you explain how you analyze algorithm complexity with Big-O notation, and how database indexes optimize query execution?"
        topic = "Infosys Technical & Algorithmic Analysis"
    elif "capgemini" in domain_str:
        fallback_q = "Welcome to the Capgemini Technical Round! Can you walk me through the 4 core pillars of Object-Oriented Programming (OOPs) and explain how Polymorphism is implemented with a practical example?"
        topic = "Capgemini OOPs & Technical Fundamentals"
    elif "accenture" in domain_str:
        fallback_q = "Welcome to the Accenture Technical Assessment! Can you explain RESTful API design principles, and how microservices manage state and distributed transactions?"
        topic = "Accenture System Design & API Architecture"
    elif "cognizant" in domain_str:
        fallback_q = "Welcome to the Cognizant Technical Round! Can you walk me through the lifecycle of an application request from client to database, and explain how multi-threading and concurrency are managed?"
        topic = "Cognizant Application Flow & Concurrency"
    elif "dsa" in domain_str or "algorithm" in domain_str:
        fallback_q = "Welcome to the Data Structures & Algorithms Track! Can you explain how hash tables resolve collisions, and walk me through an optimal approach to detect a cycle in a linked list?"
        topic = "DSA & Algorithmic Complexity"
    elif "dbms" in domain_str or "database" in domain_str:
        fallback_q = "Welcome to the Database Management Systems (DBMS) Track! Can you explain ACID transactions, the difference between clustered and non-clustered indexes, and how normalization eliminates data redundancy?"
        topic = "DBMS & Relational Architecture"
    elif "operating system" in domain_str or "os" == domain_str:
        fallback_q = "Welcome to the Operating Systems Track! Can you explain the fundamental differences between a process and a thread, and describe the 4 Coffman conditions required for a deadlock?"
        topic = "Operating Systems & Concurrency"
    elif "oop" in domain_str or "object" in domain_str:
        fallback_q = "Welcome to the Object-Oriented Programming (OOP) Track! Can you explain the 4 fundamental pillars of OOP — Abstraction, Encapsulation, Inheritance, and Polymorphism — with real-world examples?"
        topic = "OOP Principles & Design Patterns"
    elif "web" in domain_str or "frontend" in domain_str:
        fallback_q = "Welcome to the Web Development Track! Can you explain the Critical Rendering Path in modern web browsers, how the DOM is constructed, and state management strategies in modern web apps?"
        topic = "Web Architecture & Frontend Systems"
    elif "machine learning" in domain_str or "ml" in domain_str or "ai" in domain_str:
        fallback_q = "Welcome to the Machine Learning Track! Can you explain the bias-variance tradeoff, how gradient descent optimizes neural weights, and techniques to prevent overfitting?"
        topic = "Machine Learning & Model Optimization"
    elif "python" in domain_str:
        fallback_q = "Welcome to the Python Technical Track! Can you explain Python's Global Interpreter Lock (GIL), memory management via reference counting, and when to use generators vs list comprehensions?"
        topic = "Python Internals & Execution"
    elif "java" in domain_str:
        fallback_q = "Welcome to the Java Technical Track! Can you explain JVM architecture (Heap vs Stack), garbage collection algorithms, and how String immutability is implemented?"
        topic = "Java JVM Architecture & Memory"
    elif "banking" in domain_str or "fintech" in domain_str:
        fallback_q = "Welcome to the Banking & FinTech Domain Track! In financial transaction processing, data integrity is paramount. Can you explain ACID properties and how you handle race conditions during concurrent account transfers?"
        topic = "Banking System Security & ACID Integrity"
    elif has_resume_data:
        # Resume-based fallback
        if projects:
            top_project = projects[0]
            p_name = top_project.get("name", "your project")
            techs = ", ".join(top_project.get("technologies", [])[:3])
            tech_clause = f" using {techs}" if techs else ""
            fallback_q = (
                f"I noticed you built {p_name}{tech_clause}. "
                f"Can you explain the architecture and your personal contribution to it?"
            )
            topic = p_name
        elif experience:
            top_exp = experience[0]
            company = top_exp.get("company") or top_exp.get("role_or_company", "your previous company")
            role_t = top_exp.get("role", role)
            fallback_q = (
                f"I see from your resume that you worked as a {role_t} at {company}. "
                f"Can you walk me through the technical systems and responsibilities you had there?"
            )
            topic = f"{role_t} at {company}"
        else:
            # Skills only — no projects/experience
            skill_list = ", ".join(all_skills[:4])
            fallback_q = (
                f"I can see you have experience with {skill_list}. "
                f"Can you describe a real system or project where you applied these technologies and explain the architecture?"
            )
            topic = "Technical Skills"
    else:
        # No resume at all — general role-specific question
        general_questions = {
            "backend": f"Can you walk me through how you would design a scalable REST API for a high-traffic application, including authentication, rate limiting, and database architecture?",
            "frontend": f"Can you explain how you would architect a large React application for maintainability, performance, and scalability?",
            "full stack": f"Can you walk me through the architecture of a full-stack web application — from the frontend to the backend to the database — including how you would handle authentication and state management?",
            "machine learning": f"Can you explain how you would design and deploy a machine learning pipeline from data collection to model serving in production?",
            "data": f"Can you describe how you would build a data pipeline for ingesting, transforming, and analyzing large-scale datasets?",
        }
        role_lower = role.lower()
        fallback_q = next(
            (q for keyword, q in general_questions.items() if keyword in role_lower),
            f"Can you walk me through how you would architect a system for a typical {role} project, covering the key design decisions and trade-offs you would consider?"
        )
        topic = f"{role} System Design"

    return {
        "question": fallback_q,
        "current_topic": topic,
        "stage": "project_overview" if has_resume_data else "general_technical",
        "difficulty": "easy",
        "question_type": "project_opening" if has_resume_data else "general_technical",
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
        "GraphQL", "REST", "LangChain", "PyTorch", "TensorFlow", "OpenCV", "Whisper", "Next.js",
        "SQL", "Excel", "Power BI", "Tableau", "Pandas", "NumPy", "DAX", "SAP MM", "SAP",
        "Power Query", "ETL", "Statistics", "Pivot Tables", "VLOOKUP",
    ]
    mentioned_techs = [tech for tech in known_techs if re.search(r'\b' + re.escape(tech.lower()) + r'\b', answer_lower)]

    # 3. Detect explicit claims and conversational intent
    has_sql = any(w in answer_lower for w in ["sql", "join", "joins", "query", "queries", "aggregate", "groupby", "group by"])
    has_bi = any(w in answer_lower for w in ["power bi", "powerbi", "tableau", "dashboard", "dax", "rls"])
    has_excel = any(w in answer_lower for w in ["excel", "vlookup", "pivot table", "pivot", "power query"])
    has_sap = any(w in answer_lower for w in ["sap", "sap mm", "procurement", "purchase order", "goods receipt", "pr"])
    has_cleaning = any(w in answer_lower for w in ["cleaning", "clean", "outlier", "outliers", "missing values", "null", "fillna", "dropna", "iqr"])
    has_async = any(w in answer_lower for w in ["async", "asynchronous", "asyncio"])
    has_realtime = any(w in answer_lower for w in ["real-time", "realtime", "websocket", "streaming"])
    has_backend_choice = any(w in answer_lower for w in ["backend", "server", "api"]) and any(t in answer_lower for t in ["fastapi", "flask", "django", "express", "node"])
    because_match = re.search(r'because\s+(.+)', candidate_answer, re.IGNORECASE)

    next_q = None
    detected = mentioned_techs[:]
    missing = []
    question_type = "counter_question"

    if has_sql:
        next_q = "You mentioned SQL querying. How do you differentiate between Aggregate and Scalar functions in SQL, and when would you use a window function like DENSE_RANK over RANK?"
        detected.append("SQL query optimization")
        missing.append("aggregate vs scalar functions and window ranking")
        question_type = "counter_question"
    elif has_bi:
        next_q = "You highlighted Business Intelligence dashboards. How do you implement Dynamic Row-Level Security (RLS) in Power BI using USERPRINCIPALNAME() for enterprise users?"
        detected.append("Power BI & RLS")
        missing.append("dynamic DAX filtering with USERPRINCIPALNAME")
        question_type = "counter_question"
    elif has_excel:
        next_q = "You mentioned Excel. How do you leverage Pivot Tables and Power Query for automated data cleanup, and what are the advantages of INDEX/MATCH or XLOOKUP over traditional VLOOKUP?"
        detected.append("Advanced Excel Analysis")
        missing.append("data modeling and lookup resilience")
        question_type = "counter_question"
    elif has_sap:
        next_q = "You referred to enterprise procurement. What is the fundamental difference between a Purchase Requisition (PR) and a Purchase Order (PO), and how does 3-way matching operate?"
        detected.append("SAP MM & Procurement")
        missing.append("procurement controls and invoice reconciliation")
        question_type = "counter_question"
    elif has_cleaning:
        next_q = "How do you detect and handle numerical outliers using the Interquartile Range (IQR) method in Python Pandas, and how do you decide whether to impute or drop missing records?"
        detected.append("Data Hygiene & Outlier Treatment")
        missing.append("IQR formula and imputation trade-offs")
        question_type = "counter_question"
    elif has_async:
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
    company_domain: Optional[str] = None,
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
        "Topics Discussed: %s\n"
        "Company Domain: %s\n",
        json.dumps(resume_context, default=str),
        prev_question,
        cleaned_answer,
        json.dumps(conversation_history, default=str),
        json.dumps(topics_list, default=str),
        company_domain,
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
        company_domain=company_domain,
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

    # TCS Data Analyst Track Alignment Guard:
    domain_str = (company_domain or "").lower()
    role_lower = (role or "").lower()
    is_data_analyst = "analyst" in role_lower or "data" in role_lower or "analytics" in role_lower or "bi" in role_lower
    is_tcs = "tcs" in domain_str

    if is_tcs and is_data_analyst:
        curr_next_q = (result.get("next_question") or "").lower()
        is_off_topic_web = any(w in curr_next_q for w in ["react", "frontend", "html", "css", "websocket", "fastapi", "vue", "django", "express"])
        if is_off_topic_web or turns_on_topic >= 2 or result.get("switch_topic"):
            asked_texts = [turn.get("question", "").lower() for turn in conversation_history] + [prev_question.lower()]
            next_da = None
            for item in TCS_DATA_ANALYST_QUESTIONS:
                q_text = item["question"]
                if not any(item["topic"].lower() in t.lower() for t in topics_list) and not any(q_text[:25].lower() in a for a in asked_texts):
                    next_da = item
                    break
            if next_da:
                logger.info("Advancing to next authentic TCS Data Analyst question: %s", next_da["question"])
                result["next_question"] = next_da["question"]
                result["current_topic"] = next_da["topic"]
                result["stage"] = next_da["stage"]
                result["question_type"] = "tcs_data_analyst"
                result["switch_topic"] = True

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
