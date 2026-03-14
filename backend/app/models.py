from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Union
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
    semester: Union[str, int, None] = None # Semester the faculty teaches

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

class RatingsInput(BaseModel):
    clarity: int = Field(..., ge=1, le=5)
    knowledge: int = Field(..., ge=1, le=5)
    engagement: int = Field(..., ge=1, le=5)
    communication: int = Field(..., ge=1, le=5)
    punctuality: int = Field(..., ge=1, le=5)

# --- Feedback Models ---
class FeedbackCreate(BaseModel):
    faculty_id: str
    department: str
    semester: Union[str, int]
    ratings: RatingsInput
    comment: Optional[str] = None

class AIAverageRatings(BaseModel):
    clarity: float
    knowledge: float
    engagement: float
    communication: float
    punctuality: float

class AISentiment(BaseModel):
    positive: float
    neutral: float
    negative: float

class AIAnalysisResponse(BaseModel):
    sentiment: AISentiment
    strengths: List[str] = []
    concerns: List[str] = []
    summary: str = ""

class FeedbackResponse(FeedbackCreate):
    id: str = Field(alias="_id")
    student_email: str
    overall_rating: float
    ai_analysis: Optional[AIAnalysisResponse] = None
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

# --- Admin Analytics Models ---
class FacultyAIAnalysis(BaseModel):
    faculty_id: str
    department: str = "Unknown"
    semester: Union[str, int] = "Unknown"
    summary: str = "No analysis available"
    strengths: List[str] = []
    concerns: List[str] = []
    sentiment: AISentiment = Field(default_factory=lambda: AISentiment(positive=0.0, neutral=100.0, negative=0.0))
    feedback_count: int = 0
    average_ratings: AIAverageRatings = Field(default_factory=lambda: AIAverageRatings(clarity=0.0, knowledge=0.0, engagement=0.0, communication=0.0, punctuality=0.0))
    generated_at: datetime
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class FacultyStats(BaseModel):
    faculty_id: str
    faculty_name: str
    total_reviews: int
    average_ratings: AIAverageRatings
    ai_analysis: Optional[FacultyAIAnalysis] = None

class AdminStatsResponse(BaseModel):
    total_students: int
    total_feedback: int
    overall_average_rating: float
    faculty_stats: List[FacultyStats]


class AdminAIAnalysisResponse(BaseModel):
    ai_analysis: List[FacultyAIAnalysis]

