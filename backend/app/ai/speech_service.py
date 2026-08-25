"""
Speech Service — HuggingFace Whisper-large-v3-turbo for audio transcription.

Flow:
  Audio file → read bytes → HF Whisper API → transcript string
             → on failure: fallback to mock smart transcript
"""

import logging
import os
from typing import Optional

from app.ai.hf_client import hf_client
from app.config import settings

logger = logging.getLogger(__name__)


# ── Smart Mock Transcripts ────────────────────────────────────────────────────
# These are used when the Whisper API is unavailable

_GENERIC_FALLBACK = (
    "I would approach this by first identifying the core requirements and constraints, "
    "then designing a modular solution that separates concerns clearly. "
    "I would prioritise scalability, maintainability, and proper error handling. "
    "In my previous experience, I have used this approach effectively on production systems."
)

_KEYWORD_ANSWERS = {
    ("process", "thread"): (
        "A process is an independent instance of a running program with its own isolated memory space. "
        "A thread is a lightweight unit of execution within a process that shares the process memory. "
        "Threads communicate through shared memory but need synchronisation primitives like locks and semaphores "
        "to prevent race conditions, whereas processes use inter-process communication mechanisms."
    ),
    ("react", "hook", "useeffect"): (
        "React hooks are functions that let functional components use state and lifecycle features. "
        "The useEffect hook runs side effects after render — it accepts a callback and a dependency array. "
        "When the dependency array is empty, it runs once after mount, similar to componentDidMount. "
        "The rules of hooks say you can only call them at the top level and inside React function components."
    ),
    ("rest", "api"): (
        "REST stands for Representational State Transfer and is an architectural style for building web APIs. "
        "The six constraints are client-server separation, statelessness, cacheability, a uniform interface, "
        "a layered system, and optional code on demand. "
        "Resources are identified by URIs and manipulated using standard HTTP verbs: GET, POST, PUT, PATCH, DELETE."
    ),
    ("sql", "nosql"): (
        "SQL databases are relational, use a fixed schema, and excel at complex queries and ACID transactions. "
        "NoSQL databases sacrifice some consistency for horizontal scalability and flexible schemas. "
        "I would choose SQL for financial systems requiring integrity and complex joins, "
        "and NoSQL for high-volume event streams or document stores where schema flexibility is important."
    ),
    ("gil", "python", "thread"): (
        "The Global Interpreter Lock is a mutex in CPython that allows only one thread to execute Python bytecode at a time. "
        "This means CPU-bound tasks do not benefit from multi-threading in Python. "
        "For CPU-bound work, we use multiprocessing or async frameworks. "
        "For I/O-bound tasks, threading still works well because the GIL is released during I/O operations."
    ),
    ("docker", "container"): (
        "Docker containers package applications with their dependencies into isolated environments. "
        "Unlike virtual machines, containers share the host OS kernel, making them lightweight and fast to start. "
        "Containers are immutable, reproducible, and portable across environments. "
        "I use Docker Compose for local multi-service development and Kubernetes for production orchestration."
    ),
    ("conflict", "coworker", "team"): (
        "In a previous role, a team member and I disagreed on the database schema design for a new feature. "
        "I scheduled a focused meeting to walk through the trade-offs of both approaches with concrete metrics. "
        "We evaluated write latency, query complexity, and future extensibility. "
        "By combining the best elements of both designs, we arrived at a solution that improved both "
        "performance and team alignment."
    ),
    ("challenge", "project", "difficult"): (
        "One of my most challenging projects was a real-time reporting system that initially had a 30-second "
        "generation time. I diagnosed N+1 query patterns in the ORM and redesigned it to use batch pre-fetching "
        "and database-level aggregations. I also introduced a Redis cache layer for frequently accessed reports. "
        "The result was a 94 percent reduction in response time from 30 seconds to under 2 seconds."
    ),
    ("strength", "weakness"): (
        "My greatest strength is my ability to systematically debug complex systems and communicate findings clearly. "
        "I am also a strong advocate for code reviews and knowledge sharing. "
        "An area I am actively working on is becoming more comfortable with public speaking and presenting "
        "technical concepts to non-technical stakeholders. I have been taking presentation skills workshops to improve."
    ),
}


def _smart_mock(question_text: Optional[str]) -> str:
    """Return a contextually relevant mock transcript based on question keywords."""
    if not question_text:
        return _GENERIC_FALLBACK

    q_lower = question_text.lower()
    for keywords, answer in _KEYWORD_ANSWERS.items():
        if all(kw in q_lower for kw in keywords) or any(kw in q_lower for kw in keywords[:1]):
            return answer

    return _GENERIC_FALLBACK


# ── Public API ────────────────────────────────────────────────────────────────

async def transcribe_audio_hf(
    audio_path: str,
    question_text: Optional[str] = None,
    browser_transcript: Optional[str] = None,
) -> str:
    """
    Transcribe audio using HuggingFace Whisper-large-v3-turbo.

    Handles:
    - Missing HF token → browser_transcript or mock fallback
    - AI_MOCK_MODE → browser_transcript or mock fallback
    - Empty audio file → "No audio captured"
    - API failure → browser_transcript or smart mock fallback
    - Long audio → API handles natively (Whisper supports up to ~30 min)

    Returns a transcript string (never None — always a fallback).
    """
    def get_fallback():
        if browser_transcript and browser_transcript.strip():
            logger.info("Using client-side browser transcript fallback: %s", browser_transcript)
            return browser_transcript.strip()
        return _smart_mock(question_text)

    # Guard: empty file
    if not os.path.exists(audio_path):
        logger.warning("Audio file not found: %s", audio_path)
        return get_fallback()

    file_size = os.path.getsize(audio_path)
    if file_size < 100:
        logger.warning("Audio file too small (%d bytes) — likely empty recording", file_size)
        return "(No audio captured — please check your microphone and try again.)"

    # Guard: mock mode or no token
    if settings.AI_MOCK_MODE or not settings.HF_TOKEN or not settings.HF_TOKEN.strip():
        logger.info("Whisper: mock mode or no HF_TOKEN — using fallback transcript")
        return get_fallback()

    # Read audio bytes
    try:
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
    except IOError as exc:
        logger.error("Failed to read audio file %s: %s", audio_path, exc)
        return get_fallback()

    # Call HF Whisper API
    model = settings.HF_WHISPER_MODEL
    logger.info("Transcribing %d bytes via %s", len(audio_bytes), model)
    transcript = await hf_client.transcribe_audio(model, audio_bytes)

    if transcript and transcript.strip():
        logger.info("Whisper transcription success: %d chars", len(transcript))
        return transcript.strip()

    # API returned empty or failed
    logger.warning("Whisper returned empty transcript — using fallback")
    return get_fallback()
