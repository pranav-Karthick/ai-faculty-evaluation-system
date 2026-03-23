import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.routes.student_routes import get_faculty_list
from app.database import get_database

async def test_endpoint():
    db = get_database()
    current_user = {"email": "test@student.com", "role": "student"}
    
    # Directly call the endpoint logic
    faculties = await get_faculty_list(department="ECE", semester=None, current_user=current_user, db=db)
    
    print("Endpoint return values:")
    for f in faculties:
        print(f"Name: {f.get('name')}, total_reviews: {f.get('total_reviews')}, avg_rating: {f.get('avg_rating')}")

asyncio.run(test_endpoint())
