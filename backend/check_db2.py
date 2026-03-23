import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(url)
db = client["faculty_evaluation"]

async def main():
    faculties = await db.faculties.find().to_list(100)
    feedbacks = await db.feedback.find().to_list(100)
    
    print("\n--- FACULTIES ---")
    for f in faculties:
        print(f"Name: {f.get('name')}, total_reviews: {f.get('total_reviews')}, avg_rating: {f.get('avg_rating')}")
        
    print("\n--- FEEDBACKS ---")
    for fb in feedbacks:
        print(f"Feedback for faculty_id: {fb.get('faculty_id')}, faculty_name: {fb.get('faculty_name')}, comment: {fb.get('comment')}")
        
asyncio.run(main())
