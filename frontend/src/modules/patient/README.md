# Patient Module Documentation

## Overview

The Patient module is a comprehensive feature module for managing patient records in the Hospital Management System (HMS). It provides functionality for patient registration, search, profile management, medical history tracking, and department assignment with role-based access control.

## Features

### Core Functionality
- **Patient Registration**: Create new patient records with comprehensive demographic and medical information
- **Patient Search & Filtering**: Search patients by name, phone, or patient number with advanced filtering options
- **Patient Profiles**: View detailed patient information, medical history, visits, and prescriptions
- **Medical History Tracking**: Record and track patient diagnoses, treatments, and medical conditions
- **Visit Management**: Track outpatient (OPD) and inpatient (IPD) visits
- **Department Assignment**: Assign patients to specific departments for continuity of care
- **Patient Deactivation**: Soft-delete patients with reason tracking (no hard deletion)

### Advanced Features
- **Dual Patient Numbers**: Independent OPD (outpatient) and IPD (inpatient) numbers per patient
- **Role-Based Field Editability**: Different roles (Receptionist, Doctor, Admin) have different editable fields
- **Medical Information Access Control**: Only clinical roles (Doctor, Admin) can view medical details
- **Visit History**: Complete audit trail of patient visits with vital signs
- **Prescription Tracking**: Manage active medications and prescriptions
- **CSV Export**: Export patient lists for reporting (Admin only)

## Module Structure

```
patient/
├── pages/                          # Page-level components
│   ├── PatientRegistrationPage.tsx # Register/edit patient
│   ├── PatientSearchPage.tsx       # Search and browse patients
│   ├── PatientProfilePage.tsx      # View patient details
│   └── index.ts
├── components/                     # Reusable UI components
│   ├── PatientForm.tsx            # Registration/edit form
│   ├── PatientTable.tsx           # Patient list table
│   ├── PatientCard.tsx            # Patient summary card
│   ├── PatientNumbers.tsx         # OPD/IPD display
│   ├── SearchFilterBar.tsx        # Advanced search filters
│   ├── DeactivateConfirmationModal.tsx # Deactivation confirmation
│   ├── VisitHistoryComponent.tsx  # Visit list display
│   ├── MedicalHistoryComponent.tsx # Medical records timeline
│   └── index.ts
├── hooks/                          # React Query hooks
│   ├── usePatients.ts             # All patient queries and mutations
│   └── index.ts
├── services/                       # API layer
│   ├── patient.service.ts         # PatientService class
│   └── index.ts
├── guards/                         # RBAC utilities
│   ├── patientAccess.guard.ts    # Permission checks
│   └── index.ts
├── types/                          # Type definitions
│   ├── patient.dto.ts            # DTOs and enums
│   └── index.ts
├── schemas/                        # Validation schemas
│   ├── patient.schema.ts         # Zod validation schemas
│   └── index.ts
├── mock/                           # Mock data
│   └── mockPatients.ts           # Mock data for development
├── utils/                          # Helper utilities
│   ├── patient.utils.ts          # Utility functions
│   └── index.ts
├── routes.ts                       # Route configuration
├── index.ts                        # Barrel export
└── README.md                       # This file
```

## Usage

### Basic Imports

```typescript
import {
  PatientSearchPage,
  PatientRegistrationPage,
  PatientProfilePage,
  usePatientSearch,
  useCreatePatient,
  PatientService,
  patientRoutes,
  mockPatients,
  calculateAge,
} from '@modules/patient';
```

### Routes

Add to your main router configuration:

```typescript
import { patientRoutes } from '@modules/patient';

const routes = [
  ...patientRoutes,
  // ... other routes
];
```

### Available Routes

- `/patient` - Patient search/list page
- `/patient/search` - Patient search (alias)
- `/patient/register` - Register new patient (Receptionist, Admin)
- `/patient/register/:id` - Edit existing patient (Receptionist, Admin)
- `/patient/profile/:id` - View patient profile (All authenticated)

## Hooks API

### Query Hooks

#### usePatientSearch(query, options)
Search and filter patients with pagination.

```typescript
const { data, isLoading, error } = usePatientSearch({
  q: 'John',
  page: 1,
  limit: 20,
  sortBy: 'registeredAt',
  sortOrder: 'desc',
});
```

#### usePatientById(id, options)
Fetch a single patient by ID.

```typescript
const { data: patient, isLoading } = usePatientById('pat-001');
```

#### usePatientVisits(patientId, options)
Fetch patient's visit history.

```typescript
const { data: visits } = usePatientVisits('pat-001');
```

#### usePatientMedicalHistory(patientId, options)
Fetch patient's medical history records.

