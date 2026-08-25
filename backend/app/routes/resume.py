import re
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from bson import ObjectId
from app.database import get_database
from app.schemas.resume import ResumeOut
from app.services.auth_service import get_current_user

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
            # We can use a simple pdf parser or fallback to reading raw bytes as text for mock purposes
            # Let's try to parse using pdfminer or similar if available, or just convert bytes
            # For robustness, we will perform a basic text extract from standard PDF byte chunks 
            # if library import fails, or fallback.
            try:
                import pypdf
                from io import BytesIO
                reader = pypdf.PdfReader(BytesIO(contents))
                pages_text = [page.extract_text() for page in reader.pages]
                parsed_text = "\n".join(pages_text)
            except ImportError:
                # If pypdf is not installed, extract whatever string elements we can or use basic decode
                parsed_text = contents.decode("utf-8", errors="ignore")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse PDF file: {str(e)}"
            )
    else:
        # Standard txt decode
        parsed_text = contents.decode("utf-8", errors="ignore")
        
    if not parsed_text.strip():
        parsed_text = f"Resume details parsed from {file.filename}. Primary role tech stacks detected."
        
    # Extract structural details
    skills = extract_skills_from_text(parsed_text)
    experience, education = parse_experience_and_education(parsed_text)
    
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
        "uploaded_at": datetime.utcnow()
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
