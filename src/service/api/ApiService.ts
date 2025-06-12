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

export type LeaveType = 'sick' | 'annual';

export interface LeaveRequest {
  _id: string;
  employeeId: {
    _id: string;
    email: string;
  };
  type: LeaveType; // Update this to use LeaveType
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved';
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
};

interface CreateLeaveRequest {
  type: 'sick' | 'annual';
  reason: string;
  startDate: string;
  endDate: string;
}

export const createLeaveRequest = async (
  token: string,
  data: CreateLeaveRequest,
) => {
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

interface LoginRequest {
  email: string;
  password: string;
  fcmToken: string;
}

interface LoginResponse {
  accessToken: string;
}

export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  data: {
    requestId: string;
    type: string;
    status: string;
  };
  type: string;
  status: string;
  isRead: boolean;
  readAt: string | null;
  fcmMessageId: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
}

export const getNotifications = async (token: string) => {
  try {
    const response = await api.get<NotificationResponse>('/notify/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

interface LeaveDetailResponse {
  success: boolean;
  message: string;
  data: LeaveRequest;
}

export const getLeaveDetail = async (
  token: string,
  leaveId: string,
): Promise<LeaveRequest> => {
  try {
    const response = await api.get<LeaveDetailResponse>(
      `/leave-requests/${leaveId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Get leave detail error:', error);
    throw error;
  }
};

export const deleteLeaveRequest = async (token: string, leaveId: string) => {
  try {
    const response = await api.delete(`/leave-requests/${leaveId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete leave request error:', error);
    throw error;
  }
};

// test git

export interface UpdateLeaveRequest {
  type: LeaveType;
  reason: string;
  startDate: string;
  endDate: string;
}

export const updateLeaveRequest = async (
  token: string,
  leaveId: string,
  data: UpdateLeaveRequest,
) => {
  try {
    const response = await api.put(`/leave-requests/${leaveId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update leave request error:', error);
    throw error;
  }
};

export interface OTReport {
  _id: string;
  employeeId: {
    _id: string;
    email: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  status: 'pending' | 'approved';
  project: string;
  tasks: string;
  createdAt: string;
  updatedAt: string;
}

interface OTResponse {
  success: boolean;
  data: {
    reports: OTReport[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
    };
  };
}

export const getOTReports = async (token: string) => {
  try {
    const response = await api.get<OTResponse>('/ot-reports', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.reports;
  } catch (error) {
    console.error('Get OT reports error:', error);
    throw error;
  }
};

interface OTDetailResponse {
  success: boolean;
  data: OTReport;
}

export const getOTDetail = async (
  token: string,
  otId: string,
): Promise<OTReport> => {
  try {
    const response = await api.get<OTDetailResponse>(`/ot-reports/${otId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Get OT detail error:', error);
    throw error;
  }
};

export interface UpdateOTRequest {
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  project: string;
  tasks: string;
}

export const updateOTReport = async (
  token: string,
  otId: string,
  data: UpdateOTRequest,
) => {
  try {
    const response = await api.put(`/ot-reports/${otId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update OT report error:', error);
    throw error;
  }
};

export interface CreateOTRequest {
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  project: string;
  tasks: string;
}

export const createOTReport = async (token: string, data: CreateOTRequest) => {
  try {
    const response = await api.post('/ot-reports', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create OT report error:', error);
    throw error;
  }
};

export interface TimeLog {
  checkIn: string;
  checkOut: string;
  duration: number;
  _id: string;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    email: string;
  };
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
  timeLogs: TimeLog[];
}

interface AttendanceHistoryResponse {
  success: boolean;
  data: {
    records: AttendanceRecord[];
    statistics: {
      totalDays: number;
      completedDays: number;
      averageHours: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
    };
  };
}

export const checkAttendance = async (token: string) => {
  try {
    const response = await api.post(
      '/attendance/check',
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Check attendance error:', error);
    throw error;
  }
};

export const getAttendanceHistory = async (token: string) => {
  try {
    const response = await api.get<AttendanceHistoryResponse>(
      '/attendance/history',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Get attendance history error:', error);
    throw error;
  }
};

export interface Employee {
  _id: string;
  email: string;
}

export interface ShiftEmployee {
  employeeId: Employee;
  name: string;
  position: string;
}

export interface DayShifts {
  morning: ShiftEmployee[];
  afternoon: ShiftEmployee[];
}

export interface ScheduleDay {
  shifts: DayShifts;
  date: string;
}

export interface Schedule {
  _id: string;
  weekStart: string;
  weekEnd: string;
  days: ScheduleDay[];
  createdBy: string;
  createdAt: string;
}

interface ScheduleResponse {
  success: boolean;
  currentDate: string;
  data: Schedule;
  message: string;
  weekInfo: {
    weekStart: string;
    weekEnd: string;
    isCurrentWeek: boolean;
  };
}

export const getWeeklySchedule = async (token: string) => {
  try {
    const response = await api.get<ScheduleResponse>('/schedules/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get schedule error:', error);
    throw error;
  }
};
