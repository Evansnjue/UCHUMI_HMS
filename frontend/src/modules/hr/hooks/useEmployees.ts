// File: frontend/src/modules/hr/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EmployeeCreateDTO } from '../types';
import { hrService } from '../services/hrService';

const EMPLOYEES_QUERY_KEY = ['hr', 'employees'] as const;

export function useEmployees(page = 1, perPage = 25, search = '') {
  return useQuery<{ items: import('../types').Employee[]; total: number }, Error>({
    queryKey: [...EMPLOYEES_QUERY_KEY, page, perPage, search],
    queryFn: () => hrService.listEmployees(page, perPage, search),
    staleTime: 1000 * 60 * 2,
  });
} 

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: EmployeeCreateDTO) => hrService.createEmployee(dto),
    onSuccess() {
      qc.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}

export function useAllocateEmployeeNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => hrService.allocateEmployeeNumber(employeeId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
