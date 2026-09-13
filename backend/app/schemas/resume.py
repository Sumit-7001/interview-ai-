from datetime import datetime
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ResumeOut(BaseModel):
    id: str
    filename: str
    skills: List[str]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    uploaded_at: datetime
    # ATS fields (new)
    ats_score: Optional[int] = None
    ats_matched_keywords: Optional[List[str]] = []
    ats_missing_keywords: Optional[List[str]] = []
    ats_section_scores: Optional[Dict[str, Any]] = {}
    ats_suggestions: Optional[List[str]] = []
    ats_summary: Optional[str] = ""
    resume_context: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
