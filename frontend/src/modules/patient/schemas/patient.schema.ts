/**
 * Patient Form Validation Schemas
 * Using Zod for runtime type-safe validation
 */

import { z } from 'zod';
import { Gender, BloodType, MaritalStatus } from '../types';

// ============================================================================
// Validation Rules
// ============================================================================

const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
const postalCodeRegex = /^[0-9]{5,10}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ============================================================================
// Patient Registration Form Schema
// ============================================================================

export const patientRegistrationSchema = z
  .object({
    // Personal Information
    firstName: z
      .string()
      .min(2, 'patient.validation.first_name_min')
      .max(50, 'patient.validation.first_name_max')
      .regex(/^[a-zA-Z\s\-\.]+$/, 'patient.validation.invalid_name_format'),
    
    lastName: z
      .string()
      .min(2, 'patient.validation.last_name_min')
      .max(50, 'patient.validation.last_name_max')
      .regex(/^[a-zA-Z\s\-\.]+$/, 'patient.validation.invalid_name_format'),
    
    email: z
      .string()
      .email('patient.validation.invalid_email')
      .optional()
      .or(z.literal('')),
    
    phone: z
      .string()
      .regex(phoneRegex, 'patient.validation.invalid_phone')
      .min(10, 'patient.validation.phone_min_length'),
    
    alternatePhone: z
      .string()
      .regex(phoneRegex, 'patient.validation.invalid_phone')
      .optional()
      .or(z.literal('')),
    
    dateOfBirth: z
      .string()
      .regex(dateRegex, 'patient.validation.invalid_date_format')
      .refine((date) => {
        const dob = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age >= 0 && age <= 150;
      }, 'patient.validation.invalid_age'),
    
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.PREFER_NOT_TO_SAY]),
    
    bloodType: z.enum([
      BloodType.O_POSITIVE,
      BloodType.O_NEGATIVE,
      BloodType.A_POSITIVE,
      BloodType.A_NEGATIVE,
      BloodType.B_POSITIVE,
      BloodType.B_NEGATIVE,
      BloodType.AB_POSITIVE,
      BloodType.AB_NEGATIVE,
      BloodType.UNKNOWN,
    ]),
    
    maritalStatus: z.enum([
      MaritalStatus.SINGLE,
      MaritalStatus.MARRIED,
      MaritalStatus.DIVORCED,
      MaritalStatus.WIDOWED,
      MaritalStatus.PREFER_NOT_TO_SAY,
    ]),
    
    nationality: z
      .string()
      .max(100, 'patient.validation.nationality_max')
      .optional()
      .or(z.literal('')),
    
    // Contact Information
    address: z
      .string()
      .min(5, 'patient.validation.address_min')
      .max(255, 'patient.validation.address_max'),
    
    city: z
      .string()
      .min(2, 'patient.validation.city_min')
      .max(100, 'patient.validation.city_max'),
    
    state: z
      .string()
      .min(2, 'patient.validation.state_min')
      .max(100, 'patient.validation.state_max'),
    
    postalCode: z
      .string()
      .regex(postalCodeRegex, 'patient.validation.invalid_postal_code'),
    
    country: z
      .string()
      .min(2, 'patient.validation.country_min')
      .max(100, 'patient.validation.country_max'),
    
    // Emergency Contact
    emergencyContactName: z
      .string()
      .min(2, 'patient.validation.emergency_contact_name_min')
      .max(100, 'patient.validation.emergency_contact_name_max')
      .optional()
      .or(z.literal('')),
    
    emergencyContactPhone: z
      .string()
      .regex(phoneRegex, 'patient.validation.invalid_phone')
      .optional()
      .or(z.literal('')),
    
    emergencyContactRelation: z
      .string()
      .max(50, 'patient.validation.emergency_contact_relation_max')
      .optional()
      .or(z.literal('')),
    
    // Medical Information
    allergies: z
      .string()
      .max(1000, 'patient.validation.allergies_max')
      .optional()
      .or(z.literal('')),
    
    chronicDiseases: z
      .string()
      .max(1000, 'patient.validation.chronic_diseases_max')
      .optional()
      .or(z.literal('')),
    
    medications: z
      .string()
      .max(1000, 'patient.validation.medications_max')
      .optional()
      .or(z.literal('')),
    
    notes: z
      .string()
      .max(2000, 'patient.validation.notes_max')
      .optional()
      .or(z.literal('')),
    
    // Department Assignment
    assignedDepartmentId: z
      .string()
      .uuid('patient.validation.invalid_department_id')
      .optional()
      .or(z.literal('')),
  })
  .strict();

export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;

// ============================================================================
// Patient Search/Filter Schema
// ============================================================================

export const patientSearchSchema = z.object({
  q: z.string().max(100, 'patient.validation.search_query_max').optional(),
  status: z.string().optional(),
  departmentId: z.string().optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  page: z.number().int().min(1, 'patient.validation.page_min').optional(),
  limit: z.number().int().min(10, 'patient.validation.limit_min').max(100, 'patient.validation.limit_max').optional(),
  sortBy: z.enum(['name', 'registeredAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PatientSearchFormData = z.infer<typeof patientSearchSchema>;

// ============================================================================
// Deactivate Patient Schema
// ============================================================================

export const deactivatePatientSchema = z.object({
  reason: z
    .string()
    .min(10, 'patient.validation.deactivation_reason_min')
    .max(500, 'patient.validation.deactivation_reason_max'),
});

export type DeactivatePatientFormData = z.infer<typeof deactivatePatientSchema>;

// ============================================================================
// Department Assignment Schema
// ============================================================================

export const departmentAssignmentSchema = z.object({
  assignedDepartmentId: z
    .string()
    .uuid('patient.validation.invalid_department_id'),
});

export type DepartmentAssignmentFormData = z.infer<typeof departmentAssignmentSchema>;
