#!/usr/bin/env python3
"""
VibhoHCM Payroll Prediction - Open Source ML Model
Uses time series forecasting for payroll cost prediction
"""

import sys
import json
import os
import numpy as np
from datetime import datetime, timedelta
import random

def generate_historical_data(month, year):
    """Generate mock historical payroll data"""
    # In production, this would use actual historical data
    # Here we generate synthetic data
    
    # Convert month and year to datetime
    current_date = datetime(int(year), int(month), 1)
    
    # Generate data for the past 12 months
    historical_data = []
    base_amount = 2000000  # $2M monthly payroll
    
    for i in range(12, 0, -1):
        date = current_date - timedelta(days=30*i)
        
        # Add some seasonal variation and trend
        seasonality = 1 + 0.1 * np.sin(i * np.pi / 6)  # Seasonal cycle
        trend = 1 + 0.005 * i  # Slight upward trend
        random_factor = 1 + (random.random() * 0.05 - 0.025)  # Random noise ±2.5%
        
        amount = base_amount * seasonality * trend * random_factor
        
        historical_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "value": round(amount)
        })
    
    return historical_data

def forecast_payroll(historical_data, periods=3):
    """Forecast future payroll costs"""
    # In production, use Prophet or ARIMA models
    # Here we use a simple forecasting method
    
    # Extract values
    values = [entry["value"] for entry in historical_data]
    
    # Calculate trend
    n = len(values)
    x = np.arange(n)
    trend_coef = np.polyfit(x, values, 1)[0]
    
    # Calculate seasonality (simplified)
    if n >= 12:
        seasonality = []
        for i in range(12):
            season_values = [values[j] for j in range(i, n, 12) if j < n]
            if season_values:
                seasonality.append(np.mean(season_values) / np.mean(values))
            else:
                seasonality.append(1.0)
    else:
        seasonality = [1.0] * 12
    
    # Generate forecast
    forecast = []
    last_date = datetime.strptime(historical_data[-1]["date"], "%Y-%m-%d")
    
    for i in range(1, periods + 1):
        forecast_date = last_date + timedelta(days=30*i)
        
        # Apply trend and seasonality
        base_value = values[-1] + trend_coef * i
        month_idx = forecast_date.month - 1
        seasonal_factor = seasonality[month_idx]
        
        # Add random noise
        random_factor = 1 + (random.random() * 0.03 - 0.015)  # Random noise ±1.5%
        
        forecast_value = base_value * seasonal_factor * random_factor
        
        # Add uncertainty bounds
        uncertainty = forecast_value * 0.05 * (i / periods)  # Increasing uncertainty
        
        forecast.append({
            "date": forecast_date.strftime("%Y-%m-%d"),
            "value": round(forecast_value),
            "lower": round(forecast_value - uncertainty),
            "upper": round(forecast_value + uncertainty)
        })
    
    return forecast

def generate_cost_optimization(forecast):
    """Generate cost optimization recommendations"""
    # In production, use actual analysis of payroll components
    # Here we generate plausible recommendations
    
    recommendations = [
        "Implement flexible working hours to reduce overtime costs",
        "Review contractor vs. employee cost efficiency",
        "Optimize bonus structures based on performance metrics",
        "Consider restructuring benefits packages for cost efficiency",
        "Analyze department-wise salary benchmarks for optimization",
        "Implement automated time tracking to reduce timesheet errors",
        "Review travel and expense policies for potential savings",
        "Consider skill-based compensation adjustments",
        "Optimize shift scheduling to reduce overtime",
        "Implement performance-based incentive structures"
    ]
    
    # Select a random subset of recommendations
    return random.sample(recommendations, 3)

def main():
    """Main function to predict payroll costs"""
    if len(sys.argv) < 3:
        print(json.dumps({
            "success": False,
            "message": "Missing month and year parameters"
        }))
        sys.exit(1)
    
    try:
        month = sys.argv[1]
        year = sys.argv[2]
        
        # Generate historical data
        historical_data = generate_historical_data(month, year)
        
        # Forecast future payroll
        forecast = forecast_payroll(historical_data)
        
        # Generate cost optimization recommendations
        cost_optimization = generate_cost_optimization(forecast)
        
        # Return result
        result = {
            "month": f"{month}/{year}",
            "predictedCost": forecast[0]["value"],
            "variance": round((forecast[0]["value"] - historical_data[-1]["value"]) / historical_data[-1]["value"] * 100, 1),
            "forecast": forecast,
            "historicalData": historical_data,
            "costOptimization": cost_optimization
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