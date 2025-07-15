import request from 'supertest';
import app from '../../app'; // Adjust the import path to your Express app
import mongoose from 'mongoose';

describe('Timesheet Controller - Critical Path Tests', () => {
  const authToken = '';
  let createdTimesheetId = '';

  beforeAll(async () => {
    // TODO: Obtain auth token for testing, e.g., login as a test user
    // authToken = await getAuthToken();
  });

  afterAll(async () => {
    // Close DB connection after tests
    await mongoose.connection.close();
  });

  test('Create Timesheet - POST /timesheets', async () => {
    const response = await request(app)
      .post('/timesheets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        weekStartDate: '2024-06-01',
        entries: [
          { project: '60d21b4667d0d8992e610c85', hours: 8 }
        ]
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('timesheet');
    createdTimesheetId = response.body.timesheet._id;
  });

  test('Update Timesheet - PUT /timesheets/:id', async () => {
    const response = await request(app)
      .put(`/timesheets/${createdTimesheetId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        entries: [
          { project: '60d21b4667d0d8992e610c85', hours: 6 }
        ]
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timesheet');
  });

  test('Submit Timesheet - POST /timesheets/:id/submit', async () => {
    const response = await request(app)
      .post(`/timesheets/${createdTimesheetId}/submit`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timesheet');
  });

  test('Approve Timesheet - POST /timesheets/:id/approve', async () => {
    const response = await request(app)
      .post(`/timesheets/${createdTimesheetId}/approve`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timesheet');
  });

  test('Reject Timesheet - POST /timesheets/:id/reject', async () => {
    const response = await request(app)
      .post(`/timesheets/${createdTimesheetId}/reject`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reason: 'Incorrect hours' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timesheet');
  });

  test('Get Timesheets - GET /timesheets', async () => {
    const response = await request(app)
      .get('/timesheets')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timesheets');
  });

  test('Get Timesheet By ID - GET /timesheets/:id', async () => {
    const response = await request(app)
      .get(`/timesheets/${createdTimesheetId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', createdTimesheetId);
  });

  test('Get Timesheet Stats - GET /timesheets/stats', async () => {
    const response = await request(app)
      .get('/timesheets/stats')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalTimesheets');
  });
});
