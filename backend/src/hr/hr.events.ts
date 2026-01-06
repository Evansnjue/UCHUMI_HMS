export interface EmployeeCheckedInEvent {
  employeeId: string;
  attendanceId: string;
  checkIn: string;
  shiftDate: string;
  status: string;
}

export interface EmployeeOvertimeEvent {
  employeeId: string;
  attendanceId: string;
  overtimeSeconds: number;
  date: string;
}

export interface PayrollProcessedEvent {
  payrollId: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  netPay: number;
}
