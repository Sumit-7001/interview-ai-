"""
Resume Parser — Extracts and structures rich context from raw resume text.

Produces a structured Resume Context object containing:
- Candidate Name
- Summary / Objective
- Skills categorized (Languages, Frameworks, Databases, Tools)
- Projects (Title, Description, Technologies, Highlights)
- Internship / Work Experience (Role, Company, Duration, Responsibilities)
- Education (Degree, Institution, CGPA/Score)
- Certifications & Achievements

This structured context directly drives the AI Interviewer's questions.
"""

import re
import logging
from typing import Any, Dict, List, Optional
from bson import ObjectId

from app.ai.llm_service import call_llm_json
from app.database import get_database

logger = logging.getLogger(__name__)

# Predefined technology taxonomy for rule-based fallback categorization
KNOWN_LANGUAGES = [
    "python", "javascript", "typescript", "c++", "c#", "c", "java", "go",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "dart", "sql", "r"
]
KNOWN_FRAMEWORKS = [
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express",
    "fastapi", "flask", "django", "spring boot", "spring", "asp.net", "laravel",
    "tailwind", "tailwind css", "bootstrap", "redux", "graphql", "langchain",
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "opencv", "yolo"
]
KNOWN_DATABASES = [
    "mongodb", "postgresql", "postgres", "mysql", "sqlite", "redis",
    "cassandra", "elasticsearch", "neo4j", "dynamodb", "oracle"
]
KNOWN_TOOLS = [
    "git", "github", "gitlab", "docker", "kubernetes", "k8s", "aws", "gcp",
    "azure", "linux", "vs code", "jupyter", "jupyter notebook", "postman",
    "hugging face", "huggingface", "jira", "ci/cd", "jenkins", "vite"
]


def extract_candidate_name(text: str) -> str:
    """Extract candidate name from header lines."""
    lines = [line.strip() for line in text.strip().split("\n") if line.strip()]
    for line in lines[:4]:
        if any(c in line for c in ["@", "http", ".com", "|", "/", "\\"]):
            continue
        clean_words = re.findall(r"[A-Za-z]+", line)
        if 2 <= len(clean_words) <= 4:
            return " ".join(clean_words).title()
    return "Candidate"


def extract_categorized_skills(text: str) -> Dict[str, List[str]]:
    """Categorize skills found in the resume text."""
    text_lower = text.lower()
    
    languages = []
    frameworks = []
    databases = []
    tools = []
    
    def find_matches(words_list, target_list):
        for word in words_list:
            pattern = r'\b' + re.escape(word) + r'\b'
            if word in ["c++", "c#"]:
                pattern = re.escape(word)
            if re.search(pattern, text_lower):
                display = word.title()
                if word in ["sql", "html", "css", "api", "aws", "gcp", "ci/cd", "oop", "dsa", "llm"]:
                    display = word.upper()
                elif word in ["react.js", "node.js", "next.js"]:
                    display = word[0].upper() + word[1:]
                elif word in ["fastapi", "mongodb", "postgresql", "mysql"]:
                    display = word.title() if word != "mongodb" else "MongoDB"
                    if word == "fastapi": display = "FastAPI"
                    if word == "mysql": display = "MySQL"
                    if word == "postgresql": display = "PostgreSQL"
                elif word in ["github", "gitlab", "langchain", "opencv"]:
                    display = {"github": "GitHub", "gitlab": "GitLab", "langchain": "LangChain", "opencv": "OpenCV"}.get(word, word.title())
                
                if display not in target_list:
                    target_list.append(display)

    find_matches(KNOWN_LANGUAGES, languages)
    find_matches(KNOWN_FRAMEWORKS, frameworks)
    find_matches(KNOWN_DATABASES, databases)
    find_matches(KNOWN_TOOLS, tools)
    
    all_skills = list(dict.fromkeys(languages + frameworks + databases + tools))
    return {
        "programming_languages": languages,
        "frameworks": frameworks,
        "databases": databases,
        "tools": tools,
        "all_skills": all_skills,
    }


