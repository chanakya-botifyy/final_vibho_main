import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Zoom,
  Slide,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  Person
} from '@mui/icons-material';
import { processChatbotMessage } from '../../api/ai';
import { useAuthStore } from '../../store/useAuthStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: `Hello ${user?.name || 'there'}! I'm your VibhoHCM assistant. How can I help you today?`,
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

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Add a system message about authentication
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: "Please log in to use the chatbot feature.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setInput('');
      return;
    }
    
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
      // In development, use a mock response
      // const response = await processChatbotMessage(input);
      
      // Mock response
      const mockResponses = [
        "I can help you with that. What specific information do you need?",
        "Let me check that for you. In a real implementation, I would connect to the backend.",
        "I understand your request. How else can I assist you today?",
        "That's a good question. I'd typically fetch that information from our HR database.",
        "I'm here to help with your HR needs. Could you provide more details?"
      ];
      
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
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

  return (
    <>
      {/* Chatbot toggle button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <Close /> : <SmartToy />}
      </Fab>

      {/* Chatbot window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            width: 350,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy />
              <Typography variant="h6">VibhoHCM Assistant</Typography>
            </Box>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map(message => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  {message.sender === 'user' ? <Person /> : <SmartToy />}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                  <Typography variant="caption" color={message.sender === 'user' ? 'white' : 'text.secondary'} sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  <SmartToy />
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'grey.100',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <CircularProgress size={10} />
                    <CircularProgress size={10} />
                    <CircularProgress size={10} />
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default Chatbot;