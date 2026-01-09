// File: frontend/src/modules/hr/mock/mockData.ts
import type { Employee, AttendanceRecord } from '../types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    employeeNumber: 'EMP-100001',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Nursing',
    position: 'Senior Nurse',
    startDate: '2020-01-10',
    dateOfBirth: '1985-05-20',
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'emp-2',
    employeeNumber: null,
    firstName: 'Mary',
    lastName: 'Smith',
    department: 'Administration',
    position: 'HR Assistant',
    startDate: '2022-07-01',
    dateOfBirth: '1990-08-11',
    approved: false,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: new Date().toISOString().slice(0,10),
    checkIn: '08:02',
    checkOut: '17:10',
    status: 'PENDING',
    lateMinutes: 2,
    overtimeMinutes: 10,
    createdAt: new Date().toISOString(),
  },
];
