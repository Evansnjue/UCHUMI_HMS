/**
 * Pharmacy React Query Hooks
 * Custom hooks for data fetching, mutations, and caching
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type {
  Prescription,
  PrescriptionFilters,
  PrescriptionQueueResponse,
  DrugStock,
  StockFilters,
  Drug,
  DispensingRecord,
  CreateDispensingDTO,
  DispensingHistoryFilters,
  AuditLog,
  AuditLogFilters,
  DispensingValidationResult,
  DoctorDrugLimitRule,
  PaginatedResponse,
} from '../types';
import {
  prescriptionApi,
  stockApi,
  dispensingApi,
  auditApi,
  businessRulesApi,
} from './api';

// Query cache key factory for organized query management
const queryKeys = {
  all: ['pharmacy'] as const,
  prescriptions: () => [...queryKeys.all, 'prescriptions'] as const,
  prescriptionQueue: (filters: PrescriptionFilters) => [...queryKeys.prescriptions(), 'queue', filters] as const,
  prescriptionDetail: (id: string) => [...queryKeys.prescriptions(), 'detail', id] as const,
  
  stock: () => [...queryKeys.all, 'stock'] as const,
  stockAll: (filters: StockFilters) => [...queryKeys.stock(), 'all', filters] as const,
  stockDetail: (id: string) => [...queryKeys.stock(), 'detail', id] as const,
  stockBatches: (id: string) => [...queryKeys.stock(), 'batches', id] as const,
  drugs: (filters: StockFilters) => [...queryKeys.all, 'drugs', filters] as const,
  drugDetail: (id: string) => [...queryKeys.all, 'drugs', 'detail', id] as const,
  
  dispensing: () => [...queryKeys.all, 'dispensing'] as const,
  dispensingHistory: (filters: DispensingHistoryFilters) => [...queryKeys.dispensing(), 'history', filters] as const,
  dispensingRecord: (id: string) => [...queryKeys.dispensing(), 'record', id] as const,
  
  audit: () => [...queryKeys.all, 'audit'] as const,
  auditLogs: (filters: AuditLogFilters) => [...queryKeys.audit(), 'logs', filters] as const,
  auditTrail: (resourceType: string, resourceId: string) => [...queryKeys.audit(), 'trail', resourceType, resourceId] as const,
  
  rules: () => [...queryKeys.all, 'rules'] as const,
  doctorLimits: (doctorId: string) => [...queryKeys.rules(), 'doctor-limits', doctorId] as const,
};

// ============================================================================
// PRESCRIPTION HOOKS
// ============================================================================

export const usePrescriptionQueue = (
  filters: PrescriptionFilters = {},
  options = {}
): UseQueryResult<PrescriptionQueueResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.prescriptionQueue(filters),
    queryFn: () => prescriptionApi.getPrescriptionQueue(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    ...options,
  });
};

export const usePrescriptionDetail = (
  prescriptionId: string | null,
  options = {}
): UseQueryResult<Prescription, Error> => {
  return useQuery({
    queryKey: queryKeys.prescriptionDetail(prescriptionId || ''),
    queryFn: () => prescriptionApi.getPrescriptionById(prescriptionId!),
    enabled: !!prescriptionId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

export const usePrescriptionByNumber = (
  prescriptionNumber: string | null,
  options = {}
): UseQueryResult<Prescription, Error> => {
  return useQuery({
    queryKey: ['prescription-by-number', prescriptionNumber],
    queryFn: () => prescriptionApi.getPrescriptionByNumber(prescriptionNumber!),
    enabled: !!prescriptionNumber,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

export const useCancelPrescription = (): UseMutationResult<
  Prescription,
  Error,
  { prescriptionId: string; reason: string }
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prescriptionId, reason }) =>
      prescriptionApi.cancelPrescription(prescriptionId, reason),
    onSuccess: (_, { prescriptionId }) => {
      // Invalidate related caches
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptionDetail(prescriptionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions() });
    },
  });
};

// ============================================================================
// DRUG & STOCK HOOKS
// ============================================================================

export const useDrugs = (
  filters: StockFilters = {},
  options = {}
): UseQueryResult<PaginatedResponse<Drug>, Error> => {
  return useQuery({
    queryKey: queryKeys.drugs(filters),
    queryFn: () => stockApi.getDrugs(filters),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useDrugDetail = (
  drugId: string | null,
  options = {}
): UseQueryResult<Drug, Error> => {
  return useQuery({
    queryKey: queryKeys.drugDetail(drugId || ''),
    queryFn: () => stockApi.getDrugById(drugId!),
    enabled: !!drugId,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

export const useDrugStock = (
  drugId: string | null,
  options = {}
): UseQueryResult<DrugStock, Error> => {
  return useQuery({
    queryKey: queryKeys.stockDetail(drugId || ''),
    queryFn: () => stockApi.getDrugStock(drugId!),
    enabled: !!drugId,
    staleTime: 1000 * 60 * 3, // 3 minutes - stock changes frequently
    refetchInterval: 1000 * 60, // Refetch every minute
    ...options,
  });
};

export const useAllStock = (
  filters: StockFilters = {},
  options = {}
): UseQueryResult<PaginatedResponse<DrugStock>, Error> => {
  return useQuery({
    queryKey: queryKeys.stockAll(filters),
    queryFn: () => stockApi.getAllStock(filters),
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    gcTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useStockBatches = (
  drugId: string | null,
  options = {}
): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: queryKeys.stockBatches(drugId || ''),
    queryFn: () => stockApi.getStockBatches(drugId!),
    enabled: !!drugId,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

// ============================================================================
// DISPENSING HOOKS
// ============================================================================

export const useValidateDispensingRequest = (): UseMutationResult<
  DispensingValidationResult,
  Error,
  CreateDispensingDTO
> => {
  return useMutation({
    mutationFn: (dto) => dispensingApi.validateDispensingRequest(dto),
  });
};

export const useDispense = (): UseMutationResult<
  DispensingRecord,
  Error,
  CreateDispensingDTO
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto) => dispensingApi.dispense(dto),
    onSuccess: () => {
      // Invalidate related caches after successful dispensing
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dispensing() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit() });
    },
  });
};

export const useDispensePartial = (): UseMutationResult<
  DispensingRecord,
  Error,
  CreateDispensingDTO
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto) => dispensingApi.dispensePartial(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dispensing() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock() });
      queryClient.invalidateQueries({ queryKey: queryKeys.audit() });
    },
  });
};

export const useDispensingHistory = (
  filters: DispensingHistoryFilters = {},
  options = {}
): UseQueryResult<PaginatedResponse<DispensingRecord>, Error> => {
  return useQuery({
    queryKey: queryKeys.dispensingHistory(filters),
    queryFn: () => dispensingApi.getDispensingHistory(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useDispensingRecord = (
  recordId: string | null,
  options = {}
): UseQueryResult<DispensingRecord, Error> => {
  return useQuery({
    queryKey: queryKeys.dispensingRecord(recordId || ''),
    queryFn: () => dispensingApi.getDispensingRecord(recordId!),
    enabled: !!recordId,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

// ============================================================================
// AUDIT HOOKS
// ============================================================================

export const useAuditLogs = (
  filters: AuditLogFilters = {},
  options = {}
): UseQueryResult<PaginatedResponse<AuditLog>, Error> => {
  return useQuery({
    queryKey: queryKeys.auditLogs(filters),
    queryFn: () => auditApi.getAuditLogs(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useResourceAuditTrail = (
  resourceType: string | null,
  resourceId: string | null,
  options = {}
): UseQueryResult<AuditLog[], Error> => {
  return useQuery({
    queryKey: queryKeys.auditTrail(resourceType || '', resourceId || ''),
    queryFn: () => auditApi.getResourceAuditTrail(resourceType!, resourceId!),
    enabled: !!resourceType && !!resourceId,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

// ============================================================================
// BUSINESS RULES HOOKS
// ============================================================================

export const useDoctorLimits = (
  doctorId: string | null,
  options = {}
): UseQueryResult<DoctorDrugLimitRule[], Error> => {
  return useQuery({
    queryKey: queryKeys.doctorLimits(doctorId || ''),
    queryFn: () => businessRulesApi.getDoctorLimits(doctorId!),
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 30, // Doctor limits rarely change
    ...options,
  });
};

export const useCheckDoctorLimitViolation = (): UseMutationResult<
  boolean,
  Error,
  { doctorId: string; prescriptionItemId: string; drugCategory: string }
> => {
  return useMutation({
    mutationFn: ({ doctorId, prescriptionItemId, drugCategory }) =>
      businessRulesApi.checkDoctorLimitViolation(doctorId, prescriptionItemId, drugCategory),
  });
};
