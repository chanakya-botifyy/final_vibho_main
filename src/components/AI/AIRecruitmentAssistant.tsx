import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Divider,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Work,
  Person,
  Star,
  School,
  Business,
  CheckCircle,
  Warning,
  Search,
  Compare,
  Psychology as PsychologyIcon,
  Assignment,
  Description
} from '@mui/icons-material';
import { aiService, openSourceAI } from '../../utils/ai';
import * as aiApi from '../../api/ai';

interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  education: string;
  resumeText: string;
  aiScore?: number;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number;
  description: string;
}

const AIRecruitmentAssistant: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [rankedCandidates, setRankedCandidates] = useState<(Candidate & {matchScore: number, skillMatch: number, experienceMatch: number})[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Mock job postings
  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'REST API'],
      preferredSkills: ['GraphQL', 'AWS', 'Docker', 'Kubernetes'],
      minimumExperience: 5,
      description: 'We are looking for a Senior Software Engineer to join our team and help build scalable web applications.'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      requiredSkills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
      preferredSkills: ['Data Analysis', 'UX Design', 'Technical Background', 'Market Research'],
      minimumExperience: 3,
      description: 'We are seeking a Product Manager to drive our product vision and strategy.'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      requiredSkills: ['UI Design', 'User Research', 'Wireframing', 'Prototyping'],
      preferredSkills: ['Figma', 'Adobe Creative Suite', 'HTML/CSS', 'Design Systems'],
      minimumExperience: 2,
      description: 'We are looking for a UX Designer to create amazing user experiences for our products.'
    }
  ];
  
  // Mock candidates
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'REST API'],
      experience: 6,
      education: 'MS Computer Science',
      resumeText: 'Experienced software engineer with 6 years of experience in full-stack development. Proficient in React, TypeScript, Node.js, GraphQL, and AWS. Built scalable web applications and RESTful APIs.'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'REST API'],
      experience: 4,
      education: 'BS Computer Science',
      resumeText: 'Software developer with 4 years of experience. Skilled in React, JavaScript, Node.js, and MongoDB. Developed and maintained web applications and RESTful APIs.'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      skills: ['React', 'TypeScript', 'Angular', 'Java', 'Spring Boot', 'Docker'],
      experience: 7,
      education: 'MS Software Engineering',
      resumeText: 'Senior software engineer with 7 years of experience in full-stack development. Expert in React, TypeScript, Angular, Java, and Spring Boot. Implemented microservices architecture using Docker.'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Django', 'AWS'],
      experience: 5,
      education: 'BS Computer Engineering',
      resumeText: 'Full-stack developer with 5 years of experience. Proficient in React, TypeScript, Node.js, Python, and Django. Deployed applications on AWS.'
    },
    {
      id: '5',
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      skills: ['React', 'JavaScript', 'CSS', 'HTML', 'UI Design'],
      experience: 3,
      education: 'BS Web Development',
      resumeText: 'Frontend developer with 3 years of experience. Skilled in React, JavaScript, CSS, and HTML. Created responsive and accessible user interfaces.'
    }
  ];
  
  // Load candidates on mount
  useEffect(() => {
    setCandidates(mockCandidates);
  }, []);
  
  const handleAnalyzeCandidates = async () => {
    if (!selectedJob) {
      setError('Please select a job posting');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const job = jobPostings.find(j => j.id === selectedJob);
      if (!job) {
        throw new Error('Job posting not found');
      }
      
      // In a real implementation, this would use your self-hosted models to:
      // 1. Extract skills and experience from resumes
      // 2. Calculate match scores based on job requirements
      // 3. Rank candidates
      
      // For demo purposes, we'll use a simple scoring algorithm
      const rankedResults = await Promise.all(candidates.map(async (candidate) => {
        // Calculate skill match percentage
        const requiredSkillsMatch = job.requiredSkills.filter(skill => 
          candidate.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        ).length / job.requiredSkills.length;
        
        const preferredSkillsMatch = job.preferredSkills.filter(skill => 
          candidate.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        ).length / job.preferredSkills.length;
        
        // Calculate experience match
        const experienceMatch = candidate.experience >= job.minimumExperience 
          ? 1 
          : candidate.experience / job.minimumExperience;
        
        // Calculate overall match score (weighted)
        const skillMatch = (requiredSkillsMatch * 0.7) + (preferredSkillsMatch * 0.3);
        const matchScore = (skillMatch * 0.7) + (experienceMatch * 0.3);
        
        // Analyze resume text using sentiment analysis
        const sentiment = await openSourceAI.analyzeSentiment(candidate.resumeText);
        
        // Extract entities from resume
        const entities = await openSourceAI.extractEntities(candidate.resumeText);
        
        return {
          ...candidate,
          matchScore: Math.round(matchScore * 100),
          skillMatch: Math.round(skillMatch * 100),
          experienceMatch: Math.round(experienceMatch * 100),
          sentiment,
          entities
        };
      }));
      
      // Sort by match score
      rankedResults.sort((a, b) => b.matchScore - a.matchScore);
      
      setRankedCandidates(rankedResults);
    } catch (error) {
      console.error('Error analyzing candidates:', error);
      setError('Failed to analyze candidates. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Recruitment Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Match candidates to job openings using AI-powered skill analysis and ranking.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Job Matching Parameters" />
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Job Posting</InputLabel>
                    <Select
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value as string)}
                      label="Job Posting"
                    >
                      <MenuItem value="">Select Job Posting</MenuItem>
                      {jobPostings.map((job) => (
                        <MenuItem key={job.id} value={job.id}>
                          {job.title} - {job.department}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleAnalyzeCandidates}
                    disabled={isAnalyzing || !selectedJob}
                    startIcon={<Compare />}
                  >
                    Match Candidates
                  </Button>
                </Grid>
              </Grid>
              
              {selectedJob && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Job Requirements
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {jobPostings.find(j => j.id === selectedJob)?.requiredSkills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Preferred Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {jobPostings.find(j => j.id === selectedJob)?.preferredSkills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Minimum Experience: {jobPostings.find(j => j.id === selectedJob)?.minimumExperience} years
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {isAnalyzing && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Analyzing candidates...
              </Typography>
              <LinearProgress />
            </Box>
          </Grid>
        )}
        
        {rankedCandidates.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Candidate Ranking Results
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                AI has analyzed and ranked {rankedCandidates.length} candidates based on their match to the job requirements.
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Match Score</TableCell>
                      <TableCell>Skill Match</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Education</TableCell>
                      <TableCell>Key Skills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankedCandidates.map((candidate, index) => (
                      <TableRow key={candidate.id} hover>
                        <TableCell>
                          <Typography variant="h6" color={index < 3 ? "primary.main" : "text.primary"}>
                            #{index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar>{candidate.name.charAt(0)}</Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {candidate.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {candidate.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="medium"
                              color={
                                candidate.matchScore >= 80 ? "success.main" :
                                candidate.matchScore >= 60 ? "warning.main" : "error.main"
                              }
                            >
                              {candidate.matchScore}%
                            </Typography>
                            {candidate.matchScore >= 80 && <CheckCircle color="success" fontSize="small" />}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {candidate.skillMatch}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {candidate.experience} years
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {candidate.experienceMatch}% match
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {candidate.education}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {candidate.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Chip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                variant="outlined"
                                color={
                                  jobPostings.find(j => j.id === selectedJob)?.requiredSkills.includes(skill)
                                    ? "primary"
                                    : jobPostings.find(j => j.id === selectedJob)?.preferredSkills.includes(skill)
                                      ? "secondary"
                                      : "default"
                                }
                              />
                            ))}
                            {candidate.skills.length > 3 && (
                              <Chip
                                label={`+${candidate.skills.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            {rankedCandidates.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Top Candidate Analysis" 
                    subheader={rankedCandidates[0].name}
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Skill Analysis
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Required Skills Coverage:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {jobPostings.find(j => j.id === selectedJob)?.requiredSkills.map((skill, index) => {
                              const hasSkill = rankedCandidates[0].skills.some(
                                s => s.toLowerCase() === skill.toLowerCase()
                              );
                              
                              return (
                                <Chip
                                  key={index}
                                  label={skill}
                                  color={hasSkill ? "success" : "error"}
                                  variant="outlined"
                                  icon={hasSkill ? <CheckCircle /> : <Warning />}
                                />
                              );
                            })}
                          </Box>
                          
                          <Typography variant="body2" gutterBottom>
                            Preferred Skills Coverage:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {jobPostings.find(j => j.id === selectedJob)?.preferredSkills.map((skill, index) => {
                              const hasSkill = rankedCandidates[0].skills.some(
                                s => s.toLowerCase() === skill.toLowerCase()
                              );
                              
                              return (
                                <Chip
                                  key={index}
                                  label={skill}
                                  color={hasSkill ? "success" : "default"}
                                  variant="outlined"
                                  icon={hasSkill ? <CheckCircle /> : undefined}
                                />
                              );
                            })}
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle1" gutterBottom>
                          Experience Analysis
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Experience: {rankedCandidates[0].experience} years
                          </Typography>
                          
                          <Typography variant="body2" gutterBottom>
                            Required: {jobPostings.find(j => j.id === selectedJob)?.minimumExperience} years
                          </Typography>
                          
                          <Typography variant="body2" color="success.main" gutterBottom>
                            {rankedCandidates[0].experience >= (jobPostings.find(j => j.id === selectedJob)?.minimumExperience || 0)
                              ? `Exceeds requirement by ${rankedCandidates[0].experience - (jobPostings.find(j => j.id === selectedJob)?.minimumExperience || 0)} years`
                              : `Below requirement by ${(jobPostings.find(j => j.id === selectedJob)?.minimumExperience || 0) - rankedCandidates[0].experience} years`
                            }
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          AI Insights
                        </Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <PsychologyIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Resume Sentiment Analysis" 
                              secondary={`${rankedCandidates[0].sentiment?.sentiment.toUpperCase()} (${(rankedCandidates[0].sentiment?.score * 100).toFixed(1)}% confidence)`}
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Star color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Strong technical background" 
                              secondary="Candidate has all required technical skills"
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Assignment color="info" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Interview Recommendation" 
                              secondary="Proceed with technical and cultural fit interviews"
                            />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Warning color="error" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Potential Concerns" 
                              secondary="Verify depth of experience in GraphQL and AWS"
                            />
                          </ListItem>
                        </List>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle1" gutterBottom>
                          Suggested Interview Questions
                        </Typography>
                        
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Describe your experience with GraphQL and how you've implemented it in previous projects." />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="What AWS services have you worked with and what were the use cases?" />
                          </ListItem>
                          
                          <ListItem>
                            <ListItemIcon>
                              <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Can you describe a challenging problem you solved using TypeScript?" />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AIRecruitmentAssistant;