import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_db, disconnect_db
from app.routes import auth, resume, interview
from app.routes import ai as ai_router

app = FastAPI(
    title="InterviewAI API",
    description="Backend API for AI Interviewer — Qwen3 + Whisper + BGE + DeepFace",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection lifecycle
@app.on_event("startup")
async def startup_db_client():
    connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    disconnect_db()

# Include routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(ai_router.router)

# Health Check Route
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "message": "Welcome to InterviewAI Backend Services.",
        "version": "2.0.0",
        "ai_architecture": {
            "llm": settings.HF_LLM_MODEL,
            "fallback_llm": settings.HF_LLM_FALLBACK_MODEL,
            "speech": settings.HF_WHISPER_MODEL,
            "embeddings": settings.HF_EMBEDDING_MODEL,
            "mock_mode": settings.AI_MOCK_MODE,
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
