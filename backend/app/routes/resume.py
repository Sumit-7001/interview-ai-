import re
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from bson import ObjectId
from app.database import get_database
from app.schemas.resume import ResumeOut
from app.services.auth_service import get_current_user
from app.ai.ats_scorer import calculate_ats_score
from app.ai.resume_parser import parse_resume_to_structured_context
from app.config import settings

router = APIRouter(prefix="/api/resume", tags=["Resume"])

# Predefined common skills list for parsing extraction
TECH_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Vue", "Angular", "Next.js", "Node.js",
    "Express", "Django", "FastAPI", "Flask", "Java", "Spring Boot", "C++", "C#", "Go",
    "Rust", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
    "AWS", "GCP", "Azure", "Git", "Machine Learning", "Deep Learning", "TensorFlow",
    "PyTorch", "NLP", "HTML", "CSS", "Tailwind CSS", "Redux", "GraphQL"
]

def extract_skills_from_text(text: str) -> list:
    extracted = []
    text_lower = text.lower()
    for skill in TECH_SKILLS:
        # Match word boundaries or symbols
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        # Special cases like C++ or C#
        if skill in ["C++", "C#"]:
            pattern = re.escape(skill.lower())
        if re.search(pattern, text_lower):
            extracted.append(skill)
    return extracted

def parse_experience_and_education(text: str) -> tuple:
    """Rough parse of experience and education sections for personalization."""
    exp_list = []
    edu_list = []
    
    # Try simple segmentation based on section headers
    text_lines = text.split("\n")
    current_section = None
    
    for line in text_lines:
        line_strip = line.strip()
        if not line_strip:
            continue
        
        # Check section boundaries
        line_lower = line_strip.lower()
        if "experience" in line_lower or "work history" in line_lower or "employment" in line_lower:
            current_section = "experience"
            continue
        elif "education" in line_lower or "academic" in line_lower or "qualification" in line_lower:
            current_section = "education"
            continue
        elif "skills" in line_lower or "projects" in line_lower:
            current_section = "other"
            continue
            
        if current_section == "experience":
            # Add non-empty descriptions
            if len(line_strip) > 15:
                exp_list.append({"description": line_strip})
        elif current_section == "education":
            if len(line_strip) > 10:
                edu_list.append({"description": line_strip})
                
    # Fallback default values if none detected
    if not exp_list:
        exp_list = [{"description": "General professional background parsed"}]
    if not edu_list:
        edu_list = [{"description": "Self-taught / University program parsed"}]
        
    return exp_list[:3], edu_list[:2]


@router.post("/upload", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    # Validate extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "txt", "docx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload PDF, TXT, or DOCX."
        )
        
    # Read file
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:  # 5MB Limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds limit (5MB)."
        )
        
    parsed_text = ""
    # Parse PDF contents
    if ext == "pdf":
        try:
            try:
                import pypdf
                from io import BytesIO
                reader = pypdf.PdfReader(BytesIO(contents))
                pages_text = [page.extract_text() for page in reader.pages]
                parsed_text = "\n".join(pages_text)
            except ImportError:
                parsed_text = contents.decode("utf-8", errors="ignore")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse PDF file: {str(e)}"
            )
    elif ext == "docx":
        try:
            try:
                import docx
                from io import BytesIO
                doc = docx.Document(BytesIO(contents))
                parsed_text = "\n".join([para.text for para in doc.paragraphs])
            except ImportError:
                parsed_text = contents.decode("utf-8", errors="ignore")
        except Exception as e:
            parsed_text = contents.decode("utf-8", errors="ignore")
    else:
        # Standard txt decode
        parsed_text = contents.decode("utf-8", errors="ignore")
        
    if not parsed_text.strip():
        parsed_text = f"Resume details parsed from {file.filename}. Primary role tech stacks detected."
        
    # Extract structural details
    skills = extract_skills_from_text(parsed_text)
    experience, education = parse_experience_and_education(parsed_text)
    resume_context = await parse_resume_to_structured_context(parsed_text)
    
    # ── ATS Scoring ────────────────────────────────────────────────────────────
    ats_result = None
    if settings.ATS_ENABLED:
        try:
            # Determine role context from user's most recent interview or default
            db_check = get_database()
            last_interview = await db_check["interviews"].find_one(
                {"user_id": ObjectId(current_user["id"])},
                sort=[("created_at", -1)]
            )
            role_for_ats = last_interview.get("role", "Software Engineer") if last_interview else "Software Engineer"
            ats_result = calculate_ats_score(parsed_text, role_for_ats)
        except Exception as e:
            # ATS scoring is non-critical — don't fail the upload
            import logging
            logging.getLogger(__name__).warning(f"ATS scoring failed (non-critical): {e}")
            ats_result = {
                "score": 0,
                "matched_keywords": skills[:10],
                "missing_keywords": [],
                "section_scores": {},
                "suggestions": ["ATS scoring temporarily unavailable."],
                "summary": "Resume uploaded successfully.",
            }
    
    # Save to MongoDB
    db = get_database()
    
    # Remove existing resume for user if any
    await db["resumes"].delete_many({"user_id": ObjectId(current_user["id"])})
    
    resume_doc = {
        "user_id": ObjectId(current_user["id"]),
        "filename": file.filename,
        "parsed_text": parsed_text,
        "skills": skills if skills else ["General TechStack"],
        "experience": experience,
        "education": education,
        "resume_context": resume_context,
        "uploaded_at": datetime.utcnow(),
        # ATS fields (NEW)
        "ats_score": ats_result["score"] if ats_result else None,
        "ats_matched_keywords": ats_result["matched_keywords"] if ats_result else [],
        "ats_missing_keywords": ats_result["missing_keywords"] if ats_result else [],
        "ats_section_scores": ats_result["section_scores"] if ats_result else {},
        "ats_suggestions": ats_result["suggestions"] if ats_result else [],
        "ats_summary": ats_result["summary"] if ats_result else "",
    }
    
    result = await db["resumes"].insert_one(resume_doc)
    
    # Return output schema
    created = await db["resumes"].find_one({"_id": result.inserted_id})
    created["id"] = str(created["_id"])
    return created


@router.get("", response_model=Optional[ResumeOut])
async def get_resume(current_user: dict = Depends(get_current_user)):
    db = get_database()
    resume = await db["resumes"].find_one({"user_id": ObjectId(current_user["id"])})
    if not resume:
        return None
    resume["id"] = str(resume["_id"])
    return resume


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(current_user: dict = Depends(get_current_user)):
    """Remove the current user's stored resume profile."""
    db = get_database()
    result = await db["resumes"].delete_many({"user_id": ObjectId(current_user["id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No resume found.")


@router.post("/analyze-ats")
async def analyze_resume_ats(
    role: str = "Software Engineer",
    current_user: dict = Depends(get_current_user)
):
    """Re-run ATS scoring on the existing resume for a specific role."""
    db = get_database()
    resume = await db["resumes"].find_one({"user_id": ObjectId(current_user["id"])})
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload a resume first.")
    
    parsed_text = resume.get("parsed_text", "")
    if not parsed_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")
    
    ats_result = calculate_ats_score(parsed_text, role)
    
    # Update in MongoDB
    await db["resumes"].update_one(
        {"_id": resume["_id"]},
        {"$set": {
            "ats_score": ats_result["score"],
            "ats_matched_keywords": ats_result["matched_keywords"],
            "ats_missing_keywords": ats_result["missing_keywords"],
            "ats_section_scores": ats_result["section_scores"],
            "ats_suggestions": ats_result["suggestions"],
            "ats_summary": ats_result["summary"],
        }}
    )
    
    return ats_result
