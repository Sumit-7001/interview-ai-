"""
Embedding Service — BGE-small-en-v1.5 via HuggingFace Inference API.

Provides:
  - embed_texts(texts)          → List[List[float]]
  - cosine_similarity(a, b)     → float [0.0 - 1.0]
  - semantic_relevance_score()  → float [0 - 100]
"""

import logging
import math
from typing import List, Optional

from app.ai.hf_client import hf_client
from app.config import settings

logger = logging.getLogger(__name__)


# ── Math Helpers ──────────────────────────────────────────────────────────────

def _dot(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def _norm(v: List[float]) -> float:
    return math.sqrt(sum(x * x for x in v))


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    Returns a value in [0.0, 1.0] (clamped, since embeddings can produce
    slightly negative cosine values for very dissimilar texts).
    """
    if not vec_a or not vec_b:
        return 0.0
    norm_a = _norm(vec_a)
    norm_b = _norm(vec_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    sim = _dot(vec_a, vec_b) / (norm_a * norm_b)
    return max(0.0, min(1.0, sim))


# ── Public API ────────────────────────────────────────────────────────────────

async def embed_texts(texts: List[str]) -> Optional[List[List[float]]]:
    """
    Generate embeddings for a list of texts via BGE model.
    Returns None if HF is unavailable.
    """
    if not texts:
        return None

    if settings.AI_MOCK_MODE or not settings.HF_TOKEN or not settings.HF_TOKEN.strip():
        logger.info("Embedding service: mock mode or no token — returning None")
        return None

    model = settings.HF_EMBEDDING_MODEL
    logger.info("Generating embeddings via %s for %d texts", model, len(texts))
    result = await hf_client.generate_embedding(model, texts)

    if result is None:
        logger.error("Embedding API returned None")
        return None

    # BGE returns [batch_size, seq_len, hidden_dim] — take mean over seq dimension
    # OR [batch_size, hidden_dim] directly (depends on model config)
    processed: List[List[float]] = []
    for item in result:
        if isinstance(item, list) and item and isinstance(item[0], list):
            # 2D token embeddings → mean pool
            num_tokens = len(item)
            dim = len(item[0])
            mean_vec = [
                sum(item[t][d] for t in range(num_tokens)) / num_tokens
                for d in range(dim)
            ]
            processed.append(mean_vec)
        elif isinstance(item, list) and item and isinstance(item[0], float):
            # Already a flat vector
            processed.append(item)
        else:
            logger.warning("Unexpected embedding format: %s", type(item))
            return None

    return processed


async def semantic_relevance_score(question: str, answer: str) -> float:
    """
    Compute semantic similarity between a question and a candidate's answer.
    Returns a score in [0, 100].

    Falls back to a heuristic word-overlap score when embeddings are unavailable.
    """
    embeddings = await embed_texts([question, answer])

    if embeddings and len(embeddings) == 2:
        similarity = cosine_similarity(embeddings[0], embeddings[1])
        score = round(similarity * 100, 1)
        logger.info("Semantic relevance score (BGE cosine): %.1f", score)
        return score

    # Fallback: simple word-overlap Jaccard similarity
    logger.info("Using word-overlap fallback for semantic score")
    q_words = set(question.lower().split())
    a_words = set(answer.lower().split())
    if not q_words or not a_words:
        return 50.0
    intersection = len(q_words & a_words)
    union = len(q_words | a_words)
    jaccard = intersection / union if union > 0 else 0
    # Scale Jaccard [0,1] to a more realistic range [30, 85]
    fallback_score = 30.0 + jaccard * 55.0
    return round(fallback_score, 1)
