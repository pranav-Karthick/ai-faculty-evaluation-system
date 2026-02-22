from fastapi import APIRouter, HTTPException
from ..database import get_database
from ..auth import create_access_token
from ..utils.security import pwd_context
from ..schemas import LoginSchema

router = APIRouter()

@router.post("/login")
async def login(form_data: LoginSchema):
    db = get_database()

    user = db.users.find_one({"email": form_data.email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not pwd_context.verify(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"]
    }
