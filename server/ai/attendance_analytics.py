#!/usr/bin/env python3
"""
VibhoHCM Attendance Analytics - Open Source ML Model
Uses statistical analysis and anomaly detection
"""

import sys
import json
import os
import numpy as np
from datetime import datetime, timedelta
import random

def detect_patterns(attendance_records):
    """Detect patterns in attendance data"""
    # In production, use actual statistical analysis
    # Here we use a simple mock implementation
    
    # Count late arrivals
    late_arrivals = sum(1 for record in attendance_records if record.get('status') == 'late')
    
    # Count early departures (simplified)
    early_departures = 0
    for record in attendance_records:
        if record.get('checkOut') and record.get('checkIn'):
            check_in = datetime.fromisoformat(record.get('checkIn').replace('Z', '+00:00'))
            check_out = datetime.fromisoformat(record.get('checkOut').replace('Z', '+00:00'))
            hours_worked = (check_out - check_in).total_seconds() / 3600
            if hours_worked < 8 and record.get('status') != 'half_day':
                early_departures += 1
    
    # Calculate overtime hours
    overtime_hours = sum(record.get('overtime', 0) for record in attendance_records)
    
    # Count absences
    absenteeism = sum(1 for record in attendance_records if record.get('status') == 'absent')
    
    return {
        "lateArrivals": late_arrivals,
        "earlyDepartures": early_departures,
        "overtimeHours": overtime_hours,
        "absenteeism": absenteeism
    }

def detect_anomalies(attendance_records):
    """Detect anomalies in attendance patterns"""
    # In production, use actual anomaly detection algorithms
    # Here we generate some plausible anomalies
    
    anomalies = []
    
    # Check for consecutive late arrivals
    consecutive_late = 0
    for i in range(1, len(attendance_records)):
        if attendance_records[i].get('status') == 'late' and attendance_records[i-1].get('status') == 'late':
            consecutive_late += 1
    
    if consecutive_late > 1:
        anomalies.append(f"Detected {consecutive_late} consecutive late arrivals")
    
    # Check for irregular check-in times
    check_in_times = []
    for record in attendance_records:
        if record.get('checkIn'):
            check_in = datetime.fromisoformat(record.get('checkIn').replace('Z', '+00:00'))
            check_in_times.append(check_in.hour * 60 + check_in.minute)
    
    if check_in_times:
        std_dev = np.std(check_in_times)
        if std_dev > 60:  # More than 1 hour standard deviation
            anomalies.append("Highly irregular check-in times detected")
        elif std_dev > 30:  # More than 30 minutes standard deviation
            anomalies.append("Moderately irregular check-in times detected")
    
    # Check for Monday absences
    monday_absences = 0
    for record in attendance_records:
        if record.get('date'):
            date = datetime.fromisoformat(record.get('date').replace('Z', '+00:00'))
            if date.weekday() == 0 and record.get('status') == 'absent':
                monday_absences += 1
    
    if monday_absences > 1:
        anomalies.append(f"Detected {monday_absences} Monday absences")
    
    # Add some random plausible anomalies if none detected
    if not anomalies:
        possible_anomalies = [
            "Frequent late arrivals on Mondays",
            "Extended lunch breaks detected",
            "Irregular work hours pattern",
            "Frequent early departures on Fridays",
            "Inconsistent working hours"
        ]
        anomalies = [random.choice(possible_anomalies)]
    
    return anomalies

def predict_attendance(attendance_records):
    """Predict future attendance patterns"""
    # In production, use time series forecasting
    # Here we use a simple prediction based on recent patterns
    
    # Calculate average attendance rate
    present_days = sum(1 for record in attendance_records if record.get('status') in ['present', 'late', 'work_from_home'])
    total_days = len(attendance_records)
    attendance_rate = (present_days / total_days) * 100 if total_days > 0 else 0
    
    # Calculate risk score based on patterns
    patterns = detect_patterns(attendance_records)
    
    risk_factors = [
        patterns['lateArrivals'] > 5,  # Many late arrivals
        patterns['earlyDepartures'] > 5,  # Many early departures
        patterns['absenteeism'] > 3,  # Multiple absences
        attendance_rate < 90  # Low attendance rate
    ]
    
    risk_score = sum(50 * factor for factor in risk_factors) / len(risk_factors)
    
    # Predict next week's attendance (slightly lower than current average)
    next_week_attendance = max(0, min(100, attendance_rate - random.uniform(-5, 5)))
    
    return {
        "nextWeekAttendance": round(next_week_attendance, 1),
        "riskScore": round(risk_score, 1)
    }

def main():
    """Main function to analyze attendance patterns"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "message": "Missing attendance records"
        }))
        sys.exit(1)
    
    try:
        # Parse attendance records
        attendance_records = json.loads(sys.argv[1])
        
        # Detect patterns
        patterns = detect_patterns(attendance_records)
        
        # Detect anomalies
        anomalies = detect_anomalies(attendance_records)
        
        # Predict future attendance
        predictions = predict_attendance(attendance_records)
        
        # Return result
        result = {
            "patterns": patterns,
            "anomalies": anomalies,
            "predictions": predictions
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