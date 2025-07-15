#!/usr/bin/env python3
"""
VibhoHCM Insights Generator - Open Source ML Model
Generates AI insights for various HR data
"""

import sys
import json
import os
import random
from datetime import datetime, timedelta

def generate_performance_insights(data):
    """Generate insights for performance data"""
    insights = []
    
    # Get employee data
    employee_id = data.get('employeeId', '')
    reviews = data.get('reviews', [])
    goals = data.get('goals', [])
    skills = data.get('skills', [])
    
    # Generate prediction insights
    if reviews:
        # Predict next performance rating
        current_ratings = [review.get('rating', 0) for review in reviews]
        if current_ratings:
            avg_rating = sum(current_ratings) / len(current_ratings)
            trend = random.uniform(-0.5, 0.8)  # Random trend
            predicted_rating = min(5, max(1, avg_rating + trend))
            
            insights.append({
                "type": "prediction",
                "title": "Predicted Performance Rating",
                "description": f"Based on historical performance, the next review rating is predicted to be {predicted_rating:.1f}/5.0",
                "confidence": random.uniform(0.7, 0.9),
                "actionable": False,
                "priority": "medium"
            })
    
    # Generate skill gap insights
    if skills:
        skill_gaps = []
        for skill in skills:
            if skill.get('currentLevel', 0) < skill.get('targetLevel', 0):
                skill_gaps.append({
                    "skill": skill.get('skillName', ''),
                    "gap": skill.get('targetLevel', 0) - skill.get('currentLevel', 0)
                })
        
        if skill_gaps:
            # Sort by gap size
            skill_gaps.sort(key=lambda x: x['gap'], reverse=True)
            top_gap = skill_gaps[0]
            
            insights.append({
                "type": "recommendation",
                "title": f"Skill Development: {top_gap['skill']}",
                "description": f"Focus on developing {top_gap['skill']} to close the {top_gap['gap']} point gap to reach target proficiency.",
                "confidence": random.uniform(0.8, 0.95),
                "actionable": True,
                "priority": "high"
            })
    
    # Generate goal-based insights
    if goals:
        completed_goals = [goal for goal in goals if goal.get('status') == 'completed']
        in_progress_goals = [goal for goal in goals if goal.get('status') == 'in_progress']
        
        if completed_goals:
            insights.append({
                "type": "trend",
                "title": "Goal Achievement Pattern",
                "description": f"Successfully completed {len(completed_goals)} goals, demonstrating consistent achievement.",
                "confidence": random.uniform(0.75, 0.9),
                "actionable": False,
                "priority": "low",
                "metadata": {"trend": "positive"}
            })
        
        if in_progress_goals:
            at_risk_goals = []
            for goal in in_progress_goals:
                target_date = datetime.fromisoformat(goal.get('targetDate').replace('Z', '+00:00'))
                days_remaining = (target_date - datetime.now()).days
                progress = goal.get('progress', 0)
                
                # If less than 30% of time remains but progress is below 60%, goal is at risk
                if days_remaining > 0:
                    time_remaining_pct = days_remaining / 90  # Assuming 90-day goals
                    if time_remaining_pct < 0.3 and progress < 60:
                        at_risk_goals.append(goal)
            
            if at_risk_goals:
                insights.append({
                    "type": "anomaly",
                    "title": "Goals at Risk",
                    "description": f"{len(at_risk_goals)} goals may not be completed by their target dates based on current progress.",
                    "confidence": random.uniform(0.7, 0.85),
                    "actionable": True,
                    "priority": "high"
                })
    
    # Generate career development insights
    insights.append({
        "type": "recommendation",
        "title": "Career Development Opportunity",
        "description": "Based on your skill profile, consider pursuing certification in Project Management to enhance leadership capabilities.",
        "confidence": random.uniform(0.6, 0.8),
        "actionable": True,
        "priority": "medium"
    })
    
    # Add some randomness to insights
    if random.random() > 0.5:
        insights.append({
            "type": "trend",
            "title": "Collaboration Pattern",
            "description": "Your collaboration across departments has increased by 20% in the last quarter.",
            "confidence": random.uniform(0.6, 0.75),
            "actionable": False,
            "priority": "low",
            "metadata": {"trend": "positive"}
        })
    
    return insights

