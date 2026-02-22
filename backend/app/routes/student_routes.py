from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_database
from ..models import FacultyResponse, FeedbackCreate, FeedbackResponse
from ..auth import get_current_active_student
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/faculty", response_model=List[FacultyResponse])
async def get_faculty_list(current_user: dict = Depends(get_current_active_student), db = Depends(get_database)):
    faculty_cursor = db.faculty.find({})
    faculty_list = list(faculty_cursor)
    return faculty_list

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackCreate, current_user: dict = Depends(get_current_active_student), db = Depends(get_database)):
    # Check if student already submitted feedback for this faculty
    existing_feedback = db.feedback.find_one({
        "student_email": current_user["email"],
        "faculty_id": ObjectId(feedback.faculty_id)
    })
    
    if existing_feedback:
        raise HTTPException(status_code=400, detail="You have already submitted feedback for this faculty member.")
    
    # Calculate overall rating for this specific feedback
    overall_rating = (feedback.clarity_score + feedback.knowledge_score + feedback.doubt_solving) / 3.0
    
    new_feedback = feedback.model_dump()
    new_feedback["student_email"] = current_user["email"]
    new_feedback["faculty_id"] = ObjectId(feedback.faculty_id)
    new_feedback["overall_rating"] = overall_rating
    new_feedback["created_at"] = datetime.utcnow()
    
    # Insert feedback
    db.feedback.insert_one(new_feedback)
    
    # Update faculty stats
    faculty = db.faculty.find_one({"_id": ObjectId(feedback.faculty_id)})
    if faculty:
        current_total = faculty.get("total_reviews", 0)
        current_avg = faculty.get("avg_rating", 0.0)
        
        new_total = current_total + 1
        new_avg = ((current_avg * current_total) + overall_rating) / new_total
        
        db.faculty.update_one(
            {"_id": ObjectId(feedback.faculty_id)},
            {"$set": {"avg_rating": new_avg, "total_reviews": new_total}}
        )
    
    return {"message": "Feedback submitted successfully"}
