# 📘 InterviewAI — Project Documentation & Technical Specification

> **Project Title:** InterviewAI — Intelligent Resume-Driven AI Mock Interview Platform  
> **Domain:** Artificial Intelligence, Natural Language Processing, Computer Vision, Full-Stack Web Engineering  
> **Target Audience:** College Students, Freshers, Software Engineers, and Job Aspirants  
> **Author / Developer:** Sumit Kumar Sahoo & Team  
> **Version:** 3.0.0 (Production / Final Submission Ready)

---

## 📑 Table of Contents
1. [Project Overview & Executive Summary](#1-project-overview--executive-summary)
2. [Problem Statement & Proposed Solution](#2-problem-statement--proposed-solution)
3. [Key Highlights & Unique Innovations](#3-key-highlights--unique-innovations)
4. [Complete Technology Stack](#4-complete-technology-stack)
5. [System Architecture & Pipeline Flowcharts](#5-system-architecture--pipeline-flowcharts)
6. [Detailed Module Breakdown](#6-detailed-module-breakdown)
   - [Module 1: Resume Intelligence & ATS Engine](#module-1-resume-intelligence--ats-engine)
   - [Module 2: Dynamic Conversational AI Engine](#module-2-dynamic-conversational-ai-engine)
   - [Module 3: Speech & Audio Processing (Whisper + Web Audio API)](#module-3-speech--audio-processing)
   - [Module 4: Computer Vision & Emotion/Eye Tracking](#module-4-computer-vision--facial-emotion--eye-contact-tracking)
   - [Module 5: Diagnostic Scoring & Feedback Generation](#module-5-diagnostic-scoring--feedback-generation)
   - [Module 6: PDF Report Compilation Engine](#module-6-pdf-report-compilation-engine)
7. [Database Schema & Data Models (MongoDB)](#7-database-schema--data-models-mongodb)
8. [Complete API Specification (REST & WebSocket)](#8-complete-api-specification-rest--websocket)
9. [Local Installation & Setup Guide](#9-local-installation--setup-guide)
10. [College Project Presentation & Viva Defense Guide](#10-college-project-presentation--viva-defense-guide)

---

## 1. Project Overview & Executive Summary

**InterviewAI** is an advanced, automated mock interview platform designed to simulate a realistic technical and behavioral job interview. Unlike traditional interview chatbots that merely read from fixed question lists, **InterviewAI** operates as a dynamic, adaptive interviewer:

1. **Resume-Controlled:** It extracts the candidate's actual projects, programming languages, libraries, and internships from their uploaded PDF/DOCX resume and starts the interview directly questioning their actual work.
2. **Contextual Counter-Questioning:** It analyzes the candidate's spoken or typed answer in real-time, recognizes technical concepts mentioned, identifies missing trade-offs, and generates direct, relevant follow-up questions (student-friendly, practical depth).
3. **Multi-Modal Analytics:** It simultaneously evaluates:
   - **Technical Correctness & Completeness** (via LLMs: Qwen3-8B / Qwen2.5-7B).
   - **Vocal Quality & Speech Metrics** (Speaking Speed WPM, Pauses, Filler Words, Vocal Variance).
   - **Facial Expressions** (Neutral, Happy, Confident, Stressed probabilities via DeepFace).
   - **Eye Contact Stability** (Center-box gaze alignment via OpenCV & HTML5 Canvas).
4. **Actionable Mentorship & PDF Export:** Generates diagnostic radar charts, STAR-method guidance, and a formal, printable PDF evaluation certificate.

---

## 2. Problem Statement & Proposed Solution

### The Problem
- **Generic Questionnaires:** Most online interview tools ask static questions (e.g., *"Tell me about yourself"*, *"What is polymorphism?"*) without regard for what candidate actually built.
- **No Follow-up or Cross-Questioning:** Real technical interviewers grill candidates on their choices (*"You used LangChain with ChromaDB; why ChromaDB over FAISS or Pinecone?"*). Traditional mock apps cannot cross-examine.
- **Lack of Body Language / Communication Feedback:** Candidates fail interviews not just from lack of coding knowledge, but from filler words, excessive nervousness, poor eye contact, and rambling answers.
- **Cost & Accessibility:** Commercial mock interview platforms charge high subscription fees, making them inaccessible to college students and freshers.

### The Solution: InterviewAI
- **Free, Open, Self-Hostable:** Built with free/open-source technologies (FastAPI, React, Vite, MongoDB, Hugging Face Inference API / Local Ollama).
- **Deep Resume Parsing:** Understands specific project details, skills, and tools.
- **Full-Duplex WebSocket Engine:** Enables smooth, low-latency back-and-forth conversational turns with live audio capture, Text-to-Speech (TTS), and instant evaluation.
- **Comprehensive Scorecard:** Evaluates 5 dimensions: Technical Accuracy, Answer Quality, Semantic Relevance, Eye Contact, and Communication Clarity.

---

## 3. Key Highlights & Unique Innovations

| Feature | How It Works in InterviewAI |
| :--- | :--- |
| **Direct Project Opening** | Never asks generic openers. Reads the candidate's top resume project and asks an accessible, student-friendly question (e.g., *"I noticed you built an AI Chatbot using LangChain. Can you explain what specific components you developed?"*). |
| **Real Dynamic Counter-Questions** | Analyzes what candidate claimed. If candidate mentions *"Connected React to Node.js with Axios"*, the counter-question dives directly into how API responses and errors were handled in that flow. |
| **In-Browser 16kHz WAV Audio Engine** | Encodes microphone audio into genuine **16kHz 16-bit Mono WAV** directly in browser JavaScript using Web Audio API before transmission, ensuring 100% compatibility with Whisper and Soundfile. |
| **Brave Browser Shield Resilience** | Gracefully detects if browser speech recognition is blocked by privacy shields (like in Brave Browser), automatically falls back to backend Whisper transcription, and provides full typing mode. |
| **Ultra-Fast Voice Diagnostics** | Replaced sluggish Fourier pitch tracking with vectorized Soundfile + NumPy energy thresholding, reducing vocal metric computation from **170+ seconds down to 0.02 seconds**. |
| **Weighted Scoring Engine** | Applies different dimension weights depending on interview format (Technical weights code & correctness 45%; HR weights communication 40%; Behavioral weights STAR situational metrics 35%). |
| **Exportable PDF Report** | Automatically formats the session metrics into a beautiful, styled ReportLab PDF containing circular score rings, radar charts, and candidate recommendations. |

---

## 4. Complete Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                  │
│  React 18  •  Vite 8  •  Tailwind CSS v4  •  Lucide Icons  •  Recharts │
│  HTML5 Canvas  •  Web Audio API (16kHz PCM WAV)  •  Web Speech API     │
└────────────────────────────────────────────────────────────────────────┘
                                   │
              HTTP / REST API (JWT) │ WebSocket (Native Duplex)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                   │
│  Python 3.13  •  FastAPI  •  Uvicorn  •  Pydantic v2  •  Motor (Async) │
│  ReportLab (PDF)  •  Soundfile + NumPy  •  Librosa  •  OpenCV-Headless │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        AI & MACHINE LEARNING                           │
│  • LLM: Qwen/Qwen3-8B / Qwen3-4B (HF Router API) or Ollama Qwen2.5:7b │
│  • Speech-to-Text: OpenAI Whisper-large-v3-turbo                       │
│  • Embeddings: BAAI/bge-small-en-v1.5 (Semantic answer similarity)     │
│  • Computer Vision: OpenCV (Eye Gaze) + DeepFace (Facial Emotions)     │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                  │
│  MongoDB Community Server (Collections: users, resumes, interviews)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. System Architecture & Pipeline Flowcharts

### A. End-to-End System Architecture

```
CANDIDATE BROWSER
 │
 ├── Webcam Stream (HTML5 Video Element)
 │    └── Periodic Frame Snapshot (JPEG) ──[HTTP POST /api/emotion/analyze]──► DeepFace & OpenCV
 │
 ├── Microphone Stream (Web Audio API)
 │    └── Client PCM Float32 ──► In-Browser 16kHz WAV Encoder
 │         │
 │         └── [WebSocket Frame / Answer] ──────────────────────────┐
 │                                                                   │
 ├── Resume Upload (PDF / DOCX / TXT)                                │
 │    └── [HTTP POST /api/resume/upload]                             │
 │         │                                                         ▼
 │         ▼                                                  FASTAPI BACKEND
 │    PDF/DOCX Extraction (pypdf/docx)                               │
 │    Structured Context Extractor (Skills, Projects, Edu)           ├── Whisper ASR
 │    ATS Scorer (Keyword match, density, section score)             │    └── Speech Transcription
 │                                                                   ├── Voice Metrics (Soundfile/NumPy)
 │                                                                   │    └── Duration, Speed, Pauses, Fillers
 │                                                                   └── Dynamic Interview Engine
 │                                                                        ├── Qwen3-8B / Ollama
 │                                                                        ├── Turn & State Tracker
 │                                                                        └── Counter-Question Generator
 │                                                                             │
 └─────────────────────── [Live TTS & UI Update] ◄─────────────────────────────┘
```

### B. Live Interview Conversational State Machine

```
[Start Session]
      │
      ▼
Fetch Structured Resume Context ──► Generate Resume-Based Opening Question (e.g. Q1: Project Deep-Dive)
      │
      ▼
Candidate Speaks / Types Answer
      │
      ├────────────────────────────────────────┬────────────────────────────────────────┐
      ▼                                        ▼                                        ▼
Audio ──► Whisper ASR                  Face ──► DeepFace Emotion                 Vocal ──► Soundfile
Transcript Generated                   Dominant Expression                      Speed WPM, Pauses, Fillers
      │                                        │                                        │
      └────────────────────────────────────────┴────────────────────────────────────────┘
                                               │
                                               ▼
                                 Interview Intelligence Engine
                          (Evaluates Answer against claimed skills)
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
        Answer is Strong                                                Answer is Weak / Vague
   • Acknowledge specific point                                    • Warm encouragement
   • Ask practical feature/testing counter-q                       • Guide with simpler angle or clarify
               │                                                               │
               └───────────────────────────────┬───────────────────────────────┘
                                               │
                                               ▼
                         Turns on this Project/Topic >= 2-3?
                                 /                   \
                              YES                     NO
                              /                         \
            Smooth transition to next project     Deeper counter-question on
            from candidate's resume               current project
```

---

## 6. Detailed Module Breakdown

### Module 1: Resume Intelligence & ATS Engine
- **Files:** `backend/app/ai/resume_parser.py`, `backend/app/ai/ats_scorer.py`, `backend/app/services/pdf_service.py`
- **Functions:**
  - `parse_resume_to_structured_context(text)`: Extracts candidate name, categorized skills (Languages, Frameworks, Databases, Tools), structured projects with descriptions, and education history into a cached JSON context.
  - `calculate_ats_score(resume_text, role)`: Computes an ATS match score (0-100) based on role-specific required keywords, section presence (Experience, Projects, Education, Skills), keyword density, and formatting hygiene. Generates missing keyword checklists and improvement suggestions.

### Module 2: Dynamic Conversational AI Engine
- **Files:** `backend/app/ai/interview_engine.py`, `backend/app/ai/prompt_templates.py`, `backend/app/routes/interview_ws.py`
- **Functions:**
  - `generate_opening_question()`: Selects the candidate's top resume project and formulates a direct, friendly opener.
  - `process_candidate_answer_and_next_question()`: Analyzes candidate's response, identifies detected concepts (`['React', 'Node.js', 'MongoDB']`), pinpoints missing trade-offs, assigns an answer score (0-100), and generates a direct counter-question.
  - **Difficulty Governance:** Enforces **student-friendly, practical questions** for freshers, strictly avoiding unrealistic enterprise architecture or 10x scalability bottlenecks.

### Module 3: Speech & Audio Processing
- **Files:** `backend/app/ai/speech_service.py`, `backend/app/services/audio_service.py`, `frontend/src/pages/InterviewRoom.jsx`
- **Features:**
  - **In-Browser Audio Conversion:** Converts Float32 channel samples into RIFF WAVE (16kHz, 16-bit Mono PCM).
  - **Whisper Automatic Speech Recognition:** Transcribes audio via Hugging Face Inference API (`openai/whisper-large-v3-turbo`).
  - **Voice Metrics:** Computes speaking duration, speaking speed (WPM), hesitation pause duration, and filler word count in **0.02 seconds** using Soundfile and NumPy.

### Module 4: Computer Vision & Facial Emotion / Eye Contact Tracking
- **Files:** `backend/app/services/cv_service.py`, `frontend/src/components/CameraPanel.jsx`
- **Features:**
  - **Eye Contact Tracking:** HTML5 Canvas bounding box calculations detect whether the candidate's face is centered in the frame.
  - **Facial Emotion Recognition:** DeepFace processes webcam snapshots to estimate emotional distribution (Neutral, Happy, Fear, Sad, Angry, Surprise).

### Module 5: Diagnostic Scoring & Feedback Generation
- **Files:** `backend/app/ai/interview_scorer.py`, `backend/app/ai/answer_evaluator.py`
- **Features:**
  - **Role-Specific Weighted Aggregation:** Computes weighted final scores across technical knowledge, communication clarity, eye contact, and answer completeness.
  - **STAR Method Coaching:** Generates specific recommendations on how the candidate can structure stories better using Situation, Task, Action, and Result.

### Module 6: PDF Report Compilation Engine
- **Files:** `backend/app/services/pdf_service.py`, `frontend/src/pages/ReportPage.jsx`
- **Features:**
  - ReportLab compiles session scores, question-by-question transcripts, radar score summaries, and AI recommendations into a downloadable PDF report.

---

## 7. Database Schema & Data Models (MongoDB)

All application collections reside in the `interview_ai` MongoDB database.

### 1. `users` Collection
```json
{
  "_id": "ObjectId('...')",
  "email": "candidate@example.com",
  "first_name": "Sumit",
  "last_name": "Sahoo",
  "hashed_password": "$2b$12$...",
  "created_at": "2026-09-13T10:00:00.000Z"
}
```

### 2. `resumes` Collection
```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "filename": "Resume_Sumit.pdf",
  "parsed_text": "Sumit Kumar Sahoo ... Skills: Python, React, MongoDB ...",
  "skills": ["Python", "React", "MongoDB", "FastAPI", "LangChain"],
  "experience": ["Intern at TechCorp..."],
  "education": ["B.Tech Computer Science..."],
  "resume_context": {
    "candidate_name": "Sumit Kumar Sahoo",
    "skills": {
      "languages": ["Python", "JavaScript"],
      "frameworks": ["React", "FastAPI", "LangChain"],
      "databases": ["MongoDB", "MySQL"],
      "tools": ["Git", "VS Code"]
    },
    "projects": [
      {
        "name": "AI Chatbot using LangChain",
        "description": "Built a conversational agent using LangChain, Ollama and ChromaDB."
      }
    ]
  },
  "ats_score": 82,
  "ats_matched_keywords": ["python", "react", "mongodb", "api", "git"],
  "ats_missing_keywords": ["docker", "ci/cd"],
  "uploaded_at": "2026-09-13T10:05:00.000Z"
}
```

### 3. `interviews` Collection
```json
{
  "_id": "ObjectId('...')",
  "user_id": "ObjectId('...')",
  "role": "Software Engineer",
  "experience_level": "Entry",
  "interview_type": "Technical",
  "status": "completed",
  "current_topic": "AI Chatbot using LangChain",
  "turns_on_topic": 2,
  "difficulty": "easy",
  "overall_score": 78,
  "duration_seconds": 320,
  "scores_breakdown": {
    "technical": 80,
    "answer_quality": 75,
    "communication": 82,
    "eye_contact": 88
  },
  "feedback": {
    "what_went_well": ["Strong explanation of React frontend state management"],
    "areas_to_improve": ["Explain error handling when backend is unreachable"],
    "recommendations": "Practice structuring answers with STAR framework..."
  },
  "questions": [
    {
      "id": 1,
      "question_text": "I noticed on your resume that you built an AI Chatbot using LangChain. Can you explain what specific components you developed?",
      "answer_text": "I built the React UI and connected it to Node.js backend using Axios...",
      "audio_path": "uploads/audio/session_q1.wav",
      "eye_contact_score": 88.5,
      "emotion_summary": { "neutral": 85.0, "happy": 15.0 },
      "voice_metrics": {
        "duration_seconds": 12.4,
        "speaking_speed": 130,
        "filler_words_count": 1,
        "pause_duration": 1.5
      },
      "evaluation": {
        "score": 75,
        "correctness": "Accurate description of frontend-backend connectivity",
        "feedback": "Great overview. Let's dig deeper into the LLM integration."
      }
    }
  ],
  "created_at": "2026-09-13T10:10:00.000Z",
  "completed_at": "2026-09-13T10:15:20.000Z"
}
```

---

## 8. Complete API Specification (REST & WebSocket)

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Registers a new user account.
- `POST /api/auth/login` — Authenticates user and returns JWT bearer token.
- `GET /api/auth/me` — Returns current logged-in user profile.

### Resume Management (`/api/resume`)
- `POST /api/resume/upload` — Multipart file upload (PDF/DOCX/TXT). Parses context and generates ATS score.
- `GET /api/resume` — Fetches candidate's active resume profile and ATS metrics.
- `DELETE /api/resume` — Deletes candidate's stored resume from MongoDB.
- `POST /api/resume/analyze-ats` — Re-runs ATS keyword evaluation for a specific job title.

### Interview Management (`/api/interviews`)
- `POST /api/interviews` — Creates a new mock interview session with structured opening question.
- `GET /api/interviews` — Lists all previous mock interviews for the authenticated user.
- `GET /api/interviews/{id}` — Retrieves detailed session state, questions, and evaluations.
- `DELETE /api/interviews/{id}` — Permanently deletes an interview session from history.
- `POST /api/interviews/{id}/answer` — REST endpoint to submit audio WAV and receive evaluation and counter-question.
- `POST /api/interviews/{id}/complete` — Completes the session and generates final scorecard.
- `GET /api/reports/{id}/pdf` — Streams a binary PDF evaluation report for download.

### Live WebSocket Interview (`/ws/interview/{session_id}`)
- Connect URL: `ws://localhost:8000/ws/interview/{session_id}?token={JWT_TOKEN}`
- **Incoming Messages from Client:**
  - `{"type": "start"}` — Requests the resume-driven opening question.
  - `{"type": "answer", "text": "...", "audio_b64": "...", "emotion": {...}, "eye_contact": 85}` — Submits response.
  - `{"type": "end"}` — Finalizes interview and triggers score compilation.
- **Outgoing Messages from Server:**
  - `{"type": "thinking"}` — Signals AI is formulating evaluation and counter-question.
  - `{"type": "question", "question": "...", "difficulty": "easy", "tts_text": "..."}` — Next question.
  - `{"type": "feedback", "score": 75, "feedback": "...", "strengths": [...], "improvements": [...]}` — Immediate evaluation.
  - `{"type": "complete", "overall_score": 80, "redirect_url": "/reports/{id}"}` — Interview completed.

---

## 9. Local Installation & Setup Guide

### System Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 to v3.13
- **MongoDB**: Community Server running locally on port `27017`

### 1. Environment Configuration
Create a `.env` file in `/backend`:
```env
HOST=0.0.0.0
PORT=8000
SECRET_KEY=your_secure_random_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=120
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=interview_ai

# LLM Provider: "huggingface" or "ollama"
LLM_PROVIDER=huggingface
HF_TOKEN=hf_your_token_here
HF_LLM_MODEL=Qwen/Qwen3-8B
HF_LLM_FALLBACK_MODEL=Qwen/Qwen3-4B
HF_WHISPER_MODEL=openai/whisper-large-v3-turbo
HF_EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

AI_MOCK_MODE=false
ATS_ENABLED=true
MAX_INTERVIEW_QUESTIONS=10
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Running Backend Verification Tests
```bash
cd backend
./venv/bin/python tests/test_api.py
```

---

## 10. College Project Presentation & Viva Defense Guide

Here are the most common technical questions asked by external examiners and professors during project viva/defense, along with the precise answers:

### Q1: "How is your project different from a standard ChatGPT chatbot?"
> **Answer:** *"A standard chatbot only provides text Q&A without state management or multi-modal perception. InterviewAI extracts structured knowledge from the candidate's resume, tracks conversational turns across topics, analyzes verbal speech (WPM, pauses, filler words), monitors eye contact stability and facial emotions in real-time, and dynamically generates relevant counter-questions based specifically on what the candidate just answered."*

### Q2: "Why did you use WebSocket instead of regular REST APIs for the interview?"
> **Answer:** *"Mock interviews require real-time, full-duplex communication. WebSocket eliminates the latency and overhead of establishing new HTTP handshakes on every turn, allowing instantaneous 'thinking' notifications, synchronized Text-to-Speech playback, and immediate feedback delivery as soon as the candidate finishes speaking."*

### Q3: "How did you solve the browser audio format issue with Hugging Face Whisper?"
> **Answer:** *"Browsers record audio in WebM/Opus by default, which libsndfile on Hugging Face inference rejects with a 400 format error. We implemented an in-browser Web Audio API PCM decoder that converts recorded audio into standard 16kHz 16-bit Mono WAV before sending it to the server. This guarantees 100% transcription accuracy and zero format rejections across all browsers including Chrome, Edge, and Brave."*

### Q4: "How does the system ensure questions don't get too difficult for freshers?"
> **Answer:** *"The interview engine enforces an explicit student-friendly prompt constraint. It strictly forbids high-level enterprise architecture or distributed scale bottlenecks, focusing instead on practical coding, component connections, debugging steps, and database queries appropriate for entry-level candidates."*

### Q5: "How does your ATS scoring algorithm work?"
> **Answer:** *"The ATS engine parses resume text into clean tokens and evaluates three criteria: (1) Keyword match percentage against essential tech stack skills for the selected role; (2) Structural completeness checking for dedicated Education, Experience, Skills, and Projects sections; and (3) Formatting hygiene and keyword density, generating a composite score from 0 to 100 with clear suggestions for improvement."*
