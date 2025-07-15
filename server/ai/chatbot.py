#!/usr/bin/env python3
"""
VibhoHCM Chatbot - Open Source NLP Model
Uses Hugging Face Transformers for intent classification and entity recognition
"""

import sys
import json
import os
import numpy as np
from datetime import datetime
import re

# Mock implementation - in production, use actual models
def extract_entities(text):
    """Extract entities from text using NER"""
    entities = []
    
    # Simple regex patterns for demonstration
    # In production, use spaCy or Hugging Face NER models
    date_pattern = r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}\b'
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    name_pattern = r'\b[A-Z][a-z]+\s+[A-Z][a-z]+\b'
    
    # Find dates
    for match in re.finditer(date_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "DATE",
            "start": match.start(),
            "end": match.end()
        })
    
    # Find emails
    for match in re.finditer(email_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "EMAIL",
            "start": match.start(),
            "end": match.end()
        })
    
    # Find names
    for match in re.finditer(name_pattern, text):
        entities.append({
            "entity": match.group(),
            "type": "PERSON",
            "start": match.start(),
            "end": match.end()
        })
    
    return entities

def classify_intent(text, context):
    """Classify user intent"""
    # In production, use a trained intent classifier
    # Here we use simple keyword matching
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['leave', 'vacation', 'time off', 'sick']):
        return "leave_inquiry", 0.85
    
    if any(word in text_lower for word in ['salary', 'pay', 'payslip', 'compensation']):
        return "payroll_inquiry", 0.82
    
    if any(word in text_lower for word in ['attendance', 'check in', 'check out', 'present']):
        return "attendance_inquiry", 0.78
    
    if any(word in text_lower for word in ['document', 'certificate', 'upload']):
        return "document_inquiry", 0.75
    
    if any(word in text_lower for word in ['help', 'support', 'assist']):
        return "help_request", 0.90
    
    return "general_inquiry", 0.60

def generate_response(intent, entities, context):
    """Generate response based on intent, entities, and context"""
    # In production, use a more sophisticated response generator
    
    user_role = context.get('userRole', 'employee')
    user_name = context.get('name', 'there')
    
    responses = {
        "leave_inquiry": [
            f"I can help you with leave information. Based on our records, you have 15 annual leave days remaining.",
            f"Your leave balance shows 15 annual and 10 sick leave days available. Would you like to apply for leave?",
            f"I see you're asking about leave. Your last leave was from March 10-15, 2024. You have 15 days remaining."
        ],
        "payroll_inquiry": [
            f"Your latest payslip for April 2024 has been processed. The net amount is $4,250.00.",
            f"I can help with payroll information. Your YTD earnings are $17,000 with $3,400 in tax deductions.",
            f"Your next salary payment is scheduled for May 30, 2024. Would you like to view your latest payslip?"
        ],
        "attendance_inquiry": [
            f"Your attendance rate for this month is 96%. You were late on May 5, 2024.",
            f"You've worked 160 hours this month with an average daily attendance of 8.5 hours.",
            f"Your attendance records show you've been present for 20 days this month with 1 work-from-home day."
        ],
        "document_inquiry": [
            f"You have 5 documents in your profile. Your passport is expiring in 3 months.",
            f"I can help you manage your documents. Would you like to upload a new document or view existing ones?",
            f"Your document repository contains: Passport, Driver's License, Degree Certificate, and 2 more documents."
        ],
        "help_request": [
            f"I'm here to help! You can ask me about leave, attendance, payroll, documents, and more.",
            f"How can I assist you today? I can provide information on various HR services and policies.",
            f"I'm your HR assistant. Feel free to ask about company policies, benefits, or any HR-related questions."
        ],
        "general_inquiry": [
            f"Hello {user_name}! How can I assist you with HR matters today?",
            f"I'm here to help with any HR-related questions you might have.",
            f"Is there something specific about your employment that you'd like to know?"
        ]
    }
    
    # Select a response based on intent
    if intent in responses:
        # In production, use a more sophisticated selection method
        response_idx = hash(context.get('name', '') + intent) % len(responses[intent])
        return responses[intent][response_idx]
    
    return "I'm not sure how to help with that. Could you please rephrase your question?"

def main():
    """Main function to process chatbot messages"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "message": "Missing required arguments"
        }))
        sys.exit(1)
    
    message = sys.argv[1]
    context = json.loads(sys.argv[2])
    
    # Extract entities
    entities = extract_entities(message)
    
    # Classify intent
    intent, confidence = classify_intent(message, context)
    
    # Generate response
    answer = generate_response(intent, entities, context)
    
    # Return result
    result = {
        "answer": answer,
        "entities": entities,
        "intent": intent,
        "confidence": confidence
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()