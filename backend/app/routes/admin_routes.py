from fastapi import APIRouter, Depends
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from ..database import get_database
from ..models import AdminStatsResponse, AdminAIAnalysisResponse
from ..auth import get_current_active_admin

router = APIRouter()

@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    department: Optional[str] = None,
    semester: Optional[str] = None,
    current_user: dict = Depends(get_current_active_admin),
    db = Depends(get_database)
):
    # Normalize semester
    if semester and semester != "all":
        semester = str(semester).replace("Semester ", "").strip()
        semester = int(semester) if semester.isdigit() else semester

    total_students = await db.users.count_documents({"role": "student"})
    
    # Build a query using department and semester filters
    query = {}
    if department and department != "all":
        query["department"] = department
    if semester and semester != "all":
        query["semester"] = semester
        
    # Retrieve pre-calculated analytics
    ai_docs = await db.ai_analysis.find(query).to_list(100)
    
    total_feedback = sum(doc.get("feedback_count", 0) for doc in ai_docs)

    if total_feedback == 0:
        return AdminStatsResponse(
            total_students=total_students,
            total_feedback=0,
            overall_average_rating=0.0,
            faculty_stats=[]
        )
    
    # Calculate overall average rating based on the pre-calculated metrics
    total_rating_sum = 0.0
    for doc in ai_docs:
        avg = doc.get("average_ratings", {})
        doc_avg = (avg.get("clarity", 0) + avg.get("knowledge", 0) + 
                   avg.get("engagement", 0) + avg.get("communication", 0) + 
                   avg.get("punctuality", 0)) / 5.0
        total_rating_sum += doc_avg * doc.get("feedback_count", 0)

    overall_average_rating = total_rating_sum / total_feedback if total_feedback > 0 else 0.0

    # Extract unique faculty IDs
    faculty_ids = list(set([ObjectId(doc["faculty_id"]) for doc in ai_docs if doc.get("faculty_id")]))

    # Retrieve faculty names
    faculties = await db.faculties.find({"_id": {"$in": faculty_ids}}).to_list(100)
    faculty_map = {str(f["_id"]): f["name"] for f in faculties}
    
    # Group by faculty_id to handle 'all' semesters overlapping
    faculty_groups = {}
    for doc in ai_docs:
        if not doc.get("faculty_id"):
            continue
        fid = str(doc["faculty_id"])
        if fid not in faculty_groups:
            faculty_groups[fid] = []
        faculty_groups[fid].append(doc)
        
    faculty_stats = []
    
    for fid, docs in faculty_groups.items():
        total_reviews = sum(d.get("feedback_count", 0) for d in docs)
        if total_reviews == 0:
            continue
            
        avg_clarity = sum(d.get("average_ratings", {}).get("clarity", 0) * d.get("feedback_count", 0) for d in docs) / total_reviews
        avg_knowledge = sum(d.get("average_ratings", {}).get("knowledge", 0) * d.get("feedback_count", 0) for d in docs) / total_reviews
        avg_engagement = sum(d.get("average_ratings", {}).get("engagement", 0) * d.get("feedback_count", 0) for d in docs) / total_reviews
        avg_communication = sum(d.get("average_ratings", {}).get("communication", 0) * d.get("feedback_count", 0) for d in docs) / total_reviews
        avg_punctuality = sum(d.get("average_ratings", {}).get("punctuality", 0) * d.get("feedback_count", 0) for d in docs) / total_reviews
        
        average_ratings_dict = {
            "clarity": avg_clarity,
            "knowledge": avg_knowledge,
            "engagement": avg_engagement,
            "communication": avg_communication,
            "punctuality": avg_punctuality
        }
        
        # Pick the most substantial AI analysis (highest feedback count) or most recent
        best_doc = max(docs, key=lambda d: d.get("feedback_count", 0))
        best_doc_copy = best_doc.copy()
        best_doc_copy["_id"] = str(best_doc_copy.get("_id", ""))
        best_doc_copy["faculty_id"] = str(best_doc_copy.get("faculty_id", ""))
        
        faculty_stats.append({
            "faculty_id": fid,
            "faculty_name": faculty_map.get(fid, "Unknown"),
            "total_reviews": total_reviews,
            "average_ratings": average_ratings_dict,
            "ai_analysis": best_doc_copy
        })
        
    return {
        "total_students": total_students,
        "total_feedback": total_feedback,
        "overall_average_rating": overall_average_rating,
        "faculty_stats": faculty_stats
    }

@router.get("/ai-analysis/{faculty_id}", response_model=AdminAIAnalysisResponse)
async def get_ai_analysis(
    faculty_id: str, 
    department: Optional[str] = None,
    semester: Optional[str] = None,
    current_user: dict = Depends(get_current_active_admin), 
    db = Depends(get_database)
):
    import logging
    logger = logging.getLogger(__name__)
    
    faculty_object_id = ObjectId(faculty_id)
    
    query = {"faculty_id": faculty_object_id}
    
    if semester and semester != "all":
        semester = str(semester).replace("Semester ", "").strip()
        query["semester"] = int(semester) if semester.isdigit() else semester
        
    if department and department != "all":
        query["department"] = department

    # Pre-calculated analytics should already exist from background tasks
    docs = await db.ai_analysis.find(query).to_list(100)
    
    if not docs:
        empty_res = {
            "faculty_id": faculty_id,
            "department": department if department else "Unknown",
            "semester": semester if semester else 1,
            "summary": "No AI analysis available. Waiting for student feedback.",
            "strengths": [],
            "concerns": [],
            "sentiment": {
                "positive": 0,
                "neutral": 100,
                "negative": 0
            },
            "feedback_count": 0,
            "generated_at": datetime.utcnow()
        }
        return {"ai_analysis": [empty_res]}
        
    # Return the most substantial or most recent document if multiple are found (e.g. for 'all' semesters)
    best_doc = max(docs, key=lambda d: d.get("feedback_count", 0))
    best_doc["faculty_id"] = str(best_doc.get("faculty_id", ""))
    if "_id" in best_doc:
        best_doc["_id"] = str(best_doc["_id"])
        
    return {"ai_analysis": [best_doc]}

@router.post("/reset-analytics")
async def reset_analytics(
    current_user: dict = Depends(get_current_active_admin),
    db = Depends(get_database)
):
    try:
        # Clear AI Analysis
        await db.ai_analysis.delete_many({})
        
        # Clear all feedback
        await db.feedback.delete_many({})
        
        # We don't necessarily update avg_rating on faculties right now because it's calculated dynamically in /stats
        
        return {"message": "Analytics reset successfully"}
    except Exception as e:
        logger.error(f"Error resetting analytics: {e}")
        return {"message": f"Failed to reset analytics: {str(e)}"}
