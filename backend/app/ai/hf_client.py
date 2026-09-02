"""
HuggingFace Inference API — Reusable async client.

All models (LLM, Whisper, Embeddings) share this single client.
The HF_TOKEN is read from settings only — never hardcoded here.
Token values are never logged.

Updated 2026-08: Migrated from deprecated api-inference.huggingface.co
to new router.huggingface.co endpoints.
"""

import logging
from typing import Any, Dict, List, Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# New base URLs (2026+)
HF_ROUTER_BASE = "https://router.huggingface.co"
HF_INFERENCE_BASE = f"{HF_ROUTER_BASE}/hf-inference/models"
HF_CHAT_URL = f"{HF_ROUTER_BASE}/v1/chat/completions"

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

    # ── Text Generation (OpenAI-compatible chat format) ───────────────────────

    async def generate_text(
        self,
        model: str,
        prompt: str,
        max_new_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> Optional[str]:
        """
        Call HuggingFace chat completions endpoint (OpenAI-compatible).
        Returns the generated text string, or None on failure.
        """
        # Qwen3 models default to "thinking mode" — add /no_think to get direct answers
        user_content = prompt
        if "qwen" in model.lower():
            user_content = prompt + " /no_think"

        payload = {
            "model": model,
            "messages": [{"role": "user", "content": user_content}],
            "max_tokens": max_new_tokens,
            "temperature": temperature,
        }

        try:
            # Fast connect timeout (3s) to fail fast on DNS blocking
            timeout_cfg = httpx.Timeout(LLM_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(
                    HF_CHAT_URL,
                    headers={**_auth_headers(), "Content-Type": "application/json"},
                    json=payload,
                )

            if response.status_code == 200:
                data = response.json()
                # OpenAI-compatible format: {"choices": [{"message": {"content": "..."}}]}
                choices = data.get("choices", [])
                if choices:
                    msg = choices[0].get("message", {})
                    # Some models put the answer in "content", others in "reasoning_content"
                    content = msg.get("content") or msg.get("reasoning_content", "")
                    return content.strip() if content else content
                return str(data)

            logger.error(
                "HF generate_text HTTP %s for model %s: %s",
                response.status_code,
                model,
                response.text[:200],
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
        url = f"{HF_INFERENCE_BASE}/{model}"

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
        url = f"{HF_INFERENCE_BASE}/{model}"
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

    async def health_check(self, model: str, model_type: str = "llm") -> str:
        """
        Ping a model endpoint to check availability.
        model_type: 'llm' for chat models, 'whisper' for ASR, 'embedding' for feature-extraction
        Returns 'available', 'loading', or 'unavailable'.
        Does NOT expose the token in the response.
        """
        try:
            timeout_cfg = httpx.Timeout(HEALTH_TIMEOUT, connect=3.0)

            if model_type == "llm":
                # Use chat completions endpoint for LLM models
                payload = {
                    "model": model,
                    "messages": [{"role": "user", "content": "ping"}],
                    "max_tokens": 1,
                }
                async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                    response = await client.post(
                        HF_CHAT_URL,
                        headers={**_auth_headers(), "Content-Type": "application/json"},
                        json=payload,
                    )
            else:
                # Use hf-inference endpoint for Whisper & Embedding models
                url = f"{HF_INFERENCE_BASE}/{model}"
                payload = {"inputs": "ping", "options": {"wait_for_model": False}}
                async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                    response = await client.post(
                        url,
                        headers={**_auth_headers(), "Content-Type": "application/json"},
                        json=payload,
                    )

            if response.status_code in (200, 400):
                # 400 = model is up but input was invalid (expected for ping)
                return "available"
            if response.status_code == 503:
                return "loading"
            return "unavailable"

        except Exception:
            return "unavailable"


# Singleton instance
hf_client = HuggingFaceClient()
