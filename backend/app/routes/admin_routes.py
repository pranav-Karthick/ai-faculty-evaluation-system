from fastapi import APIRouter, Depends
from ..database import get_database
from ..models import AdminAnalyticsResponse
from ..auth import get_current_active_admin

router = APIRouter()

@router.get("/analytics", response_model=AdminAnalyticsResponse)
async def get_analytics(current_user: dict = Depends(get_current_active_admin), db = Depends(get_database)):
    total_students = db.users.count_documents({"role": "student"})
    total_feedback = db.feedback.count_documents({})
    
    # Calculate overall average rating across all feedback
    pipeline = [
        {"$group": {"_id": None, "avg": {"$avg": "$overall_rating"}}}
    ]
    # to_list is async, command is synchronous in pymongo but aggregate returns a cursor.
    # We can cast to list() or use next() if we expect one result.
    result = list(db.feedback.aggregate(pipeline))
    overall_average_rating = result[0]["avg"] if result else 0.0
    
    # Get per-faculty performance
    faculty_cursor = db.faculty.find({}, {"name": 1, "avg_rating": 1, "total_reviews": 1})
    faculty_list = list(faculty_cursor)
    
    faculty_performance = [
        {
            "faculty_name": f["name"],
            "avg_rating": f.get("avg_rating", 0.0),
            "total_reviews": f.get("total_reviews", 0)
        }
        for f in faculty_list
    ]
    
    return {
        "total_students": total_students,
        "total_feedback": total_feedback,
        "overall_average_rating": overall_average_rating,
        "faculty_performance": faculty_performance
    }
