from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.utils.bson_util import PyObjectId

class UserDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    email: str
    hashed_password: str
    first_name: str
    last_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
