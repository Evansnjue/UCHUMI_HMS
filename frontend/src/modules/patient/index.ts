/**
 * Patient Module Index
 * Central export point for all patient module functionality
 */

// Pages
export { PatientRegistrationPage, PatientSearchPage, PatientProfilePage } from './pages';

// Components
export {
  PatientNumbers,
  PatientForm,
  PatientTable,
  PatientCard,
  SearchFilterBar,
  DeactivateConfirmationModal,
  VisitHistoryComponent,
  MedicalHistoryComponent,
} from './components';

export type {
  SearchFilterBarProps,
  FilterOptions,
  DeactivateConfirmationModalProps,
  VisitHistoryComponentProps,
  MedicalHistoryComponentProps,
} from './components';

// Hooks
export {
  usePatientSearch,
  usePatientById,
  usePatientVisits,
  usePatientMedicalHistory,
  usePatientPrescriptions,
  usePatientNumbers,
  useDepartments,
  useDoctorsByDepartment,
  useCreatePatient,
  useUpdatePatient,
  useDeactivatePatient,
  useBulkDeactivatePatients,
  useExportPatients,
} from './hooks';

// Services
export { PatientService } from './services';

// Types
export {
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
  PatientStatus,
  Gender,
  BloodType,
  MaritalStatus,
} from './types';

// Guards
export {
  useCanCreatePatient,
  useCanEditPatient,
  useCanDeactivatePatient,
  useCanViewPatients,
  useCanViewPatientDetails,
  useCanExportPatients,
  useCanAssignDepartment,
  useCanEditMedicalInfo,
  useCanViewMedicalInfo,
  useCanViewVisitHistory,
  getEditableFields,
  isPatientEditable,
  isPatientDeactivatable,
  isPatientReadOnly,
} from './guards';

// Schemas
export {
  patientRegistrationSchema,
  patientSearchSchema,
  deactivatePatientSchema,
  departmentAssignmentSchema,
} from './schemas';

// Routes
export { patientRoutes } from './routes';

// Mock Data
export {
  mockPatients,
  mockDepartments,
  mockDoctors,
  mockPatientVisits,
  mockMedicalHistory,
  mockPrescriptions,
} from './mock/mockPatients';

// Utilities
export {
  formatPatientNumber,
  calculateAge,
  formatPhoneNumber,
  getPatientDisplayName,
  getPatientIdentifier,
  hasCompleteContact,
  getPatientContactSummary,
  sortPatientsByName,
  sortPatientsByDate,
  filterPatientsByStatus,
  filterPatientsByQuery,
  exportPatientsToCsv,
  downloadCsv,
  isValidPhoneNumber,
  isValidEmail,
  getAgeGroup,
} from './utils';
