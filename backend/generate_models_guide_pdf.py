"""
Generate a publication-quality PDF of the InterviewAI Models & Technology Reference Guide.
Output: /Users/sukdebsahu/Documents/AI Project/InterviewAI_Models_Technology_Guide.pdf
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

OUTPUT_PATH = "/Users/sukdebsahu/Documents/AI Project/InterviewAI_Models_Technology_Guide.pdf"


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
            return  # No header/footer on title page

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header
        self.drawString(36, 756, "InterviewAI — Models & Technology Reference Guide")
        self.drawRightString(576, 756, "Version 3.0.0 • AI/ML Model Specification")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)

        # Footer
        self.line(36, 42, 576, 42)
        self.drawString(36, 30, "InterviewAI Platform — Models & Technology Documentation for Team Reference")
        self.drawRightString(576, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


# ── Color Palette ─────────────────────────────────────────────────────────────
PRIMARY = colors.HexColor("#7C3AED")      # Royal Purple
SECONDARY = colors.HexColor("#0F172A")    # Deep Midnight
TEXT_MUTED = colors.HexColor("#475569")   # Slate
TEXT_DARK = colors.HexColor("#1E293B")    # Dark Slate
BG_CARD = colors.HexColor("#F8FAFC")      # Light Slate Tint
BG_PURPLE = colors.HexColor("#F5F3FF")    # Light Purple
BORDER_COLOR = colors.HexColor("#CBD5E1") # Grey Border
BORDER_PURPLE = colors.HexColor("#DDD6FE")
ACCENT_GREEN = colors.HexColor("#16A34A")
ACCENT_BLUE = colors.HexColor("#2563EB")
ACCENT_AMBER = colors.HexColor("#D97706")
ACCENT_RED = colors.HexColor("#DC2626")
HEADER_BG = colors.HexColor("#EDE9FE")
ROW_ALT_BG = colors.HexColor("#F8FAFC")


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

    # ── Typography Styles ─────────────────────────────────────────────────────
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=24, leading=28,
        textColor=PRIMARY, spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=15,
        textColor=TEXT_MUTED, spaceAfter=10,
    )

    h1_style = ParagraphStyle(
        'SectionH1', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=SECONDARY, spaceBefore=12, spaceAfter=6, keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=11, leading=15,
        textColor=PRIMARY, spaceBefore=8, spaceAfter=4, keepWithNext=True,
    )

    h3_style = ParagraphStyle(
        'SectionH3', parent=styles['Heading3'],
        fontName='Helvetica-Bold', fontSize=9.5, leading=13,
        textColor=ACCENT_BLUE, spaceBefore=6, spaceAfter=3, keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, leading=12.5,
        textColor=TEXT_DARK, spaceAfter=5,
    )

    bullet_style = ParagraphStyle(
        'Bullet', parent=body_style,
        leftIndent=12, spaceAfter=2.5,
    )

    code_style = ParagraphStyle(
        'CodeBlock', parent=styles['Normal'],
        fontName='Courier', fontSize=7, leading=9.5,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderColor=BORDER_COLOR, borderWidth=0.5, borderPadding=5,
        spaceAfter=6,
    )

    note_style = ParagraphStyle(
        'NoteStyle', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=8, leading=11,
        textColor=ACCENT_AMBER, leftIndent=8, spaceAfter=5,
    )

    # ── Helpers ───────────────────────────────────────────────────────────────

    def make_table(headers, rows, col_widths=None):
        """Create a styled table with purple header."""
        header_paras = [Paragraph(f"<b>{h}</b>", ParagraphStyle(
            'TH', fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=colors.white
        )) for h in headers]
        data = [header_paras]
        for row in rows:
            data.append([Paragraph(str(cell), ParagraphStyle(
                'TD', fontName='Helvetica', fontSize=7.5, leading=10, textColor=TEXT_DARK
            )) for cell in row])

        if col_widths is None:
            col_widths = [540 // len(headers)] * len(headers)

        t = Table(data, colWidths=col_widths, repeatRows=1)
        style_cmds = [
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 7.5),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('TOPPADDING', (0, 0), (-1, 0), 6),
            ('GRID', (0, 0), (-1, -1), 0.4, BORDER_COLOR),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 1), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 4),
        ]
        # Alternating row colors
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(('BACKGROUND', (0, i), (-1, i), ROW_ALT_BG))
        t.setStyle(TableStyle(style_cmds))
        return t

    def prop_table(props):
        """Create a property-value table for model specs."""
        header_paras = [
            Paragraph("<b>Property</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=colors.white)),
            Paragraph("<b>Value</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=colors.white)),
        ]
        data = [header_paras]
        for k, v in props:
            data.append([
                Paragraph(f"<b>{k}</b>", ParagraphStyle('TDK', fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=SECONDARY)),
                Paragraph(str(v), ParagraphStyle('TDV', fontName='Courier' if '/' in str(v) or '.' in str(v) else 'Helvetica', fontSize=7.5, leading=10, textColor=TEXT_DARK)),
            ])
        t = Table(data, colWidths=[130, 410], repeatRows=1)
        style_cmds = [
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
            ('GRID', (0, 0), (-1, -1), 0.4, BORDER_COLOR),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#FAFAFE")),
        ]
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(('BACKGROUND', (1, i), (1, i), ROW_ALT_BG))
        t.setStyle(TableStyle(style_cmds))
        return t

    def hr():
        return HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6)

    def note(text):
        return Paragraph(f"⚠️ {text}", note_style)

    story = []

    # ══════════════════════════════════════════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════════════════════════════════════════
    banner_data = [
        [Paragraph("<b>InterviewAI — Models &amp; Technology Reference Guide</b>", title_style)],
        [Paragraph(
            "<b>Document Type:</b> AI/ML Model Specification &amp; Technology Stack Reference<br/>"
            "<b>Purpose:</b> Comprehensive guide for teammates to understand all models, libraries, and architecture<br/>"
            "<b>Models Covered:</b> Qwen3-8B • Qwen3-4B • Ollama Qwen2.5:7B • Whisper-v3-turbo • BGE Embeddings • FERPlus ONNX • OpenCV Haar Cascades<br/>"
            "<b>Author:</b> Sumit Kumar Sahoo &amp; Team &nbsp;|&nbsp; <b>Version:</b> 3.0.0 &nbsp;|&nbsp; <b>Date:</b> October 2026",
            subtitle_style
        )]
    ]
    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_PURPLE),
        ('BOX', (0, 0), (-1, -1), 1.2, BORDER_PURPLE),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 16))

    # ── TABLE OF CONTENTS ─────────────────────────────────────────────────────
    story.append(Paragraph("Table of Contents", h1_style))
    story.append(hr())
    toc_items = [
        "1. AI/ML Models at a Glance",
        "2. Model 1 — Qwen3-8B (Primary LLM)",
        "3. Model 2 — Qwen3-4B (Fallback LLM)",
        "4. Model 3 — Ollama Qwen2.5:7B (Local LLM)",
        "5. Model 4 — Whisper-large-v3-turbo (Speech-to-Text)",
        "6. Model 5 — BAAI/bge-small-en-v1.5 (Semantic Embeddings)",
        "7. Model 6 — Emotion FERPlus ONNX (Facial Emotion CNN)",
        "8. Model 7 — OpenCV Haar Cascades (Face/Eye/Smile Detection)",
        "9. LLM Provider Routing &amp; Fallback Architecture",
        "10. Backend Libraries &amp; Frameworks",
        "11. Frontend Libraries &amp; Frameworks",
        "12. Database (MongoDB)",
        "13. Environment Configuration (.env)",
        "14. System Architecture Diagram",
        "15. File-to-Model Quick Reference",
    ]
    for item in toc_items:
        story.append(Paragraph(f"• {item}", bullet_style))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 1. AI/ML MODELS AT A GLANCE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1. AI/ML Models at a Glance", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "The InterviewAI project uses <b>7 AI/ML models</b> across 4 different domains: "
        "Language Understanding (LLM), Speech Recognition (ASR), Semantic Analysis (Embeddings), "
        "and Computer Vision (Emotion &amp; Eye Contact).",
        body_style
    ))
    story.append(Spacer(1, 6))
    story.append(make_table(
        ["#", "Model", "Task", "Runs On"],
        [
            ["1", "Qwen/Qwen3-8B", "Interview questions, answer evaluation, counter-questioning", "HuggingFace Cloud API"],
            ["2", "Qwen/Qwen3-4B", "Fallback LLM (when 8B model fails)", "HuggingFace Cloud API"],
            ["3", "Ollama Qwen2.5:7B", "Local LLM (works without internet)", "Local Machine (Ollama)"],
            ["4", "openai/whisper-large-v3-turbo", "Voice → Text (Speech Recognition)", "HuggingFace Cloud API"],
            ["5", "BAAI/bge-small-en-v1.5", "Answer relevance check (Semantic Similarity)", "HuggingFace Cloud API"],
            ["6", "emotion-ferplus-8.onnx", "Facial Emotion Recognition (CNN)", "Local (ONNX via OpenCV)"],
            ["7", "OpenCV Haar Cascades", "Face, Eye, Smile Detection", "Local (OpenCV)"],
        ],
        col_widths=[25, 145, 220, 150]
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 2. MODEL 1 — QWEN3-8B
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2. Model 1 — Qwen/Qwen3-8B (Primary Large Language Model)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This is the <b>primary LLM</b> — it handles all intelligent interview operations including "
        "question generation, answer evaluation, counter-questioning, resume analysis, and feedback generation.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model ID", "Qwen/Qwen3-8B"),
        ("Provider", "HuggingFace Router API (Cloud)"),
        ("Parameters", "8 Billion"),
        ("Type", "Causal Language Model (Chat Completions)"),
        ("API Endpoint", "https://router.huggingface.co/v1/chat/completions"),
        ("Config Variable", "HF_LLM_MODEL (in .env)"),
        ("Source File", "backend/app/ai/hf_client.py"),
        ("Timeout", "120 seconds"),
        ("Temperature", "0.3 (default)"),
        ("Max Tokens", "1024 (default)"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("What This Model Does", h3_style))
    for item in [
        "<b>Resume-based Opening Question:</b> Reads candidate's resume and generates the first project-based question",
        "<b>Counter-Questions:</b> Analyzes candidate's answer and generates relevant follow-up questions",
        "<b>Answer Evaluation:</b> Scores each answer (0-100) with strengths/weaknesses analysis",
        "<b>ATS Resume Analysis:</b> Extracts skills, projects, and structured context from resume text",
        "<b>Final Feedback:</b> Generates STAR-method recommendations after interview completion",
    ]:
        story.append(Paragraph(f"• {item}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Qwen3 Special Handling", h3_style))
    story.append(note(
        "Qwen3 models include a &lt;think&gt;...&lt;/think&gt; block by default (\"thinking mode\"). "
        "We append <b>/no_think</b> to all prompts to get direct answers. The parse_json_from_llm_response() "
        "function in llm_service.py automatically strips these tags from responses."
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'if "qwen" in model.lower():<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;user_content = prompt + " /no_think"'
        '</font>',
        code_style
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 3. MODEL 2 — QWEN3-4B (FALLBACK)
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3. Model 2 — Qwen/Qwen3-4B (Fallback LLM)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This is the <b>automatic fallback LLM</b> — when the primary Qwen3-8B model fails "
        "(timeout, server down, rate limit), the system automatically retries with this smaller model.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model ID", "Qwen/Qwen3-4B"),
        ("Parameters", "4 Billion"),
        ("Config Variable", "HF_LLM_FALLBACK_MODEL (in .env)"),
        ("Source File", "backend/app/ai/llm_service.py (Line 70-95)"),
        ("Same API Endpoint", "https://router.huggingface.co/v1/chat/completions"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Fallback Flow", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'Step 1: Call Qwen3-8B (primary) → SUCCESS? Return response<br/>'
        'Step 2: Qwen3-8B FAILED → Call Qwen3-4B (fallback) → SUCCESS? Return response<br/>'
        'Step 3: Both FAILED → Return None (callers use mock/graceful degradation)'
        '</font>',
        code_style
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 4. MODEL 3 — OLLAMA QWEN2.5:7B
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph("4. Model 3 — Ollama Qwen2.5:7B (Local/Offline LLM)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This is the <b>local/offline LLM</b> — works without internet. Requires Ollama runtime "
        "installed on the developer's machine. Useful for development, testing, and environments without internet.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model ID", "qwen2.5:7b"),
        ("Provider", "Ollama (Local Runtime)"),
        ("Parameters", "7 Billion"),
        ("API Endpoint", "http://localhost:11434/api/chat"),
        ("Config Variables", "OLLAMA_MODEL, OLLAMA_BASE_URL"),
        ("Source File", "backend/app/ai/ollama_client.py"),
        ("Timeout", "120 seconds"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("How to Activate Ollama", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        '# Step 1: Install Ollama (https://ollama.ai)<br/>'
        '# Step 2: Pull the model<br/>'
        'ollama pull qwen2.5:7b<br/><br/>'
        '# Step 3: Start Ollama server<br/>'
        'ollama serve<br/><br/>'
        '# Step 4: Set in .env<br/>'
        'LLM_PROVIDER=ollama<br/>'
        'OLLAMA_BASE_URL=http://localhost:11434<br/>'
        'OLLAMA_MODEL=qwen2.5:7b'
        '</font>',
        code_style
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 5. MODEL 4 — WHISPER
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5. Model 4 — OpenAI Whisper-large-v3-turbo (Speech-to-Text)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This is the <b>Automatic Speech Recognition (ASR)</b> model — converts candidate's "
        "spoken voice into text transcription for evaluation.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model ID", "openai/whisper-large-v3-turbo"),
        ("Provider", "HuggingFace Inference API"),
        ("Type", "Automatic Speech Recognition (ASR)"),
        ("API Endpoint", "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo"),
        ("Config Variable", "HF_WHISPER_MODEL"),
        ("Source File", "backend/app/ai/speech_service.py"),
        ("Input Format", "16kHz, 16-bit, Mono WAV"),
        ("Timeout", "180 seconds"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Audio Pipeline Flow", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'Browser Microphone (MediaDevices API)<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>'
        'Web Audio API (Float32 PCM samples)<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>'
        'In-Browser WAV Encoder (16kHz, 16-bit, Mono) [InterviewRoom.jsx]<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>'
        'WebSocket → FastAPI Backend<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>'
        'HuggingFace Whisper API → Transcript Text'
        '</font>',
        code_style
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Fallback Chain", h3_style))
    story.append(Paragraph(
        "If Whisper API fails or HF_TOKEN is missing:<br/>"
        "1. <b>Browser Transcript</b> — Uses Web Speech API transcript from the browser<br/>"
        "2. <b>Smart Mock</b> — Generates contextually relevant mock answer based on question keywords",
        body_style
    ))
    story.append(note(
        "Audio Format: Browsers record WebM/Opus by default, but Whisper requires WAV. "
        "We encode 16kHz WAV in-browser using Web Audio API (in InterviewRoom.jsx) before sending to the server."
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 6. MODEL 5 — BGE EMBEDDINGS
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Model 5 — BAAI/bge-small-en-v1.5 (Semantic Embeddings)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This <b>Semantic Similarity</b> model measures how relevant a candidate's answer is "
        "to the question asked, by comparing their vector representations.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model ID", "BAAI/bge-small-en-v1.5"),
        ("Provider", "HuggingFace Inference API (Feature Extraction)"),
        ("Type", "Sentence Embedding Model"),
        ("Output Dimensions", "384-dimensional vector per text"),
        ("API Endpoint", "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5"),
        ("Config Variable", "HF_EMBEDDING_MODEL"),
        ("Source File", "backend/app/ai/embedding_service.py"),
        ("Timeout", "30 seconds"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("How It Works", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'Question Text → BGE Model → Vector [384 dims]<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↕ Cosine Similarity<br/>'
        'Answer Text  → BGE Model → Vector [384 dims]<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Relevance Score (0-100)'
        '</font>',
        code_style
    ))
    story.append(Paragraph(
        "<b>Fallback:</b> When embedding API is unavailable, Jaccard word-overlap similarity "
        "is used (score range: 30-85).",
        body_style
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 7. MODEL 6 — FERPLUS ONNX
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("7. Model 6 — Emotion FERPlus ONNX (Facial Emotion Recognition CNN)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "This <b>deep Convolutional Neural Network (CNN)</b> detects facial emotions from "
        "webcam frames in real-time. It runs locally using OpenCV's DNN module.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(prop_table([
        ("Model File", "emotion-ferplus-8.onnx (35 MB)"),
        ("Location", "backend/app/models/emotion-ferplus-8.onnx"),
        ("Type", "Convolutional Neural Network (ONNX format)"),
        ("Input", "64×64 grayscale face image"),
        ("Output", "8 emotion class probabilities"),
        ("Runtime", "OpenCV DNN module (cv2.dnn.readNetFromONNX)"),
        ("Source File", "backend/app/services/cv_service.py"),
        ("Runs", "Locally — no API call needed"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Detected Emotions (FERPlus Classes)", h3_style))
    story.append(make_table(
        ["Index", "FERPlus Class", "Our Mapping"],
        [
            ["0", "Neutral", "neutral"],
            ["1", "Happiness", "happy"],
            ["2", "Surprise", "surprise"],
            ["3", "Sadness", "sad"],
            ["4", "Anger", "angry"],
            ["5", "Disgust", "disgust (combined with contempt)"],
            ["6", "Fear", "fear"],
            ["7", "Contempt", "merged into disgust"],
        ],
        col_widths=[60, 160, 320]
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Processing Pipeline", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        '1. Detect face using Haar Cascade → crop face ROI<br/>'
        '2. Convert to grayscale<br/>'
        '3. Resize to 64×64 pixels<br/>'
        '4. Reshape to blob: (1, 1, 64, 64)<br/>'
        '5. Run ONNX CNN inference: net.setInput(blob) → net.forward()<br/>'
        '6. Apply Softmax to logits → emotion probabilities<br/>'
        '7. Reinforce with Haar Smile detector (if smile detected → boost "happy")'
        '</font>',
        code_style
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 8. MODEL 7 — HAAR CASCADES
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph("8. Model 7 — OpenCV Haar Cascades (Face/Eye/Smile Detection)", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "These are <b>pre-trained Haar feature-based cascade classifiers</b> built into OpenCV. "
        "They detect face, eyes, and smile using gradient features on grayscale images.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(make_table(
        ["Cascade Classifier", "OpenCV File", "Purpose"],
        [
            ["Frontal Face", "haarcascade_frontalface_default.xml", "Detects face from front view"],
            ["Profile Face", "haarcascade_profileface.xml", "Detects face from side angle"],
            ["Eye", "haarcascade_eye.xml", "Detects eyes (for eye contact tracking)"],
            ["Smile", "haarcascade_smile.xml", "Detects smile (boosts 'happy' emotion)"],
        ],
        col_widths=[120, 220, 200]
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Eye Contact Score Algorithm", h3_style))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'Base score = 86.0<br/>'
        'if num_eyes >= 2:  score += 10.0  # Both eyes visible<br/>'
        'if num_eyes == 1:  score -= 6.0   # Slight angle<br/>'
        'if num_eyes == 0:  score -= 32.0  # Looking away<br/><br/>'
        '# Centering penalty (face should be centered in camera frame)<br/>'
        'centering_penalty = max(0, (max(dx, dy) - 0.35)) × 40.0<br/>'
        'score -= centering_penalty<br/>'
        'Final range: 15.0 to 98.0'
        '</font>',
        code_style
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 9. LLM PROVIDER ROUTING
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("9. LLM Provider Routing &amp; Fallback Architecture", h1_style))
    story.append(hr())
    story.append(Paragraph(
        "All LLM calls go through a single central function <b>call_llm()</b> in llm_service.py. "
        "It handles provider selection and automatic fallback.",
        body_style
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        '<font face="Courier" size="7">'
        'call_llm(prompt)<br/>'
        '│<br/>'
        '├── AI_MOCK_MODE = true?<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── YES → Skip all API calls, return None<br/>'
        '│<br/>'
        '├── LLM_PROVIDER = "ollama"?<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── YES → Call Ollama Qwen2.5:7b (local)<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── FAILED? → Fallback to HuggingFace chain<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── NO → HuggingFace (default)<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Primary: Qwen3-8B<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└── FAILED? → Fallback: Qwen3-4B<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── FAILED? → return None<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── SUCCESS → return response'
        '</font>',
        code_style
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Provider Switching", h3_style))
    story.append(make_table(
        ["Environment Variable", "Value", "Effect"],
        [
            ["LLM_PROVIDER", "huggingface", "Uses HuggingFace Cloud API (Qwen3-8B → Qwen3-4B fallback)"],
            ["LLM_PROVIDER", "ollama", "Uses local Ollama runtime (no internet needed)"],
            ["AI_MOCK_MODE", "true", "Skips all real AI calls; callers use mock/fallback data"],
            ["AI_MOCK_MODE", "false", "Normal operation — real AI models are called"],
        ],
        col_widths=[130, 100, 310]
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 10. BACKEND LIBRARIES
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("10. Backend Libraries &amp; Frameworks", h1_style))
    story.append(hr())

    story.append(Paragraph("Core Framework", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["FastAPI", "0.115.8", "Async web framework (REST + WebSocket)"],
            ["Uvicorn", "0.34.0", "ASGI server (runs FastAPI)"],
            ["Pydantic", "2.10.6", "Data validation &amp; serialization"],
            ["pydantic-settings", "2.7.1", "Loads config from .env file"],
            ["Motor", "3.6.0", "Async MongoDB driver"],
            ["PyMongo", "4.10.1", "MongoDB Python driver (Motor depends on it)"],
            ["websockets", "≥12.0", "WebSocket support for FastAPI"],
        ],
        col_widths=[130, 80, 330]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Authentication &amp; Security", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["bcrypt", "4.2.1", "Password hashing"],
            ["passlib", "1.7.4", "Password hashing utilities"],
            ["python-jose", "3.3.0", "JWT token creation &amp; verification"],
        ],
        col_widths=[130, 80, 330]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("AI &amp; Machine Learning", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["httpx", "≥0.27.0", "Async HTTP client (all HuggingFace API calls)"],
            ["openai", "1.61.1", "OpenAI-compatible client (legacy, not actively used)"],
            ["opencv-python-headless", "4.11.0.86", "Computer vision (face/eye/emotion + ONNX runtime)"],
            ["numpy", "2.2.2", "Numerical computation (audio energy, softmax, embeddings)"],
            ["soundfile", "0.13.1", "WAV audio file reading &amp; voice analysis"],
            ["librosa", "0.10.2", "Advanced audio analysis (optional, fallback)"],
            ["deepface", "0.0.93", "Face analysis library (optional, heavy dependency)"],
            ["tf-keras", "2.18.0", "TensorFlow/Keras backend for DeepFace (optional)"],
        ],
        col_widths=[145, 80, 315]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Document Processing", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["pypdf", "6.16.2", "PDF resume text extraction"],
            ["python-multipart", "0.0.20", "File upload handling"],
            ["reportlab", "4.3.1", "PDF report generation (score cards, radar charts)"],
        ],
        col_widths=[130, 80, 330]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Utilities", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["python-dotenv", "1.0.1", ".env file loading"],
            ["gdown", "5.2.0", "Google Drive file download (model downloads)"],
        ],
        col_widths=[130, 80, 330]
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 11. FRONTEND LIBRARIES
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("11. Frontend Libraries &amp; Frameworks", h1_style))
    story.append(hr())

    story.append(Paragraph("NPM Dependencies", h2_style))
    story.append(make_table(
        ["Library", "Version", "Purpose"],
        [
            ["React", "19.2.8", "UI component framework"],
            ["React DOM", "19.2.8", "DOM rendering"],
            ["React Router DOM", "7.18.2", "Client-side routing (SPA navigation)"],
            ["Vite", "8.2.0", "Build tool &amp; dev server"],
            ["Tailwind CSS", "4.3.3", "Utility-first CSS framework"],
            ["Axios", "1.19.0", "HTTP client (REST API calls to backend)"],
            ["Framer Motion", "13.1.1", "Smooth animations &amp; transitions"],
            ["Lucide React", "1.33.0", "Icon library"],
            ["Recharts", "3.10.1", "Data visualization (radar charts, score graphs)"],
            ["PostCSS", "8.5.26", "CSS processing"],
            ["Autoprefixer", "10.5.4", "CSS vendor prefix automation"],
            ["OxLint", "1.75.0", "Fast JavaScript linter"],
        ],
        col_widths=[130, 80, 330]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Browser APIs (No Library Needed)", h2_style))
    story.append(make_table(
        ["API", "Purpose"],
        [
            ["Web Audio API", "Microphone audio capture &amp; 16kHz WAV encoding in browser"],
            ["Web Speech API", "Browser-native speech recognition (fallback for Whisper)"],
            ["HTML5 Canvas", "Webcam video capture &amp; frame extraction for emotion analysis"],
            ["WebSocket API", "Real-time full-duplex interview communication"],
            ["MediaDevices API", "Camera &amp; microphone hardware access"],
        ],
        col_widths=[130, 410]
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 12. DATABASE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 12))
    story.append(Paragraph("12. Database (MongoDB)", h1_style))
    story.append(hr())
    story.append(prop_table([
        ("Database", "MongoDB Community Server"),
        ("Driver", "Motor 3.6.0 (Async Python)"),
        ("Connection URL", "mongodb://localhost:27017"),
        ("Database Name", "interview_ai"),
        ("Config File", "backend/app/database.py"),
    ]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Collections", h3_style))
    story.append(make_table(
        ["Collection", "Purpose", "Key Fields"],
        [
            ["users", "User accounts", "email, first_name, last_name, hashed_password, created_at"],
            ["resumes", "Uploaded resumes", "parsed_text, skills, resume_context, ats_score, ats_matched_keywords"],
            ["interviews", "Interview sessions", "questions, scores_breakdown, feedback, status, overall_score, duration_seconds"],
        ],
        col_widths=[80, 130, 330]
    ))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # 13. ENVIRONMENT CONFIG
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("13. Environment Configuration (.env)", h1_style))
    story.append(hr())
    story.append(note(
        "The .env file must NEVER be committed to Git! It contains secrets like HF_TOKEN and SECRET_KEY."
    ))
    story.append(Spacer(1, 4))
    story.append(make_table(
        ["Variable", "Default Value", "Description"],
        [
            ["HOST", "0.0.0.0", "Server bind host"],
            ["PORT", "8000", "Server port"],
            ["SECRET_KEY", "(set in .env)", "JWT signing secret key"],
            ["ACCESS_TOKEN_EXPIRE_MINUTES", "120", "JWT token expiry time"],
            ["MONGODB_URL", "mongodb://localhost:27017", "MongoDB connection string"],
            ["DATABASE_NAME", "interview_ai", "MongoDB database name"],
            ["LLM_PROVIDER", "huggingface", "\"huggingface\" or \"ollama\""],
            ["OLLAMA_BASE_URL", "http://localhost:11434", "Ollama server URL"],
            ["OLLAMA_MODEL", "qwen2.5:7b", "Ollama model name"],
            ["HF_TOKEN", "(set in .env)", "HuggingFace API token (get from huggingface.co/settings/tokens)"],
            ["HF_LLM_MODEL", "Qwen/Qwen3-8B", "Primary LLM model ID"],
            ["HF_LLM_FALLBACK_MODEL", "Qwen/Qwen3-4B", "Fallback LLM model ID"],
            ["HF_WHISPER_MODEL", "openai/whisper-large-v3-turbo", "Speech-to-Text model ID"],
            ["HF_EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5", "Semantic embedding model ID"],
            ["AI_MOCK_MODE", "false", "Skip all AI calls and use mock data"],
            ["ATS_ENABLED", "true", "Toggle ATS resume scoring"],
            ["MAX_INTERVIEW_QUESTIONS", "10", "Max questions per interview session"],
        ],
        col_widths=[155, 155, 230]
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph("How to Get HuggingFace Token", h3_style))
    for step in [
        "1. Go to https://huggingface.co/settings/tokens",
        "2. Create a new token with \"Read\" access",
        "3. Copy the token (starts with hf_)",
        "4. Paste in backend/.env as HF_TOKEN=hf_your_token_here",
    ]:
        story.append(Paragraph(step, bullet_style))

    # ══════════════════════════════════════════════════════════════════════════
    # 14. ARCHITECTURE DIAGRAM
    # ══════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("14. System Architecture — How All Models Connect", h1_style))
    story.append(hr())
    story.append(Paragraph(
        '<font face="Courier" size="6.5">'
        '┌──────────────────────────────────────────────────────────────────┐<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CANDIDATE BROWSER (React + Vite)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;┌──────────┐&nbsp;&nbsp;┌────────────┐&nbsp;&nbsp;┌───────────┐&nbsp;&nbsp;┌────────────┐&nbsp;│<br/>'
        '│&nbsp;&nbsp;│&nbsp;&nbsp;React&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;Web Audio&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;&nbsp;Canvas&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;Web Speech&nbsp;│&nbsp;│<br/>'
        '│&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;UI&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;API (WAV)&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;(Webcam)&nbsp;&nbsp;│&nbsp;&nbsp;│&nbsp;(Fallback)&nbsp;│&nbsp;│<br/>'
        '│&nbsp;&nbsp;└────┬─────┘&nbsp;&nbsp;└─────┬──────┘&nbsp;&nbsp;└─────┬─────┘&nbsp;&nbsp;└──────┬─────┘&nbsp;│<br/>'
        '└───────┼──────────────┼───────────────┼───────────────┼──────────┘<br/>'
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;WebSocket │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ HTTP POST&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '┌───────┼──────────────┼───────────────┼───────────────┼──────────┐<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FASTAPI BACKEND (:8000)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;┌────────────┐&nbsp;┌────────────┐&nbsp;┌────────────┐&nbsp;┌──────────┐&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;│&nbsp;Qwen3-8B&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;Whisper&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;BGE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│CV Service│&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;│&nbsp;Qwen3-4B&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;v3-turbo&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;Embeddings&nbsp;│&nbsp;│&nbsp;FERPlus&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;│&nbsp;Ollama&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;(ASR)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│&nbsp;(Semantic)&nbsp;│&nbsp;│&nbsp;+Haar&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;└────────────┘&nbsp;└────────────┘&nbsp;└────────────┘&nbsp;└──────────┘&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌──────────────┐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;MongoDB&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;:27017&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──────────────┘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br/>'
        '└──────────────────────────────────────────────────────────────────┘'
        '</font>',
        code_style
    ))

    # ══════════════════════════════════════════════════════════════════════════
    # 15. FILE-TO-MODEL REFERENCE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 12))
    story.append(Paragraph("15. File-to-Model Quick Reference", h1_style))
    story.append(hr())
    story.append(make_table(
        ["Source File", "What It Contains"],
        [
            ["backend/app/config.py", "All model names, API URLs, and environment settings"],
            ["backend/app/ai/hf_client.py", "HuggingFace API client (LLM, Whisper, Embeddings)"],
            ["backend/app/ai/ollama_client.py", "Local Ollama LLM client"],
            ["backend/app/ai/llm_service.py", "LLM provider routing &amp; fallback logic (call_llm)"],
            ["backend/app/ai/speech_service.py", "Whisper ASR transcription + fallback chain"],
            ["backend/app/ai/embedding_service.py", "BGE semantic similarity scoring"],
            ["backend/app/services/cv_service.py", "FERPlus ONNX CNN + Haar Cascades (emotion + eye contact)"],
            ["backend/app/services/audio_service.py", "Voice metrics (WPM, pauses, fillers) via Soundfile + NumPy"],
            ["backend/app/ai/interview_engine.py", "Core interview logic (question generation, counter-questioning)"],
            ["backend/app/ai/resume_parser.py", "Resume text extraction &amp; structured context"],
            ["backend/app/ai/ats_scorer.py", "ATS keyword scoring engine"],
            ["backend/app/ai/prompt_templates.py", "All LLM prompt templates"],
            ["frontend/src/pages/InterviewRoom.jsx", "In-browser 16kHz WAV encoding + WebSocket + Camera"],
            ["frontend/src/components/CameraPanel.jsx", "Webcam capture &amp; frame extraction for emotion analysis"],
        ],
        col_widths=[215, 325]
    ))

    # ── END NOTE ──────────────────────────────────────────────────────────────
    story.append(Spacer(1, 16))
    end_data = [[
        Paragraph(
            "<b>📌 For New Teammates:</b> Start with README.md for setup instructions, "
            "then read this document for model details. Follow the source file paths above "
            "to dive deeper into any specific model's implementation.",
            ParagraphStyle('EndNote', fontName='Helvetica', fontSize=8.5, leading=12,
                         textColor=SECONDARY)
        )
    ]]
    end_table = Table(end_data, colWidths=[540])
    end_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ECFDF5")),
        ('BOX', (0, 0), (-1, -1), 1, ACCENT_GREEN),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(end_table)

    # ── BUILD ─────────────────────────────────────────────────────────────────
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"\n✅ PDF generated successfully: {OUTPUT_PATH}")
    print(f"   File size: {os.path.getsize(OUTPUT_PATH):,} bytes")


if __name__ == "__main__":
    build_pdf()
