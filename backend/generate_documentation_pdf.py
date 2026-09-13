"""
Generate a professional, publication-ready PDF of the complete InterviewAI Project Documentation.
Output: /Users/sukdebsahu/Documents/AI Project/InterviewAI_Project_Documentation.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

OUTPUT_PATH = "/Users/sukdebsahu/Documents/AI Project/InterviewAI_Project_Documentation.pdf"


class NumberedCanvas(canvas.Canvas):
    """Adds running header and footer with total page count."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress running header/footer on title page

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header
        self.drawString(36, 756, "InterviewAI — Project Documentation & Technical Specification")
        self.drawRightString(576, 756, "Version 3.0.0")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)

        # Footer
        self.line(36, 42, 576, 42)
        self.drawString(36, 30, "Confidential & Proprietary — For Academic & Evaluation Purposes")
        self.drawRightString(576, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    PRIMARY = colors.HexColor("#7C3AED")      # Royal Purple
    SECONDARY = colors.HexColor("#0F172A")    # Deep Midnight
    TEXT_MUTED = colors.HexColor("#475569")   # Slate
    BG_CARD = colors.HexColor("#F8FAFC")      # Light Slate Tint
    BORDER_COLOR = colors.HexColor("#CBD5E1") # Grey Border
    ACCENT_GREEN = colors.HexColor("#16A34A")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=TEXT_MUTED,
        spaceAfter=14,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=SECONDARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=12,
        spaceAfter=3,
    )

    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8,
    )

    q_style = ParagraphStyle(
        'QStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=SECONDARY,
        spaceBefore=6,
        spaceAfter=2,
    )

    ans_style = ParagraphStyle(
        'AnsStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_MUTED,
        leftIndent=10,
        spaceAfter=6,
    )

    story = []

    # ── COVER / HEADER BANNER ──────────────────────────────────────────────────
    banner_data = [
        [
            Paragraph("<b>InterviewAI — Technical Documentation</b>", title_style),
        ],
        [
            Paragraph("<b>Domain:</b> Artificial Intelligence • Natural Language Processing • Full-Stack Web Systems<br/>"
                      "<b>Author:</b> Sumit Kumar Sahoo & Team &nbsp;|&nbsp; <b>Version:</b> 3.0.0 &nbsp;|&nbsp; <b>Date:</b> September 2026", subtitle_style)
        ]
    ]
    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F5F3FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#DDD6FE")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # ── 1. EXECUTIVE SUMMARY ───────────────────────────────────────────────────
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    story.append(Paragraph(
        "<b>InterviewAI</b> is an end-to-end, multi-modal automated mock interview platform engineered to prepare "
        "college students and freshers for competitive technical and behavioral interviews. Standard conversational "
        "chatbots provide static, generic Q&A without tracking candidate projects, speech characteristics, or body language. "
        "<b>InterviewAI</b> transforms this experience by establishing a stateful, resume-driven conversational engine.",
        body_style
    ))

    # Problem vs Solution Table
    pv_data = [
        [Paragraph("<b>Traditional Interview Bots</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#991B1B"))),
         Paragraph("<b>InterviewAI Platform</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold', textColor=ACCENT_GREEN))],
        [Paragraph("• Asks generic icebreakers ('Tell me about yourself').<br/>"
                   "• Cannot cross-examine or ask relevant follow-ups.<br/>"
                   "• No body language, emotion, or vocal diagnostics.<br/>"
                   "• Static pre-determined question lists.<br/>"
                   "• High commercial fees, inaccessible to students.", body_style),
         Paragraph("• Directly opens with candidate's top resume project.<br/>"
                   "• Analyzes spoken answers & formulates direct counter-questions.<br/>"
                   "• Evaluates eye contact, facial emotions, speed (WPM) & fillers.<br/>"
                   "• Real-time full-duplex WebSocket conversational state.<br/>"
                   "• 100% free, self-hostable, and student-accessible.", body_style)]
    ]
    pv_table = Table(pv_data, colWidths=[265, 275])
    pv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#FEF2F2")),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(pv_table)
    story.append(Spacer(1, 12))

    # ── 2. TECHNICAL STACK ─────────────────────────────────────────────────────
    story.append(Paragraph("2. Complete Technology Stack", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    stack_data = [
        [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technologies & Libraries</b>", body_style), Paragraph("<b>Key Responsibilities</b>", body_style)],
        [Paragraph("<b>Frontend</b>", body_style), Paragraph("React 18, Vite 8, Tailwind CSS v4, Recharts, Lucide React", body_style), Paragraph("Modern reactive SPA, camera feeds, dynamic charts, audio controls.", body_style)],
        [Paragraph("<b>Client Audio</b>", body_style), Paragraph("Web Audio API (Float32 PCM → 16kHz WAV), Web Speech API", body_style), Paragraph("Lossless in-browser WAV encoding, Brave shield fallback, live preview.", body_style)],
        [Paragraph("<b>Backend</b>", body_style), Paragraph("Python 3.13, FastAPI, Uvicorn (ASGI), Pydantic v2, Motor", body_style), Paragraph("High-concurrency async REST & native WebSocket endpoints.", body_style)],
        [Paragraph("<b>AI / LLM</b>", body_style), Paragraph("Qwen/Qwen3-8B & Qwen3-4B (HF Router), Ollama Qwen2.5:7b", body_style), Paragraph("Stateful answer analysis, counter-question generator, mentorship.", body_style)],
        [Paragraph("<b>Speech ASR</b>", body_style), Paragraph("OpenAI Whisper-large-v3-turbo (HuggingFace Inference)", body_style), Paragraph("High-accuracy speech-to-text audio transcription.", body_style)],
        [Paragraph("<b>Audio Metrics</b>", body_style), Paragraph("Soundfile + NumPy Vectorized Energy Thresholding", body_style), Paragraph("Ultra-fast voice duration, WPM speed, pauses, and filler estimation.", body_style)],
        [Paragraph("<b>Computer Vision</b>", body_style), Paragraph("HTML5 Canvas Gaze Centering + DeepFace / OpenCV-Headless", body_style), Paragraph("Real-time eye contact tracking and emotional probability breakdown.", body_style)],
        [Paragraph("<b>Database</b>", body_style), Paragraph("MongoDB Community Server (Collections: users, resumes, interviews)", body_style), Paragraph("Document-oriented persistence with structured resume context caching.", body_style)],
        [Paragraph("<b>Export Engine</b>", body_style), Paragraph("ReportLab PDF Toolkit", body_style), Paragraph("Dynamic compilation of performance certificates and scorecards.", body_style)],
    ]
    stack_table = Table(stack_data, colWidths=[80, 230, 230])
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDE9FE")),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(stack_table)
    story.append(Spacer(1, 14))

    # ── 3. ARCHITECTURE & WORKFLOW ─────────────────────────────────────────────
    story.append(Paragraph("3. System Architecture & Flow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    arch_ascii = (
        "USER BROWSER (React + Vite + Web Audio API 16kHz WAV Encoder)\n"
        "   │\n"
        "   ├── Native WebSocket (ws://localhost:8000/ws/interview/{session_id})\n"
        "   └── REST Endpoints (/api/interviews, /api/resume, /api/auth, /api/reports)\n"
        "        │\n"
        "        ▼\n"
        "FASTAPI ASYNC BACKEND (:8000)\n"
        "   ├── Dynamic Interview Engine (Qwen3-8B / Ollama Qwen2.5:7b)\n"
        "   ├── Whisper Speech-to-Text (HF Inference Router API)\n"
        "   ├── Voice Analytics Engine (Soundfile + NumPy Vectorized Energy — 0.02s)\n"
        "   ├── Computer Vision Service (OpenCV + DeepFace Expressions)\n"
        "   ├── ATS Resume Parser & Context Extractor (pypdf/docx)\n"
        "   ├── PDF Exporter (ReportLab Document Generator)\n"
        "   └── MongoDB Database (:27017) [Users, Resumes, Interviews Collections]"
    )
    story.append(Paragraph(arch_ascii.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>End-to-End Conversational Lifecycle:</b>", h2_style))
    story.append(Paragraph("<b>Step 1: Resume Context Ingestion</b> — Candidate uploads PDF/DOCX. Parser extracts structured JSON containing candidate name, skills categorized into languages/frameworks/tools, and specific projects with descriptions.", bullet_style))
    story.append(Paragraph("<b>Step 2: Resume-Driven Opening</b> — System launches WebSocket session. Opening question directly probes the candidate's top project rather than asking generic background questions.", bullet_style))
    story.append(Paragraph("<b>Step 3: Client 16kHz WAV Recording</b> — While candidate speaks, Web Audio API decodes Float32 audio and formats a clean 16kHz 16-bit Mono WAV. Eliminates WebM/Opus incompatibilities.", bullet_style))
    story.append(Paragraph("<b>Step 4: Real-Time Answer Analysis & Counter-Questioning</b> — Backend transcribes audio via Whisper, detects mentioned technical concepts, identifies missing trade-offs, and generates a student-friendly counter-question.", bullet_style))
    story.append(Paragraph("<b>Step 5: Diagnostic Scoring & PDF Export</b> — Final session computes weighted scores across 5 dimensions, renders interactive radar charts, and generates a downloadable PDF certificate.", bullet_style))

    story.append(PageBreak())

    # ── 4. DETAILED MODULE BREAKDOWN ──────────────────────────────────────────
    story.append(Paragraph("4. Detailed Module Breakdown", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    story.append(Paragraph("Module 1: Resume Processing & ATS Scoring Engine", h2_style))
    story.append(Paragraph(
        "Files: <code>resume_parser.py</code>, <code>ats_scorer.py</code>, <code>resume.py</code><br/>"
        "• <b>Structured Context Extraction:</b> Uses pattern matching and NLP to extract clean entity objects: "
        "<code>candidate_name</code>, <code>skills</code> (languages, frameworks, databases, tools), <code>projects</code> "
        "(title, tech stack, descriptions), and <code>education</code>.<br/>"
        "• <b>ATS Scoring Formula:</b> Evaluates 3 weighted criteria: (1) Technical keyword match against selected job role; "
        "(2) Section completeness (Projects, Skills, Experience, Education); (3) Formatting hygiene and keyword density. "
        "Outputs score (0-100), matched keywords, missing keyword checklist, and optimization recommendations.",
        body_style
    ))

    story.append(Paragraph("Module 2: Real Dynamic Conversational AI Engine", h2_style))
    story.append(Paragraph(
        "Files: <code>interview_engine.py</code>, <code>prompt_templates.py</code>, <code>interview_ws.py</code><br/>"
        "• <b>Adaptive State Machine:</b> Tracks active topic, consecutive turns per topic, difficulty, and conversation history.<br/>"
        "• <b>Counter-Questioning Algorithm:</b> Reads candidate's actual answer text. If the answer is strong, acknowledges it "
        "and asks a practical feature/testing counter-question. If the answer is vague or says 'I don't know', warmly pivots to a "
        "simpler foundational angle.<br/>"
        "• <b>Fresher / Student-Friendly Governance:</b> Strictly forbids high-level enterprise architecture or 10x scalability "
        "bottlenecks, focusing on practical college-level implementation and debugging.",
        body_style
    ))

    story.append(Paragraph("Module 3: Speech Transcription & Ultra-Fast Voice Analytics", h2_style))
    story.append(Paragraph(
        "Files: <code>speech_service.py</code>, <code>audio_service.py</code>, <code>InterviewRoom.jsx</code><br/>"
        "• <b>In-Browser WAV Encoding:</b> JavaScript <code>audioBufferToWav()</code> converts recorded audio into RIFF WAVE (16kHz 16-bit Mono). "
        "Ensures 100% compatibility with Whisper and Soundfile across Chrome, Edge, and Brave.<br/>"
        "• <b>Vectorized Voice Analytics:</b> Replaced slow Librosa Fourier piptrack with Soundfile + NumPy energy thresholding, "
        "bringing execution time from <b>172 seconds down to 0.02 seconds</b>. Computes duration, speaking speed (WPM), hesitation pause duration, "
        "filler word counts, and pitch variance.",
        body_style
    ))

    story.append(Paragraph("Module 4: Computer Vision & Body Language Tracking", h2_style))
    story.append(Paragraph(
        "Files: <code>cv_service.py</code>, <code>CameraPanel.jsx</code>, <code>interview.py</code><br/>"
        "• <b>Eye Contact Monitoring:</b> HTML5 Canvas calculates face centering in bounding box every animation frame.<br/>"
        "• <b>Facial Emotion Analysis:</b> Transmits frame snapshots periodically to DeepFace for emotion probability breakdown "
        "(Neutral, Happy, Confident, Stressed).",
        body_style
    ))

    story.append(Spacer(1, 10))

    # ── 5. DATABASE SCHEMA & DATA MODELS ──────────────────────────────────────
    story.append(Paragraph("5. Database Schema & Data Models (MongoDB)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    db_schema_text = (
        "1. users Collection:\n"
        "   { _id: ObjectId, email: String, first_name: String, last_name: String,\n"
        "     hashed_password: String, created_at: ISODate }\n\n"
        "2. resumes Collection:\n"
        "   { _id: ObjectId, user_id: ObjectId, filename: String, parsed_text: String,\n"
        "     skills: [String], experience: [String], education: [String],\n"
        "     resume_context: { candidate_name: String, skills: Object, projects: [Object] },\n"
        "     ats_score: Number, ats_matched_keywords: [String], ats_missing_keywords: [String],\n"
        "     uploaded_at: ISODate }\n\n"
        "3. interviews Collection:\n"
        "   { _id: ObjectId, user_id: ObjectId, role: String, experience_level: String,\n"
        "     interview_type: String, status: 'active'|'completed', overall_score: Number,\n"
        "     duration_seconds: Number, scores_breakdown: Object, feedback: Object,\n"
        "     questions: [\n"
        "       { id: Number, question_text: String, answer_text: String, audio_path: String,\n"
        "         eye_contact_score: Number, emotion_summary: Object, voice_metrics: Object,\n"
        "         evaluation: { score: Number, correctness: String, feedback: String } }\n"
        "     ], created_at: ISODate, completed_at: ISODate }"
    )
    story.append(Paragraph(db_schema_text.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(PageBreak())

    # ── 6. COMPLETE API SPECIFICATION ──────────────────────────────────────────
    story.append(Paragraph("6. Complete API Specification (REST & WebSocket)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    api_data = [
        [Paragraph("<b>Endpoint</b>", body_style), Paragraph("<b>Method</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [Paragraph("/api/auth/register", code_style), Paragraph("POST", body_style), Paragraph("Create candidate profile and hash password.", body_style)],
        [Paragraph("/api/auth/login", code_style), Paragraph("POST", body_style), Paragraph("Authenticate credentials and return JWT bearer token.", body_style)],
        [Paragraph("/api/auth/me", code_style), Paragraph("GET", body_style), Paragraph("Fetch current authenticated user profile.", body_style)],
        [Paragraph("/api/resume/upload", code_style), Paragraph("POST", body_style), Paragraph("Upload PDF/DOCX resume, parse context, calculate ATS score.", body_style)],
        [Paragraph("/api/resume", code_style), Paragraph("GET", body_style), Paragraph("Retrieve candidate's active resume and ATS metadata.", body_style)],
        [Paragraph("/api/resume", code_style), Paragraph("DELETE", body_style), Paragraph("Permanently remove candidate resume from MongoDB.", body_style)],
        [Paragraph("/api/interviews", code_style), Paragraph("POST", body_style), Paragraph("Initialize interview session with resume opening question.", body_style)],
        [Paragraph("/api/interviews", code_style), Paragraph("GET", body_style), Paragraph("List all previous interview sessions for user.", body_style)],
        [Paragraph("/api/interviews/{id}", code_style), Paragraph("GET", body_style), Paragraph("Fetch detailed session state, questions, and scores.", body_style)],
        [Paragraph("/api/interviews/{id}", code_style), Paragraph("DELETE", body_style), Paragraph("Delete an interview session from history.", body_style)],
        [Paragraph("/api/interviews/{id}/answer", code_style), Paragraph("POST", body_style), Paragraph("Submit audio WAV/text answer and receive counter-question.", body_style)],
        [Paragraph("/api/interviews/{id}/complete", code_style), Paragraph("POST", body_style), Paragraph("Complete session and calculate weighted scores.", body_style)],
        [Paragraph("/api/reports/{id}/pdf", code_style), Paragraph("GET", body_style), Paragraph("Stream downloadable PDF evaluation certificate.", body_style)],
        [Paragraph("/ws/interview/{session_id}", code_style), Paragraph("WS", body_style), Paragraph("Native full-duplex live interview WebSocket stream.", body_style)],
    ]
    api_table = Table(api_data, colWidths=[160, 55, 325])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDE9FE")),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 14))

    # ── 7. VIVA & DEFENSE TECHNICAL Q&A ────────────────────────────────────────
    story.append(Paragraph("7. Project Viva & Defense Technical Q&A", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    qas = [
        ("Q1: How is your project different from a regular ChatGPT wrapper?",
         "Standard chatbots lack stateful conversation management, resume entity extraction, and multi-modal perception. "
         "InterviewAI extracts structured projects from resumes, monitors conversational topic turns, analyzes vocal metrics "
         "(WPM, pauses, filler words), tracks eye contact via HTML5 Canvas, evaluates facial emotions via DeepFace, and asks "
         "adaptive counter-questions based strictly on what candidate just answered."),
        ("Q2: Why did you choose WebSocket over REST for the interview room?",
         "Mock interviews require instantaneous, bi-directional communication. WebSocket avoids the latency of HTTP connection "
         "handshakes on every turn, enables instant 'thinking' indicators, synchronizes Text-to-Speech audio playback, and delivers "
         "counter-questions with zero polling delay."),
        ("Q3: How did you solve the browser audio format issue with Whisper?",
         "Browsers record audio in WebM/Opus by default, which libsndfile on Hugging Face inference rejects with a 400 format error. "
         "We implemented an in-browser Web Audio API PCM decoder that converts recorded audio into standard 16kHz 16-bit Mono WAV "
         "before sending it to the server. This guarantees 100% transcription accuracy across Chrome, Edge, and Brave."),
        ("Q4: How did you optimize the backend from hanging during voice analysis?",
         "Previously, Librosa's Fourier piptrack algorithm executed nested CPU calculations synchronously in the event loop, "
         "pegging CPU at 88% and freezing the server for over 170 seconds. We replaced it with vectorized Soundfile and NumPy energy "
         "thresholding, reducing voice metric computation from 170+ seconds down to 0.02 seconds with zero event loop blocking."),
        ("Q5: How does your ATS scoring algorithm work?",
         "The ATS engine parses resume text into clean tokens and evaluates three criteria: (1) Keyword match percentage against "
         "essential tech stack skills for the selected role; (2) Structural completeness checking for dedicated Education, Experience, "
         "Skills, and Projects sections; and (3) Formatting hygiene and keyword density, generating a composite score from 0 to 100."),
    ]

    for q, a in qas:
        story.append(Paragraph(f"<b>{q}</b>", q_style))
        story.append(Paragraph(f"<b>Defense Answer:</b> {a}", ans_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully at: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
