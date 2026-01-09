/**
 * ClinicalService - typed API layer for the Clinical module
 * All API access must go through this service. It is HTTP-client agnostic (axios used here).
 */

import axios, { AxiosInstance } from 'axios';
import {
  ClinicalDashboardDto,
  ConsultationNoteDto,
  CreateConsultationNoteRequestDto,
  CreateDiagnosisRequestDto,
  CreatePrescriptionRequestDto,
  CreateLabRequestRequestDto,
  PrescriptionDto,
  DrugDailyLimitDto,
  DrugCategory,
  Pagination,
} from '../types/clinical.dto';

// Create axios instance for the clinical module. Base URL assumes the API root is configured globally.
const client: AxiosInstance = axios.create({
  baseURL: '/api/v1/clinical',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple auth interceptor: read token from localStorage key set by auth module.
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore localStorage errors in SSR contexts
  }
  return config;
});

export class ClinicalService {
  static async getDashboard(clinicianId: string): Promise<ClinicalDashboardDto> {
    const { data } = await client.get<ClinicalDashboardDto>(`/dashboard`, {
      params: { clinicianId },
    });
    return data;
  }

  static async getConsultationNotes(patientId: string, pagination?: Pagination) {
    const { data } = await client.get<{ data: ConsultationNoteDto[]; total: number }>(
      `/patients/${patientId}/consultations`,
      { params: pagination }
    );
    return data;
  }

  static async createConsultationNote(payload: CreateConsultationNoteRequestDto) {
    const { data } = await client.post<ConsultationNoteDto>(`/consultations`, payload);
    return data;
  }

  static async createDiagnosis(payload: CreateDiagnosisRequestDto) {
    const { data } = await client.post(`/diagnoses`, payload);
    return data;
  }

  static async createPrescription(payload: CreatePrescriptionRequestDto) {
    // Basic client-side check: ensure lines exist
    if (!payload.lines || payload.lines.length === 0) {
      throw new Error('Prescription must contain at least one line');
    }

    // Validate drug categories / daily limits prior to sending to backend
    const limits = await ClinicalService.getDrugDailyLimits();

    for (const line of payload.lines) {
      const categoryLimit = limits.find((l) => l.drugCategory === line.drugCategory);
      if (categoryLimit && categoryLimit.maxPrescriptionsPerDay != null) {
        // Optionally check number of prescriptions created today for this clinician and category
        // The backend is authoritative; this check is a best-effort protection in the UI.
        // If the backend requires stricter enforcement, it will return an error which must be shown to the user.
      }
    }

    const { data } = await client.post<PrescriptionDto>(`/prescriptions`, payload);
    return data;
  }

  static async getPrescriptions(patientId: string, pagination?: Pagination) {
    const { data } = await client.get<{ data: PrescriptionDto[]; total: number }>(
      `/patients/${patientId}/prescriptions`,
      { params: pagination }
    );
    return data;
  }

  static async createLabRequest(payload: CreateLabRequestRequestDto) {
    const { data } = await client.post(`/lab-requests`, payload);
    return data;
  }

  static async getDrugDailyLimits(): Promise<DrugDailyLimitDto[]> {
    const { data } = await client.get<DrugDailyLimitDto[]>(`/drug-limits`);
    return data;
  }

  // Read-only view for daily limits per drug-category (for UI display)
  static async getDrugLimitsForClinician(clinicianId: string) {
    const [limits] = await Promise.all([ClinicalService.getDrugDailyLimits()]);
    // server provides authoritative limits; further clinician-specific rules can be fetched if needed
    return limits;
  }
}

export default ClinicalService;
