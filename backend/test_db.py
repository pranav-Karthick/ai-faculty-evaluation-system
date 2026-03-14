import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    try:
        client = AsyncIOMotorClient('mongodb+srv://pranav:PVemjYgoDTg5vyXQdE7ASqy_Q@cluster0.pbgso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        db = client['evalai']
        
        print("--- ai_analysis ---")
        analyses = await db.ai_analysis.find({}).to_list(10)
        for a in analyses:
            print(f"ID: {a.get('_id')}, Faculty: {a.get('faculty_id')} (Type: {type(a.get('faculty_id'))})")
            
        print("\n--- faculties ---")
        faculties = await db.faculties.find({}).to_list(10)
        for f in faculties:
            print(f"ID: {f.get('_id')} (Type: {type(f.get('_id'))}), Name: {f.get('name')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    asyncio.run(main())
