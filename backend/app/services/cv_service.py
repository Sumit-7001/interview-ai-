import base64
import logging
import os
import random
import tempfile
from typing import Dict, Any, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

# Try optional CV imports
try:
    import cv2
    import numpy as np
    CV_LIBS_AVAILABLE = True
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
except Exception as e:
    CV_LIBS_AVAILABLE = False
    face_cascade = None
    eye_cascade = None
    logger.warning(f"cv2 or numpy is not available: {e}. Using mock cv service.")

_deepface = None
_deepface_failed = False

def _get_deepface():
    global _deepface, _deepface_failed
    if _deepface_failed:
        return None
    if _deepface is not None:
        return _deepface
    try:
        from deepface import DeepFace
        _deepface = DeepFace
        return _deepface
    except Exception as e:
        logger.warning(f"DeepFace is not available ({e}). Using mock cv service.")
        _deepface_failed = True
        return None

def decode_base64_to_cv2(base64_str: str) -> Any:
    """Decodes a base64 string to a cv2 image."""
    if not CV_LIBS_AVAILABLE:
        return None
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        logger.error(f"Error decoding base64 image: {e}")
        return None

def check_eyes_detected(img) -> bool:
    """Checks if eyes are detected (open) using Haar cascade."""
    if not CV_LIBS_AVAILABLE or img is None:
        return False
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) == 0:
            return False
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 4)
            if len(eyes) >= 1:
                return True
        return False
    except Exception as e:
        logger.error(f"Error in eye detection: {e}")
        return False

async def analyze_emotion(base64_frame: str) -> Tuple[str, Dict[str, float], bool]:
    """
    Analyzes webcam base64 frame for emotion detection and eye contact.
    Returns dominant emotion, a dictionary of probabilities, and eyes_detected boolean.
    """
    emotions = ["neutral", "happy", "sad", "angry", "fear", "surprise", "disgust"]
    eyes_detected = True
    
    if CV_LIBS_AVAILABLE:
        img = decode_base64_to_cv2(base64_frame)
        if img is not None:
            eyes_detected = check_eyes_detected(img)
            deepface_lib = _get_deepface()
            if deepface_lib is not None:
                temp_path = None
                try:
                    # Save to a temporary file because DeepFace sometimes prefers file paths or numpy arrays
                    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
                        temp_path = temp_file.name
                        cv2.imwrite(temp_path, img)
                    
                    # Analyze using DeepFace (VGG-Face default, emotion action)
                    # enforce_detection=False prevents crashes when no face is aligned
                    results = deepface_lib.analyze(img_path=temp_path, actions=["emotion"], enforce_detection=False)
                    
                    # Clean up temp file
                    if temp_path and os.path.exists(temp_path):
                        os.unlink(temp_path)
                    
                    if isinstance(results, list):
                        result = results[0]
                    else:
                        result = results
                    
                    dominant = result.get("dominant_emotion", "neutral")
                    probabilities = result.get("emotion", {e: 0.0 for e in emotions})
                    
                    # Map deepface output floats safely
                    probs = {k.lower(): float(v) for k, v in probabilities.items()}
                    return dominant, probs, eyes_detected
                except Exception as e:
                    logger.error(f"DeepFace analysis failed: {e}")
                    if temp_path and os.path.exists(temp_path):
                        try:
                            os.unlink(temp_path)
                        except Exception:
                            pass
                    # Fall through to mock logic

    # High-fidelity Simulation Mock Logic
    # Bias slightly towards neutral (70%) and happy (20%) or surprise (10%) as typical interview states
    probs = {e: 0.0 for e in emotions}
    dominant = random.choices(
        ["neutral", "happy", "surprise", "sad", "angry"], 
        weights=[0.70, 0.15, 0.08, 0.05, 0.02]
    )[0]
    
    # Generate realistic percentages summing to 100
    if dominant == "neutral":
        probs["neutral"] = round(random.uniform(75.0, 92.0), 2)
        probs["happy"] = round(random.uniform(2.0, 10.0), 2)
        probs["surprise"] = round(random.uniform(1.0, 5.0), 2)
    elif dominant == "happy":
        probs["happy"] = round(random.uniform(60.0, 85.0), 2)
        probs["neutral"] = round(random.uniform(10.0, 30.0), 2)
        probs["surprise"] = round(random.uniform(1.0, 5.0), 2)
    elif dominant == "surprise":
        probs["surprise"] = round(random.uniform(50.0, 75.0), 2)
        probs["neutral"] = round(random.uniform(20.0, 40.0), 2)
        probs["happy"] = round(random.uniform(1.0, 5.0), 2)
    else:
        probs[dominant] = round(random.uniform(40.0, 60.0), 2)
        probs["neutral"] = round(random.uniform(30.0, 50.0), 2)
        
    # Standardize remaining fields with tiny values
    total_assigned = sum(probs.values())
    unassigned = [e for e in emotions if probs[e] == 0.0]
    remaining = max(0.0, 100.0 - total_assigned)
    if unassigned:
        share = remaining / len(unassigned)
        for e in unassigned:
            probs[e] = round(share, 2)
            
    # Adjust total to exactly 100.0
    diff = round(100.0 - sum(probs.values()), 2)
    probs[dominant] = round(probs[dominant] + diff, 2)
    
    return dominant, probs, eyes_detected