```typescript
const { data: history } = usePatientMedicalHistory('pat-001');
```

#### usePatientPrescriptions(patientId, options)
Fetch patient's prescriptions.

```typescript
const { data: prescriptions } = usePatientPrescriptions('pat-001');
```

#### useDepartments()
Fetch all departments for assignment.

```typescript
const { data: departments } = useDepartments();
```

#### useDoctorsByDepartment(departmentId, options)
Fetch doctors in a specific department.

```typescript
const { data: doctors } = useDoctorsByDepartment('dept-001');
```

#### usePatientNumbers()
Get next available OPD/IPD numbers.

```typescript
const { data: numbers } = usePatientNumbers();
```

### Mutation Hooks

#### useCreatePatient()
Create a new patient.

```typescript
const { mutateAsync, isPending } = useCreatePatient();

await mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1985-06-15',
  // ... other fields
});
```

#### useUpdatePatient(id)
Update an existing patient.

```typescript
const { mutateAsync, isPending } = useUpdatePatient('pat-001');

await mutateAsync({
  firstName: 'Jane',
  // ... updated fields
});
```

#### useDeactivatePatient(id)
Deactivate a patient with reason.

```typescript
const { mutateAsync, isPending } = useDeactivatePatient('pat-001');

await mutateAsync({
  reason: 'Patient relocated to another facility',
});
```

#### useBulkDeactivatePatients()
Deactivate multiple patients at once.

```typescript
const { mutateAsync, isPending } = useBulkDeactivatePatients();

await mutateAsync({
  patientIds: ['pat-001', 'pat-002'],
  reason: 'Facility closure',
});
```

#### useExportPatients()
Export patient list as CSV.

```typescript
const { mutateAsync, isPending } = useExportPatients();

await mutateAsync({
  q: 'John',
  status: 'ACTIVE',
});
```

## Guards API

### useCanCreatePatient()
Check if user can register new patients.

```typescript
const canCreate = useCanCreatePatient();
if (canCreate) {
  // Show registration button
}
```

### useCanEditPatient()
Check if user can edit patient information.

```typescript
const canEdit = useCanEditPatient();
```

### useCanDeactivatePatient()
Check if user can deactivate patients (Admin only).

```typescript
const canDeactivate = useCanDeactivatePatient();
```

### useCanViewMedicalInfo()
Check if user can view medical information.

```typescript
const canViewMedical = useCanViewMedicalInfo();
```

### useCanViewVisitHistory()
Check if user can view visit history.

```typescript
const canViewVisits = useCanViewVisitHistory();
```

### getEditableFields(roleCode)
Get list of editable fields for a specific role.

```typescript
const editableFields = getEditableFields('RECEPTIONIST');
// Returns: ['firstName', 'lastName', 'phone', 'address', ...]
```

## Type Definitions

### PatientDto
Main patient entity with all attributes.

```typescript
interface PatientDto {
  // Identifiers
  id: string;
  opdNumber: string;       // Optional outpatient number
  ipdNumber: string | null; // Optional inpatient number

  // Personal Information
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;     // YYYY-MM-DD
  gender: Gender;          // MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
  bloodType: BloodType;    // A+, A-, B+, B-, AB+, AB-, O+, O-
  maritalStatus: MaritalStatus;

  // Contact
  phone: string;
  alternatePhone?: string;
  email?: string;

  // Address
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Medical
  allergies?: string;
  chronicDiseases?: string;
  medications?: string;
  notes?: string;

  // Department Assignment
  assignedDepartmentId?: string;
  assignedDepartment?: DepartmentDto;

  // Status
  status: PatientStatus; // ACTIVE, INACTIVE, DECEASED, TRANSFERRED

  // Audit Fields
  registeredAt: string;    // ISO 8601
  registeredBy: string;    // User ID
  updatedAt: string;
  updatedBy: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
  deactivatedReason?: string;
}
```

### PatientStatus Enum
```typescript
enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}
```

### Gender Enum
```typescript
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}
```

### BloodType Enum
```typescript
enum BloodType {
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
```

## Validation Schemas

### patientRegistrationSchema
Zod schema for patient registration/edit forms.

```typescript
const schema = patientRegistrationSchema;
// Validates:
// - Name: 2-50 chars, letters/hyphens/dots only
// - Phone: International format
// - Email: Valid format (optional)
// - DOB: YYYY-MM-DD, age 0-150
// - Postal Code: 5-10 digits
// - Blood Type: One of 9 enum values
// - Gender: One of 4 enum values
// - All text fields: Max 1000 chars
```

### patientSearchSchema
Schema for search query parameters.

