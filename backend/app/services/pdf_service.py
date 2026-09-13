from io import BytesIO
from datetime import datetime
from typing import Dict, Any

def generate_pdf_report(interview_data: Dict[str, Any]) -> BytesIO:
    """
    Generates a beautifully styled PDF report containing mock interview results and insights.
    """
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    # Premium SaaS Color Palette
    PRIMARY_COLOR = colors.HexColor("#7C3AED")    # Purple accent
    SECONDARY_COLOR = colors.HexColor("#0D0D11")  # Deep Midnight
    BG_CARD_COLOR = colors.HexColor("#F9FAF8")    # Soft warm grey
    TEXT_MUTED = colors.HexColor("#4B5563")       # Muted body grey
    TEXT_DARK = colors.HexColor("#111827")        # Dark grey
    BORDER_COLOR = colors.HexColor("#E5E7EB")     # Light border grey
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=SECONDARY_COLOR
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_MUTED
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY_COLOR,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_DARK
    )
    
    body_muted = ParagraphStyle(
        'BodyTextMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_MUTED
    )
    
    bold_body = ParagraphStyle(
        'BoldBodyText',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    # Build Story
    story = []
    
    # Header Banner Block
    header_data = [
        [Paragraph("InterviewAI", ParagraphStyle('Logo', fontName='Helvetica-Bold', fontSize=18, textColor=PRIMARY_COLOR)), 
         Paragraph(datetime.now().strftime("%B %d, %Y"), ParagraphStyle('DateText', alignment=2, fontName='Helvetica', fontSize=10, textColor=TEXT_MUTED))]
    ]
    header_table = Table(header_data, colWidths=[270, 260])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    
    # Title Block
    story.append(Paragraph("Interview Evaluation Report", title_style))
    story.append(Paragraph(f"Comprehensive feedback for <b>{interview_data.get('role', 'Candidate')}</b> ({interview_data.get('experience_level', 'Mid')} Level)", subtitle_style))
    story.append(Spacer(1, 15))
    
    # Overview Cards Table
    created_dt = interview_data.get('created_at')
    if isinstance(created_dt, datetime):
        date_str = created_dt.strftime("%Y-%m-%d %H:%M")
    else:
        date_str = str(created_dt)[:16] if created_dt else "N/A"
        
    duration_min = round(interview_data.get('duration_seconds', 0) / 60, 1)
    
    metadata_data = [
        [
            Paragraph("<b>Interview Type:</b>", bold_body), 
            Paragraph(str(interview_data.get('interview_type')), body_style),
            Paragraph("<b>Completed At:</b>", bold_body), 
            Paragraph(date_str, body_style)
        ],
        [
            Paragraph("<b>Duration:</b>", bold_body), 
            Paragraph(f"{duration_min} minutes", body_style),
            Paragraph("<b>Overall Score:</b>", bold_body), 
            Paragraph(f"<font color='purple'><b>{interview_data.get('overall_score', 0)} / 100</b></font>", body_style)
        ]
    ]
    metadata_table = Table(metadata_data, colWidths=[100, 160, 100, 170])
    metadata_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(metadata_table)
    story.append(Spacer(1, 20))
    
    # Scores Breakdown Chart Table
    story.append(Paragraph("Scores Breakdown", section_heading))
    scores_breakdown = interview_data.get('scores_breakdown', {})
    
    breakdown_data = [
        [Paragraph("<b>Evaluation Category</b>", bold_body), Paragraph("<b>Score (0-100)</b>", bold_body), Paragraph("<b>Performance Level</b>", bold_body)]
    ]
    
    category_map = {
        "technical": "Technical Knowledge",
        "communication": "Communication Quality",
        "answer_quality": "Answer Depth & Content",
        "confidence": "Visible Confidence & Tone",
        "eye_contact": "Eye Contact & Engagement",
        "speech_clarity": "Speech Clarity & Pace"
    }
    
    for key, val in scores_breakdown.items():
        label = category_map.get(key, key.replace("_", " ").title())
        score_val = int(val)
        if score_val >= 80:
            level = "<font color='green'><b>Excellent</b></font>"
        elif score_val >= 60:
            level = "<font color='orange'><b>Good</b></font>"
        else:
            level = "<font color='red'><b>Needs Improvement</b></font>"
            
        breakdown_data.append([
            Paragraph(label, body_style),
            Paragraph(str(score_val), body_style),
            Paragraph(level, body_style)
        ])
        
    breakdown_table = Table(breakdown_data, colWidths=[240, 140, 150])
    breakdown_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    # Adjust top row text color for the PDF header explicitly in style
    for i in range(3):
        breakdown_data[0][i].style.textColor = colors.white
    story.append(breakdown_table)
    story.append(Spacer(1, 20))
    
    # Executive Summary Feedback
    feedback = interview_data.get('feedback', {})
    
    summary_elements = []
    summary_elements.append(Paragraph("Executive Performance Summary", section_heading))
    
    if feedback.get('what_went_well'):
        summary_elements.append(Paragraph("<b>What You Did Well:</b>", bold_body))
        for item in feedback.get('what_went_well', []):
            summary_elements.append(Paragraph(f"• {item}", body_style))
            summary_elements.append(Spacer(1, 3))
        summary_elements.append(Spacer(1, 8))
        
    if feedback.get('areas_to_improve'):
        summary_elements.append(Paragraph("<b>Areas to Focus On:</b>", bold_body))
        for item in feedback.get('areas_to_improve', []):
            summary_elements.append(Paragraph(f"• {item}", body_style))
            summary_elements.append(Spacer(1, 3))
        summary_elements.append(Spacer(1, 8))
        
    if feedback.get('recommendations'):
        summary_elements.append(Paragraph("<b>Mentorship Recommendations:</b>", bold_body))
        summary_elements.append(Paragraph(str(feedback.get('recommendations')), body_style))
        
    story.append(KeepTogether(summary_elements))
    
    # Page Break for Question Details
    story.append(PageBreak())
    
    # Detailed Question breakdown
    story.append(Paragraph("Detailed Question Breakdown", section_heading))
    
    questions = interview_data.get('questions', [])
    for idx, q in enumerate(questions):
        q_elements = []
        q_elements.append(Paragraph(f"<b>Question {q.get('id', idx+1)}:</b> {q.get('question_text')}", bold_body))
        q_elements.append(Spacer(1, 4))
        
        # Audio / Transcript
        answer = q.get('answer_text') or "*No spoken answer recorded*"
        q_elements.append(Paragraph(f"<b>Your Response:</b> <i>\"{answer}\"</i>", body_muted))
        q_elements.append(Spacer(1, 6))
        
        # Metrics line
        eye_contact = q.get('eye_contact_score')
        eye_contact_str = f"{int(eye_contact)}%" if eye_contact is not None else "N/A"
        
        emotion_summary = q.get('emotion_summary') or {}
        dom_emotion = max(emotion_summary, key=emotion_summary.get) if emotion_summary else "N/A"
        
        voice = q.get('voice_metrics') or {}
        speed = f"{voice.get('speaking_speed', 'N/A')} wpm"
        fillers = f"{voice.get('filler_words_count', 'N/A')} filler words"
        
        metrics_line = f"<b>Eye Contact:</b> {eye_contact_str}  |  <b>Dominant Emotion:</b> {dom_emotion.capitalize()}  |  <b>Speed:</b> {speed}  |  <b>Pauses:</b> {fillers}"
        q_elements.append(Paragraph(metrics_line, body_style))
        q_elements.append(Spacer(1, 4))
        
        # AI Grade
        eval_data = q.get('evaluation') or {}
        q_score = eval_data.get('score', 0)
        feedback_text = eval_data.get('feedback', "No feedback generated.")
        
        q_elements.append(Paragraph(f"<b>AI Score:</b> <font color='purple'><b>{q_score} / 100</b></font>", body_style))
        q_elements.append(Paragraph(f"<b>AI Feedback:</b> {feedback_text}", body_style))
        q_elements.append(Spacer(1, 10))
        
        # Draw a separation line
        sep_table = Table([[""]], colWidths=[530], rowHeights=[1])
        sep_table.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 5),
        ]))
        q_elements.append(sep_table)
        q_elements.append(Spacer(1, 10))
        
        story.append(KeepTogether(q_elements))
        
    doc.build(story)
    buffer.seek(0)
    return buffer
