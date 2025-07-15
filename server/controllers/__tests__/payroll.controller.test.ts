import request from 'supertest';
import { app } from '../../index'; // Adjusted import to named export 'app'
import mongoose from 'mongoose';
import { PayrollStatus } from '../../models/payroll.model';
import Employee from '../../models/employee.model';
import Payroll from '../../models/payroll.model';


describe('Payroll Controller', () => {
  let adminToken;
  let hrToken;
  let employeeId;
  let payrollId;

  beforeAll(async () => {
    // Setup test users and tokens here or mock authentication
    // For simplicity, assume tokens are available or mock middleware to bypass auth

    // Create a test employee
    const employee = new Employee({
      employeeId: 'EMP123',
      userId: new mongoose.Types.ObjectId(),
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        phone: '1234567890',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        maritalStatus: 'Single',
        nationality: 'Testland',
        address: {
          street: '123 Test St',
          city: 'Testville',
          state: 'TS',
          country: 'Testland',
          zipCode: '12345'
        },
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Friend',
          phone: '0987654321'
        }
      },
      companyInfo: {
        department: 'Engineering',
        designation: 'Developer',
        reportingManager: 'Manager',
        dateOfJoining: new Date('2020-01-01'),
        employmentType: 'Full-time',
        workLocation: 'Remote',
        shift: 'Day',
        probationPeriod: 3
      },
      bankInfo: {
        bankName: 'Test Bank',
        accountNumber: '123456789',
        routingNumber: '987654321',
        accountType: 'Savings'
      },
      documents: [],
      qualifications: [],
      previousEmployment: [],
      status: 'active',
      onboardingStep: 1,
      tenantId: 'tenant1'
    });
    await employee.save();
    employeeId = employee._id;

    // Mock tokens or setup authentication here
    adminToken = 'mock-admin-token';
    hrToken = 'mock-hr-token';
  });

  afterAll(async () => {
    await Payroll.deleteMany({});
    await Employee.deleteMany({});
    await mongoose.connection.close();
  });

  test('Generate payroll - success', async () => {
    const res = await request(app)
      .post('/payroll/generate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        employeeId: employeeId.toString(),
        month: 7,
        year: 2024
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('payroll');
    payrollId = res.body.payroll._id;
  });

  test('Process payroll - success', async () => {
    const res = await request(app)
      .post(`/payroll/process/${payrollId}`)
      .set('Authorization', `Bearer ${hrToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.payroll.status).toBe(PayrollStatus.PROCESSED);
  });

  test('Mark payroll as paid - success', async () => {
    const res = await request(app)
      .post(`/payroll/mark-paid/${payrollId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ paymentDate: new Date().toISOString() });
    expect(res.statusCode).toBe(200);
    expect(res.body.payroll.status).toBe(PayrollStatus.PAID);
  });

  test('Get payroll records - success', async () => {
    const res = await request(app)
      .get('/payroll/records')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ employeeId: employeeId.toString(), page: 1, limit: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.records.length).toBeGreaterThanOrEqual(1);
  });

  test('Get payroll by ID - success', async () => {
    const res = await request(app)
      .get(`/payroll/${payrollId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(payrollId.toString());
  });

  test('Generate bulk payroll - success', async () => {
    const res = await request(app)
      .post('/payroll/generate-bulk')
      .set('Authorization', `Bearer ${hrToken}`)
      .send({ month: 7, year: 2024 });
    expect(res.statusCode).toBe(201);
    expect(res.body.payrolls.length).toBeGreaterThanOrEqual(1);
  });

  test('Get payroll statistics - success', async () => {
    const res = await request(app)
      .get('/payroll/stats')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ month: 7, year: 2024 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalEmployees');
  });
});
