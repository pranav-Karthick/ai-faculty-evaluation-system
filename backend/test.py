from google import genai
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), '.env'))

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY'))

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Say hello"
)

print(response.text)
