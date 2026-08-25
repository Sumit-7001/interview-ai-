import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    SECRET_KEY: str = "9a8b7c6d5e4f3g2h1i0j_interview_ai_secret_key_2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "interview_ai"

    # ── Hugging Face ──────────────────────────────────────────────────────────
    # Token is read from .env only — never hardcoded in source files
    HF_TOKEN: str = ""

    # LLM (primary + fallback)
    HF_LLM_MODEL: str = "Qwen/Qwen3-8B"
    HF_LLM_FALLBACK_MODEL: str = "Qwen/Qwen3-4B"

    # Speech-to-Text
    HF_WHISPER_MODEL: str = "openai/whisper-large-v3-turbo"

    # Semantic Embeddings
    HF_EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"

    # Feature flag: when True, realistic mocks are used instead of HF API calls
    AI_MOCK_MODE: bool = False

    # Legacy OpenAI key (kept for backward compat, no longer used)
    OPENAI_API_KEY: str = ""

    class Config:
        env_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"
        )
        extra = "ignore"

settings = Settings()
