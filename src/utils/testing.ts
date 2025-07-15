// Testing utilities for the application

/**
 * Wait for a specified amount of time
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate a mock employee object for testing
 * @param overrides Properties to override in the default mock
 * @returns Mock employee object
 */
export const mockEmployee = (overrides = {}) => {
  return {
    id: `emp-${Math.random().toString(36).substr(2, 9)}`,
    employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe${Math.floor(Math.random() * 1000)}@example.com`,
      phone: '+1-555-0123',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'American',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Sister',
        phone: '+1-555-0124'
      }
    },
    companyInfo: {
      department: 'Engineering',
      designation: 'Software Engineer',
      reportingManager: 'Michael Chen',
      dateOfJoining: new Date('2023-01-15'),
      employmentType: 'Full-time',
      workLocation: 'New York Office',
      shift: 'Day Shift'
    },
    status: 'active',
    ...overrides
  };
};

/**
 * Generate a mock timesheet entry for testing
 * @param overrides Properties to override in the default mock
 * @returns Mock timesheet entry
 */
export const mockTimesheetEntry = (overrides = {}) => {
  return {
    id: `entry-${Math.random().toString(36).substr(2, 9)}`,
    employeeId: `emp-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
    projectId: `proj-${Math.random().toString(36).substr(2, 9)}`,
    projectName: 'Project Alpha',
    taskId: `task-${Math.random().toString(36).substr(2, 9)}`,
    taskName: 'Development',
    hours: 8,
    description: 'Worked on feature implementation',
    billable: true,
    status: 'draft',
    ...overrides
  };
};

/**
 * Generate a mock leave request for testing
 * @param overrides Properties to override in the default mock
 * @returns Mock leave request
 */
export const mockLeaveRequest = (overrides = {}) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 3);
  
  return {
    id: `leave-${Math.random().toString(36).substr(2, 9)}`,
    employeeId: `emp-${Math.random().toString(36).substr(2, 9)}`,
    type: 'annual',
    startDate,
    endDate,
    days: 4,
    reason: 'Personal vacation',
    status: 'pending',
    appliedDate: new Date(),
    ...overrides
  };
};

/**
 * Generate a mock API response for testing
 * @param data Response data
 * @param status HTTP status code
 * @param statusText HTTP status text
 * @returns Mock API response
 */
export const mockApiResponse = (data: any, status = 200, statusText = 'OK') => {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {},
  };
};

/**
 * Generate a mock API error for testing
 * @param message Error message
 * @param status HTTP status code
 * @param data Response data
 * @returns Mock API error
 */
export const mockApiError = (message = 'An error occurred', status = 500, data = {}) => {
  const error = new Error(message) as any;
  error.isAxiosError = true;
  error.response = {
    data,
    status,
    statusText: message,
    headers: {},
    config: {}
  };
  return error;
};

/**
 * Create a mock store for testing
 * @param initialState Initial state for the store
 * @returns Mock store object with state and actions
 */
export const createMockStore = (initialState = {}) => {
  let state = { ...initialState };
  const listeners: Function[] = [];
  
  return {
    getState: () => state,
    setState: (newState: any) => {
      state = { ...state, ...newState };
      listeners.forEach(listener => listener());
    },
    subscribe: (listener: Function) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    dispatch: (action: any) => {
      console.log('Mock store dispatch:', action);
      return action;
    }
  };
};