import { LeaveRequest } from '../service/api/ApiService';

export const mockLeaveRequests: LeaveRequest[] = [
  {
    _id: '1',
    employeeId: {
      _id: '683ff0dc49cf57e75c65cbf3',
      email: 'test1@example.com'
    },
    type: 'sick',
    reason: 'Cảm sốt nặng',
    startDate: '2025-06-10',
    endDate: '2025-06-12',
    status: 'pending',
    createdAt: '2025-06-05T22:07:44.579Z',
  },
  {
    _id: '2',
    employeeId: {
      _id: '683ff0dc49cf57e75c65cbf3',
      email: 'test1@example.com'
    },
    type: 'annual',
    reason: 'Nghỉ phép năm',
    startDate: '2025-07-01',
    endDate: '2025-07-03',
    status: 'approved',
    createdAt: '2025-06-04T10:15:00.000Z',
  },
  {
    _id: '3',
    employeeId: {
      _id: '683ff0dc49cf57e75c65cbf3',
      email: 'test1@example.com'
    },
    type: 'sick',
    reason: 'Đau bụng',
    startDate: '2025-06-15',
    endDate: '2025-06-16',
    status: 'pending',
    createdAt: '2025-06-05T08:30:00.000Z',
  }
];