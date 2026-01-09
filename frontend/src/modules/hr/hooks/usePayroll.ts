// File: frontend/src/modules/hr/hooks/usePayroll.ts
import { useQuery } from '@tanstack/react-query';
import { hrService } from '../services/hrService';

const PAYROLL_QUERY_KEY = ['hr', 'payroll'];

export function usePayrollSummary(periodStart: string, periodEnd: string) {
  return useQuery({
    queryKey: [...PAYROLL_QUERY_KEY, periodStart, periodEnd],
    queryFn: () => hrService.payrollSummary(periodStart, periodEnd),
    staleTime: 1000 * 60 * 5,
  });
}
