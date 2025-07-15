import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Send,
  Psychology as PsychologyIcon,
  Person,
  AccessTime,
  CalendarMonth,
  AttachMoney,
  Description,
  Help,
  Info,
  Refresh,
  Delete
} from '@mui/icons-material';
import { aiService, openSourceAI } from '../../utils/ai';
import * as aiApi from '../../api/ai';
import { useAuthStore } from '../../store/useAuthStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  entities?: any[];
  sentiment?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  };
}

const AIChatbot: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [context, setContext] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: `Hello ${user?.name || 'there'}! I'm your VibhoHCM AI assistant powered by open-source models. How can I help you today?`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [user, messages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // In a real implementation, call the API
      // const response = await aiApi.processChatbotMessage(input, context);
      
      // For now, use the mock implementation
      const entities = await openSourceAI.extractEntities(input);
      const sentiment = await openSourceAI.analyzeSentiment(input);
      const response = await aiService.processMessage(input, context);
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response, // In real implementation: response.answer
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Simulate typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const clearConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: `Hello ${user?.name || 'there'}! I'm your VibhoHCM AI assistant powered by open-source models. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setContext({});
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get help with HR tasks, answer questions, and access information using our open-source AI assistant.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <CardHeader 
              title="AI Assistant" 
              subheader="Powered by open-source models"
              avatar={<Psychology color="primary" />}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={clearConversation} title="Clear conversation">
                    <Delete />
                  </IconButton>
                  <IconButton title="Refresh context">
                    <Refresh />
                  </IconButton>
                </Box>
              }
            />
            
            <Divider />
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    mb: 2,
                    gap: 1
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {message.sender === 'user' ? <Person /> : <Psychology />}
                  </Avatar>
                  
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                      boxShadow: 1
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                    
                    {message.entities && message.entities.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {message.entities.map((entity, index) => (
                          <Chip
                            key={index}
                            label={`${entity.entity} (${entity.type})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {isTyping && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    <Psychology />
                  </Avatar>
                  
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <CircularProgress size={10} />
                      <CircularProgress size={10} />
                      <CircularProgress size={10} />
                    </Box>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                sx={{ alignSelf: 'center' }}
              >
                <Send />
              </IconButton>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Conversation Context" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                The AI assistant is tracking these contextual elements:
              </Typography>
              
              <List dense>
                {Object.keys(context).length > 0 ? (
                  Object.entries(context).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemIcon>
                        {key === 'date' && <CalendarMonth color="primary" />}
                        {key === 'person' && <Person color="primary" />}
                        {key === 'amount' && <AttachMoney color="primary" />}
                        {key === 'document' && <Description color="primary" />}
                        {key === 'time' && <AccessTime color="primary" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                        secondary={value}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemIcon>
                      <Info color="disabled" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="No context detected yet"
                      secondary="Context will be extracted as you chat"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Suggested Questions" />
            <CardContent>
              <List dense>
                <ListItem button onClick={() => setInput("What's my leave balance?")}>
                  <ListItemIcon>
                    <CalendarMonth color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="What's my leave balance?" />
                </ListItem>
                
                <ListItem button onClick={() => setInput("Show me my attendance this month")}>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Show me my attendance this month" />
                </ListItem>
                
                <ListItem button onClick={() => setInput("When is the next salary payment?")}>
                  <ListItemIcon>
                    <AttachMoney color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="When is the next salary payment?" />
                </ListItem>
                
                <ListItem button onClick={() => setInput("How do I apply for leave?")}>
                  <ListItemIcon>
                    <Help color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="How do I apply for leave?" />
                </ListItem>
                
                <ListItem button onClick={() => setInput("Show me my performance review")}>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Show me my performance review" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper components
const Grid = ({ container, item, xs, md, spacing, children, sx }: any) => (
  <Box
    sx={{
      ...(container && { display: 'flex', flexWrap: 'wrap', margin: spacing ? -spacing/2 : 0 }),
      ...(item && { 
        flex: '0 0 auto',
        width: xs === 12 ? '100%' : xs === 6 ? '50%' : xs === 4 ? '33.33%' : xs === 3 ? '25%' : 'auto',
        '@media (min-width: 900px)': {
          width: md === 12 ? '100%' : md === 8 ? '66.66%' : md === 6 ? '50%' : md === 4 ? '33.33%' : md === 3 ? '25%' : 'auto',
        },
        padding: spacing ? spacing/2 : 0
      }),
      ...sx
    }}
  >
    {children}
  </Box>
);

export default AIChatbot;