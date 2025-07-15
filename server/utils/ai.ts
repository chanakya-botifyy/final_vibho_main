import { NlpManager } from 'node-nlp';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Initialize NLP manager for chatbot
const nlpManager = new NlpManager({ languages: ['en'] });

// Train NLP manager with intents and responses
const trainChatbot = async () => {
  // Leave-related intents
  nlpManager.addDocument('en', 'how many leave days do I have', 'leave.balance');
  nlpManager.addDocument('en', 'what is my leave balance', 'leave.balance');
  nlpManager.addDocument('en', 'check my remaining leaves', 'leave.balance');
  
  nlpManager.addDocument('en', 'how do I apply for leave', 'leave.apply');
  nlpManager.addDocument('en', 'I want to take time off', 'leave.apply');
  nlpManager.addDocument('en', 'request vacation', 'leave.apply');
  
  nlpManager.addDocument('en', 'what is the status of my leave request', 'leave.status');
  nlpManager.addDocument('en', 'has my leave been approved', 'leave.status');
  
  // Payroll-related intents
  nlpManager.addDocument('en', 'when will I get my salary', 'payroll.date');
  nlpManager.addDocument('en', 'salary payment date', 'payroll.date');
  
  nlpManager.addDocument('en', 'how to download payslip', 'payroll.download');
  nlpManager.addDocument('en', 'get my payslip', 'payroll.download');
  
  nlpManager.addDocument('en', 'explain my salary breakdown', 'payroll.breakdown');
  nlpManager.addDocument('en', 'what are the deductions in my salary', 'payroll.breakdown');
  
  // Attendance-related intents
  nlpManager.addDocument('en', 'how to mark attendance', 'attendance.mark');
  nlpManager.addDocument('en', 'check in procedure', 'attendance.mark');
  
  nlpManager.addDocument('en', 'how to apply for regularization', 'attendance.regularize');
  nlpManager.addDocument('en', 'forgot to mark attendance', 'attendance.regularize');
  
  // Add responses
  nlpManager.addAnswer('en', 'leave.balance', 'You can check your leave balance in the "My Leave" section of your dashboard.');
  nlpManager.addAnswer('en', 'leave.apply', 'To apply for leave, go to the "My Leave" section and click on "Apply Leave" button.');
  nlpManager.addAnswer('en', 'leave.status', 'You can check the status of your leave requests in the "My Leave" section under "Leave History".');
  
  nlpManager.addAnswer('en', 'payroll.date', 'Salaries are typically processed on the last working day of each month.');
  nlpManager.addAnswer('en', 'payroll.download', 'You can download your payslip from the "My Payroll" section of your dashboard.');
  nlpManager.addAnswer('en', 'payroll.breakdown', 'Your salary breakdown including all allowances and deductions can be viewed in the "My Payroll" section.');
  
  nlpManager.addAnswer('en', 'attendance.mark', 'You can mark your attendance by clicking on the "Check In" button in the "Attendance" section.');
  nlpManager.addAnswer('en', 'attendance.regularize', 'To apply for attendance regularization, go to the "Attendance" section and click on "Request Regularization".');
  
  // Train the model
  await nlpManager.train();
  console.log('NLP Manager trained successfully');
};

// Process chatbot message
export const processChatbotMessage = async (message: string) => {
  try {
    const response = await nlpManager.process('en', message);
    
    if (response.intent && response.score > 0.7) {
      return {
        intent: response.intent,
        answer: response.answer,
        score: response.score
      };
    }
    
    return {
      intent: 'none',
      answer: "I'm sorry, I don't understand that question. Please try rephrasing or contact support for assistance.",
      score: 0
    };
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    return {
      intent: 'error',
      answer: "Sorry, I'm having trouble processing your request right now. Please try again later.",
      score: 0
    };
  }
};

// Resume parsing function
export const parseResume = async (resumeText: string) => {
  try {
    // In a real implementation, this would use a more sophisticated NLP model
    // For this example, we'll use a simple keyword extraction approach
    
    const skills = extractSkills(resumeText);
    const education = extractEducation(resumeText);
    const experience = estimateExperience(resumeText);
    
    return {
      skills,
      education,
      experience,
      score: calculateResumeScore(skills, experience)
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    return {
      skills: [],
      education: [],
      experience: 0,
      score: 0
    };
  }
};

// Helper functions for resume parsing
const extractSkills = (text: string) => {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
    'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust',
    'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
    'MongoDB', 'MySQL', 'PostgreSQL', 'SQL Server', 'Oracle', 'Redis',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
    'Agile', 'Scrum', 'Kanban', 'Waterfall', 'TDD', 'BDD',
    'REST', 'GraphQL', 'gRPC', 'WebSockets', 'Microservices', 'Serverless'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills;
};

const extractEducation = (text: string) => {
  const educationKeywords = [
    'Bachelor', 'Master', 'PhD', 'Doctorate', 'BSc', 'MSc', 'MBA',
    'Computer Science', 'Information Technology', 'Engineering',
    'University', 'College', 'Institute', 'School'
  ];
  
  const foundEducation = educationKeywords.filter(edu => 
    text.toLowerCase().includes(edu.toLowerCase())
  );
  
  return foundEducation;
};

const estimateExperience = (text: string) => {
  // Simple heuristic: count the number of years mentioned
  const yearPattern = /(\d+)[\s-]*(year|yr)/gi;
  const matches = text.match(yearPattern);
  
  if (matches && matches.length > 0) {
    // Extract the numbers from matches
    const years = matches.map(match => {
      const num = match.match(/\d+/);
      return num ? parseInt(num[0]) : 0;
    });
    
    // Return the highest number as the estimated experience
    return Math.max(...years);
  }
  
  return 0;
};

const calculateResumeScore = (skills: string[], experience: number) => {
  // Simple scoring algorithm
  const skillScore = Math.min(skills.length * 5, 50); // Max 50 points for skills
  const experienceScore = Math.min(experience * 10, 50); // Max 50 points for experience
  
  return skillScore + experienceScore;
};

// Initialize the chatbot
trainChatbot().catch(console.error);

export default {
  processChatbotMessage,
  parseResume
};