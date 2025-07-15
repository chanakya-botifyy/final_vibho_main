import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { register, login, getCurrentUser, refreshToken, changePassword, forgotPassword, resetPassword, logout } from '../auth.controller';
import { User } from '../../models/user.model';

// Mock express app
const app = express();
app.use(bodyParser.json());

// Mock routes for testing
app.post('/register', register);
app.post('/login', login);
app.get('/me', (req, res) => {
  // Mock req.user for getCurrentUser
  (req as any).user = { id: 'mockUserId', role: 'employee', tenantId: 'default' };
  return getCurrentUser(req, res);
});
app.post('/refresh-token', refreshToken);
app.post('/change-password', (req, res) => {
  (req as any).user = { id: 'mockUserId', role: 'employee', tenantId: 'default' };
  return changePassword(req, res);
});
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.post('/logout', logout);

// Mock User model methods
jest.mock('../../models/user.model', () => {
  const originalModule = jest.requireActual('../../models/user.model');
  return {
    ...originalModule,
    User: {
      findOne: jest.fn(),
      findById: jest.fn(),
      prototype: {
        generateAuthToken: jest.fn(() => 'mockToken'),
        comparePassword: jest.fn(() => Promise.resolve(true)),
        save: jest.fn(),
      },
    },
  };
});

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register - should register a new user and return token', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.prototype.save as jest.Mock).mockResolvedValue(true);

    const res = await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'employee',
      tenantId: 'default',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('login - should login user and return token', async () => {
    const mockUser = {
      _id: 'mockUserId',
      email: 'test@example.com',
      isActive: true,
      role: 'employee',
      comparePassword: jest.fn(() => Promise.resolve(true)),
      generateAuthToken: jest.fn(() => 'mockToken'),
      save: jest.fn(),
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('getCurrentUser - should return current user', async () => {
    const mockUser = {
      _id: 'mockUserId',
      email: 'test@example.com',
      role: 'employee',
      avatar: '',
      department: '',
      designation: '',
      employeeId: '',
      tenantId: 'default',
      lastLogin: new Date(),
    };
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).get('/me');

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  // Additional tests for refreshToken, changePassword, forgotPassword, resetPassword, logout can be added similarly
});