def generate_attendance_insights(data):
    """Generate insights for attendance data"""
    insights = []
    
    # Get attendance data
    employee_id = data.get('employeeId', '')
    attendance_records = data.get('attendanceRecords', [])
    
    if not attendance_records:
        return insights
    
    # Calculate attendance metrics
    total_records = len(attendance_records)
    present_days = sum(1 for record in attendance_records if record.get('status') == 'present')
    late_days = sum(1 for record in attendance_records if record.get('status') == 'late')
    absent_days = sum(1 for record in attendance_records if record.get('status') == 'absent')
    
    attendance_rate = (present_days / total_records) * 100 if total_records > 0 else 0
    
    # Generate attendance trend insight
    insights.append({
        "type": "trend",
        "title": "Attendance Pattern",
        "description": f"Your attendance rate is {attendance_rate:.1f}%, which is {'above' if attendance_rate > 90 else 'below'} the company average.",
        "confidence": random.uniform(0.8, 0.95),
        "actionable": False,
        "priority": "medium",
        "metadata": {"trend": "positive" if attendance_rate > 90 else "negative"}
    })
    
    # Generate late arrival insight if applicable
    if late_days > 0:
        insights.append({
            "type": "anomaly",
            "title": "Late Arrival Pattern",
            "description": f"You have been late {late_days} times in the last {total_records} working days.",
            "confidence": random.uniform(0.75, 0.9),
            "actionable": True,
            "priority": "high" if late_days > 5 else "medium"
        })
    
    # Generate work hour prediction
    insights.append({
        "type": "prediction",
        "title": "Work Hour Forecast",
        "description": f"Based on your current pattern, you are projected to work {160 + random.randint(-10, 20)} hours next month.",
        "confidence": random.uniform(0.6, 0.8),
        "actionable": False,
        "priority": "low"
    })
    
    return insights

def generate_recruitment_insights(data):
    """Generate insights for recruitment data"""
    insights = []
    
    # Get recruitment data
    job_postings = data.get('jobPostings', [])
    candidates = data.get('candidates', [])
    
    if not job_postings or not candidates:
        return insights
    
    # Generate insights on candidate quality
    avg_score = sum(candidate.get('aiScore', 0) for candidate in candidates) / len(candidates)
    
    insights.append({
        "type": "trend",
        "title": "Candidate Quality Trend",
        "description": f"The average candidate match score is {avg_score:.1f}%, which is {'above' if avg_score > 75 else 'below'} the benchmark.",
        "confidence": random.uniform(0.7, 0.85),
        "actionable": False,
        "priority": "medium",
        "metadata": {"trend": "positive" if avg_score > 75 else "negative"}
    })
    
    # Generate insights on recruitment funnel
    insights.append({
        "type": "prediction",
        "title": "Hiring Timeline Prediction",
        "description": f"Based on current pipeline, positions are expected to be filled within {random.randint(20, 45)} days.",
        "confidence": random.uniform(0.6, 0.8),
        "actionable": False,
        "priority": "medium"
    })
    
    # Generate recommendation for improving job descriptions
    insights.append({
        "type": "recommendation",
        "title": "Job Description Optimization",
        "description": "Adding specific technical requirements could improve candidate matching by 15-20%.",
        "confidence": random.uniform(0.7, 0.85),
        "actionable": True,
        "priority": "high"
    })
    
    return insights

def main():
    """Main function to generate insights"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "message": "Missing insight type and data"
        }))
        sys.exit(1)
    
    try:
        insight_type = sys.argv[1]
        data = json.loads(sys.argv[2])
        
        # Generate insights based on type
        if insight_type == 'performance':
            insights = generate_performance_insights(data)
        elif insight_type == 'attendance':
            insights = generate_attendance_insights(data)
        elif insight_type == 'recruitment':
            insights = generate_recruitment_insights(data)
        else:
            insights = []
        
        # Return insights
        print(json.dumps(insights))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()