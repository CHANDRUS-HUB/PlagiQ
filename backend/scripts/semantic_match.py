import sys
import json
import re
import numpy as np
from sentence_transformers import SentenceTransformer, util
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
from PyPDF2 import PdfReader
import docx

def is_scanned_pdf(text):
    return len(text.strip()) == 0

def extract_text_from_pdf(file):
    text = ""
    reader = PdfReader(file)
    for page in reader.pages:
        text += page.extract_text() or ""  
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def extract_questions(text):
    lines = text.split('\n')
    questions = []
    for line in lines:
        line = line.strip()
        if not line or len(line) < 10:
            continue
        if re.search(r'\b(who|what|when|where|why|how|define|explain|describe|list|mention)\b', line.lower()) and (
            line.endswith('?') or line.endswith('.')
        ):
            if not re.search(r'\bmarks?\b|\bsection\b|\bpart\b|^\d+\.?$|^time\b|^\(?[0-9]+\)?$', line.lower()):
                questions.append(line)
    return questions

def extract_text_from_image(image):
    try:
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return ""  

def process_pdf(file_path):
    text = ""
    with open(file_path, "rb") as f:
        text = extract_text_from_pdf(f)  
    if is_scanned_pdf(text):
        images = convert_from_path(file_path)
        text = ""
        for image in images:
            text += extract_text_from_image(image)
    return text

def process_docx(file_path):
    with open(file_path, 'rb') as f:
        return extract_text_from_docx(f)

try:
    model = SentenceTransformer("all-MiniLM-L6-v2")
    file_path = sys.argv[1]  # File path
    file_type = sys.argv[2]  # File type (PDF, DOCX, TXT)
    file_content = sys.argv[3]  # Raw file content

    if file_type == 'application/pdf':
        file_content = process_pdf(file_path)
    elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        file_content = process_docx(file_path)
    
    if not file_content.strip():
        print(json.dumps({"error": "No text extracted", "percentage": 0.0, "duplicates": [], "question_count": 0, "total_duplicates": 0}))
        sys.exit(0)

    questions = extract_questions(file_content)
    
    if len(questions) < 2:
        print(json.dumps({"error": "Not enough questions", "percentage": 0.0, "duplicates": [], "question_count": len(questions), "total_duplicates": 0}))
        sys.exit(0)

    questions = [q.strip() for q in questions if len(q.strip()) > 5][:300]  
    embeddings = model.encode(questions, convert_to_tensor=True, show_progress_bar=True)

    threshold = 0.8
    duplicates = []
    max_score = 0.0

    for i in range(len(questions)):
        for j in range(i + 1, len(questions)):
            score = util.pytorch_cos_sim(embeddings[i], embeddings[j]).item()
            if score >= threshold:
                duplicates.append({
                    "q1": questions[i],
                    "q2": questions[j],
                    "score": round(score, 2)
                })
            max_score = max(max_score, score)

    result = {
        "percentage": round(max_score * 100, 2),
        "duplicates": duplicates[:10],  # Limit to top 10 duplicates
        "total_duplicates": len(duplicates),
        "question_count": len(questions)
    }

    print(json.dumps(result))  
    sys.exit(0)

except Exception as e:
    print(json.dumps({"error": str(e), "percentage": 0.0, "duplicates": [], "question_count": 0, "total_duplicates": 0}), file=sys.stderr)
    sys.exit(1)
