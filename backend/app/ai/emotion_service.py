"""
Emotion Service — thin wrapper around existing DeepFace cv_service.

DeepFace logic is unchanged. This module provides a consistent
import path from the new ai/ package layer.
"""

from app.services.cv_service import analyze_emotion

__all__ = ["analyze_emotion"]