def parse_resume_heuristics(text: str) -> Dict[str, Any]:
    """Deterministic, rule-based resume parser fallback."""
    name = extract_candidate_name(text)
    skills = extract_categorized_skills(text)
    
    projects = []
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    
    # Check for known project indicators
    in_project_section = False
    current_proj = None
    
    for i, line in enumerate(lines):
        line_upper = line.upper()
        if "PROJECT" in line_upper:
            in_project_section = True
            continue
        elif in_project_section and any(sec in line_upper for sec in ["EDUCATION", "EXPERIENCE", "ADDITIONAL", "CERTIFICATIONS"]):
            if current_proj:
                projects.append(current_proj)
                current_proj = None
            in_project_section = False
            continue
            
        if in_project_section:
            if re.match(r'^(?:Tech|Technologies|Stack|Tools)\s*[:–-]', line, re.IGNORECASE):
                if current_proj:
                    techs = re.sub(r'^(?:Tech|Technologies|Stack|Tools)\s*[:–-]', '', line, re.IGNORECASE)
                    current_proj["technologies"] = [t.strip() for t in re.split(r'[,|•]', techs) if t.strip()]
            elif not line.startswith("•") and not line.startswith("-") and len(line) < 50:
                if current_proj:
                    projects.append(current_proj)
                current_proj = {
                    "name": line,
                    "description": "",
                    "technologies": [],
                    "highlights": []
                }
            elif current_proj:
                cleaned = line.lstrip("•-* ")
                current_proj["highlights"].append(cleaned)
                if not current_proj["description"]:
                    current_proj["description"] = cleaned
                    
    if current_proj:
        projects.append(current_proj)
        
    # Experience heuristics
    experience = []
    in_exp = False
    current_exp = None
    for line in lines:
        if "EXPERIENCE" in line.upper() or "INTERNSHIP" in line.upper():
            in_exp = True
            continue
        elif in_exp and any(sec in line.upper() for sec in ["EDUCATION", "PROJECTS", "SKILLS", "ADDITIONAL"]):
            if current_exp:
                experience.append(current_exp)
                current_exp = None
            in_exp = False
            continue
            
        if in_exp:
            if any(k in line.lower() for k in ["intern", "developer", "engineer", "pvt", "ltd"]):
                if current_exp:
                    experience.append(current_exp)
                current_exp = {"role": line, "company": line, "technologies": [], "responsibilities": []}
            elif current_exp:
                if re.match(r'^(?:Tech|Technologies|Stack)\s*[:–-]', line, re.IGNORECASE):
                    techs = re.sub(r'^(?:Tech|Technologies|Stack)\s*[:–-]', '', line, re.IGNORECASE)
                    current_exp["technologies"] = [t.strip() for t in re.split(r'[,|•]', techs) if t.strip()]
                else:
                    current_exp["responsibilities"].append(line.lstrip("•-* "))
                    
    if current_exp:
        experience.append(current_exp)
        
    return {
        "candidate_name": name,
        "skills": skills,
        "projects": projects[:3],
        "experience": experience[:2],
        "education": [],
        "certifications": []
    }


