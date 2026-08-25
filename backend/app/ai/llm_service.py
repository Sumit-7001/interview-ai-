"""
LLM Service — Qwen3-8B primary with Qwen3-4B automatic fallback.

All calls go through call_llm() which:
1. Tries HF_LLM_MODEL (Qwen3-8B)
2. Falls back to HF_LLM_FALLBACK_MODEL (Qwen3-4B) on failure
3. Returns None if both fail (callers handle graceful degradation)
4. Short-circuits to mock data when AI_MOCK_MODE=true
"""

import json
import logging
import re
from typing import Any, Dict, Optional

from app.ai.hf_client import hf_client
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
    """
    if not text or not text.strip():
        return None

    # Strip /nothink tags if the model includes them in output
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


# ── Core LLM Caller ───────────────────────────────────────────────────────────

async def call_llm(
    prompt: str,
    max_new_tokens: int = 1024,
    temperature: float = 0.3,
) -> Optional[str]:
    """
    Call the primary LLM model with automatic fallback.

    Returns raw text from the model, or None if all models fail.
    Respects AI_MOCK_MODE=true by returning None immediately
    (callers are responsible for generating mock data).
    """
    if settings.AI_MOCK_MODE:
        logger.info("AI_MOCK_MODE is enabled — skipping real LLM call")
        return None

    if not settings.HF_TOKEN or not settings.HF_TOKEN.strip():
        logger.warning("HF_TOKEN not configured — skipping LLM call, using mock fallback")
        return None

    # Attempt primary model
    primary_model = settings.HF_LLM_MODEL
    logger.info("Calling primary LLM: %s", primary_model)
    result = await hf_client.generate_text(primary_model, prompt, max_new_tokens, temperature)

    if result is not None:
        logger.info("Primary LLM responded successfully")
        return result

    # Primary failed — try fallback
    fallback_model = settings.HF_LLM_FALLBACK_MODEL
    logger.warning("Primary LLM failed, attempting fallback: %s", fallback_model)
    result = await hf_client.generate_text(fallback_model, prompt, max_new_tokens, temperature)

    if result is not None:
        logger.info("Fallback LLM responded successfully")
        return result

    logger.error("Both primary (%s) and fallback (%s) LLM models failed", primary_model, fallback_model)
    return None


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
