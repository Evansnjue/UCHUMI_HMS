// File: frontend/src/modules/hr/services/hrService.ts
import type {
  Employee,
  EmployeeCreateDTO,
  AttendanceCreateDTO,
  AttendanceRecord,
  PayrollSummary,
} from '../types';
import { MOCK_EMPLOYEES, MOCK_ATTENDANCE } from '../mock/mockData';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || '/api';
const USE_MOCK = ((import.meta as any).env?.VITE_USE_MOCK as unknown) === 'true';

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as Record<string, string>;
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message || JSON.stringify(json);
    } catch {
      // ignore
    }
    throw new Error(`API error ${res.status}: ${message}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const hrService = {
  async listEmployees(page = 1, perPage = 25, search = ''): Promise<{ items: Employee[]; total: number }> {
    if (USE_MOCK) {
      const items = MOCK_EMPLOYEES.filter((e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().indexOf(search.toLowerCase()) !== -1,
      );
      const total = items.length;
      const paged = items.slice((page - 1) * perPage, page * perPage);
      return { items: paged, total };
    }
    return request(`/hr/employees?page=${page}&perPage=${perPage}&q=${encodeURIComponent(search)}`);
  },

  async createEmployee(dto: EmployeeCreateDTO): Promise<Employee> {
    if (USE_MOCK) {
      const newItem: Employee = {
        id: `mock-${Date.now()}`,
        employeeNumber: null,
        ...dto,
        approved: false,
        createdAt: new Date().toISOString(),
      } as Employee;
      MOCK_EMPLOYEES.unshift(newItem);
      return newItem;
    }
    return request('/hr/employees', { method: 'POST', body: JSON.stringify(dto) });
  },

  async allocateEmployeeNumber(employeeId: string): Promise<{ employeeNumber: string }> {
    if (USE_MOCK) {
      const emp = MOCK_EMPLOYEES.filter((e) => e.id === employeeId)[0];
      if (!emp) throw new Error('Employee not found');
      if (emp.employeeNumber) return { employeeNumber: emp.employeeNumber };
      const num = `EMP-${Math.floor(100000 + Math.random() * 899999)}`;
      emp.employeeNumber = num;
      emp.updatedAt = new Date().toISOString();
      return { employeeNumber: num };
    }
    return request(`/hr/employees/${employeeId}/allocate-number`, { method: 'POST' });
  },

  async listAttendance(page = 1, perPage = 50, employeeId?: string): Promise<{ items: AttendanceRecord[]; total: number }> {
    if (USE_MOCK) {
      const items = employeeId ? MOCK_ATTENDANCE.filter((a) => a.employeeId === employeeId) : MOCK_ATTENDANCE;
      const total = items.length;
      const paged = items.slice((page - 1) * perPage, page * perPage);
      return { items: paged, total };
    }
    const query = `?page=${page}&perPage=${perPage}${employeeId ? `&employeeId=${employeeId}` : ''}`;
    return request(`/hr/attendance${query}`);
  },

  async recordAttendance(dto: AttendanceCreateDTO): Promise<AttendanceRecord> {
    if (USE_MOCK) {
      const newItem: AttendanceRecord = {
        id: `att-${Date.now()}`,
        ...dto,
        status: 'PENDING',
        lateMinutes: 0,
        overtimeMinutes: 0,
        createdAt: new Date().toISOString(),
      } as AttendanceRecord;
      MOCK_ATTENDANCE.unshift(newItem);
      return newItem;
    }
    return request('/hr/attendance', { method: 'POST', body: JSON.stringify(dto) });
  },

  async approveAttendance(attendanceId: string): Promise<AttendanceRecord> {
    // Attendance becomes immutable after approval on backend; UI must disable actions after status APPROVED
    if (USE_MOCK) {
      const rec = MOCK_ATTENDANCE.filter((a) => a.id === attendanceId)[0];
      if (!rec) throw new Error('Attendance not found');
      if (rec.status === 'APPROVED') return rec;
      rec.status = 'APPROVED';
      rec.approvedAt = new Date().toISOString();
      return rec;
    }
    return request(`/hr/attendance/${attendanceId}/approve`, { method: 'POST' });
  },

  async payrollSummary(periodStart: string, periodEnd: string) : Promise<PayrollSummary[]> {
    if (USE_MOCK) {
      // Minimal mock payroll calculation
      return MOCK_EMPLOYEES.map((e) => ({
        employeeId: e.id,
        employeeNumber: e.employeeNumber || null,
        periodStart,
        periodEnd,
        totalHours: 160,
        totalOvertime: 12,
        totalLateMinutes: 30,
        grossPayEstimate: 2500,
      }));
    }
    return request(`/hr/payroll?start=${encodeURIComponent(periodStart)}&end=${encodeURIComponent(periodEnd)}`);
  },
};

export default hrService;
