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

    class Config:
        from_attributes = True
