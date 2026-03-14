import asyncio
from app.database import db

async def main():
    feedbacks = await db.feedback.find().to_list(100)
    print(f"Total feedbacks in DB: {len(feedbacks)}")
    for f in feedbacks:
        print({k: v for k, v in f.items() if k in ["department", "semester", "faculty_id", "overall_rating"]})

if __name__ == "__main__":
    asyncio.run(main())