```typescript
const query = patientSearchSchema.parse({
  q: 'John',
  page: 1,
  limit: 20,
  status: 'ACTIVE',
  departmentId: 'dept-001',
});
```

## Utility Functions

### calculateAge(dateOfBirth: string): number
Calculate patient age from date of birth.

```typescript
const age = calculateAge('1985-06-15');
```

### formatPhoneNumber(phone: string): string
Format phone number for display.

```typescript
const formatted = formatPhoneNumber('+254712345678');
// Returns: '+254 712 345 678'
```

### getPatientDisplayName(patient: PatientDto): string
Get patient full name from first/last names.

```typescript
const name = getPatientDisplayName(patient);
```

### getPatientIdentifier(patient: PatientDto): string
Get primary patient identifier (OPD or IPD number).

```typescript
const id = getPatientIdentifier(patient);
```

### getAgeGroup(dateOfBirth: string): string
Get patient age group.

```typescript
const group = getAgeGroup('2005-06-15');
// Returns: 'Pediatric', 'Adult', or 'Elderly'
```

### exportPatientsToCsv(patients: PatientDto[]): string
Generate CSV content from patient list.

```typescript
const csv = exportPatientsToCsv(patients);
downloadCsv(csv, 'patients.csv');
```

## Role-Based Access Control

### Receptionist
- **Can**: Create, edit, search patients
- **Cannot**: Deactivate, view medical info, export
- **Edit Fields**: firstName, lastName, phone, address, email, contact details
- **Read-Only**: gender, dateOfBirth, bloodType (from profile)

### Doctor
- **Can**: View patients, view medical info, search
- **Cannot**: Create, edit, deactivate, export
- **View Medical**: Allergies, chronic diseases, medications, notes, visit history
- **No Edit**: All fields read-only

### Admin
- **Can**: All operations - create, edit, deactivate, view all info, export
- **Edit Fields**: All fields

## Mock Data

The module includes comprehensive mock data for development:

```typescript
import {
  mockPatients,
  mockDepartments,
  mockDoctors,
  mockPatientVisits,
  mockMedicalHistory,
  mockPrescriptions,
} from '@modules/patient';
```

Mock data includes:
- 4 sample patients with varied statuses
- 5 hospital departments
- 3 doctor profiles
- Sample visits, medical history, and prescriptions

## Error Handling

All hooks and services include error handling:

```typescript
const { mutateAsync, error, isPending } = useCreatePatient();

try {
  await mutateAsync(formData);
} catch (err) {
  const message = (err as AxiosError).response?.data?.message;
  console.error('Registration failed:', message);
}
```

## Styling

The module uses Tailwind CSS for styling:

- Status colors: Green (ACTIVE), Red (INACTIVE/DECEASED)
- Patient numbers: Monospace font for clarity
- Forms: Full-width on mobile, fixed max-width on desktop
- Tables: Responsive with horizontal scroll on mobile
- Modals: Fixed position with backdrop overlay

## Performance Optimizations

- **React Query**: Automatic caching and stale time management
- **Lazy Loading**: Visit history and medical records loaded on demand
- **Pagination**: Patient lists paginated at 20 items per page
- **Memoization**: Hooks memoized to prevent unnecessary re-renders
- **Debouncing**: Search input debounced to reduce API calls

## Testing

Each component and hook includes:
- Type safety via TypeScript
- Validation via Zod schemas
- Error boundary support
- Loading state handling
- Empty state messaging

## API Contract

The module expects the backend to provide these endpoints:

```
GET    /api/v1/patients                    - Search patients
GET    /api/v1/patients/:id                - Get patient
POST   /api/v1/patients                    - Create patient
PUT    /api/v1/patients/:id                - Update patient
PATCH  /api/v1/patients/:id/deactivate    - Deactivate patient
PATCH  /api/v1/patients/bulk/deactivate   - Bulk deactivate
GET    /api/v1/patients/:id/visits        - Get visits
GET    /api/v1/patients/:id/history       - Get medical history
GET    /api/v1/patients/:id/prescriptions - Get prescriptions
GET    /api/v1/departments                - List departments
GET    /api/v1/departments/:id/doctors    - Get doctors
GET    /api/v1/patients/numbers           - Get next numbers
POST   /api/v1/patients/export            - Export as CSV
```

## Future Enhancements

- [ ] Patient appointment scheduling
- [ ] Insurance information management
- [ ] Vaccination record tracking
- [ ] Lab results integration
- [ ] Imaging/radiology records
- [ ] Pharmacy integration
- [ ] Patient mobile app
- [ ] Telemedicine support

---

**Last Updated**: March 2024  
**Version**: 1.0.0  
**Compatibility**: React 18+, TypeScript 5.0+
