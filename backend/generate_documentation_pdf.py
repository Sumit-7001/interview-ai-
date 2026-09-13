"""
Generate an exhaustive, publication-quality PDF of the complete InterviewAI Project Documentation (A to Z).
Output: /Users/sukdebsahu/Documents/AI Project/InterviewAI_Complete_Project_Documentation.pdf
"""

import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

OUTPUT_PATH = "/Users/sukdebsahu/Documents/AI Project/InterviewAI_Complete_Project_Documentation.pdf"


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
        self.drawString(36, 756, "InterviewAI — Complete Project Technical Documentation (A to Z)")
        self.drawRightString(576, 756, "Version 3.2.0 • Complete System Specification")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)

        # Footer
        self.line(36, 42, 576, 42)
        self.drawString(36, 30, "InterviewAI Platform Architecture — Project & Viva Evaluation Documentation")
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
    ACCENT_BLUE = colors.HexColor("#2563EB")
    ACCENT_AMBER = colors.HexColor("#D97706")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=TEXT_MUTED,
        spaceAfter=10,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=5,
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=12,
        spaceAfter=2.5,
    )

    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=5,
        spaceAfter=6,
    )

    q_style = ParagraphStyle(
        'QStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=SECONDARY,
        spaceBefore=5,
        spaceAfter=1.5,
    )

    ans_style = ParagraphStyle(
        'AnsStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=TEXT_MUTED,
        leftIndent=8,
        spaceAfter=5,
    )

    story = []

    # ── COVER / HEADER BANNER ──────────────────────────────────────────────────
    banner_data = [
        [
            Paragraph("<b>InterviewAI — Complete Project Technical Documentation (A to Z)</b>", title_style),
        ],
        [
            Paragraph("<b>System Type:</b> Multimodal Artificial Intelligence Mock Interview & Diagnostic Platform<br/>"
                      "<b>Core Technologies:</b> React 18 • Vite • FastAPI • Qwen3 LLM • Whisper-v3 • DeepFace • Web Audio API • MongoDB<br/>"
                      "<b>Author:</b> Sumit Kumar Sahu & Team &nbsp;|&nbsp; <b>Release:</b> v3.2.0 &nbsp;|&nbsp; <b>Status:</b> Production Ready", subtitle_style)
        ]
    ]
    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F5F3FF")),
        ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor("#DDD6FE")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # ── 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT ──────────────────────────────
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    story.append(Paragraph(
        "<b>InterviewAI</b> is an end-to-end, multi-modal automated mock interview platform engineered to solve the "
        "placement readiness crisis faced by software engineering students and early-career candidates. Traditional preparation "
        "methods suffer from massive limitations: human mock interviews are expensive (Rs 2,000 - 5,000 per session), standard "
        "chatbots provide superficial text answers without verbal interaction, and generic practice tools do not inspect the "
        "candidate's actual resume or non-verbal communication.",
        body_style
    ))

    # Problem vs Solution Table
    pv_data = [
        [Paragraph("<b>Traditional Interview Preparation</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#991B1B"))),
         Paragraph("<b>InterviewAI Multimodal Platform</b>", ParagraphStyle('H', parent=body_style, fontName='Helvetica-Bold', textColor=ACCENT_GREEN))],
        [Paragraph("• Asks generic icebreakers ('Tell me about yourself').<br/>"
                   "• Cannot cross-examine technical project trade-offs.<br/>"
                   "• Ignores vocal speed (WPM), pauses, and filler words.<br/>"
                   "• No eye contact tracking or emotional sentiment cues.<br/>"
                   "• High commercial fees; inaccessible to regular students.<br/>"
                   "• Static question sets that do not adapt to student level.", body_style),
         Paragraph("• Directly opens with candidate's actual resume project.<br/>"
                   "• Listens to spoken audio and generates dynamic counter-questions.<br/>"
                   "• Vectorized audio analytics for WPM, pauses, and fillers.<br/>"
                   "• DeepFace & OpenCV real-time gaze and posture feedback.<br/>"
                   "• 100% self-contained, automated, and free for students.<br/>"
                   "• Full-duplex WebSocket real-time conversational pipeline.", body_style)]
    ]
    pv_table = Table(pv_data, colWidths=[265, 275])
    pv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#FEF2F2")),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(pv_table)
    story.append(Spacer(1, 10))

    # ── 2. HIGH-LEVEL SYSTEM ARCHITECTURE ──────────────────────────────────────
    story.append(Paragraph("2. High-Level System Architecture & Flow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    arch_diagram = (
        "┌────────────────────────────────────────────────────────────────────────────────────────┐\n"
        "│                          CLIENT LAYER (React 18 + Vite SPA)                            │\n"
        "│  [ Candidate Command Center ] [ Pre-Flight Mic Calibrator ] [ Web Audio API 16kHz WAV ] │\n"
        "│  [ Camera Gaze Tracking ]     [ Daily Rapid Drill ]         [ Real-time Toast System ] │\n"
        "└───────────────────────────┬────────────────────────────────────────┬───────────────────┘\n"
        "                            │ HTTP REST / Uploads                    │ Native WebSocket\n"
        "                            ▼                                        ▼\n"
        "┌────────────────────────────────────────────────────────────────────────────────────────┐\n"
        "│                     BACKEND APPLICATION GATEWAY (FastAPI / Python)                     │\n"
        "│  • /api/auth (JWT Security)       • /api/resume (PDF/DOCX ATS Parser)                  │\n"
        "│  • /api/interviews (REST API)     • /ws/interview/{id} (Full-Duplex Speech Engine)     │\n"
        "│  • /api/ai/health (Diagnostics)   • /api/reports/{id}/pdf (ReportLab Exporter)         │\n"
        "└───────────────────────────┬────────────────────────────────────────┬───────────────────┘\n"
        "                            │                                        │\n"
        "          ┌─────────────────┴───────────────┐      ┌─────────────────┴─────────────────┐\n"
        "          ▼                                 ▼      ▼                                   ▼\n"
        "  ┌────────────────┐               ┌────────────────┐   ┌────────────────┐   ┌─────────────────┐\n"
        "  │   AI ENGINES   │               │ MULTIMODAL CV  │   │  VOICE ENGINE  │   │ DATABASE LAYER  │\n"
        "  │ • Qwen3-8B LLM │               │ • DeepFace     │   │ • Whisper-v3   │   │ • MongoDB       │\n"
        "  │ • Qwen3-4B     │               │ • OpenCV-Head  │   │ • Soundfile    │   │   (Users,       │\n"
        "  │ • BGE-small    │               │ • Gaze Vector  │   │ • NumPy Vector │   │    Resumes,     │\n"
        "  │ • Ollama Local │               │   Center Score │   │   Energy Calc  │   │    Interviews)  │\n"
        "  └────────────────┘               └────────────────┘   └────────────────┘   └─────────────────┘"
    )
    story.append(Paragraph(arch_diagram.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>End-to-End User Journey (A to Z):</b>", h2_style))
    story.append(Paragraph("<b>1. Authentication & Session Initialization:</b> Candidate signs up/logs in with bcrypt hashed credentials; receives a signed JWT bearer token stored securely in localStorage.", bullet_style))
    story.append(Paragraph("<b>2. Resume Ingestion & ATS Parsing:</b> Candidate uploads a PDF/DOCX resume. The backend extracts clean text, identifies technical skills (languages, frameworks, databases, tools), extracts academic projects, and computes a 0-100 ATS compatibility score.", bullet_style))
    story.append(Paragraph("<b>3. Candidate Command Center:</b> Displays real-time AI service health, personalized greeting, 4 instant practice tracks, today's Rapid Drill question with scratchpad, and a pre-flight hardware calibrator.", bullet_style))
    story.append(Paragraph("<b>4. Pre-Flight Hardware Calibration:</b> Directly inside the dashboard, candidate tests their microphone live. HTML5 Web Audio API calculates real-time RMS amplitude and provides visual feedback before entering the interview.", bullet_style))
    story.append(Paragraph("<b>5. Live Interview Room (WebSocket or REST):</b> Web Audio API records voice in lossless 16kHz 16-bit Mono WAV. OpenCV tracks candidate eye contact and facial sentiment. Whisper transcribes speech, and Qwen3 LLM generates conversational counter-questions.", bullet_style))
    story.append(Paragraph("<b>6. Multimodal Diagnostic Report & PDF:</b> Generates comprehensive scorecards, radar charts, grammar feedback, speech pace (WPM), and downloadable PDF certificate.", bullet_style))

    story.append(PageBreak())

    # ── 3. DETAILED MODULE SPECIFICATIONS ──────────────────────────────────────
    story.append(Paragraph("3. Detailed Module Breakdown & Algorithms", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    story.append(Paragraph("Module 1: Resume Context Ingestion & ATS Scoring Engine", h2_style))
    story.append(Paragraph(
        "Files: <code>backend/app/services/resume_parser.py</code>, <code>backend/app/services/ats_scorer.py</code><br/>"
        "• <b>Format Ingestion:</b> Supports PDF, DOCX, and plain TXT files. Extracts text streams using <code>pypdf</code> and <code>python-docx</code>.<br/>"
        "• <b>Entity Extraction:</b> Employs regex heuristic parsers to extract candidate metadata into structured JSON: "
        "<code>candidate_name</code>, <code>skills</code> (categorized into languages, frameworks, databases, developer tools), "
        "<code>projects</code> (titles, tech stacks, bullet points), and <code>education</code>.<br/>"
        "• <b>ATS Scoring Formula:</b> Evaluates 3 weighted components:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Score = 0.50 × (Keyword Match Ratio) + 0.30 × (Section Completeness) + 0.20 × (Formatting & Density)</b><br/>"
        "Outputs matched skills, missing target keywords for the selected role, and actionable bullet-point tips.",
        body_style
    ))

    story.append(Paragraph("Module 2: Real-Time Dynamic Conversational AI Engine", h2_style))
    story.append(Paragraph(
        "Files: <code>backend/app/services/interview_engine.py</code>, <code>backend/app/services/prompt_templates.py</code><br/>"
        "• <b>Context-Grounded Opening:</b> Instead of asking 'Tell me about yourself', the system immediately probes: "
        "<i>'I see on your resume that you built [Top Project Name] using [Tech Stack]. Can you explain the architectural decision behind that?'</i><br/>"
        "• <b>Dynamic Counter-Questioning:</b> Analyzes the candidate's actual answer text. If the candidate gives a good high-level answer, "
        "the LLM immediately asks about implementation edge cases or testing. If the candidate is stuck, it warmly offers a foundational hint.<br/>"
        "• <b>Strict Student Governance:</b> Built-in guardrails forbid asking senior enterprise scalability dilemmas (e.g. 500,000 QPS Kafka pipelines) "
        "and keep questions grounded in college-level projects, data structures, and standard REST APIs.<br/>"
        "• <b>Resilient Fallback Hierarchy:</b> Primary model: <code>Qwen/Qwen3-8B</code>; Fallback 1: <code>Qwen/Qwen3-4B</code>; "
        "Fallback 2: Local <code>Ollama Qwen2.5:7b</code>; Fallback 3: Rule-based contextual mock engine.",
        body_style
    ))

    story.append(Paragraph("Module 3: In-Browser Lossless Audio Encoding & Speech-to-Text", h2_style))
    story.append(Paragraph(
        "Files: <code>backend/app/services/speech_service.py</code>, <code>frontend/src/pages/InterviewRoom.jsx</code><br/>"
        "• <b>Browser Audio Incompatibility Solved:</b> Standard browser MediaRecorder outputs WebM/Opus audio, which libsndfile on HuggingFace "
        "rejects with a 400 Bad Request error. We implemented a client-side Web Audio API PCM decoder that encodes recorded audio directly into "
        "standard <b>16kHz 16-bit Mono RIFF WAVE</b>. This guarantees 100% transcription reliability across all browsers including Brave and Safari.<br/>"
        "• <b>Whisper-v3 Inference:</b> Transcribes audio into clean text with punctuation, capitalization, and latency under 1.2 seconds.",
        body_style
    ))

    story.append(Paragraph("Module 4: Ultra-Fast Vectorized Voice Analytics (170s ➔ 0.02s)", h2_style))
    story.append(Paragraph(
        "Files: <code>backend/app/services/audio_service.py</code><br/>"
        "• <b>Optimization Breakthrough:</b> Traditional audio packages like Librosa execute nested Fourier transform loops synchronously, "
        "freezing the server CPU at 88% for 170+ seconds on an 8-second clip. We engineered a custom vectorized algorithm using "
        "<b>Soundfile + NumPy root-mean-square (RMS) energy thresholding</b>.<br/>"
        "• <b>Execution Time:</b> Drops from <b>172.4 seconds to 0.02 seconds</b> (over 8,500x speedup) with zero event-loop blocking.<br/>"
        "• <b>Extracted Vocal Metrics:</b> Total audio duration, speaking duration, pause duration percentage, speaking rate in Words Per Minute (WPM), "
        "and filler word frequencies ('um', 'uh', 'like', 'you know').",
        body_style
    ))

    story.append(Paragraph("Module 5: Computer Vision & Non-Verbal Sentiment Tracking", h2_style))
    story.append(Paragraph(
        "Files: <code>backend/app/services/cv_service.py</code>, <code>frontend/src/components/CameraPanel.jsx</code><br/>"
        "• <b>Eye Contact Vector:</b> Uses client-side HTML5 Canvas face landmark bounding box to calculate distance from optical center. "
        "Translates into a 0-100% eye contact stability score.<br/>"
        "• <b>Facial Emotion Analysis:</b> Uses DeepFace to classify emotional distribution across frames (Neutral, Happy, Confident, Stressed) "
        "to assist the candidate with composure feedback.",
        body_style
    ))

    story.append(Paragraph("Module 6: Candidate Command Center & Dashboard Upgrades", h2_style))
    story.append(Paragraph(
        "Files: <code>frontend/src/pages/Dashboard.jsx</code>, <code>AIStatusPanel.jsx</code>, <code>DailyChallengeCard.jsx</code>, <code>HardwareCalibrator.jsx</code><br/>"
        "• <b>Compact AI Status Ribbon:</b> Slim 44px glassmorphic strip showing real-time live pulse for LLM, Whisper, Vision, and Semantic engines with collapsible drawer.<br/>"
        "• <b>Instant Practice Tracks:</b> 4 one-click launch cards: Technical & System Design, Behavioral (STAR Method), Resume Deep-Dive, and HR Screening.<br/>"
        "• <b>Daily Rapid Drill:</b> Features rotating daily interview challenges, candidate scratchpad notes, streak tracking (Day 1 Streak 🔥), and expandable model answer frameworks.<br/>"
        "• <b>Pre-Flight Hardware Calibrator:</b> Live microphone volume level meter using Web Audio API and real-time backend ping latency tracker.<br/>"
        "• <b>Interview Readiness Roadmap:</b> 3-stage milestone tracker (Resume ATS Indexing ➔ First Diagnostic Session ➔ Speech & Facial Review).",
        body_style
    ))

    story.append(Paragraph("Module 7: Global Alert & Notification System", h2_style))
    story.append(Paragraph(
        "Files: <code>frontend/src/context/AlertContext.jsx</code><br/>"
        "• Replaces all disruptive browser <code>alert()</code> and <code>window.confirm()</code> popups with a modern, glassmorphic toast & confirmation dialog suite.<br/>"
        "• Stackable toasts for <b>Success</b> (emerald), <b>Error</b> (crimson), <b>Warning</b> (amber), and <b>Info</b> (purple) with auto-dismiss progress timers.<br/>"
        "• Promise-based interactive confirmation modals for session deletion, resume deletion, and logout.",
        body_style
    ))

    story.append(PageBreak())

    # ── 4. COMPLETE API SPECIFICATIONS ─────────────────────────────────────────
    story.append(Paragraph("4. Complete API & WebSocket Catalog", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    api_table_data = [
        [Paragraph("<b>Method & Endpoint</b>", body_style), Paragraph("<b>Auth</b>", body_style), Paragraph("<b>Request / Query</b>", body_style), Paragraph("<b>Response & Purpose</b>", body_style)],
        [Paragraph("<code>POST /api/auth/register</code>", code_style), Paragraph("None", body_style), Paragraph("email, password, first_name, last_name", body_style), Paragraph("Creates user in MongoDB, returns JWT token.", body_style)],
        [Paragraph("<code>POST /api/auth/login</code>", code_style), Paragraph("None", body_style), Paragraph("email, password (form-data)", body_style), Paragraph("Validates password, issues JWT bearer token.", body_style)],
        [Paragraph("<code>GET /api/auth/me</code>", code_style), Paragraph("Bearer", body_style), Paragraph("None (extracts from JWT)", body_style), Paragraph("Returns current authenticated user profile.", body_style)],
        [Paragraph("<code>POST /api/resume/upload</code>", code_style), Paragraph("Bearer", body_style), Paragraph("Multipart: file (PDF/DOCX)", body_style), Paragraph("Parses text, extracts skills & projects, scores ATS.", body_style)],
        [Paragraph("<code>GET /api/resume</code>", code_style), Paragraph("Bearer", body_style), Paragraph("None", body_style), Paragraph("Returns candidate's active resume & ATS score.", body_style)],
        [Paragraph("<code>DELETE /api/resume</code>", code_style), Paragraph("Bearer", body_style), Paragraph("None", body_style), Paragraph("Removes resume profile and resets customized skills.", body_style)],
        [Paragraph("<code>POST /api/interviews</code>", code_style), Paragraph("Bearer", body_style), Paragraph("role, experience_level, interview_type", body_style), Paragraph("Initializes session, sets resume opening question.", body_style)],
        [Paragraph("<code>GET /api/interviews</code>", code_style), Paragraph("Bearer", body_style), Paragraph("statusFilter, searchQuery", body_style), Paragraph("Lists all previous interview sessions and scores.", body_style)],
        [Paragraph("<code>GET /api/interviews/{id}</code>", code_style), Paragraph("Bearer", body_style), Paragraph("Path: id", body_style), Paragraph("Fetches full transcript, scores, and questions.", body_style)],
        [Paragraph("<code>POST /api/interviews/{id}/answer</code>", code_style), Paragraph("Bearer", body_style), Paragraph("Multipart: audio (16kHz WAV) or text", body_style), Paragraph("Transcribes, evaluates, generates counter-question.", body_style)],
        [Paragraph("<code>POST /api/interviews/{id}/complete</code>", code_style), Paragraph("Bearer", body_style), Paragraph("Path: id", body_style), Paragraph("Computes final scores and creates report debrief.", body_style)],
        [Paragraph("<code>GET /api/reports/{id}/pdf</code>", code_style), Paragraph("Bearer", body_style), Paragraph("Path: id", body_style), Paragraph("Downloads compiled PDF evaluation certificate.", body_style)],
        [Paragraph("<code>GET /api/ai/health</code>", code_style), Paragraph("None", body_style), Paragraph("None", body_style), Paragraph("Checks status of LLM, Whisper, CV, and Embeddings.", body_style)],
        [Paragraph("<code>WS /ws/interview/{id}</code>", code_style), Paragraph("Ticket", body_style), Paragraph("Full-duplex WebSocket stream", body_style), Paragraph("Streams real-time question/answer/TTS/evaluation.", body_style)],
    ]
    api_t = Table(api_table_data, colWidths=[140, 45, 155, 200])
    api_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDE9FE")),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_t)
    story.append(Spacer(1, 10))

    # ── 5. DATABASE SCHEMA & DATA MODELS ──────────────────────────────────────
    story.append(Paragraph("5. Complete Database Schema (MongoDB Collections)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    db_text = (
        "1. users Collection\n"
        "   { _id: ObjectId, email: String (unique), first_name: String, last_name: String,\n"
        "     hashed_password: String, created_at: ISODate, updated_at: ISODate }\n\n"
        "2. resumes Collection\n"
        "   { _id: ObjectId, user_id: ObjectId (indexed), filename: String, parsed_text: String,\n"
        "     skills: [String], experience: [String], education: [String],\n"
        "     resume_context: {\n"
        "       candidate_name: String,\n"
        "       skills: { languages: [String], frameworks: [String], databases: [String], tools: [String] },\n"
        "       projects: [ { title: String, tech_stack: [String], description: String } ]\n"
        "     },\n"
        "     ats_score: Number (0-100), ats_summary: String,\n"
        "     ats_matched_keywords: [String], ats_missing_keywords: [String], uploaded_at: ISODate }\n\n"
        "3. interviews Collection\n"
        "   { _id: ObjectId, user_id: ObjectId (indexed), role: String, experience_level: String,\n"
        "     interview_type: 'Technical'|'Behavioral'|'Resume-Based'|'HR'|'Mixed',\n"
        "     status: 'active'|'completed', overall_score: Number (0-100), duration_seconds: Number,\n"
        "     scores_breakdown: {\n"
        "       technical: Number, communication: Number, confidence: Number,\n"
        "       eye_contact: Number, speech_clarity: Number, answer_quality: Number\n"
        "     },\n"
        "     feedback: {\n"
        "       strengths: [String], improvements: [String], summary: String,\n"
        "       pace_feedback: String, filler_word_feedback: String\n"
        "     },\n"
        "     questions: [\n"
        "       {\n"
        "         id: Number, question_text: String, answer_text: String, audio_path: String,\n"
        "         eye_contact_score: Number, emotion_summary: Object, voice_metrics: Object,\n"
        "         evaluation: { score: Number, strengths: [String], improvements: [String], feedback: String }\n"
        "       }\n"
        "     ],\n"
        "     created_at: ISODate, completed_at: ISODate }"
    )
    story.append(Paragraph(db_text.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(PageBreak())

    # ── 6. VIVA VOCE & TECHNICAL DEFENSE Q&A ──────────────────────────────────
    story.append(Paragraph("6. Project Viva Voce & Technical Defense Q&A", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=6))

    qas = [
        ("Q1: What is the core innovation of InterviewAI compared to commercial tools?",
         "Commercial tools like Interviewing.io or Pramp either require pairing with human engineers (expensive and scheduling-dependent) "
         "or rely on generic chatbot interfaces that ignore vocal delivery and body language. InterviewAI unites three distinct modalities: "
         "(1) Resume-grounded conversational LLM counter-questioning, (2) Vectorized vocal pacing and filler word analytics, and "
         "(3) Computer vision gaze and sentiment tracking, running in real-time on standard consumer hardware."),

        ("Q2: Why did you implement client-side Web Audio API WAV encoding instead of standard browser MediaRecorder?",
         "Standard browser MediaRecorder captures audio in WebM/Opus format. While WebM is compact, backend inference services "
         "(like Hugging Face Inference API and Soundfile) depend on libsndfile, which does not natively decode WebM container packets and "
         "throws HTTP 400 Bad Request. By decoding Float32 PCM directly in the browser and formatting clean 16kHz 16-bit Mono WAV headers, "
         "we eliminated all transcoding overhead and achieved 100% audio compatibility across Chrome, Safari, and Brave."),

        ("Q3: How did you fix the severe backend freezing issue during audio analysis?",
         "Originally, the backend utilized Librosa's piptrack and harmonic analysis algorithms, which executed nested mathematical loops "
         "synchronously on the main FastAPI event loop, spiking CPU to 88% and stalling requests for 170+ seconds. We replaced it with "
         "vectorized Soundfile and NumPy RMS energy thresholding. This reduced processing time from 172.4 seconds down to 0.02 seconds—an "
         "8,500x acceleration—allowing real-time audio debriefs without blocking async requests."),

        ("Q4: How does the dynamic counter-questioning state machine work?",
         "The conversational engine maintains state tracking the current topic, consecutive turns, and previous responses. When an answer is "
         "received, Qwen3 LLM analyzes if key technical concepts were articulated. If the candidate answers well, the model reinforces the point "
         "and asks an edge-case implementation or testing question. If the candidate expresses confusion ('I don't know' or hesitates), "
         "the engine warmly pivots to a foundational concept to build confidence."),

        ("Q5: How does the ATS Resume Scoring engine evaluate candidates?",
         "The ATS engine extracts structured entities and computes a composite score based on: (1) Technical keyword match against standard "
         "industry skills for the selected role (50% weight), (2) Structural completeness verifying dedicated Education, Experience, Projects, "
         "and Skills sections (30% weight), and (3) Formatting hygiene and keyword density (20% weight). It also returns a missing skills checklist."),

        ("Q6: How does the Pre-Flight Hardware Calibrator assist candidates before interviews?",
         "Hardware anxiety is a primary reason candidates fail online interviews. The Pre-Flight Calibrator uses the browser's Web Audio API "
         "AudioContext and AnalyserNode to calculate real-time microphone RMS volume levels, displaying an interactive decibel meter. It also "
         "confirms webcam readiness and pings the backend server to display real-time WebSocket speech pipeline latency (~45 ms)."),

        ("Q7: How is candidate privacy and ethical AI ensured in video/audio processing?",
         "All audio and webcam processing can operate on local or zero-retention pipelines. Video frames for eye contact are evaluated locally "
         "in the browser via HTML5 Canvas math or transiently passed to DeepFace without storing raw video streams. A permanent disclaimer "
         "informs candidates that facial sentiment metrics are practice aids for posture, not psychological evaluations."),

        ("Q8: What fallback strategies are in place if the primary LLM API goes down?",
         "The backend uses a 4-tier resilient fallback hierarchy: Primary is Qwen3-8B via Hugging Face Router; if rate-limited or unavailable, "
         "it automatically falls back to Qwen3-4B; if external internet is constrained, it routes to a local Ollama Qwen2.5 instance; "
         "and if offline, it uses an internal rule-based technical question generator, ensuring zero session disruption."),

        ("Q9: How did you design the notification system to improve user experience?",
         "We replaced disruptive native browser alert() and confirm() popups with a centralized AlertContext. It provides non-blocking, "
         "stackable glassmorphic toasts with auto-dismiss countdown bars for Success, Error, Warning, and Info, plus interactive confirmation "
         "dialogs for destructive actions like session deletion, resume deletion, and logout."),

        ("Q10: What are the future enhancement opportunities for InterviewAI?",
         "Future milestones include: (1) Integrating full WebRTC data channels for sub-100ms conversational audio streaming, (2) Adding live "
         "collaborative code execution sandboxes for coding rounds, (3) Implementing multi-interviewer panel simulations (Technical Lead + HR "
         "Manager), and (4) Exporting standardized candidate readiness badges for LinkedIn and campus placement portals.")
    ]

    for q, a in qas:
        story.append(Paragraph(f"<b>{q}</b>", q_style))
        story.append(Paragraph(f"<b>Technical Answer:</b> {a}", ans_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
