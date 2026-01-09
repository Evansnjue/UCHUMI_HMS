// File: frontend/src/modules/hr/services/hrService.ts
import type {
  Employee,
  EmployeeCreateDTO,
  AttendanceCreateDTO,
  AttendanceRecord,
  PayrollSummary,
} from '../types';
const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || '/api';

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
    return request(`/hr/employees?page=${page}&perPage=${perPage}&q=${encodeURIComponent(search)}`);
  },

  async createEmployee(dto: EmployeeCreateDTO): Promise<Employee> {
    return request('/hr/employees', { method: 'POST', body: JSON.stringify(dto) });
  },

  async allocateEmployeeNumber(employeeId: string): Promise<{ employeeNumber: string }> {
    return request(`/hr/employees/${employeeId}/allocate-number`, { method: 'POST' });
  },

  async listAttendance(page = 1, perPage = 50, employeeId?: string): Promise<{ items: AttendanceRecord[]; total: number }> {
    const query = `?page=${page}&perPage=${perPage}${employeeId ? `&employeeId=${employeeId}` : ''}`;
    return request(`/hr/attendance${query}`);
  },

  async recordAttendance(dto: AttendanceCreateDTO): Promise<AttendanceRecord> {
    return request('/hr/attendance', { method: 'POST', body: JSON.stringify(dto) });
  },

  async approveAttendance(attendanceId: string): Promise<AttendanceRecord> {
    // Attendance becomes immutable after approval on backend; UI must disable actions after status APPROVED
    return request(`/hr/attendance/${attendanceId}/approve`, { method: 'POST' });
  },

  async payrollSummary(periodStart: string, periodEnd: string) : Promise<PayrollSummary[]> {
    return request(`/hr/payroll?start=${encodeURIComponent(periodStart)}&end=${encodeURIComponent(periodEnd)}`);
  },
};
};

export default hrService;
