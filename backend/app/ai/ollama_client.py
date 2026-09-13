"""
Ollama Client — Local LLM provider via Ollama runtime.

Mirrors the interface of hf_client.py so LLM service can route to either.
Ollama must be running: `ollama serve` and a model pulled: `ollama pull qwen2.5:7b`

Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md
"""

import logging
from typing import Any, Dict, Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

OLLAMA_TIMEOUT = 120.0
OLLAMA_HEALTH_TIMEOUT = 5.0


class OllamaClient:
    """
    Async client for Ollama local LLM runtime.
    Uses the /api/chat endpoint (OpenAI-compatible).
    """

    def _base_url(self) -> str:
        return settings.OLLAMA_BASE_URL.rstrip("/")

    async def generate_text(
        self,
        model: Optional[str] = None,
        prompt: str = "",
        max_new_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> Optional[str]:
        """
        Call Ollama chat endpoint.
        Returns generated text string, or None on failure.
        `model` defaults to settings.OLLAMA_MODEL if not provided.
        """
        use_model = model or settings.OLLAMA_MODEL

        payload = {
            "model": use_model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_new_tokens,
            },
        }

        url = f"{self._base_url()}/api/chat"
        logger.info("Calling Ollama model: %s @ %s", use_model, url)

        try:
            timeout_cfg = httpx.Timeout(OLLAMA_TIMEOUT, connect=3.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.post(url, json=payload)

            if response.status_code == 200:
                data = response.json()
                content = data.get("message", {}).get("content", "")
                logger.info("Ollama responded: %d chars", len(content))
                return content.strip() if content else None

            logger.error(
                "Ollama HTTP %s: %s", response.status_code, response.text[:200]
            )
            return None

        except httpx.ConnectError:
            logger.error(
                "Ollama connection refused at %s. Is `ollama serve` running?",
                self._base_url(),
            )
            return None
        except httpx.TimeoutException:
            logger.error("Ollama request timed out for model %s", use_model)
            return None
        except Exception as exc:
            logger.error("Ollama client error: %s", exc)
            return None

    async def health_check(self) -> str:
        """
        Check if Ollama is running and the model is available.
        Returns 'available' | 'unavailable' | 'model_not_found'.
        """
        url = f"{self._base_url()}/api/tags"
        try:
            timeout_cfg = httpx.Timeout(OLLAMA_HEALTH_TIMEOUT, connect=2.0)
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                target = settings.OLLAMA_MODEL
                available = any(target in m or m in target for m in models)
                if available:
                    return "available"
                logger.warning(
                    "Ollama running but model '%s' not found. Pulled models: %s",
                    target,
                    models,
                )
                return "model_not_found"
            return "unavailable"
        except Exception:
            return "unavailable"


# Singleton instance
ollama_client = OllamaClient()
