// File: frontend/src/modules/hr/types.ts
export type UUID = string;

export type Employee = {
  id: UUID;
  employeeNumber?: string | null;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  startDate: string; // ISO date
  dateOfBirth?: string | null; // ISO date
  approved?: boolean; // business flag
  createdAt: string;
  updatedAt?: string | null;
};

export type EmployeeCreateDTO = {
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  startDate: string;
  dateOfBirth?: string | null;
};

export type AttendanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AttendanceRecord = {
  id: UUID;
  employeeId: UUID;
  date: string; // ISO date
  checkIn?: string | null; // ISO time
  checkOut?: string | null; // ISO time
  status: AttendanceStatus;
  lateMinutes: number;
  overtimeMinutes: number;
  approvedAt?: string | null;
  createdAt: string;
};

export type AttendanceCreateDTO = {
  employeeId: UUID;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
};

export type PayrollSummary = {
  employeeId: UUID;
  employeeNumber?: string | null;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  totalHours: number;
  totalOvertime: number;
  totalLateMinutes: number;
  grossPayEstimate: number;
};
