#!/usr/bin/env python3
"""
VibhoHCM Document Processor - Open Source NLP Model
Uses text classification and entity extraction for document processing
"""

import sys
import json
import os
import re
import random
from datetime import datetime

def extract_text_from_file(file_path):
    """Extract text from document file"""
    # In production, use proper document parsing libraries
    # Here we simply read the file if it's a text file
    
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if file_ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    elif file_ext in ['.pdf', '.doc', '.docx']:
        # Mock text extraction for non-text files
        return f"This is extracted text from a {file_ext} document. In production, we would use proper document parsing libraries."
    elif file_ext in ['.jpg', '.jpeg', '.png']:
        # Mock OCR for image files
        return f"This is OCR text from a {file_ext} image. In production, we would use OCR libraries."
    else:
        return "Unsupported file format"

def classify_document(text):
    """Classify document type based on content"""
    # In production, use a trained document classifier
    # Here we use simple keyword matching
    
    text_lower = text.lower()
    
    # Define document categories and their keywords
    categories = {
        "Contract": ["agreement", "contract", "terms", "parties", "signed", "clause"],
        "Invoice": ["invoice", "payment", "amount", "due", "bill", "tax", "total"],
        "Resume": ["experience", "skills", "education", "employment", "resume", "cv"],
        "Policy": ["policy", "guidelines", "rules", "compliance", "procedure"],
        "Report": ["report", "analysis", "findings", "conclusion", "summary"],
        "Letter": ["dear", "sincerely", "regards", "letter", "request"],
        "Email": ["from:", "to:", "subject:", "sent:", "received:", "forwarded"]
    }
    
    # Count keyword matches for each category
    scores = {}
    for category, keywords in categories.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        scores[category] = score
    
    # Find category with highest score
    if any(scores.values()):
        best_category = max(scores.items(), key=lambda x: x[1])[0]
        confidence = min(0.5 + (scores[best_category] / 10), 0.95)  # Scale confidence
    else:
        best_category = "Other"
        confidence = 0.3
    
    return {
        "category": best_category,
        "confidence": confidence
    }

def analyze_sentiment(text):
    """Analyze sentiment of document text"""
    # In production, use a trained sentiment analysis model
    # Here we use simple keyword counting
    
    text_lower = text.lower()
    
    positive_words = ["good", "great", "excellent", "positive", "happy", "pleased", "satisfied", "agree", "benefit", "success"]
    negative_words = ["bad", "poor", "negative", "unhappy", "disappointed", "dissatisfied", "disagree", "problem", "issue", "failure"]
    
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    total = positive_count + negative_count
    if total == 0:
        return {"sentiment": "neutral", "score": 0.5}
    
    score = positive_count / total
    
    if score > 0.6:
        sentiment = "positive"
    elif score < 0.4:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return {
        "sentiment": sentiment,
        "score": score
    }

def extract_entities(text):
    """Extract entities from document text"""
    # In production, use NER models
    # Here we use simple regex patterns
    
    entities = []
    
    # Extract dates
    date_pattern = r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}\b'
    for match in re.finditer(date_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "DATE",
            "start": match.start(),
            "end": match.end()
        })
    
    # Extract monetary amounts
    money_pattern = r'\$\s*\d+(?:,\d+)*(?:\.\d+)?|\d+(?:,\d+)*(?:\.\d+)?\s*(?:USD|EUR|GBP|INR)'
    for match in re.finditer(money_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "MONEY",
            "start": match.start(),
            "end": match.end()
        })
    
    # Extract organizations
    org_pattern = r'\b[A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)+\s+(?:Inc|LLC|Ltd|Corp|Corporation|Company)\b'
    for match in re.finditer(org_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "ORGANIZATION",
            "start": match.start(),
            "end": match.end()
        })
    
    # Extract people names (simplified)
    name_pattern = r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b'
    for match in re.finditer(name_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "PERSON",
            "start": match.start(),
            "end": match.end()
        })
    
    return entities

def main():
    """Main function to process documents"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "message": "Missing document file path"
        }))
        sys.exit(1)
    
    document_path = sys.argv[1]
    
    try:
        # Extract text from document
        text = extract_text_from_file(document_path)
        
        # Classify document
        classification = classify_document(text)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(text)
        
        # Extract entities
        entities = extract_entities(text)
        
        # Return result
        result = {
            "category": classification["category"],
            "confidence": classification["confidence"],
            "sentiment": sentiment,
            "entities": entities,
            "textLength": len(text),
            "processingTime": random.uniform(0.5, 2.0)  # Mock processing time
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()