// AI utilities and services for VibhoHCM
// This file contains implementations of AI features using open-source models

import axios from 'axios';
import { memoize } from './performance';

// Types
export interface AIInsight {
  type: 'prediction' | 'anomaly' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface SkillAssessment {
  id: string;
  employeeId: string;
  skillName: string;
  category: 'technical' | 'soft' | 'leadership';
  currentLevel: number;
  targetLevel: number;
  lastAssessedDate?: Date;
  assessedBy?: string;
  comments?: string;
}

// Mock implementation of AI service
// In a real implementation, these would call self-hosted open-source models
export const aiService = {
  // Connect to Supabase AI
  connectToSupabaseAI: async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not found');
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      return supabase;
    } catch (error) {
      console.error('Error connecting to Supabase AI:', error);
      throw error;
    }
  },
  
  // Analyze resume and extract information
  analyzeResume: async (resumeText: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data, error } = await supabase.functions.invoke('resume-parser', {
        body: { text: resumeText }
      });
      
      if (error) throw error;
      if (data) return data;
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock resume analysis data');
      
      // Mock response - in a real implementation, this would use NLP models
      return {
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'AWS'],
        education: ['Bachelor of Computer Science', 'Master of Information Technology'],
        experience: 5,
        score: 85,
        recommendations: [
          'Strong technical skills in full-stack development',
          'Good experience with cloud technologies',
          'Consider for senior developer roles'
        ],
        matchingJobs: [
          'Senior Software Engineer',
          'Full Stack Developer',
          'React Developer'
        ]
      };
    }
  },
  
  // Analyze attendance patterns
  analyzeAttendancePattern: async (employeeId: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data, error } = await supabase.functions.invoke('attendance-analytics', {
        body: { employeeId }
      });
      
      if (error) throw error;
      if (data) return data;
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock attendance analysis data');
      
      // Mock response - in a real implementation, this would use time series analysis
      return {
        patterns: {
          lateArrivals: 3,
          earlyDepartures: 2,
          absenteeism: 1,
          overtimeHours: 12
        },
        predictions: {
          nextWeekAttendance: 95,
          riskScore: 15
        },
        anomalies: [
          'Consistently late on Mondays',
          'Higher absence rate compared to team average'
        ]
      };
    }
  },
  
  // Predict payroll costs
  predictPayrollCosts: async (period: 'next-month' | 'next-quarter' | 'next-year') => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200)); 
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data, error } = await supabase.functions.invoke('payroll-prediction', {
        body: { period }
      });
      
      if (error) throw error;
      if (data) return data;
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock payroll prediction data');
      
      // Mock response - in a real implementation, this would use forecasting models
      return {
        predictedCosts: {
          'next-month': 125000,
          'next-quarter': 380000,
          'next-year': 1560000
        }[period],
        growthRate: 5.2,
        confidenceInterval: {
          lower: period === 'next-month' ? 120000 : (period === 'next-quarter' ? 360000 : 1480000),
          upper: period === 'next-month' ? 130000 : (period === 'next-quarter' ? 400000 : 1640000)
        },
        costOptimization: [
          'Consider reviewing overtime policies to reduce excess costs',
          'Identify departments with high turnover for retention strategies',
          'Analyze benefit utilization to optimize offerings',
          'Review salary bands for market competitiveness',
          'Consider implementing flexible work arrangements to reduce facility costs'
        ]
      };
    }
  },
  
  // Categorize document
  categorizeDocument: async (documentText: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 600)); 
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data, error } = await supabase.functions.invoke('document-classifier', {
        body: { text: documentText }
      });
      
      if (error) throw error;
      if (data && data.category) return data.category;
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock document classification data');
      
      // Mock document classification - in a real implementation, this would use a classification model
      const categories = ['Resume', 'Invoice', 'Contract', 'Policy', 'Report'];
      return categories[Math.floor(Math.random() * categories.length)];
    }
  },
  
  // Process chatbot message
  processMessage: async (message: string, context: any) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message, context }
      });
      
      if (error) throw error;
      if (data && data.response) return data.response;
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock chatbot response data');
      
      // Mock response - in a real implementation, this would use NLP models
      const responses = [
        'I can help you with that. What specific information do you need?',
        'Let me check that for you. In a real implementation, I would connect to the backend.',
        'I understand your request. How else can I assist you today?',
        'That\'s a good question. I\'d typically fetch that information from our HR database.',
        'I\'m here to help with your HR needs. Could you provide more details?'
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  },
  
  // Generate insights based on data
  generateInsights: async (domain: string, data: any): Promise<AIInsight[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    try {
      // Try to use Supabase AI if available
      const supabase = await aiService.connectToSupabaseAI();
      
      // Call Supabase AI function
      const { data: aiData, error } = await supabase.functions.invoke('generate-insights', {
        body: { domain, data }
      });
      
      if (error) throw error;
      if (aiData && Array.isArray(aiData)) return aiData as AIInsight[];
      
      // Fallback to mock if Supabase call fails
      throw new Error('Fallback to mock data');
    } catch (error) {
      console.log('Using mock insights data');
      
      // Mock insights - in a real implementation, this would use various ML models
      const insights: AIInsight[] = [
        {
          type: 'prediction',
          title: 'Performance Trajectory',
          description: 'Based on current performance trends, this employee is likely to exceed targets in the next quarter.',
          confidence: 0.85,
          actionable: false,
          priority: 'medium'
        },
        {
          type: 'recommendation',
          title: 'Skill Development',
          description: 'Consider training in leadership skills to prepare for future management roles.',
          confidence: 0.92,
          actionable: true,
          priority: 'high'
        },
        {
          type: 'anomaly',
          title: 'Attendance Pattern',
          description: 'Unusual pattern of Monday absences detected over the past 3 months.',
          confidence: 0.78,
          actionable: true,
          priority: 'medium'
        },
        {
          type: 'trend',
          title: 'Productivity Increase',
          description: 'Consistent improvement in task completion rate over the last 6 months.',
          confidence: 0.88,
          actionable: false,
          priority: 'low',
          metadata: {
            trend: 'positive',
            percentage: 12.5
          }
        },
        {
          type: 'prediction',
          title: 'Retention Risk',
          description: 'Low risk of attrition based on engagement metrics and performance satisfaction.',
          confidence: 0.76,
          actionable: false,
          priority: 'low'
        },
        {
          type: 'recommendation',
          title: 'Project Assignment',
          description: 'Consider assigning to Project Alpha based on skill match and availability.',
          confidence: 0.89,
          actionable: true,
          priority: 'medium'
        }
      ];
      
      return insights;
    }
  }
};

