/**
 * RBAC guards and helpers for the Clinical module
 * Use small, composable hooks for permission checks and field-level rules.
 */

import { useMemo } from 'react';
import { useAuthUser } from '@modules/auth';
import { DrugCategory, PrescriptionDto, RoleCode } from '../types/clinical.dto';
import { useDrugDailyLimits } from '../hooks';

// Role predicates
export function useIsDoctor(): boolean {
  const user = useAuthUser();
  return !!user && user.roles?.some((r: any) => r.code === RoleCode.DOCTOR);
}

export function useIsNurse(): boolean {
  const user = useAuthUser();
  return !!user && user.roles?.some((r: any) => r.code === RoleCode.NURSE);
}

export function useIsAdmin(): boolean {
  const user = useAuthUser();
  return !!user && user.roles?.some((r: any) => r.code === RoleCode.ADMIN);
}

// High level permissions
export function useCanAddConsultationNote(): boolean {
  // Doctors and nurses can add notes
  return useIsDoctor() || useIsNurse() || useIsAdmin();
}

export function useCanCreatePrescription(): boolean {
  // Only doctors (and admins in oversight roles) can create prescriptions
  return useIsDoctor() || useIsAdmin();
}

export function useCanSubmitPrescription(): boolean {
  // Submission (finalize) reserved for doctors; admins may have oversight but should not submit on behalf
  return useIsDoctor();
}

export function useCanCreateLabRequest(): boolean {
  // Doctors and nurses can create lab requests
  return useIsDoctor() || useIsNurse() || useIsAdmin();
}

// Field-level editable fields for UI to selectively enable/disable inputs
export function getEditableClinicalFields(roleCode: string): string[] {
  switch (roleCode) {
    case RoleCode.DOCTOR:
      return [
        'consultation.note',
        'diagnosis.description',
        'prescription.lines',
        'labRequest.tests',
      ];
    case RoleCode.NURSE:
      return ['consultation.note', 'labRequest.tests'];
    case RoleCode.ADMIN:
      return [
        'consultation.note',
        'diagnosis.description',
        'prescription.lines',
        'labRequest.tests',
      ];
    default:
      return [];
  }
}

// Prescription immutability check
export function isPrescriptionImmutable(prescription: PrescriptionDto): boolean {
  // Immutable once submitted or flagged by backend
  return prescription.immutable === true || prescription.status === 'SUBMITTED';
}

// Hook to check if a clinician may prescribe a given drug category based on daily limits
export function useCanPrescribeCategory(category: DrugCategory): { allowed: boolean; reason?: string } {
  const { data: limits, isLoading } = useDrugDailyLimits();

  const result = useMemo(() => {
    if (isLoading) return { allowed: true };
    if (!limits) return { allowed: true };

    const limit = limits.find((l) => l.drugCategory === category);
    if (!limit) return { allowed: true };

    // If maxPrescriptionsPerDay === 0, category is blocked
    if (limit.maxPrescriptionsPerDay === 0) {
      return { allowed: false, reason: 'Prescribing of this drug category is blocked by policy' };
    }

    // If maxDailyDoseMg is defined, UI may perform additional checks at line level; here we allow and leave numeric checks to service/backend
    return { allowed: true };
  }, [limits, isLoading, category]);

  return result;
}

// Helper: validate clinics cannot bypass drug-limits in UI by checking lines against numeric limits (best-effort)
export function checkPrescriptionAgainstLimits(lines: { drugCategory: DrugCategory; doseMg?: number | null }[], limits?: any) {
  if (!limits) return { ok: true };
  for (const line of lines) {
    const l = limits.find((lim: any) => lim.drugCategory === line.drugCategory);
    if (l && l.maxDailyDoseMg != null && line.doseMg != null) {
      if (line.doseMg > l.maxDailyDoseMg) {
        return { ok: false, message: `Dose ${line.doseMg}mg exceeds daily limit for ${line.drugCategory}` };
      }
    }
  }
  return { ok: true };
}
