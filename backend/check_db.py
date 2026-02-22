import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["faculty_evaluation"]

try:
    print("Collections:", db.list_collection_names())
except Exception as e:
    print("Error:", e)
