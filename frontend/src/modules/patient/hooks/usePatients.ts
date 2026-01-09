/**
 * Patient React Query Hooks
 * Custom hooks for patient data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  PatientDto,
  CreatePatientRequestDto,
  UpdatePatientRequestDto,
  DeactivatePatientRequestDto,
  PatientSearchQueryDto,
  PatientSearchResponseDto,
  PatientVisitDto,
  PatientMedicalHistoryDto,
  PatientPrescriptionDto,
  DepartmentDto,
  DoctorDto,
} from '../types';
import { patientService } from '../services';

// ============================================================================
// Query Keys
// ============================================================================

export const patientQueryKeys = {
  all: ['patients'] as const,
  searches: () => [...patientQueryKeys.all, 'search'] as const,
  search: (query: PatientSearchQueryDto) =>
    [...patientQueryKeys.searches(), query] as const,
  details: () => [...patientQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientQueryKeys.details(), id] as const,
  visits: (id: string) => [...patientQueryKeys.detail(id), 'visits'] as const,
  medicalHistory: (id: string) => [...patientQueryKeys.detail(id), 'medical-history'] as const,
  prescriptions: (id: string) => [...patientQueryKeys.detail(id), 'prescriptions'] as const,
  departments: ['departments'] as const,
  doctors: (departmentId: string) => ['doctors', departmentId] as const,
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * usePatientSearch - Search/filter patients with pagination
 */
export const usePatientSearch = (
  query: PatientSearchQueryDto,
  options?: { enabled?: boolean }
): UseQueryResult<PatientSearchResponseDto, Error> => {
  return useQuery({
    queryKey: patientQueryKeys.search(query),
    queryFn: () => patientService.searchPatients(query),
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * usePatientById - Get single patient by ID
 */
export const usePatientById = (
  id: string,
  options?: { enabled?: boolean }
): UseQueryResult<PatientDto, Error> => {
  return useQuery({
    queryKey: patientQueryKeys.detail(id),
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * usePatientVisits - Get patient visit history
 */
export const usePatientVisits = (
  patientId: string,
  options?: { enabled?: boolean }
): UseQueryResult<PatientVisitDto[], Error> => {
  return useQuery({
    queryKey: patientQueryKeys.visits(patientId),
    queryFn: () => patientService.getPatientVisits(patientId),
    enabled: !!patientId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * usePatientMedicalHistory - Get patient medical history
 */
export const usePatientMedicalHistory = (
  patientId: string,
  options?: { enabled?: boolean }
): UseQueryResult<PatientMedicalHistoryDto[], Error> => {
  return useQuery({
    queryKey: patientQueryKeys.medicalHistory(patientId),
    queryFn: () => patientService.getPatientMedicalHistory(patientId),
    enabled: !!patientId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * usePatientPrescriptions - Get patient prescriptions
 */
export const usePatientPrescriptions = (
  patientId: string,
  options?: { enabled?: boolean }
): UseQueryResult<PatientPrescriptionDto[], Error> => {
  return useQuery({
    queryKey: patientQueryKeys.prescriptions(patientId),
    queryFn: () => patientService.getPatientPrescriptions(patientId),
    enabled: !!patientId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * useDepartments - Get all departments
 */
export const useDepartments = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: patientQueryKeys.departments,
    queryFn: () => patientService.getDepartments(),
    enabled: options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * useDoctorsByDepartment - Get doctors by department
 */
export const useDoctorsByDepartment = (
  departmentId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: patientQueryKeys.doctors(departmentId),
    queryFn: () => patientService.getDoctorsByDepartment(departmentId),
    enabled: !!departmentId && options?.enabled !== false,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * usePatientNumbers - Get next patient numbers
 */
export const usePatientNumbers = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['patient-numbers', 'next'],
    queryFn: () => patientService.getPatientNumbers(),
    enabled: options?.enabled !== false,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * useCreatePatient - Create new patient
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientRequestDto) => patientService.createPatient(data),
    onSuccess: (newPatient) => {
      // Invalidate search results
      queryClient.invalidateQueries({
        queryKey: patientQueryKeys.searches(),
      });
      // Add to cache
      queryClient.setQueryData(patientQueryKeys.detail(newPatient.id), newPatient);
    },
    onError: (error: any) => {
      console.error('Create patient failed:', error.response?.data || error.message);
    },
  });
};

/**
 * useUpdatePatient - Update existing patient
 */
export const useUpdatePatient = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientRequestDto) =>
      patientService.updatePatient(patientId, data),
    onSuccess: (updatedPatient) => {
      // Update cache
      queryClient.setQueryData(patientQueryKeys.detail(patientId), updatedPatient);
      // Invalidate search results
      queryClient.invalidateQueries({
        queryKey: patientQueryKeys.searches(),
      });
    },
    onError: (error: any) => {
      console.error('Update patient failed:', error.response?.data || error.message);
    },
  });
};

/**
 * useDeactivatePatient - Deactivate patient
 */
export const useDeactivatePatient = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeactivatePatientRequestDto) =>
      patientService.deactivatePatient(patientId, data),
    onSuccess: (deactivatedPatient) => {
      // Update cache
      queryClient.setQueryData(patientQueryKeys.detail(patientId), deactivatedPatient);
      // Invalidate search results
      queryClient.invalidateQueries({
        queryKey: patientQueryKeys.searches(),
      });
    },
    onError: (error: any) => {
      console.error('Deactivate patient failed:', error.response?.data || error.message);
    },
  });
};

/**
 * useBulkDeactivatePatients - Deactivate multiple patients
 */
export const useBulkDeactivatePatients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { patientIds: string[]; reason: string }) =>
      patientService.bulkDeactivatePatients(data),
    onSuccess: () => {
      // Invalidate all patient data
      queryClient.invalidateQueries({
        queryKey: patientQueryKeys.all,
      });
    },
    onError: (error: any) => {
      console.error('Bulk deactivate failed:', error.response?.data || error.message);
    },
  });
};

/**
 * useExportPatients - Export patients to CSV
 */
export const useExportPatients = () => {
  return useMutation({
    mutationFn: (query: PatientSearchQueryDto) => patientService.exportPatients(query),
    onSuccess: (blob) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error: any) => {
      console.error('Export failed:', error.response?.data || error.message);
    },
  });
};
