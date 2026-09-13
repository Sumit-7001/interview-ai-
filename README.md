# 🚀 InterviewAI — Intelligent Resume-Driven AI Mock Interview Platform

> An end-to-end, multi-modal AI Interviewer with live WebSocket conversations, adaptive resume-based counter-questioning, real-time facial expression tracking, eye contact monitoring, speech analytics, and automated ATS resume scoring.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Whisper](https://img.shields.io/badge/Speech--to--Text-Whisper--v3--turbo-orange.svg)](https://huggingface.co/openai/whisper-large-v3-turbo)
[![Qwen3](https://img.shields.io/badge/LLM-Qwen3--8B%20%7C%20Ollama-blue.svg)](https://huggingface.co/Qwen)

---

## 📖 Complete Documentation
👉 **For the complete, in-depth technical report, viva defense guide, and architecture diagrams, see [PROJECT_DOCUMENTATION.md](file:///Users/sukdebsahu/Documents/AI%20Project/PROJECT_DOCUMENTATION.md).**

---

## 🌟 Key Features

1. **📄 Resume-Controlled Interviewing:**
   - Extracts structured candidate profile: candidate name, categorized skills (Languages, Frameworks, Databases, Tools), and projects.
   - Starts directly with the candidate's actual projects rather than generic icebreakers.

2. **🎯 Contextual Counter-Questioning:**
   - Analyzes candidate answers, recognizes claimed concepts (`['React', 'Node.js', 'MongoDB']`), identifies missing trade-offs, and asks direct, student-friendly counter-questions.

3. **🎙️ Speech & Vocal Analysis:**
   - In-browser **16kHz 16-bit Mono WAV encoding** using Web Audio API for 100% Whisper compatibility.
   - Computes speaking speed (WPM), hesitation pause duration, filler word counts, and vocal energy variance in **<0.02 seconds** with Soundfile and NumPy.

4. **👁️ Computer Vision & Body Language Tracking:**
   - Real-time **Eye Contact Tracking** via HTML5 Canvas center bounding box logic.
   - Real-time **Facial Emotion Recognition** via DeepFace (Neutral, Happy, Confident, Stressed).

5. **⚡ Full-Duplex WebSocket Engine:**
   - Instant back-and-forth conversational turns on `/ws/interview/{session_id}` with live TTS audio playback and thinking indicators.

6. **📊 ATS Resume Optimization:**
   - Analyzes uploaded resumes (PDF/DOCX/TXT) against target roles, scoring keyword matches, section completeness, and providing improvement checklists.

7. **📑 Automated PDF Report Export:**
   - ReportLab compiles final weighted scorecards, question transcripts, diagnostic radar charts, and STAR-method recommendations into a downloadable PDF certificate.

---

## 🏗️ Architecture

```
CANDIDATE BROWSER (React + Vite + Tailwind + Web Audio API 16kHz WAV)
   │
   ├── Native WebSocket (/ws/interview/{id})
   └── REST API (/api/interviews, /api/resume, /api/auth)
        │
        ▼
FASTAPI SERVER (:8000)
   ├── Dynamic Interview Engine (Qwen3-8B / Ollama Qwen2.5:7b)
   ├── Speech ASR (OpenAI Whisper-large-v3-turbo)
   ├── Vocal Analyzer (Soundfile + NumPy Vectorized Energy)
   ├── Computer Vision (OpenCV + DeepFace)
   ├── ATS Resume Scorer & Context Parser (pypdf/docx)
   ├── PDF Exporter (ReportLab)
   └── MongoDB Community Server (:27017)
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 8, Tailwind CSS v4, Recharts, Lucide Icons, Web Audio API, Web Speech API.
- **Backend:** Python 3.13, FastAPI, Uvicorn, Motor (Async MongoDB), Pydantic v2, ReportLab, Soundfile, NumPy.
- **AI Models:** Qwen/Qwen3-8B (LLM), OpenAI Whisper-large-v3-turbo (ASR), BAAI/bge-small-en-v1.5 (Semantic embeddings), DeepFace (Emotions).
- **Database:** MongoDB Community Server (`interview_ai`).

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10 to v3.13
- **MongoDB**: Running locally on `mongodb://localhost:27017`

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

### 4. Running Backend Verification Tests
```bash
cd backend
./venv/bin/python tests/test_api.py
```
*(Runs all 8 verification stages: health, auth, session, answer submission, weighted scoring, and PDF compilation).*

---

## 📄 License
Open source for educational and academic project purposes.
