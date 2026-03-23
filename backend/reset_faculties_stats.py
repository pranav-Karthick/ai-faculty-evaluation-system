import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("MONGO_URL", "mongodb://localhost:27017")

async def reset_faculty_stats():
    client = AsyncIOMotorClient(url)
    db = client["faculty_evaluation"]
    
    faculties = await db.faculties.find({}).to_list(None)
    
    for faculty in faculties:
        faculty_id = ObjectId(faculty["_id"])
        
        # Count feedback dynamically
        review_count = await db.feedback.count_documents({"faculty_id": faculty_id})
        
        avg_rating = 0.0
        
        if review_count > 0:
            pipeline = [
                {"$match": {"faculty_id": faculty_id}},
                {"$group": {"_id": None, "avg_rating": {"$avg": "$overall_rating"}}}
            ]
            aggregate_cursor = db.feedback.aggregate(pipeline)
            aggr_res = await aggregate_cursor.to_list(length=1)
            
            if aggr_res and aggr_res[0].get("avg_rating"):
                avg_rating = round(aggr_res[0]["avg_rating"], 1)
                
        # Update the faculty document permanently
        update_doc = {
            "total_reviews": review_count,
            "avg_rating": avg_rating if review_count > 0 else 0.0
        }
        
        await db.faculties.update_one(
            {"_id": faculty_id},
            {"$set": update_doc}
        )
        print(f"Reset {faculty.get('name')} -> reviews: {review_count}, rating: {update_doc['avg_rating']}")

    print("Successfully reset all faculty stats in the database based on feedback!")

asyncio.run(reset_faculty_stats())
