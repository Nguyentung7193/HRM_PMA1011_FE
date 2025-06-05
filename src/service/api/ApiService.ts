import axios from 'axios';

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // for Android emulator
  // baseURL: 'http://localhost:5000/api', // for iOS simulator
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LeaveRequest {
  _id: string;
  employeeId: {
    _id: string;
    email: string;
  };
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export interface LeaveResponse {
  message: string;
  data: {
    requests: LeaveRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
    };
  };
}

export const getLeaveRequests = async (token: string) => {
  try {
    const response = await api.get<LeaveResponse>('/leave-requests/leaves', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.requests; // Return the requests array
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

interface CreateLeaveRequest {
  type: 'sick' | 'annual';
  reason: string;
  startDate: string;
  endDate: string;
}

export const createLeaveRequest = async (token: string, data: CreateLeaveRequest) => {
  try {
    const response = await api.post('/leave-requests', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create leave request error:', error);
    throw error;
  }
};