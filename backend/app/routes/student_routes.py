from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List, Optional
from ..database import get_database
from ..models import FacultyResponse, FeedbackCreate, FeedbackResponse
from ..auth import get_current_active_student
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/departments")
async def get_departments(db = Depends(get_database)):
    departments = await db.departments.find().to_list(100)
    for d in departments:
        d["_id"] = str(d["_id"])
    return departments

@router.get("/semesters")
async def get_semesters(db = Depends(get_database)):
    semesters = await db.semesters.find().to_list(100)
    for s in semesters:
        s["_id"] = str(s["_id"])
    return semesters

@router.get("/faculty", response_model=List[FacultyResponse])
async def get_faculty_list(
    department: Optional[str] = None,
    current_user: dict = Depends(get_current_active_student),
    db = Depends(get_database)
):
    query = {}
    if department:
        query["department"] = department
        
    faculty_cursor = db.faculties.find(query)
    faculty_list = await faculty_cursor.to_list(length=None)
    for faculty in faculty_list:
        faculty["_id"] = str(faculty["_id"])
    return faculty_list

@router.post("/feedback")
async def submit_feedback(
    feedback: FeedbackCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_active_student),
    db = Depends(get_database)
):
    # Normalize semester
    sem_val = str(feedback.semester).replace("Semester ", "").strip()
    normalized_semester = int(sem_val) if sem_val.isdigit() else sem_val

    # Check if student already submitted feedback for this faculty in this semester
    existing_feedback = await db.feedback.find_one({
        "student_email": current_user["email"],
        "faculty_id": ObjectId(feedback.faculty_id),
        "semester": normalized_semester
    })
    
    if existing_feedback:
        raise HTTPException(status_code=400, detail="You have already submitted feedback for this faculty member this semester.")
    
    # Calculate overall rating for this specific feedback (5 dimensions)
    overall_rating = (
        feedback.ratings.clarity + 
        feedback.ratings.knowledge + 
        feedback.ratings.engagement + 
        feedback.ratings.communication +
        feedback.ratings.punctuality
    ) / 5.0
    
    new_feedback = feedback.model_dump()
    new_feedback["semester"] = normalized_semester
    new_feedback["student_email"] = current_user["email"]
    new_feedback["faculty_id"] = ObjectId(feedback.faculty_id)
    new_feedback["overall_rating"] = overall_rating
    new_feedback["ai_analysis"] = None # Run dynamically in admin analytics
    new_feedback["created_at"] = datetime.utcnow()
    
    # Insert feedback
    await db.feedback.insert_one(new_feedback)
    
    # Trigger background AI analysis regeneration
    from ..utils.ai_analyzer import trigger_ai_analysis_background
    background_tasks.add_task(
        trigger_ai_analysis_background,
        str(feedback.faculty_id),
        feedback.department,
        normalized_semester
    )
    
    # Update faculty stats
    faculty = await db.faculties.find_one({"_id": ObjectId(feedback.faculty_id)})
    if faculty:
        current_total = faculty.get("total_reviews") or 0
        current_avg = faculty.get("avg_rating") or 0.0
        
        new_total = current_total + 1
        new_avg = ((current_avg * current_total) + overall_rating) / new_total
        
        await db.faculties.update_one(
            {"_id": ObjectId(feedback.faculty_id)},
            {"$set": {"avg_rating": new_avg, "total_reviews": new_total}}
        )
        
    return {"message": "Feedback submitted successfully"}
