from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

# Helper for ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None, config=None, field=None): # Updated signature for Pydantic v2 compatibility check, keeping v1 style for safety or using string
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

# --- User Models ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    name: str
    email: EmailStr
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# --- Faculty Models ---
class FacultyBase(BaseModel):
    name: str
    department: str
    subject: Optional[str] = None # Added subject as it's in frontend

class FacultyCreate(FacultyBase):
    pass

class FacultyResponse(FacultyBase):
    id: str = Field(alias="_id")
    avg_rating: float = 0.0
    total_reviews: int = 0
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

# --- Feedback Models ---
class FeedbackCreate(BaseModel):
    faculty_id: str
    clarity_score: int = Field(..., ge=1, le=5)
    knowledge_score: int = Field(..., ge=1, le=5)
    doubt_solving: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class FeedbackResponse(FeedbackCreate):
    id: str = Field(alias="_id")
    student_email: str
    overall_rating: float
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

# --- Admin Analytics Models ---
class FacultyPerformance(BaseModel):
    faculty_name: str
    avg_rating: float
    total_reviews: int

class AdminAnalyticsResponse(BaseModel):
    total_students: int
    total_feedback: int
    overall_average_rating: float
    faculty_performance: List[FacultyPerformance]
