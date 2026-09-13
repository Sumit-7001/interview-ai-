"""
ATS Scorer — Resume Applicant Tracking System scoring engine.

Scores a resume against a target job role using:
1. Keyword matching (tech skills, role-specific terms)
2. Section completeness (experience, education, projects, skills)
3. LLM-based deep analysis (if available)

Falls back to pure heuristic scoring if LLM is unavailable.
No heavy NLP dependencies required — spaCy/KeyBERT used only if installed.

Returns:
    {
        "score": int (0-100),
        "matched_keywords": list[str],
        "missing_keywords": list[str],
        "section_scores": dict,
        "suggestions": list[str],
        "summary": str
    }
"""

import logging
import re
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


# ── Role-Specific Keyword Maps ────────────────────────────────────────────────

ROLE_KEYWORDS: Dict[str, List[str]] = {
    "software engineer": [
        "python", "java", "javascript", "c++", "go", "rust", "algorithms", "data structures",
        "system design", "api", "rest", "microservices", "git", "agile", "ci/cd",
        "docker", "kubernetes", "sql", "nosql", "mongodb", "postgresql", "redis",
        "testing", "unit test", "code review", "scalability", "performance"
    ],
    "react developer": [
        "react", "javascript", "typescript", "html", "css", "node.js", "npm", "webpack",
        "redux", "hooks", "context api", "next.js", "vite", "tailwind", "rest api",
        "graphql", "jest", "testing library", "responsive design", "git"
    ],
    "python developer": [
        "python", "django", "fastapi", "flask", "sqlalchemy", "pandas", "numpy",
        "pytest", "asyncio", "celery", "redis", "docker", "sql", "postgresql",
        "rest api", "git", "linux", "bash", "debugging", "clean code"
    ],
    "data scientist": [
        "python", "machine learning", "deep learning", "tensorflow", "pytorch", "sklearn",
        "pandas", "numpy", "matplotlib", "jupyter", "sql", "statistics", "nlp",
        "computer vision", "feature engineering", "model evaluation", "data pipeline",
        "a/b testing", "regression", "classification", "clustering"
    ],
    "devops engineer": [
        "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "jenkins", "github actions",
        "terraform", "ansible", "linux", "bash", "monitoring", "prometheus", "grafana",
        "networking", "security", "git", "helm", "iac", "infrastructure as code"
    ],
    "machine learning engineer": [
        "python", "tensorflow", "pytorch", "scikit-learn", "mlops", "model deployment",
        "feature engineering", "data pipeline", "sql", "spark", "aws", "docker",
        "transformers", "nlp", "computer vision", "a/b testing", "experimentation"
    ],
    "frontend developer": [
        "html", "css", "javascript", "typescript", "react", "vue", "angular",
        "responsive design", "webpack", "git", "rest api", "graphql", "accessibility",
        "performance", "testing", "sass", "tailwind", "figma"
    ],
    "backend developer": [
        "python", "java", "node.js", "golang", "api design", "rest", "graphql",
        "sql", "nosql", "docker", "kubernetes", "caching", "message queue",
        "authentication", "security", "testing", "git", "linux"
    ],
    "product manager": [
        "product strategy", "roadmap", "user stories", "stakeholder management",
        "agile", "scrum", "data analysis", "metrics", "kpi", "a/b testing",
        "user research", "wireframing", "jira", "confluence", "sql", "communication"
    ],
}

# Common universal keywords any tech resume should have
UNIVERSAL_KEYWORDS = [
    "git", "agile", "problem solving", "teamwork", "communication",
    "api", "testing", "documentation"
]

# Section markers for completeness scoring
SECTION_MARKERS = {
    "experience": ["experience", "work history", "employment", "professional"],
    "education": ["education", "academic", "university", "degree", "bachelor", "master"],
    "skills": ["skills", "technologies", "technical"],
    "projects": ["project", "built", "developed", "created", "implemented"],
    "contact": ["email", "phone", "linkedin", "github", "@"],
}


# ── Keyword Matching ───────────────────────────────────────────────────────────

def _normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9\s\+\#]", " ", text.lower())


def _extract_keywords_from_resume(resume_text: str, role_keywords: List[str]) -> Dict[str, List[str]]:
    """Return matched and missing keywords."""
    normalized = _normalize(resume_text)
    matched = []
    missing = []
    for kw in role_keywords:
        pattern = re.compile(r"\b" + re.escape(kw.lower()) + r"\b")
        if pattern.search(normalized):
            matched.append(kw)
        else:
            missing.append(kw)
    return {"matched": matched, "missing": missing}


