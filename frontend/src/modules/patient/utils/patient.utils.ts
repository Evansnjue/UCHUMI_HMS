/**
 * Patient Module Utilities
 * Helper functions for patient operations
 */

import { PatientDto } from '../types';

/**
 * Format patient number with visual spacing
 */
export const formatPatientNumber = (number: string | null | undefined): string => {
  if (!number) return 'N/A';
  return number;
};

/**
 * Calculate patient age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as +XXX XXX XXX XXX
  if (cleaned.length >= 12) {
    return `+${cleaned.slice(0, cleaned.length - 9)} ${cleaned.slice(cleaned.length - 9, cleaned.length - 6)} ${cleaned.slice(cleaned.length - 6, cleaned.length - 3)} ${cleaned.slice(cleaned.length - 3)}`;
  }
  return phone;
};

/**
 * Get patient display name
 */
export const getPatientDisplayName = (patient: PatientDto): string => {
  return patient.fullName || `${patient.firstName} ${patient.lastName}`;
};

/**
 * Get patient primary identifier (OPD or IPD number)
 */
export const getPatientIdentifier = (patient: PatientDto): string => {
  return patient.opdNumber || patient.ipdNumber || 'Unknown';
};

/**
 * Check if patient has complete contact information
 */
export const hasCompleteContact = (patient: PatientDto): boolean => {
  return !!(patient.phone && patient.address && patient.city && patient.country);
};

/**
 * Get patient contact summary
 */
export const getPatientContactSummary = (patient: PatientDto): string => {
  const parts = [patient.phone];
  if (patient.email) parts.push(patient.email);
  return parts.join(' | ');
};

/**
 * Sort patients by name
 */
export const sortPatientsByName = (patients: PatientDto[]): PatientDto[] => {
  return [...patients].sort((a, b) => {
    const nameA = getPatientDisplayName(a).toLowerCase();
    const nameB = getPatientDisplayName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sort patients by registration date (newest first)
 */
export const sortPatientsByDate = (patients: PatientDto[]): PatientDto[] => {
  return [...patients].sort((a, b) => {
    return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
  });
};

/**
 * Filter patients by status
 */
export const filterPatientsByStatus = (
  patients: PatientDto[],
  status: string
): PatientDto[] => {
  if (!status) return patients;
  return patients.filter((p) => p.status === status);
};

/**
 * Filter patients by search query
 */
export const filterPatientsByQuery = (patients: PatientDto[], query: string): PatientDto[] => {
  if (!query) return patients;
  const lowerQuery = query.toLowerCase();
  return patients.filter(
    (p) =>
      getPatientDisplayName(p).toLowerCase().includes(lowerQuery) ||
      p.phone?.includes(query) ||
      p.opdNumber?.includes(query) ||
      p.ipdNumber?.includes(query) ||
      p.email?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Export patient data as CSV
 */
export const exportPatientsToCsv = (patients: PatientDto[]): string => {
  const headers = [
    'Full Name',
    'Phone',
    'Email',
    'OPD Number',
    'IPD Number',
    'Status',
    'Date of Birth',
    'Gender',
    'Blood Type',
    'City',
    'Registered Date',
  ];

  const rows = patients.map((p) => [
    getPatientDisplayName(p),
    p.phone,
    p.email || '',
    p.opdNumber || '',
    p.ipdNumber || '',
    p.status,
    p.dateOfBirth,
    p.gender,
    p.bloodType,
    p.city,
    new Date(p.registeredAt).toLocaleDateString(),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCsv = (content: string, filename: string = 'patients.csv'): void => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get patient age group
 */
export const getAgeGroup = (dateOfBirth: string): string => {
  const age = calculateAge(dateOfBirth);
  if (age < 18) return 'Pediatric';
  if (age < 65) return 'Adult';
  return 'Elderly';
};
