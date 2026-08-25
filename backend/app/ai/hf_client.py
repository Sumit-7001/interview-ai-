"""
HuggingFace Inference API — Reusable async client.

All models (LLM, Whisper, Embeddings) share this single client.
The HF_TOKEN is read from settings only — never hardcoded here.
Token values are never logged.
"""

import logging
from typing import Any, Dict, List, Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# Base URL for HuggingFace Inference API
HF_API_BASE = "https://api-inference.huggingface.co/models"

# Timeouts (seconds)
LLM_TIMEOUT = 120.0
WHISPER_TIMEOUT = 180.0
EMBED_TIMEOUT = 30.0
HEALTH_TIMEOUT = 10.0


def _auth_headers() -> Dict[str, str]:
    """Return Authorization header. Token is never logged."""
    token = settings.HF_TOKEN
    if not token or not token.strip():
        return {}
    return {"Authorization": f"Bearer {token}"}


class HuggingFaceClient:
    """
    Reusable async client for the HuggingFace Inference API.

    Usage:
        client = HuggingFaceClient()
        text = await client.generate_text(model, prompt)
    """

    # ── Text Generation ───────────────────────────────────────────────────────

    async def generate_text(
        self,
        model: str,
        prompt: str,
        max_new_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> Optional[str]:
        """
        Call HuggingFace text-generation endpoint.
        Returns the generated text string, or None on failure.
        """
        url = f"{HF_API_BASE}/{model}"
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_new_tokens,
                "temperature": temperature,
                "return_full_text": False,
                "do_sample": True,
            },
        }

        try:
            # Fast connect timeout (3s) to fail fast on DNS blocking
            timeout_cfg = httpx.Timeout(LLM_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(
                    url,
                    headers={**_auth_headers(), "Content-Type": "application/json"},
                    json=payload,
                )

            if response.status_code == 200:
                data = response.json()
                # HF returns a list of dicts: [{"generated_text": "..."}]
                if isinstance(data, list) and data:
                    return data[0].get("generated_text", "")
                # Some models return a single dict
                if isinstance(data, dict):
                    return data.get("generated_text", "")
                return str(data)

            logger.error(
                "HF generate_text HTTP %s for model %s",
                response.status_code,
                model,
            )
            return None

        except httpx.TimeoutException:
            logger.error("HF generate_text timed out for model %s", model)
            return None
        except Exception as exc:
            logger.error("HF generate_text error for model %s: %s", model, exc)
            return None

    # ── Audio Transcription ───────────────────────────────────────────────────

    async def transcribe_audio(
        self,
        model: str,
        audio_bytes: bytes,
    ) -> Optional[str]:
        """
        Call HuggingFace automatic-speech-recognition endpoint.
        audio_bytes: raw audio file content (WebM, WAV, MP3, etc.)
        Returns transcript string, or None on failure.
        """
        url = f"{HF_API_BASE}/{model}"

        try:
            timeout_cfg = httpx.Timeout(WHISPER_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(
                    url,
                    headers={
                        **_auth_headers(),
                        "Content-Type": "audio/wav",
                    },
                    content=audio_bytes,
                )

            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict):
                    return data.get("text", "")
                return str(data)

            logger.error(
                "HF transcribe_audio HTTP %s for model %s",
                response.status_code,
                model,
            )
            return None

        except httpx.TimeoutException:
            logger.error("HF transcribe_audio timed out for model %s", model)
            return None
        except Exception as exc:
            logger.error("HF transcribe_audio error for model %s: %s", model, exc)
            return None

    # ── Embeddings ────────────────────────────────────────────────────────────

    async def generate_embedding(
        self,
        model: str,
        texts: List[str],
    ) -> Optional[List[List[float]]]:
        """
        Call HuggingFace feature-extraction endpoint.
        Returns a list of embedding vectors (one per input text), or None on failure.
        """
        url = f"{HF_API_BASE}/{model}"
        payload = {"inputs": texts, "options": {"wait_for_model": True}}

        try:
            timeout_cfg = httpx.Timeout(EMBED_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(
                    url,
                    headers={**_auth_headers(), "Content-Type": "application/json"},
                    json=payload,
                )

            if response.status_code == 200:
                data = response.json()
                # HF returns List[List[float]] for batch inputs
                if isinstance(data, list):
                    return data
                return None

            logger.error(
                "HF generate_embedding HTTP %s for model %s",
                response.status_code,
                model,
            )
            return None

        except httpx.TimeoutException:
            logger.error("HF generate_embedding timed out for model %s", model)
            return None
        except Exception as exc:
            logger.error("HF generate_embedding error for model %s: %s", model, exc)
            return None

    # ── Health Check ──────────────────────────────────────────────────────────

    async def health_check(self, model: str) -> str:
        """
        Ping a model endpoint to check availability.
        Returns 'available', 'loading', or 'unavailable'.
        Does NOT expose the token in the response.
        """
        url = f"{HF_API_BASE}/{model}"
        # Send a minimal payload — we only care about HTTP status
        payload = {"inputs": "ping", "parameters": {"max_new_tokens": 1}}

        try:
            timeout_cfg = httpx.Timeout(HEALTH_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(
                    url,
                    headers={**_auth_headers(), "Content-Type": "application/json"},
                    json=payload,
                )

            if response.status_code == 200:
                return "available"
            if response.status_code == 503:
                return "loading"
            return "unavailable"

        except Exception:
            return "unavailable"


# Singleton instance
hf_client = HuggingFaceClient()