def _get_role_keywords(role: str) -> List[str]:
    """Find best-matching role keyword set."""
    role_lower = role.lower()
    # Exact or substring match
    for key, kws in ROLE_KEYWORDS.items():
        if key in role_lower or any(word in role_lower for word in key.split()):
            return kws
    # Default to software engineer
    return ROLE_KEYWORDS["software engineer"]


def _score_sections(resume_text: str) -> Dict[str, bool]:
    """Check which resume sections are present."""
    normalized = _normalize(resume_text)
    result = {}
    for section, markers in SECTION_MARKERS.items():
        result[section] = any(m in normalized for m in markers)
    return result


# ── ATS Score Calculator ──────────────────────────────────────────────────────

def calculate_ats_score(
    resume_text: str,
    role: str = "Software Engineer",
) -> Dict[str, Any]:
    """
    Calculate ATS score for a resume against a target role.

    Scoring breakdown:
      - Keyword match rate:       50%
      - Section completeness:     30%
      - Resume length/detail:     20%

    Returns a dict with score, matched/missing keywords, suggestions.
    """
    if not resume_text or not resume_text.strip():
        return {
            "score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "section_scores": {},
            "suggestions": ["Resume text is empty. Please upload a valid resume."],
            "summary": "No resume content found.",
        }

    # 1. Keyword score (50%)
    role_keywords = _get_role_keywords(role)
    # Add universal keywords
    all_keywords = list(set(role_keywords + UNIVERSAL_KEYWORDS))
    kw_result = _extract_keywords_from_resume(resume_text, all_keywords)
    matched = kw_result["matched"]
    missing = kw_result["missing"]

    keyword_score = (len(matched) / len(all_keywords)) * 100 if all_keywords else 50.0

    # 2. Section completeness (30%)
    sections = _score_sections(resume_text)
    section_score = (sum(sections.values()) / len(sections)) * 100 if sections else 60.0

    # 3. Length/detail score (20%)
    word_count = len(resume_text.split())
    if word_count >= 400:
        length_score = 100.0
    elif word_count >= 200:
        length_score = 75.0
    elif word_count >= 100:
        length_score = 50.0
    else:
        length_score = 25.0

    # Weighted final score
    raw_score = (keyword_score * 0.50) + (section_score * 0.30) + (length_score * 0.20)
    final_score = max(5, min(100, round(raw_score)))

    # Build suggestions
    suggestions = []
    if not sections.get("contact"):
        suggestions.append("Add contact information (email, LinkedIn, GitHub).")
    if not sections.get("projects"):
        suggestions.append("Add a Projects section with 2-3 detailed technical projects.")
    if not sections.get("skills"):
        suggestions.append("Add a dedicated Skills section listing your technical stack.")
    if not sections.get("experience"):
        suggestions.append("Add Work Experience with bullet points describing your contributions.")
    if missing[:5]:
        suggestions.append(
            f"Add these in-demand keywords for {role}: {', '.join(missing[:5])}."
        )
    if word_count < 300:
        suggestions.append(
            "Your resume is quite short. Add more detail to each experience/project entry."
        )
    if not suggestions:
        suggestions.append(
            "Great resume! Consider tailoring the summary section to the specific job description."
        )

    # Build summary
    grade = "Excellent" if final_score >= 80 else "Good" if final_score >= 60 else "Needs Improvement"
    summary = (
        f"ATS Score: {final_score}/100 ({grade}). "
        f"Matched {len(matched)}/{len(all_keywords)} keywords for {role}. "
        f"Sections found: {', '.join(s for s, v in sections.items() if v)}."
    )

    logger.info(
        "ATS Score for '%s': %d/100 (keywords: %d/%d, sections: %d/%d)",
        role, final_score, len(matched), len(all_keywords),
        sum(sections.values()), len(sections)
    )

    return {
        "score": final_score,
        "matched_keywords": matched[:30],  # Limit for UI display
        "missing_keywords": missing[:15],
        "section_scores": {
            "keyword_match": round(keyword_score),
            "section_completeness": round(section_score),
            "detail_level": round(length_score),
        },
        "suggestions": suggestions[:5],
        "summary": summary,
    }
