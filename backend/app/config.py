from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings():
    return Settings()