// Open-source AI implementations
// These would be replaced with actual open-source model calls in production
export const openSourceAI = {
  // Extract entities from text using NER
  extractEntities: async (text: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock entities - in a real implementation, this would use spaCy or similar
    const entities = [];
    
    if (text.includes('John')) {
      entities.push({ entity: 'John Smith', type: 'PERSON' });
    }
    
    if (text.includes('Google')) {
      entities.push({ entity: 'Google', type: 'ORGANIZATION' });
    }
    
    if (text.includes('New York')) {
      entities.push({ entity: 'New York', type: 'LOCATION' });
    }
    
    if (text.match(/\$\d+/)) {
      entities.push({ entity: text.match(/\$\d+/)?.[0] || '$100', type: 'MONEY' });
    }
    
    if (text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
      entities.push({ entity: text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)?.[0] || '01/01/2023', type: 'DATE' });
    }
    
    // Add some random entities if none were found
    if (entities.length === 0) {
      entities.push(
        { entity: 'Jane Doe', type: 'PERSON' },
        { entity: 'Microsoft', type: 'ORGANIZATION' },
        { entity: 'Seattle', type: 'LOCATION' }
      );
    }
    
    return entities;
  },
  
  // Analyze sentiment of text
  analyzeSentiment: async (text: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock sentiment analysis - in a real implementation, this would use a sentiment model
    let sentiment = 'neutral';
    let score = 0.5;
    
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'positive', 'best', 'love', 'impressive'];
    const negativeWords = ['bad', 'poor', 'terrible', 'unhappy', 'negative', 'worst', 'hate', 'disappointing'];
    
    const words = text.toLowerCase().split(/\s+/);
    
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = 0.5 + (positiveCount / words.length) * 0.5;
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = 0.5 - (negativeCount / words.length) * 0.5;
    }
    
    return { sentiment, score };
  },
  
  // Classify document type
  classifyDocument: async (text: string, categories: string[]) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock document classification - in a real implementation, this would use a classification model
    const categoryScores = categories.map(category => {
      let score = Math.random();
      
      // Bias the score based on keywords
      const keywords: Record<string, string[]> = {
        'Resume': ['experience', 'skills', 'education', 'work', 'job', 'career'],
        'Invoice': ['payment', 'amount', 'due', 'invoice', 'bill', 'total'],
        'Contract': ['agreement', 'terms', 'conditions', 'parties', 'signed', 'legal'],
        'Policy': ['policy', 'guidelines', 'rules', 'compliance', 'procedure', 'regulation'],
        'Report': ['report', 'analysis', 'findings', 'results', 'conclusion', 'summary'],
        'Letter': ['dear', 'sincerely', 'regards', 'address', 'greeting', 'signature'],
        'Email': ['subject', 'sender', 'recipient', 'forwarded', 'replied', 'inbox']
      };
      
      if (keywords[category]) {
        const matchCount = keywords[category].filter(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        score = Math.min(0.95, score + (matchCount / keywords[category].length) * 0.5);
      }
      
      return { category, score };
    });
    
    // Sort by score and get the highest
    categoryScores.sort((a, b) => b.score - a.score);
    
    return {
      category: categoryScores[0].category,
      confidence: categoryScores[0].score,
      allCategories: categoryScores
    };
  },
  
  // Detect anomalies in time series data
  detectAnomalies: async (data: number[]) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock anomaly detection - in a real implementation, this would use statistical methods
    // Calculate mean and standard deviation
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    );
    
    // Mark values that are more than 2 standard deviations from the mean as anomalies
    const threshold = 2;
    
    return data.map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      return {
        index,
        value,
        isAnomaly: zScore > threshold,
        score: zScore,
        mean,
        stdDev
      };
    });
  },
  
  // Forecast time series data
  forecastTimeSeries: async (historicalData: { date: string; value: number }[], periods: number) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock time series forecasting - in a real implementation, this would use Prophet or similar
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const lastValue = historicalData[historicalData.length - 1].value;
    
    // Simple forecasting with slight random variations and trend continuation
    const result = [];
    
    // Calculate average change
    let avgChange = 0;
    for (let i = 1; i < historicalData.length; i++) {
      avgChange += historicalData[i].value - historicalData[i-1].value;
    }
    avgChange = avgChange / (historicalData.length - 1);
    
    for (let i = 1; i <= periods; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      // Add trend and some randomness
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
      const forecastValue = Math.round(lastValue + (avgChange * i * randomFactor));
      
      // Add confidence intervals
      const uncertainty = 0.05 + (i * 0.01); // Increases with forecast distance
      const lower = Math.round(forecastValue * (1 - uncertainty));
      const upper = Math.round(forecastValue * (1 + uncertainty));
      
      result.push({
        date: forecastDate.toISOString().split('T')[0],
        value: forecastValue,
        lower,
        upper
      });
    }
    
    return result;
  }
};

// Memoize expensive AI operations
export const memoizedAI = {
  extractEntities: memoize(openSourceAI.extractEntities),
  analyzeSentiment: memoize(openSourceAI.analyzeSentiment),
  classifyDocument: memoize(openSourceAI.classifyDocument)
};