/**
 * React Query hooks for Clinical module
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ClinicalService from '../services/clinical.service';
import {
  ClinicalDashboardDto,
  ConsultationNoteDto,
  CreateConsultationNoteRequestDto,
  CreateDiagnosisRequestDto,
  CreatePrescriptionRequestDto,
  PrescriptionDto,
  CreateLabRequestRequestDto,
  DrugDailyLimitDto,
  Pagination,
} from '../types/clinical.dto';

const CLINICAL_QUERY_KEYS = {
  dashboard: (clinicianId: string) => ['clinical', 'dashboard', clinicianId],
  consultationNotes: (patientId: string, page = 1, limit = 20) => ['clinical', 'consultations', patientId, page, limit],
  prescriptions: (patientId: string, page = 1, limit = 20) => ['clinical', 'prescriptions', patientId, page, limit],
  drugLimits: ['clinical', 'drug-limits'] as const,
};

export function useDashboard(clinicianId: string) {
  return useQuery<ClinicalDashboardDto, Error>(CLINICAL_QUERY_KEYS.dashboard(clinicianId), () =>
    ClinicalService.getDashboard(clinicianId)
  );
}

export function useConsultationNotes(patientId: string, pagination?: Pagination) {
  return useQuery<{ data: ConsultationNoteDto[]; total: number }, Error>(
    CLINICAL_QUERY_KEYS.consultationNotes(patientId, pagination?.page ?? 1, pagination?.limit ?? 20),
    () => ClinicalService.getConsultationNotes(patientId, pagination),
    { keepPreviousData: true }
  );
}

export function useCreateConsultationNote() {
  const qc = useQueryClient();
  return useMutation<ConsultationNoteDto, Error, CreateConsultationNoteRequestDto>((payload) =>
    ClinicalService.createConsultationNote(payload),
  {
    onSuccess: (data) => {
      // Invalidate patient's consultations list and dashboard
      qc.invalidateQueries(['clinical', 'consultations', data.patientId]);
      qc.invalidateQueries(['clinical', 'dashboard']);
    },
  }
  );
}

export function useCreateDiagnosis() {
  const qc = useQueryClient();
  return useMutation<void, Error, CreateDiagnosisRequestDto>((payload) => ClinicalService.createDiagnosis(payload), {
    onSuccess: (_, payload) => {
      // invalidate related consultation
      qc.invalidateQueries(['clinical', 'consultations']);
    },
  });
}

export function usePrescriptions(patientId: string, pagination?: Pagination) {
  return useQuery<{ data: PrescriptionDto[]; total: number }, Error>(
    CLINICAL_QUERY_KEYS.prescriptions(patientId, pagination?.page ?? 1, pagination?.limit ?? 20),
    () => ClinicalService.getPrescriptions(patientId, pagination),
    { keepPreviousData: true }
  );
}

export function useCreatePrescription() {
  const qc = useQueryClient();

  return useMutation<PrescriptionDto, Error, CreatePrescriptionRequestDto>(
    async (payload) => {
      // Basic client-side immutability enforcement: prevent creating if lines empty (service already checks)
      if (!payload.lines || payload.lines.length === 0) {
        throw new Error('Prescription must contain at least one line');
      }

      // Fetch limits and perform best-effort checks before submission
      const limits: DrugDailyLimitDto[] = await ClinicalService.getDrugDailyLimits();

      for (const line of payload.lines) {
        const limit = limits.find((l) => l.drugCategory === line.drugCategory);
        if (limit && limit.maxPrescriptionsPerDay === 0) {
          // This category is blocked by policy
          throw new Error(`Prescribing of ${line.drugCategory} is not allowed today`);
        }
      }

      const result = await ClinicalService.createPrescription(payload);
      return result;
    },
    {
      onSuccess: (data) => {
        // Invalidate prescriptions for patient and dashboard
        qc.invalidateQueries(['clinical', 'prescriptions', data.patientId]);
        qc.invalidateQueries(['clinical', 'dashboard']);
      },
    }
  );
}

export function useCreateLabRequest() {
  const qc = useQueryClient();
  return useMutation<any, Error, CreateLabRequestRequestDto>((payload) => ClinicalService.createLabRequest(payload), {
    onSuccess: (data) => {
      qc.invalidateQueries(['clinical', 'dashboard']);
    },
  });
}

export function useDrugDailyLimits() {
  return useQuery<DrugDailyLimitDto[], Error>(CLINICAL_QUERY_KEYS.drugLimits, () => ClinicalService.getDrugDailyLimits(), {
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
