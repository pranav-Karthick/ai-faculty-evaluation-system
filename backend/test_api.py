import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("MONGO_URL")

async def main():
    client = AsyncIOMotorClient(url)
    db = client["faculty_evaluation"]
    
    faculty_cursor = db.faculties.find({})
    faculty_list = await faculty_cursor.to_list(length=None)
    
    results = []
    for faculty in faculty_list:
        faculty_id_obj = ObjectId(faculty["_id"])
        review_count = await db.feedback.count_documents({
            "faculty_id": faculty_id_obj
        })
        results.append({
            "name": faculty.get("name"),
            "db_total_reviews": faculty.get("total_reviews"),
            "calculated_reviews": review_count,
            "id": str(faculty_id_obj)
        })
        
    with open("test_out2.txt", "w", encoding="utf-8") as f:
        for r in results:
            f.write(str(r) + "\n")
            
        feedbacks = await db.feedback.find({}).to_list(None)
        f.write(f"\nTotal Feedbacks in DB: {len(feedbacks)}\n")
        for fb in feedbacks:
            f.write(f"FB: {fb['_id']} -> Faculty: {fb.get('faculty_id')}\n")

asyncio.run(main())
