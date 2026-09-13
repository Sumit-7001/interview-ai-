"""
LLM Service — Unified provider interface for Qwen3/Ollama/HuggingFace.

Provider selection is controlled by LLM_PROVIDER env var:
  - "huggingface" (default): Uses HF Inference API with Qwen3-8B primary + 4B fallback
  - "ollama": Uses local Ollama runtime (no internet required)

All calls go through call_llm() which:
1. Routes to the configured provider
2. Falls back gracefully on failure
3. Returns None if all providers fail (callers handle graceful degradation)
4. Short-circuits to mock data when AI_MOCK_MODE=true
"""

import json
import logging
import re
from typing import Any, Dict, Optional

from app.config import settings

logger = logging.getLogger(__name__)


# ── JSON Extraction ────────────────────────────────────────────────────────────

def parse_json_from_llm_response(text: str) -> Optional[Dict[str, Any]]:
    """
    Robustly extract a JSON object from LLM output.
    Handles:
    - Clean JSON strings
    - JSON wrapped in markdown code fences (```json ... ```)
    - JSON with surrounding text/explanation
    - Qwen3 <think>...</think> tags
    """
    if not text or not text.strip():
        return None

    # Strip /nothink and <think> tags if the model includes them in output
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

    # Try direct parse first (cleanest case)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Try finding the first { ... } block
    brace_match = re.search(r"\{[\s\S]*\}", text)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass

    logger.warning("Could not extract JSON from LLM response. Raw text (first 200 chars): %s", text[:200])
    return None


# ── Provider Routing ───────────────────────────────────────────────────────────

async def _call_hf(prompt: str, max_new_tokens: int, temperature: float) -> Optional[str]:
    """Call HuggingFace primary + fallback LLM."""
    if not settings.HF_TOKEN or not settings.HF_TOKEN.strip():
        logger.warning("HF_TOKEN not configured — skipping HF LLM call")
        return None

    from app.ai.hf_client import hf_client

    primary_model = settings.HF_LLM_MODEL
    logger.info("Calling HF primary LLM: %s", primary_model)
    result = await hf_client.generate_text(primary_model, prompt, max_new_tokens, temperature)

    if result is not None:
        logger.info("HF primary LLM responded successfully")
        return result

    fallback_model = settings.HF_LLM_FALLBACK_MODEL
    logger.warning("HF primary failed, trying fallback: %s", fallback_model)
    result = await hf_client.generate_text(fallback_model, prompt, max_new_tokens, temperature)

    if result is not None:
        logger.info("HF fallback LLM responded successfully")
        return result

    logger.error("Both HF models (%s, %s) failed", primary_model, fallback_model)
    return None


async def _call_ollama(prompt: str, max_new_tokens: int, temperature: float) -> Optional[str]:
    """Call local Ollama LLM."""
    from app.ai.ollama_client import ollama_client
    return await ollama_client.generate_text(
        model=settings.OLLAMA_MODEL,
        prompt=prompt,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
    )


# ── Core LLM Caller ───────────────────────────────────────────────────────────

async def call_llm(
    prompt: str,
    max_new_tokens: int = 1024,
    temperature: float = 0.3,
) -> Optional[str]:
    """
    Call the configured LLM provider.

    Provider selection:
      LLM_PROVIDER=ollama      → Ollama local (no internet needed)
      LLM_PROVIDER=huggingface → HuggingFace remote API (default)

    Returns raw text from the model, or None if all providers fail.
    """
    if settings.AI_MOCK_MODE:
        logger.info("AI_MOCK_MODE is enabled — skipping real LLM call")
        return None

    provider = (settings.LLM_PROVIDER or "huggingface").lower().strip()

    if provider == "ollama":
        logger.info("LLM provider: Ollama (%s)", settings.OLLAMA_MODEL)
        result = await _call_ollama(prompt, max_new_tokens, temperature)
        if result is not None:
            return result
        # Fallback to HF if Ollama fails (graceful degradation)
        logger.warning("Ollama failed — falling back to HuggingFace")
        return await _call_hf(prompt, max_new_tokens, temperature)

    else:
        # Default: HuggingFace
        logger.info("LLM provider: HuggingFace")
        return await _call_hf(prompt, max_new_tokens, temperature)


async def call_llm_json(
    prompt: str,
    max_new_tokens: int = 1024,
    temperature: float = 0.3,
) -> Optional[Dict[str, Any]]:
    """
    Call LLM and parse the response as JSON.
    Returns a dict on success, None on failure.
    """
    raw = await call_llm(prompt, max_new_tokens, temperature)
    if raw is None:
        return None

    parsed = parse_json_from_llm_response(raw)
    if parsed is None:
        logger.error("LLM returned non-JSON response. Attempting retry...")
        # One retry with slightly different temperature
        raw2 = await call_llm(prompt, max_new_tokens, temperature + 0.1)
        if raw2:
            parsed = parse_json_from_llm_response(raw2)

    return parsed
