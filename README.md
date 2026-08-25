# InterviewAI — Smart Practice Room with Emotion & Eye Contact Detection

**InterviewAI** is a premium, production-ready AI-powered mock interview SaaS platform. It evaluates candidates on technical answers, facial expressions, vocal patterns, and eye contact behavior, producing detailed performance evaluations and Study Plan reports.

---

## 1. System Architecture

The platform follows a separated client-server architecture with MongoDB persistence and specialized AI/Computer-Vision layers:

```
                  ┌──────────────────────────────┐
                  │        React Client          │
                  │   (Vite + Tailwind v4 + FM)  │
                  └──────────────┬───────────────┘
                                 │
                     HTTP & Web Uploads (JWT)
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │       FastAPI Server         │
                  └──────────────┬───────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     │                           │                           │
     ▼                           ▼                           ▼
┌──────────┐               ┌───────────┐               ┌───────────┐
│ MongoDB  │               │AI Services│               │CV & Audio │
│ Database │               │ (OpenAI)  │               │ (Fallback)│
└──────────┘               └───────────┘               └───────────┘
```

* **Frontend Client:** Built using React, Vite, Tailwind CSS v4, Framer Motion, and Recharts. Real-time eye contact centering and tracking is calculated in the browser using HTML5 Canvas pixel bounding math. Webcam snapshots are periodically transmitted to the API.
* **FastAPI Backend:** Orchestrates authentication, resume parsing, interview rooms, and report compiling.
* **AI & Media Services:**
  * **LLM (OpenAI GPT-4o-mini):** Drives dynamic, resume-personalized question builders and semantic answer graders.
  * **Speech-to-Text (Whisper):** Transcribes verbal responses from uploaded browser WebM audio tracks.
  * **Emotion Detection (DeepFace):** Analyzes webcam frame snapshots to evaluate expression states.
  * **Voice Diagnostics (Librosa):** Processes audio files to calculate speed (wpm), pauses, fillers, and pitch.
  * **PDF Builder (ReportLab):** Compiles and formats result cards as PDF downloads.

---

## 2. Technical Stack

* **Frontend:** React 18, Vite 8, Tailwind CSS v4, React Router v6, Axios, Recharts, Lucide React, Framer Motion.
* **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic v2, Motor/PyMongo, Passlib (Bcrypt), Python-JOSE (JWT), ReportLab, OpenCV-Headless.
* **Optional ML Engines:** TensorFlow 2.21, tf-keras, DeepFace, Librosa (resiliently wrapped in try-catch fallbacks).
* **Database:** MongoDB Community Server.

---

## 3. Database Schema

All tables are saved inside a local MongoDB database named `interview_ai`:

* **`users`:** Stores credentials and account setup dates.
* **`resumes`:** Stores parsed skills, education lines, and text bodies mapped to `user_id`.
* **`interviews`:** Represents the mock sessions. Houses arrays of `QuestionDB` records containing transcribed response strings, emotion metrics, eye contact stats, voice metrics, and AI grading logs.

---

## 4. API Endpoints

### Authentication
* `POST /api/auth/register` - Create user profile
* `POST /api/auth/login` - Retrieve access tokens (JSON)
* `GET /api/auth/me` - Fetch authenticated account details

### Resume Manager
* `POST /api/resume/upload` - Parse and record resume metadata (Skills, Education)
* `GET /api/resume` - Retrieve parsed user resume profile

### Interview Room
* `POST /api/interviews` - Initiate session (builds 5 dynamic questions)
* `GET /api/interviews` - List user practice history
* `GET /api/interviews/{id}` - Fetch detailed session details
* `POST /api/interviews/{id}/answer` - Upload WebM audio file response and evaluate
* `POST /api/interviews/{id}/complete` - Finish session, calculate average parameters, and produce study plans
* `GET /api/reports/{id}/pdf` - Download styled PDF diagnostics report
* `POST /api/emotion/analyze` - Process webcam snapshots and return expression probabilities

---

## 5. Local Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.10 to v3.13)
* **MongoDB Community Server** (installed and active on `localhost:27017`)

### A. Environment Configuration
Create a `.env` file in the `backend/` directory (copied from `.env.example`):
```env
HOST=0.0.0.0
PORT=8000
SECRET_KEY=9a8b7c6d5e4f3g2h1i0j_interview_ai_secret_key_2026
ACCESS_TOKEN_EXPIRE_MINUTES=120
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=interview_ai
OPENAI_API_KEY=your_openai_api_key_here
```
*Note: If `OPENAI_API_KEY` is omitted or empty, the backend runs in a High-Fidelity Simulator mode. This simulates Whisper transcription, LLM question builders, and answer grading dynamically based on user profiles, making the app immediately testable without credentials.*

### B. Backend Setup
1. Open a terminal inside the `/backend` folder.
2. Run the installer script (configures a python virtualenv and installs dependencies):
   ```bash
   ./install_backend.sh
   ```
3. Boot the FastAPI server:
   ```bash
   ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### C. Frontend Setup
1. Open a terminal inside the `/frontend` folder.
2. Install npm modules:
   ```bash
   npm install
   ```
3. Run the client development server:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
4. Access the web dashboard at `http://localhost:5173`.

### D. Running Verification Tests
To run integration tests verifying signup, question building, voice submission, and PDF compilation:
1. Ensure the FastAPI backend is running on port 8000.
2. Execute the test runner script inside the `/backend` folder:
   ```bash
   ./venv/bin/python tests/test_api.py
   ```
# interview-ai-
