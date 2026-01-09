/**
 * Patient Module RBAC Guards
 * Role-based access control for patient operations
 */

import { PatientDto, PatientStatus } from '../types';
import { useHasRole, useHasPermission } from '@modules/auth';

/**
 * Check if user can create patients
 * Only Receptionists and Admins can create
 */
export const useCanCreatePatient = (): boolean => {
  const isReceptionist = useHasRole('RECEPTIONIST');
  const isAdmin = useHasRole('ADMIN');
  return isReceptionist || isAdmin;
};

/**
 * Check if user can edit patients
 * Only Receptionists and Admins can edit
 */
export const useCanEditPatient = (): boolean => {
  const isReceptionist = useHasRole('RECEPTIONIST');
  const isAdmin = useHasRole('ADMIN');
  return isReceptionist || isAdmin;
};

/**
 * Check if user can deactivate patients
 * Only Admins can deactivate
 */
export const useCanDeactivatePatient = (): boolean => {
  const isAdmin = useHasRole('ADMIN');
  return isAdmin;
};

/**
 * Check if user can view all patients
 * All authenticated users can view
 */
export const useCanViewPatients = (): boolean => {
  return true; // All authenticated users
};

/**
 * Check if user can view patient details
 * All authenticated users can view
 */
export const useCanViewPatientDetails = (): boolean => {
  return true; // All authenticated users
};

/**
 * Check if user can export patients
 * Only Admins can export
 */
export const useCanExportPatients = (): boolean => {
  const isAdmin = useHasRole('ADMIN');
  return isAdmin;
};

/**
 * Check if user can assign departments
 * Only Admins and Receptionists
 */
export const useCanAssignDepartment = (): boolean => {
  const isReceptionist = useHasRole('RECEPTIONIST');
  const isAdmin = useHasRole('ADMIN');
  return isReceptionist || isAdmin;
};

/**
 * Check if user can edit medical information
 * Only Doctors and Admins (Doctors have limited edit rights)
 */
export const useCanEditMedicalInfo = (): boolean => {
  const isDoctor = useHasRole('DOCTOR');
  const isAdmin = useHasRole('ADMIN');
  return isDoctor || isAdmin;
};

/**
 * Determine editable fields based on role
 * Doctors can only edit medical info, Receptionists can edit most fields
 */
export const getEditableFields = (role: string): string[] => {
  switch (role) {
    case 'DOCTOR':
      return ['allergies', 'chronicDiseases', 'medications', 'notes'];
    case 'RECEPTIONIST':
      return [
        'firstName',
        'lastName',
        'email',
        'phone',
        'alternatePhone',
        'address',
        'city',
        'state',
        'postalCode',
        'country',
        'emergencyContactName',
        'emergencyContactPhone',
        'emergencyContactRelation',
        'assignedDepartmentId',
      ];
    case 'ADMIN':
      return [
        // All fields can be edited
        'firstName',
        'lastName',
        'email',
        'phone',
        'alternatePhone',
        'dateOfBirth',
        'gender',
        'bloodType',
        'maritalStatus',
        'nationality',
        'address',
        'city',
        'state',
        'postalCode',
        'country',
        'emergencyContactName',
        'emergencyContactPhone',
        'emergencyContactRelation',
        'allergies',
        'chronicDiseases',
        'medications',
        'notes',
        'assignedDepartmentId',
      ];
    default:
      return [];
  }
};

/**
 * Check if patient is editable
 * Only active patients can be edited
 */
export const isPatientEditable = (patient: PatientDto): boolean => {
  return patient.status === PatientStatus.ACTIVE;
};

/**
 * Check if patient can be deactivated
 * Only active patients can be deactivated
 */
export const isPatientDeactivatable = (patient: PatientDto): boolean => {
  return patient.status === PatientStatus.ACTIVE;
};

/**
 * Check if user should see patient's medical information
 * Doctors can see, Receptionists cannot, Admins can
 */
export const useCanViewMedicalInfo = (): boolean => {
  const isDoctor = useHasRole('DOCTOR');
  const isAdmin = useHasRole('ADMIN');
  return isDoctor || isAdmin;
};

/**
 * Check if user should see patient's visit history
 * Doctors can see, Admins can, Receptionists cannot
 */
export const useCanViewVisitHistory = (): boolean => {
  const isDoctor = useHasRole('DOCTOR');
  const isAdmin = useHasRole('ADMIN');
  return isDoctor || isAdmin;
};

/**
 * Determine read-only status for patients
 * Doctors see patients as read-only
 */
export const isPatientReadOnly = (userRole: string): boolean => {
  return userRole === 'DOCTOR';
};
