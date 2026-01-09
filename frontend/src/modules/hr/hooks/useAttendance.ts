// File: frontend/src/modules/hr/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AttendanceCreateDTO } from '../types';
import { hrService } from '../services/hrService';

const ATT_QUERY_KEY = ['hr', 'attendance'] as const;

export function useAttendance(page = 1, perPage = 50, employeeId?: string) {
  return useQuery<{ items: import('../types').AttendanceRecord[]; total: number }, Error>({
    queryKey: [...ATT_QUERY_KEY, page, perPage, employeeId ?? 'all'],
    queryFn: () => hrService.listAttendance(page, perPage, employeeId),
    staleTime: 1000 * 60,
  });
} 

export function useRecordAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AttendanceCreateDTO) => hrService.recordAttendance(dto),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ATT_QUERY_KEY });
    },
  });
}

export function useApproveAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attendanceId: string) => hrService.approveAttendance(attendanceId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ATT_QUERY_KEY });
    },
  });
}
