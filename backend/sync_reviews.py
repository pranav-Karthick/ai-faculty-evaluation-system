import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def main():
    client = AsyncIOMotorClient("mongodb+srv://pranav:Commando%402023@cluster0.deobu4m.mongodb.net/faculty_evaluation?retryWrites=true&w=majority")
    db = client.faculty_evaluation

    faculties = await db.faculties.find().to_list(100)
    for fac in faculties:
        fid = str(fac["_id"])
        
        feedbacks = await db.feedback.find({"faculty_id": fid}).to_list(1000)
        total = len(feedbacks)
        
        if total == 0:
            await db.faculties.update_one({"_id": fac["_id"]}, {"$set": {"total_reviews": 0, "avg_rating": 0.0}})
            print(f"Updated {fac['name']} -> 0 reviews, 0.0 rating")
        else:
            total_sum = 0.0
            for fb in feedbacks:
                r = fb.get("ratings", {})
                for key in ["clarity", "knowledge", "engagement", "communication", "punctuality"]:
                    val = r.get(key)
                    if val is None: val = fb.get(key)
                    if val is None: val = fb.get(f"{key}_score")
                    total_sum += float(val or 0)
            
            avg = total_sum / (total * 5)
            await db.faculties.update_one({"_id": fac["_id"]}, {"$set": {"total_reviews": total, "avg_rating": avg}})
            print(f"Updated {fac['name']} -> {total} reviews, {avg:.2f} rating")
            
    print("Sync complete.")

if __name__ == "__main__":
    asyncio.run(main())
