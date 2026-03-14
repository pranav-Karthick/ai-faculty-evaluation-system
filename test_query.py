import motor.motor_asyncio
import asyncio

async def main():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://pranav:Commando%402023@cluster0.deobu4m.mongodb.net/faculty_evaluation?retryWrites=true&w=majority')
    db = client.faculty_evaluation
    f = await db.faculties.find_one({'department': 'ECE'})
    print(f)
    print("---")
    fs = await db.faculties.find({'department': 'ECE'}).to_list(10)
    for fac in fs:
        print(fac.get('name'), fac.get('semester'))

asyncio.run(main())
