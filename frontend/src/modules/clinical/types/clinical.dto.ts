/**
 * Clinical module DTOs and enums
 * All types are strict and should reflect backend contracts.
 */

export enum RoleCode {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
}

export enum VisitType {
  OPD = 'OPD',
  IPD = 'IPD',
  TELEMED = 'TELEMED',
}

export enum PrescriptionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  CANCELLED = 'CANCELLED',
}

export enum DrugCategory {
  ANTIBIOTIC = 'ANTIBIOTIC',
  ANALGESIC = 'ANALGESIC',
  ANTIPYRETIC = 'ANTIPYRETIC',
  ANTISEPTIC = 'ANTISEPTIC',
  ANTIVIRAL = 'ANTIVIRAL',
  OTHER = 'OTHER',
}

export interface DoctorDto {
  id: string;
  fullName: string;
  licenseNumber?: string;
  departmentId?: string;
}

export interface ConsultationNoteDto {
  id: string;
  patientId: string;
  clinicianId: string; // doctor or nurse
  clinicianRole: RoleCode;
  visitId?: string | null;
  note: string;
  createdAt: string; // ISO
  createdBy: string;
}

export interface DiagnosisDto {
  id: string;
  consultationId: string;
  clinicianId: string;
  icd10Code?: string | null;
  description: string;
  createdAt: string;
}

export interface PrescriptionLineDto {
  id: string;
  drugId: string;
  drugName: string;
  drugCategory: DrugCategory;
  dose: string; // e.g., "500mg"
  frequency: string; // e.g., "OD", "BID"
  durationDays: number;
  instructions?: string;
}

export interface PrescriptionDto {
  id: string;
  patientId: string;
  clinicianId: string;
  status: PrescriptionStatus;
  lines: PrescriptionLineDto[];
  createdAt: string;
  submittedAt?: string | null;
  immutable: boolean; // set true once submitted
}

export interface LabRequestDto {
  id: string;
  patientId: string;
  clinicianId: string;
  tests: { code: string; name: string }[];
  priority: 'ROUTINE' | 'STAT';
  notes?: string;
  createdAt: string;
}

export interface DrugDailyLimitDto {
  drugCategory: DrugCategory;
  maxDailyDoseMg?: number | null; // null means no explicit numeric limit (use business rules)
  maxPrescriptionsPerDay?: number | null; // number of prescriptions allowed per doctor per day
}

// Request DTOs
export interface CreateConsultationNoteRequestDto {
  patientId: string;
  clinicianId: string;
  clinicianRole: RoleCode;
  visitId?: string | null;
  note: string;
}

export interface CreateDiagnosisRequestDto {
  consultationId: string;
  clinicianId: string;
  icd10Code?: string | null;
  description: string;
}

export interface CreatePrescriptionLineRequestDto {
  drugId: string;
  drugName: string;
  drugCategory: DrugCategory;
  dose: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface CreatePrescriptionRequestDto {
  patientId: string;
  clinicianId: string;
  lines: CreatePrescriptionLineRequestDto[];
}

export interface CreateLabRequestRequestDto {
  patientId: string;
  clinicianId: string;
  tests: { code: string; name: string }[];
  priority?: 'ROUTINE' | 'STAT';
  notes?: string;
}

export interface ClinicalDashboardDto {
  assignedPatientsCount: number;
  todaysAppointments: { id: string; patientName: string; time: string; visitType: VisitType }[];
  pendingLabResultsCount: number;
  recentPrescriptions: PrescriptionDto[];
}

export type Pagination = { page: number; limit: number };

