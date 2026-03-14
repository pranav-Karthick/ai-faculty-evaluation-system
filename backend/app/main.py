from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_routes, student_routes, admin_routes
from .config import get_settings

app = FastAPI(title="Faculty Evaluation Backend")

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router, tags=["Authentication"])
app.include_router(student_routes.router, tags=["Student"]) # No prefix, as routes are /faculty and /feedback
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])