async def parse_resume_to_structured_context(text: str) -> Dict[str, Any]:
    """
    Parse raw resume text into a rich, structured Resume Context object.
    Tries fast LLM extraction first, falling back to robust heuristic parsing.
    """
    if not text or not text.strip():
        return {
            "candidate_name": "Candidate",
            "skills": {"all_skills": []},
            "projects": [],
            "experience": [],
            "education": [],
            "key_topics": []
        }
        
    # 1. Try LLM structured extraction
    prompt = f"""/nothink
You are an expert resume parser. Analyze this resume text and extract a clean structured JSON object.

Resume Text:
{text}

Output ONLY valid JSON in this exact structure, with no markdown fences:
{{
  "candidate_name": "Candidate's Full Name",
  "education": [
    {{"degree": "Degree Title", "institution": "University/College", "details": "CGPA / Graduation Year"}}
  ],
  "skills": {{
    "programming_languages": ["Python", "JavaScript"],
    "frameworks": ["React", "FastAPI"],
    "databases": ["MongoDB", "MySQL"],
    "tools": ["Git", "Docker"]
  }},
  "projects": [
    {{
      "name": "Project Name",
      "description": "Clear explanation of what was built and how it works",
      "technologies": ["Tech 1", "Tech 2"],
      "highlights": ["Key feature or achievement"]
    }}
  ],
  "experience": [
    {{
      "role": "Role Title",
      "company": "Company / Organization",
      "period": "Dates or Duration",
      "technologies": ["Tech 1"],
      "responsibilities": ["Key contribution"]
    }}
  ],
  "certifications": ["Certification or award"]
}}"""

    llm_res = await call_llm_json(prompt, max_new_tokens=1000, temperature=0.2)
    
    context = None
    if llm_res and isinstance(llm_res, dict) and "projects" in llm_res and llm_res["projects"]:
        context = llm_res
        logger.info("Successfully extracted structured resume context using LLM")
    else:
        logger.info("Using heuristic resume parser fallback")
        context = parse_resume_heuristics(text)
        
    # Ensure all required keys exist
    context.setdefault("candidate_name", extract_candidate_name(text))
    context.setdefault("education", [])
    context.setdefault("skills", extract_categorized_skills(text))
    context.setdefault("projects", [])
    context.setdefault("experience", [])
    context.setdefault("certifications", [])
    
    # Flatten all skills list for quick lookups
    all_skills_list = []
    skills_dict = context.get("skills", {})
    if isinstance(skills_dict, dict):
        for k, v in skills_dict.items():
            if isinstance(v, list):
                all_skills_list.extend(v)
    skills_dict["all_skills"] = list(dict.fromkeys(all_skills_list))
    context["skills"] = skills_dict
    
    # Formulate prioritized key topics list
    key_topics = []
    for p in context.get("projects", []):
        tech_str = f" using {', '.join(p['technologies'][:3])}" if p.get("technologies") else ""
        key_topics.append(f"Project: {p['name']}{tech_str}")
        
    for e in context.get("experience", []):
        company = e.get("company") or e.get("role_or_company", "Work Experience")
        key_topics.append(f"Experience at {company}")
        
    prog_langs = skills_dict.get("programming_languages", [])
    if prog_langs:
        key_topics.append(f"Languages: {', '.join(prog_langs[:4])}")
        
    frameworks = skills_dict.get("frameworks", [])
    if frameworks:
        key_topics.append(f"Frameworks: {', '.join(frameworks[:4])}")
        
    context["key_topics"] = key_topics
    context["raw_text_length"] = len(text)
    
    return context


async def get_or_create_resume_context(user_id: str, db=None) -> Dict[str, Any]:
    """
    Retrieve structured resume context for a user.
    If not yet parsed in DB, parses parsed_text, saves resume_context, and returns it.
    """
    if db is None:
        db = get_database()
        
    resume = await db["resumes"].find_one({"user_id": ObjectId(user_id)})
    if not resume:
        return {}
        
    # Return existing structured context if already present and has valid projects/skills
    existing_ctx = resume.get("resume_context")
    if existing_ctx and existing_ctx.get("projects") and len(existing_ctx["projects"]) > 0:
        return existing_ctx
        
    # Generate structured context
    parsed_text = resume.get("parsed_text", "")
    context = await parse_resume_to_structured_context(parsed_text)
    
    # Cache in MongoDB
    try:
        await db["resumes"].update_one(
            {"_id": resume["_id"]},
            {"$set": {"resume_context": context}}
        )
        logger.info(f"Cached structured resume_context for user {user_id}")
    except Exception as e:
        logger.warning(f"Could not cache resume_context in DB: {e}")
        
    return context
