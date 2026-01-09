/**
 * Patient API Service
 * Abstraction layer for all patient-related API calls
 */

import axios, { AxiosInstance } from 'axios';
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
  PatientNumberResponseDto,
  BulkDeactivatePatientsRequestDto,
  BulkDeactivatePatientsResponseDto,
  DepartmentDto,
  DoctorDto,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const PATIENT_ENDPOINT = '/patients';

class PatientService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${PATIENT_ENDPOINT}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor from localStorage
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Get all patients with search, filter, and pagination
   */
  async searchPatients(query: PatientSearchQueryDto): Promise<PatientSearchResponseDto> {
    const response = await this.client.get<PatientSearchResponseDto>('/search', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<PatientDto> {
    const response = await this.client.get<PatientDto>(`/${id}`);
    return response.data;
  }

  /**
   * Create new patient
   */
  async createPatient(data: CreatePatientRequestDto): Promise<PatientDto> {
    const response = await this.client.post<PatientDto>('/', data);
    return response.data;
  }

  /**
   * Update patient
   */
  async updatePatient(id: string, data: UpdatePatientRequestDto): Promise<PatientDto> {
    const response = await this.client.patch<PatientDto>(`/${id}`, data);
    return response.data;
  }

  /**
   * Deactivate patient
   */
  async deactivatePatient(
    id: string,
    data: DeactivatePatientRequestDto
  ): Promise<PatientDto> {
    const response = await this.client.post<PatientDto>(`/${id}/deactivate`, data);
    return response.data;
  }

  /**
   * Bulk deactivate patients
   */
  async bulkDeactivatePatients(
    data: BulkDeactivatePatientsRequestDto
  ): Promise<BulkDeactivatePatientsResponseDto> {
    const response = await this.client.post<BulkDeactivatePatientsResponseDto>(
      '/bulk-deactivate',
      data
    );
    return response.data;
  }

  /**
   * Get or generate patient numbers
   */
  async getPatientNumbers(): Promise<PatientNumberResponseDto> {
    const response = await this.client.get<PatientNumberResponseDto>('/numbers/next');
    return response.data;
  }

  /**
   * Get patient visits
   */
  async getPatientVisits(patientId: string): Promise<PatientVisitDto[]> {
    const response = await this.client.get<PatientVisitDto[]>(`/${patientId}/visits`);
    return response.data;
  }

  /**
   * Get patient medical history
   */
  async getPatientMedicalHistory(patientId: string): Promise<PatientMedicalHistoryDto[]> {
    const response = await this.client.get<PatientMedicalHistoryDto[]>(
      `/${patientId}/medical-history`
    );
    return response.data;
  }

  /**
   * Get patient prescriptions
   */
  async getPatientPrescriptions(patientId: string): Promise<PatientPrescriptionDto[]> {
    const response = await this.client.get<PatientPrescriptionDto[]>(`/${patientId}/prescriptions`);
    return response.data;
  }

  /**
   * Get all departments for assignment
   */
  async getDepartments(): Promise<DepartmentDto[]> {
    const response = await this.client.get<DepartmentDto[]>(
      `${API_BASE_URL}/departments?active=true`
    );
    return response.data;
  }

  /**
   * Get doctors by department
   */
  async getDoctorsByDepartment(departmentId: string): Promise<DoctorDto[]> {
    const response = await this.client.get<DoctorDto[]>(
      `${API_BASE_URL}/doctors?departmentId=${departmentId}`
    );
    return response.data;
  }

  /**
   * Export patients to CSV
   */
  async exportPatients(query: PatientSearchQueryDto): Promise<Blob> {
    const response = await this.client.get('/export/csv', {
      params: query,
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

export const patientService = new PatientService();
export default patientService;
