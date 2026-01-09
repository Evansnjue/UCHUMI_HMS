/**
 * Patient Module - Type Definitions (DTOs)
 * These types represent contracts with the backend API
 */

// ============================================================================
// Patient Core
// ============================================================================

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum BloodType {
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  UNKNOWN = 'UNKNOWN',
}

// ============================================================================
// Patient Registration
// ============================================================================

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string; // ISO 8601
  gender: Gender;
  bloodType: BloodType;
  maritalStatus: MaritalStatus;
  nationality?: string;
  status: PatientStatus;
  
  // Patient Numbers
  opdNumber?: string; // Outpatient Department number
  ipdNumber?: string; // Inpatient Department number
  
  // Contact Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Medical Information
  allergies?: string;
  chronicDiseases?: string;
  medications?: string;
  notes?: string;
  
  // Department Assignment
  assignedDepartmentId?: string;
  assignedDepartment?: DepartmentDto;
  
  // Audit
  registeredBy?: string;
  registeredAt: string;
  updatedBy?: string;
  updatedAt: string;
  deactivatedAt?: string;
  deactivatedReason?: string;
}

export interface CreatePatientRequestDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType: BloodType;
  maritalStatus: MaritalStatus;
  nationality?: string;
  
  // Contact Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Medical Information
  allergies?: string;
  chronicDiseases?: string;
  medications?: string;
  notes?: string;
  
  // Department Assignment
  assignedDepartmentId?: string;
}

export interface UpdatePatientRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  
  // Contact Information
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Medical Information
  allergies?: string;
  chronicDiseases?: string;
  medications?: string;
  notes?: string;
  
  // Department Assignment
  assignedDepartmentId?: string;
}

export interface DeactivatePatientRequestDto {
  reason: string;
}

// ============================================================================
// Patient Search & Filtering
// ============================================================================

export interface PatientSearchQueryDto {
  q?: string; // Search by name, phone, OPD/IPD number
  status?: PatientStatus;
  departmentId?: string;
  gender?: Gender;
  bloodType?: BloodType;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  registeredFrom?: string;
  registeredTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'registeredAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PatientSearchResponseDto {
  data: PatientDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Patient History & Visits
// ============================================================================

export interface PatientVisitDto {
  id: string;
  patientId: string;
  visitType: 'OPD' | 'IPD' | 'EMERGENCY';
  departmentId: string;
  department?: DepartmentDto;
  doctorId?: string;
  doctor?: DoctorDto;
  reason?: string;
  diagnosis?: string;
  notes?: string;
  visitDate: string;
  completedAt?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface PatientMedicalHistoryDto {
  id: string;
  patientId: string;
  medicalCondition: string;
  diagnosis: string;
  treatmentStartDate: string;
  treatmentEndDate?: string;
  doctorId?: string;
  notes?: string;
  attachments?: AttachmentDto[];
}

export interface PatientPrescriptionDto {
  id: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  medications: PrescriptionMedicationDto[];
  instructions?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
}

export interface PrescriptionMedicationDto {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// ============================================================================
// Department & Doctor
// ============================================================================

export interface DepartmentDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface DoctorDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization?: string;
  departmentId: string;
  departmentName?: string;
  registrationNumber?: string;
  isActive: boolean;
}

// ============================================================================
// Attachments
// ============================================================================

export interface AttachmentDto {
  id: string;
  fileKey: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy?: string;
}

// ============================================================================
// Patient Numbers Generation
// ============================================================================

export interface PatientNumberResponseDto {
  opdNumber?: string;
  ipdNumber?: string;
}

// ============================================================================
// Bulk Operations
// ============================================================================

export interface BulkDeactivatePatientsRequestDto {
  patientIds: string[];
  reason: string;
}

export interface BulkDeactivatePatientsResponseDto {
  successCount: number;
  failureCount: number;
  failures: { patientId: string; reason: string }[];
}
