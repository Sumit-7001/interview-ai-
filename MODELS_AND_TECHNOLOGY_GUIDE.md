# 🤖 InterviewAI — Models & Technology Reference Guide

> **Purpose:** এই ডকুমেন্টটি তৈরি করা হয়েছে যাতে team এর সকল সদস্য প্রোজেক্টে ব্যবহৃত প্রতিটি AI/ML model, library এবং technology সম্পর্কে বিস্তারিত জানতে পারেন।
>
> **Last Updated:** 2026-10-01 | **Author:** Auto-generated from codebase analysis

---

## 📑 Table of Contents

1. [AI/ML Models at a Glance](#1-aiml-models-at-a-glance)
2. [Model 1 — Qwen3-8B (Large Language Model)](#2-model-1--qwen3-8b-large-language-model)
3. [Model 2 — Qwen3-4B (Fallback LLM)](#3-model-2--qwen3-4b-fallback-llm)
4. [Model 3 — Ollama Qwen2.5:7B (Local LLM)](#4-model-3--ollama-qwen257b-local-llm)
5. [Model 4 — OpenAI Whisper-large-v3-turbo (Speech-to-Text)](#5-model-4--openai-whisper-large-v3-turbo-speech-to-text)
6. [Model 5 — BAAI/bge-small-en-v1.5 (Semantic Embeddings)](#6-model-5--baaibge-small-en-v15-semantic-embeddings)
7. [Model 6 — Emotion FERPlus ONNX (Facial Emotion Recognition)](#7-model-6--emotion-ferplus-onnx-facial-emotion-recognition)
8. [Model 7 — OpenCV Haar Cascades (Face/Eye/Smile Detection)](#8-model-7--opencv-haar-cascades-faceeyesmile-detection)
9. [LLM Provider Routing & Fallback Architecture](#9-llm-provider-routing--fallback-architecture)
10. [Backend Libraries & Frameworks](#10-backend-libraries--frameworks)
11. [Frontend Libraries & Frameworks](#11-frontend-libraries--frameworks)
12. [Database](#12-database)
13. [Environment Configuration (.env)](#13-environment-configuration-env)
14. [Architecture Diagram — How Models Connect](#14-architecture-diagram--how-models-connect)
15. [Quick Reference Table](#15-quick-reference-table)

---

## 1. AI/ML Models at a Glance

আমাদের প্রোজেক্টে মোট **7 টি AI/ML models** ব্যবহার হচ্ছে, যেগুলো 4 টি ভিন্ন কাজ করে:

| # | Model | কাজ | কোথায় চলে |
|---|-------|------|-----------|
| 1 | **Qwen/Qwen3-8B** | Interview questions তৈরি, answers evaluate করা | HuggingFace Cloud API |
| 2 | **Qwen/Qwen3-4B** | Fallback LLM (যখন 8B model fail করে) | HuggingFace Cloud API |
| 3 | **Ollama Qwen2.5:7B** | Local LLM (internet ছাড়া চলে) | Local Machine (Ollama) |
| 4 | **openai/whisper-large-v3-turbo** | Voice → Text (Speech Recognition) | HuggingFace Cloud API |
| 5 | **BAAI/bge-small-en-v1.5** | Answer relevance check (Semantic Similarity) | HuggingFace Cloud API |
| 6 | **emotion-ferplus-8.onnx** | Facial Emotion Recognition (CNN) | Local (ONNX Runtime via OpenCV) |
| 7 | **OpenCV Haar Cascades** | Face, Eye, Smile Detection | Local (OpenCV) |

---

## 2. Model 1 — Qwen3-8B (Large Language Model)

### Overview
এটি আমাদের **primary LLM** — interview এর সমস্ত intelligent কাজ এই model করে।

| Property | Value |
|----------|-------|
| **Model ID** | `Qwen/Qwen3-8B` |
| **Provider** | HuggingFace Router API |
| **Parameters** | 8 Billion |
| **Type** | Causal Language Model (Chat) |
| **API Endpoint** | `https://router.huggingface.co/v1/chat/completions` |
| **Config Variable** | `HF_LLM_MODEL` |
| **Source File** | `backend/app/ai/hf_client.py` |
| **Timeout** | 120 seconds |

### এই Model কী কী করে
1. **Resume-based Opening Question তৈরি করে** — Candidate এর resume পড়ে প্রথম project-based question generate করে
2. **Counter-Questions তৈরি করে** — Candidate এর answer analyze করে follow-up question বানায়
3. **Answer Evaluation করে** — প্রতিটি উত্তর score (0-100) দেয় + strengths/weaknesses identify করে
4. **ATS Resume Analysis** — Resume text থেকে skills, projects extract করে
5. **Final Feedback Generation** — Interview শেষে STAR-method based recommendations দেয়

### Code Example — কিভাবে Call হচ্ছে
```python
# backend/app/ai/hf_client.py (Line 52-109)
async def generate_text(self, model, prompt, max_new_tokens=1024, temperature=0.3):
    # Qwen3 models default to "thinking mode" — /no_think for direct answers
    user_content = prompt
    if "qwen" in model.lower():
        user_content = prompt + " /no_think"
    
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": user_content}],
        "max_tokens": max_new_tokens,
        "temperature": temperature,
    }
    # POST to https://router.huggingface.co/v1/chat/completions
```

### Important Note for Teammates
> ⚠️ **Qwen3 "Thinking Mode":** Qwen3 models by default include a `<think>...</think>` block in responses. We append `/no_think` to prompts to get direct answers. The `parse_json_from_llm_response()` function in `llm_service.py` strips these tags automatically.

---

## 3. Model 2 — Qwen3-4B (Fallback LLM)

### Overview
এটি **fallback LLM** — যখন primary Qwen3-8B model fail করে (timeout, server down, rate limit), তখন automatically এটি ব্যবহার হয়।

| Property | Value |
|----------|-------|
| **Model ID** | `Qwen/Qwen3-4B` |
| **Parameters** | 4 Billion |
| **Config Variable** | `HF_LLM_FALLBACK_MODEL` |
| **Source File** | `backend/app/ai/llm_service.py` |

### Fallback Logic
```python
# backend/app/ai/llm_service.py (Line 70-95)
async def _call_hf(prompt, max_new_tokens, temperature):
    # Step 1: Try primary model (Qwen3-8B)
    result = await hf_client.generate_text(settings.HF_LLM_MODEL, prompt, ...)
    if result is not None:
        return result
    
    # Step 2: Primary failed → Try fallback (Qwen3-4B)
    result = await hf_client.generate_text(settings.HF_LLM_FALLBACK_MODEL, prompt, ...)
    return result  # None if both fail
```

---

## 4. Model 3 — Ollama Qwen2.5:7B (Local LLM)

### Overview
এটি **offline/local LLM** — internet ছাড়া কাজ করে। Developer machine এ Ollama install থাকলে এটি ব্যবহার করা যায়।

| Property | Value |
|----------|-------|
| **Model ID** | `qwen2.5:7b` |
| **Provider** | Ollama (Local Runtime) |
| **Parameters** | 7 Billion |
| **API Endpoint** | `http://localhost:11434/api/chat` |
| **Config Variable** | `OLLAMA_MODEL`, `OLLAMA_BASE_URL` |
| **Source File** | `backend/app/ai/ollama_client.py` |
| **Timeout** | 120 seconds |

### কিভাবে Activate করবে
```bash
# Step 1: Install Ollama (https://ollama.ai)
# Step 2: Pull the model
ollama pull qwen2.5:7b

# Step 3: Start Ollama server
ollama serve

# Step 4: Set in .env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

### Provider Switching
`.env` file এ `LLM_PROVIDER` variable change করে provider switch করা যায়:
- `LLM_PROVIDER=huggingface` → Cloud API (Qwen3-8B + 4B fallback)
- `LLM_PROVIDER=ollama` → Local Ollama (internet লাগবে না)

---

## 5. Model 4 — OpenAI Whisper-large-v3-turbo (Speech-to-Text)

### Overview
এটি **Automatic Speech Recognition (ASR)** model — candidate এর voice record করে text এ convert করে।

| Property | Value |
|----------|-------|
| **Model ID** | `openai/whisper-large-v3-turbo` |
| **Provider** | HuggingFace Inference API |
| **Type** | Automatic Speech Recognition (ASR) |
| **API Endpoint** | `https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo` |
| **Config Variable** | `HF_WHISPER_MODEL` |
| **Source File** | `backend/app/ai/speech_service.py` |
| **Input Format** | 16kHz, 16-bit, Mono WAV |
| **Timeout** | 180 seconds |

### Audio Pipeline Flow
```
Browser Microphone
    ↓
Web Audio API (Float32 PCM)
    ↓
In-Browser WAV Encoder (16kHz, 16-bit, Mono)
    ↓
WebSocket → Backend
    ↓
Whisper API → Transcript Text
```

### Fallback Mechanism
যদি Whisper API fail করে বা HF_TOKEN না থাকে:
1. **Browser Transcript** — Browser এর Web Speech API এর transcript ব্যবহার হয়
2. **Smart Mock** — Question keywords অনুযায়ী relevant mock answer generate হয়

### Important Note
> ⚠️ **Audio Format Issue:** Browsers normally record WebM/Opus format, কিন্তু Whisper API শুধু WAV accept করে। তাই আমরা browser এই JavaScript দিয়ে 16kHz WAV encode করি — এটা `InterviewRoom.jsx` এ আছে।

---

## 6. Model 5 — BAAI/bge-small-en-v1.5 (Semantic Embeddings)

### Overview
এটি **Semantic Similarity** model — candidate এর answer কতটা relevant তা measure করে question এর সাথে compare করে।

| Property | Value |
|----------|-------|
| **Model ID** | `BAAI/bge-small-en-v1.5` |
| **Provider** | HuggingFace Inference API (Feature Extraction) |
| **Type** | Sentence Embedding Model |
| **Output** | 384-dimensional vector per text |
| **API Endpoint** | `https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5` |
| **Config Variable** | `HF_EMBEDDING_MODEL` |
| **Source File** | `backend/app/ai/embedding_service.py` |
| **Timeout** | 30 seconds |

### কিভাবে কাজ করে
```
Question Text ──→ BGE Model ──→ Vector [384 dims]
                                       ↕ Cosine Similarity
Answer Text  ──→ BGE Model ──→ Vector [384 dims]
                                       ↓
                              Relevance Score (0-100)
```

### Code Example
```python
# backend/app/ai/embedding_service.py (Line 91-117)
async def semantic_relevance_score(question: str, answer: str) -> float:
    embeddings = await embed_texts([question, answer])
    if embeddings and len(embeddings) == 2:
        similarity = cosine_similarity(embeddings[0], embeddings[1])
        return round(similarity * 100, 1)  # 0-100 score
    
    # Fallback: word-overlap Jaccard similarity
    return jaccard_fallback_score(question, answer)
```

### Fallback
যদি embedding API unavailable থাকে, **Jaccard word-overlap similarity** ব্যবহার হয় (range: 30-85)।

---

## 7. Model 6 — Emotion FERPlus ONNX (Facial Emotion Recognition)

### Overview
এটি **Deep CNN model** — webcam frame থেকে candidate এর facial emotion detect করে।

| Property | Value |
|----------|-------|
| **Model File** | `emotion-ferplus-8.onnx` (35 MB) |
| **Location** | `backend/app/models/emotion-ferplus-8.onnx` |
| **Type** | Convolutional Neural Network (ONNX format) |
| **Input** | 64×64 grayscale face image |
| **Output** | 8 emotion probabilities |
| **Runtime** | OpenCV DNN module (`cv2.dnn.readNetFromONNX`) |
| **Source File** | `backend/app/services/cv_service.py` |

### Detected Emotions
| Index | FERPlus Class | Our Mapping |
|-------|--------------|-------------|
| 0 | Neutral | `neutral` |
| 1 | Happiness | `happy` |
| 2 | Surprise | `surprise` |
| 3 | Sadness | `sad` |
| 4 | Anger | `angry` |
| 5 | Disgust | `disgust` (combined with contempt) |
| 6 | Fear | `fear` |
| 7 | Contempt | merged into `disgust` |

### Processing Pipeline
```python
# backend/app/services/cv_service.py (Line 140-160)
# 1. Detect face with Haar Cascade
# 2. Crop face ROI from grayscale image
face_roi = gray[y:y+h, x:x+w]
# 3. Resize to 64x64
resized = cv2.resize(face_roi, (64, 64)).astype(np.float32)
# 4. Reshape for CNN input
blob = resized.reshape(1, 1, 64, 64)
# 5. Run ONNX inference
net.setInput(blob)
logits = net.forward()[0]
# 6. Softmax → probabilities
exp = np.exp(logits - np.max(logits))
fer_probs = exp / np.sum(exp)
```

---

## 8. Model 7 — OpenCV Haar Cascades (Face/Eye/Smile Detection)

### Overview
এগুলো **traditional ML models** (pre-trained Haar feature classifiers) — face, eye, smile detection এর জন্য OpenCV এর built-in classifiers।

| Cascade | File | কাজ |
|---------|------|------|
| **Frontal Face** | `haarcascade_frontalface_default.xml` | সামনে থেকে face detect করে |
| **Profile Face** | `haarcascade_profileface.xml` | পাশ থেকে (side angle) face detect করে |
| **Eye** | `haarcascade_eye.xml` | চোখ detect করে (eye contact tracking) |
| **Smile** | `haarcascade_smile.xml` | হাসি detect করে |

### Eye Contact Score Calculation
```python
# backend/app/services/cv_service.py (Line 183-199)
if num_eyes >= 2:
    score += 10.0   # Both eyes visible → good eye contact
elif num_eyes == 1:
    score -= 6.0    # One eye → slight angle
else:
    score -= 32.0   # No eyes → looking away

# Centering penalty: face should be centered in camera frame
centering_penalty = max(0.0, (max(dx, dy) - 0.35)) * 40.0
score -= centering_penalty
# Final: eye_contact_score between 15.0 and 98.0
```

### Source File
`backend/app/services/cv_service.py`

---

## 9. LLM Provider Routing & Fallback Architecture

সমস্ত LLM calls একটি central function `call_llm()` দিয়ে হয়। এটি automatically provider routing ও fallback handle করে।

```
call_llm(prompt)
    │
    ├── LLM_PROVIDER = "ollama"?
    │       ├── YES → Ollama Qwen2.5:7b (local)
    │       │         └── FAILED? → Fallback to HuggingFace
    │       │
    │       └── NO → HuggingFace (default)
    │               ├── Primary: Qwen3-8B
    │               │    └── FAILED? → Fallback: Qwen3-4B
    │               │         └── FAILED? → return None
    │               └── SUCCESS → return response
    │
    └── AI_MOCK_MODE = true?
            └── YES → Skip all API calls, return None (callers use mock data)
```

### Source File
`backend/app/ai/llm_service.py`

---

## 10. Backend Libraries & Frameworks

### Core Framework

| Library | Version | Purpose |
|---------|---------|---------|
| **FastAPI** | 0.115.8 | Async web framework (REST + WebSocket) |
| **Uvicorn** | 0.34.0 | ASGI server (FastAPI চালায়) |
| **Pydantic** | 2.10.6 | Data validation & serialization |
| **pydantic-settings** | 2.7.1 | `.env` file থেকে config load করে |
| **Motor** | 3.6.0 | Async MongoDB driver |
| **PyMongo** | 4.10.1 | MongoDB Python driver (Motor depends on it) |
| **websockets** | ≥12.0 | WebSocket support for FastAPI |

### Authentication & Security

| Library | Version | Purpose |
|---------|---------|---------|
| **bcrypt** | 4.2.1 | Password hashing |
| **passlib** | 1.7.4 | Password hashing utilities |
| **python-jose** | 3.3.0 | JWT token creation & verification |

### AI & ML Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **httpx** | ≥0.27.0 | Async HTTP client (HuggingFace API calls) |
| **openai** | 1.61.1 | OpenAI-compatible client (legacy, not actively used) |
| **opencv-python-headless** | 4.11.0.86 | Computer vision (face/eye/emotion detection + ONNX runtime) |
| **numpy** | 2.2.2 | Numerical computation (audio energy, softmax, embedding math) |
| **soundfile** | 0.13.1 | WAV audio file reading & analysis |
| **librosa** | 0.10.2 | Advanced audio analysis (optional, fallback) |
| **deepface** | 0.0.93 | Face analysis library (optional, heavy dependency) |
| **tf-keras** | 2.18.0 | TensorFlow/Keras backend for DeepFace (optional) |

### Document Processing

| Library | Version | Purpose |
|---------|---------|---------|
| **pypdf** | 6.16.2 | PDF resume text extraction |
| **python-multipart** | 0.0.20 | File upload handling |
| **reportlab** | 4.3.1 | PDF report generation (score cards, radar charts) |

### Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| **python-dotenv** | 1.0.1 | `.env` file loading |
| **gdown** | 5.2.0 | Google Drive file download (model downloads) |

---

## 11. Frontend Libraries & Frameworks

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 19.2.8 | UI component framework |
| **React DOM** | 19.2.8 | DOM rendering |
| **React Router DOM** | 7.18.2 | Client-side routing (SPA navigation) |
| **Vite** | 8.2.0 | Build tool & dev server |
| **Tailwind CSS** | 4.3.3 | Utility-first CSS framework |
| **Axios** | 1.19.0 | HTTP client (REST API calls) |
| **Framer Motion** | 13.1.1 | Smooth animations & transitions |
| **Lucide React** | 1.33.0 | Icon library |
| **Recharts** | 3.10.1 | Data visualization (radar charts, score graphs) |
| **PostCSS** | 8.5.26 | CSS processing |
| **Autoprefixer** | 10.5.4 | CSS vendor prefix automation |
| **OxLint** | 1.75.0 | Fast JavaScript linter |

### Browser APIs (No Library Needed)

| API | Purpose |
|-----|---------|
| **Web Audio API** | Microphone audio capture & 16kHz WAV encoding |
| **Web Speech API** | Browser-native speech recognition (fallback) |
| **HTML5 Canvas** | Webcam video capture & frame extraction |
| **WebSocket API** | Real-time interview communication |
| **MediaDevices API** | Camera & microphone access |

---

## 12. Database

| Property | Value |
|----------|-------|
| **Database** | MongoDB Community Server |
| **Driver** | Motor 3.6.0 (Async) |
| **Connection URL** | `mongodb://localhost:27017` |
| **Database Name** | `interview_ai` |
| **Config File** | `backend/app/database.py` |

### Collections

| Collection | Purpose | Key Fields |
|-----------|---------|------------|
| `users` | User accounts | email, first_name, last_name, hashed_password |
| `resumes` | Uploaded resumes | parsed_text, skills, resume_context, ats_score |
| `interviews` | Interview sessions | questions, scores_breakdown, feedback, status |

---

## 13. Environment Configuration (.env)

সব AI model configuration `.env` file এ থাকে। **`.env` file কখনো Git এ push করবে না!**

```env
# ── Server ────────────────────────────────────────
HOST=0.0.0.0
PORT=8000
SECRET_KEY=your_secure_random_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=120

# ── Database ──────────────────────────────────────
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=interview_ai

# ── LLM Provider Selection ───────────────────────
# "huggingface" → Cloud API (Qwen3-8B)
# "ollama"      → Local Ollama (internet ছাড়া)
LLM_PROVIDER=huggingface

# ── Ollama (Local) ────────────────────────────────
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# ── HuggingFace (Cloud) ──────────────────────────
HF_TOKEN=hf_your_token_here              # ← HuggingFace থেকে নিতে হবে
HF_LLM_MODEL=Qwen/Qwen3-8B              # Primary LLM
HF_LLM_FALLBACK_MODEL=Qwen/Qwen3-4B     # Fallback LLM
HF_WHISPER_MODEL=openai/whisper-large-v3-turbo   # Speech-to-Text
HF_EMBEDDING_MODEL=BAAI/bge-small-en-v1.5       # Semantic Embeddings

# ── Feature Flags ─────────────────────────────────
AI_MOCK_MODE=false          # true → সব AI call skip, mock data ব্যবহার
ATS_ENABLED=true            # Resume ATS scoring on/off
MAX_INTERVIEW_QUESTIONS=10  # Per session question limit
```

### Config Source File
`backend/app/config.py`

---

## 14. Architecture Diagram — How Models Connect

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CANDIDATE'S BROWSER                              │
│                                                                      │
│  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌──────────────────┐ │
│  │  React   │  │ Web Audio  │  │  HTML5    │  │  Web Speech API  │ │
│  │   UI     │  │  API (WAV) │  │  Canvas   │  │   (Fallback)     │ │
│  └────┬─────┘  └─────┬──────┘  └─────┬─────┘  └────────┬─────────┘ │
│       │              │               │                  │           │
└───────┼──────────────┼───────────────┼──────────────────┼───────────┘
        │              │               │                  │
        │    WebSocket │               │ HTTP POST        │
        │              │               │                  │
┌───────┼──────────────┼───────────────┼──────────────────┼───────────┐
│       ▼              ▼               ▼                  ▼           │
│                    FASTAPI BACKEND (:8000)                           │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    llm_service.py (Router)                      │ │
│  │          ┌─────────────────┬─────────────────┐                  │ │
│  │          ▼                 ▼                 ▼                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │  Qwen3-8B    │  │  Qwen3-4B    │  │  Ollama      │          │ │
│  │  │  (Primary)   │  │  (Fallback)  │  │  Qwen2.5:7B  │          │ │
│  │  │  HF Cloud    │  │  HF Cloud    │  │  Local        │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │  Whisper     │  │  BGE         │  │  CV Service             │   │
│  │  v3-turbo    │  │  Embeddings  │  │  ┌─────────┐ ┌───────┐ │   │
│  │  (ASR)       │  │  (Semantic)  │  │  │FERPlus  │ │Haar   │ │   │
│  │  HF Cloud    │  │  HF Cloud    │  │  │ONNX CNN │ │Cascade│ │   │
│  └──────────────┘  └──────────────┘  │  └─────────┘ └───────┘ │   │
│                                       │  Local OpenCV           │   │
│                                       └─────────────────────────┘   │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Soundfile   │  │  ReportLab   │  │  pypdf       │              │
│  │  + NumPy     │  │  (PDF Gen)   │  │  (Resume     │              │
│  │  (Voice)     │  │              │  │   Parser)    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│                          ▼                                           │
│                  ┌──────────────┐                                    │
│                  │   MongoDB    │                                    │
│                  │  :27017      │                                    │
│                  └──────────────┘                                    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 15. Quick Reference Table

### Key Files — কোন model কোন file এ আছে

| File | কী আছে |
|------|---------|
| `backend/app/config.py` | সব model names ও settings |
| `backend/app/ai/hf_client.py` | HuggingFace API calls (LLM, Whisper, Embeddings) |
| `backend/app/ai/ollama_client.py` | Local Ollama LLM calls |
| `backend/app/ai/llm_service.py` | LLM provider routing & fallback logic |
| `backend/app/ai/speech_service.py` | Whisper transcription + fallback |
| `backend/app/ai/embedding_service.py` | BGE semantic similarity scoring |
| `backend/app/services/cv_service.py` | FERPlus ONNX + Haar Cascades (emotion + eye contact) |
| `backend/app/services/audio_service.py` | Voice metrics (WPM, pauses, fillers) via Soundfile + NumPy |
| `backend/app/ai/interview_engine.py` | Core interview logic (question generation, counter-questioning) |
| `backend/app/ai/resume_parser.py` | Resume text extraction & structured context |
| `backend/app/ai/ats_scorer.py` | ATS keyword scoring engine |
| `backend/app/ai/prompt_templates.py` | All LLM prompt templates |

### HuggingFace Token কিভাবে পাবে
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" access
3. Copy the token (starts with `hf_`)
4. Paste in `backend/.env` as `HF_TOKEN=hf_your_token_here`

---

> 📌 **নতুন teammate এর জন্য:** প্রথমে `README.md` পড়ো setup এর জন্য, তারপর এই document পড়ো model details বোঝার জন্য। যদি কোনো model সম্পর্কে আরো জানতে চাও, উপরের table এর source file paths follow করো।
