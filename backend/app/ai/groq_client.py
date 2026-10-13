"""
Groq API Client — Ultra-fast Cloud LLM and Whisper STT.
"""

import logging
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_CHAT_URL = f"{GROQ_BASE_URL}/chat/completions"
GROQ_AUDIO_URL = f"{GROQ_BASE_URL}/audio/transcriptions"


class GroqClient:
    """Reusable async client for Groq Cloud API."""

    def _headers(self) -> Dict[str, str]:
        key = settings.GROQ_API_KEY
        if not key or not key.strip():
            return {}
        return {"Authorization": f"Bearer {key.strip()}"}

    async def generate_text(
        self,
        model: str,
        prompt: str,
        max_new_tokens: int = 1024,
        temperature: float = 0.3,
        system_prompt: Optional[str] = None,
    ) -> Optional[str]:
        """Call Groq chat completions."""
        if not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not configured")
            return None

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model or settings.GROQ_MODEL,
            "messages": messages,
            "max_tokens": max_new_tokens,
            "temperature": temperature,
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    GROQ_CHAT_URL,
                    headers={**self._headers(), "Content-Type": "application/json"},
                    json=payload,
                )

            if response.status_code == 200:
                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "")
                    return content.strip()
                return str(data)

            logger.error("Groq generate_text HTTP %s: %s", response.status_code, response.text[:200])
            return None
        except Exception as e:
            logger.error("Groq generate_text error: %s", e)
            return None

    async def transcribe_audio(
        self,
        model: str,
        audio_bytes: bytes,
        filename: str = "audio.wav",
    ) -> Optional[str]:
        """Transcribe audio using Groq Whisper."""
        if not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not configured")
            return None

        try:
            files = {"file": (filename, audio_bytes, "audio/wav")}
            data = {"model": model or settings.GROQ_WHISPER_MODEL}

            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    GROQ_AUDIO_URL,
                    headers=self._headers(),
                    files=files,
                    data=data,
                )

            if response.status_code == 200:
                return response.json().get("text", "").strip()

            logger.error("Groq transcribe_audio HTTP %s: %s", response.status_code, response.text[:200])
            return None
        except Exception as e:
            logger.error("Groq transcribe_audio error: %s", e)
            return None


groq_client = GroqClient()
