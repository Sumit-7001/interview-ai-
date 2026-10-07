import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from app.database import get_database
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserOut,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    db = get_database()
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    
    # Hash password and save
    hashed_pwd = get_password_hash(user_data.password)
    user_dict = user_data.model_dump()
    user_dict["email"] = user_dict["email"].lower()
    user_dict["hashed_password"] = hashed_pwd
    user_dict["created_at"] = datetime.utcnow()
    del user_dict["password"]
    
    result = await db["users"].insert_one(user_dict)
    
    # Retrieve created user
    created_user = await db["users"].find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    return created_user

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Standard JSON-body login endpoint for frontend client calls."""
    db = get_database()
    user = await db["users"].find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-swagger", response_model=Token, include_in_schema=False)
async def login_swagger(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 form-body login endpoint enabling Swagger docs authentication."""
    db = get_database()
    user = await db["users"].find_one({"email": form_data.username.lower()})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    if "created_at" not in current_user or current_user["created_at"] is None:
        current_user["created_at"] = datetime.utcnow()
    return current_user

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Generates a secure 6-digit verification code for password reset.
    """
    db = get_database()
    user = await db["users"].find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )

    # Generate 6-digit reset code
    reset_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    await db["users"].update_one(
        {"email": payload.email.lower()},
        {"$set": {"reset_code": reset_code, "reset_code_expires": expires_at}}
    )

    return {
        "message": "Password reset code generated successfully.",
        "email": payload.email.lower(),
        "reset_code": reset_code
    }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    """
    Resets user's password using valid verification code.
    """
    db = get_database()
    user = await db["users"].find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email address."
        )

    saved_code = user.get("reset_code")
    expires_at = user.get("reset_code_expires")

    if not saved_code or saved_code != payload.reset_code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code."
        )

    if expires_at and datetime.utcnow() > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired. Please request a new code."
        )

    # Hash new password & update
    new_hashed_password = get_password_hash(payload.new_password)
    await db["users"].update_one(
        {"email": payload.email.lower()},
        {
            "$set": {"hashed_password": new_hashed_password},
            "$unset": {"reset_code": "", "reset_code_expires": ""}
        }
    )

    return {"message": "Password updated successfully! You can now log in."}
