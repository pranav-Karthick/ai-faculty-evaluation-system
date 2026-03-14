import os
import json
import logging
from google import genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API Key
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def generate_ai_analysis(comments: list):
    logger.info(f"Generating AI analysis for {len(comments)} comments.")
    
    prompt = f"""
You are an academic faculty performance evaluator.

Based on the following student feedback comments:

{comments}

Return STRICT JSON in this EXACT format:

{{
  "summary": "4-5 line academic performance summary",
  "strengths": ["Top 3 strengths"],
  "concerns": ["Top 3 areas of concern"],
  "sentiment": {{
      "positive": 0,
      "neutral": 0,
      "negative": 0
  }}
}}

Rules:
- Sentiment must be based on full semantic context understanding of all comments.
- Do NOT use simple keyword matching.
- Percentages (positive, neutral, negative) must total exactly 100.
- Be professional and objective.
- Return ONLY valid JSON, no markdown formatting.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()
        logger.info("Received response from Gemini API.")

        # Remove markdown if Gemini wraps JSON
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)
        elif text.startswith("```"):
            text = text.replace("```", "", 1)
            
        if text.endswith("```"):
            text = text[:-3]

        parsed_json = json.loads(text.strip())
        logger.info("Successfully parsed Gemini JSON response.")
        return parsed_json
        
    except Exception as e:
        logger.error(f"Error generating AI analysis: {str(e)}")
        raise e

async def trigger_ai_analysis_background(faculty_id_str: str, department: str, semester: int):
    from ..database import db
    from bson import ObjectId
    from datetime import datetime
    import asyncio
    
    faculty_id = ObjectId(faculty_id_str)
    
    # Wait briefly to ensure feedback is committed to DB
    await asyncio.sleep(1)
    
    # Get all feedback for this specific semester
    feedback_cursor = db.feedback.find({"faculty_id": faculty_id, "semester": semester})
    feedback_list = await feedback_cursor.to_list(length=1000)
    
    feedback_count = len(feedback_list)
    if feedback_count == 0:
        logger.info(f"No feedback found for faculty {faculty_id_str} in semester {semester}")
        return
        
    # Calculate average ratings
    average_ratings = {
        "clarity": 0.0, "knowledge": 0.0, "engagement": 0.0, "communication": 0.0, "punctuality": 0.0
    }
    
    def get_score(fb, key):
        val = fb.get("ratings", {}).get(key)
        if val is None: val = fb.get(key)
        if val is None: val = fb.get(f"{key}_score")
        return val if isinstance(val, (int, float)) else 0
        
    average_ratings["clarity"] = sum(get_score(fb, "clarity") for fb in feedback_list) / feedback_count
    average_ratings["knowledge"] = sum(get_score(fb, "knowledge") for fb in feedback_list) / feedback_count
    average_ratings["engagement"] = sum(get_score(fb, "engagement") for fb in feedback_list) / feedback_count
    average_ratings["communication"] = sum(get_score(fb, "communication") for fb in feedback_list) / feedback_count
    average_ratings["punctuality"] = sum(get_score(fb, "punctuality") for fb in feedback_list) / feedback_count

    comments = [
        f["comment"] for f in feedback_list
        if f.get("comment") and f["comment"].strip() != ""
    ]
        
    try:
        ai_result = generate_ai_analysis(comments)
        result = {
            "faculty_id": faculty_id,
            "department": department,
            "semester": semester,
            "summary": ai_result.get("summary", "No summary provided."),
            "strengths": ai_result.get("strengths", []),
            "concerns": ai_result.get("concerns", []),
            "sentiment": ai_result.get("sentiment", {"positive": 0, "neutral": 100, "negative": 0}),
            "feedback_count": feedback_count,
            "average_ratings": average_ratings,
            "generated_at": datetime.utcnow()
        }
        
        await db.ai_analysis.replace_one(
            {"faculty_id": faculty_id, "semester": semester},
            result,
            upsert=True
        )
        logger.info(f"AI cache generated and saved for faculty {faculty_id_str} and semester {semester}")
    except Exception as e:
        logger.error(f"Failed to generate background AI for {faculty_id_str}: {e}")

