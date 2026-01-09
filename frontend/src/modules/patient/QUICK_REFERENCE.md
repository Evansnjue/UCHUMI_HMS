# Patient Module - Quick Reference

## Module Exports

```typescript
import {
  // Pages
  PatientSearchPage,
  PatientRegistrationPage,
  PatientProfilePage,

  // Components
  PatientForm,
  PatientTable,
  PatientCard,
  PatientNumbers,
  SearchFilterBar,
  DeactivateConfirmationModal,
  VisitHistoryComponent,
  MedicalHistoryComponent,

  // Hooks
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

  // Guards
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

  // Types
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

  // Schemas
  patientRegistrationSchema,
  patientSearchSchema,
  deactivatePatientSchema,
  departmentAssignmentSchema,

  // Utilities
  calculateAge,
  formatPhoneNumber,
  getPatientDisplayName,
  getPatientIdentifier,
  getAgeGroup,
  exportPatientsToCsv,
  downloadCsv,
  formatPatientNumber,

  // Routes & Mock
  patientRoutes,
  mockPatients,
  mockDepartments,
  mockDoctors,
} from '@modules/patient';
```

## Quick API Reference

### Pages
| Page | Route | Purpose |
|------|-------|---------|
| PatientSearchPage | `/patient` | Search & browse patients |
| PatientRegistrationPage | `/patient/register` | Register/edit patient |
| PatientProfilePage | `/patient/profile/:id` | View patient details |

### Query Hooks
| Hook | Returns | Purpose |
|------|---------|---------|
| `usePatientSearch(query)` | `{ data, isLoading }` | Search patients |
| `usePatientById(id)` | `{ data: PatientDto }` | Get single patient |
| `usePatientVisits(id)` | `{ data: VisitDto[] }` | Get visit history |
| `usePatientMedicalHistory(id)` | `{ data: HistoryDto[] }` | Get medical records |
| `usePatientPrescriptions(id)` | `{ data: PrescriptionDto[] }` | Get prescriptions |
| `useDepartments()` | `{ data: DepartmentDto[] }` | Get all departments |
| `useDoctorsByDepartment(id)` | `{ data: DoctorDto[] }` | Get doctors in dept |

### Mutation Hooks
| Hook | Method | Purpose |
|------|--------|---------|
| `useCreatePatient()` | `mutateAsync(data)` | Register patient |
| `useUpdatePatient(id)` | `mutateAsync(data)` | Update patient |
| `useDeactivatePatient(id)` | `mutateAsync(reason)` | Deactivate patient |
| `useBulkDeactivatePatients()` | `mutateAsync(ids)` | Bulk deactivate |
| `useExportPatients()` | `mutateAsync(filters)` | Export to CSV |

### Guard Hooks
| Hook | Returns | Purpose |
|------|---------|---------|
| `useCanCreatePatient()` | `boolean` | Check create permission |
| `useCanEditPatient()` | `boolean` | Check edit permission |
| `useCanDeactivatePatient()` | `boolean` | Check deactivate permission (Admin) |
| `useCanViewMedicalInfo()` | `boolean` | Check medical view permission (Doctor/Admin) |
| `useCanViewVisitHistory()` | `boolean` | Check visit view permission (Doctor/Admin) |
| `getEditableFields(role)` | `string[]` | Get editable fields for role |
| `isPatientEditable(patient)` | `boolean` | Check if patient is ACTIVE |

### Components
| Component | Props | Purpose |
|-----------|-------|---------|
| `PatientForm` | `patient, onSubmit, readOnly` | Registration/edit form |
| `PatientTable` | `patients, onPageChange, onRowClick` | Patient list table |
| `PatientCard` | `patient, onClick` | Patient summary card |
| `PatientNumbers` | `patient, compact` | OPD/IPD display |
| `SearchFilterBar` | `onFilterChange` | Advanced search filters |
| `DeactivateConfirmationModal` | `isOpen, onConfirm, onCancel` | Deactivation confirmation |
| `VisitHistoryComponent` | `visits, onRowClick` | Visit list |
| `MedicalHistoryComponent` | `histories, onRowClick` | Medical history timeline |

## Role Permissions Matrix

| Action | Receptionist | Doctor | Admin |
|--------|---|---|---|
| Create Patient | ✓ | ✗ | ✓ |
| Edit Patient | ✓ | ✗ | ✓ |
| View Patient | ✓ | ✓ | ✓ |
| View Medical Info | ✗ | ✓ | ✓ |
| View Visit History | ✗ | ✓ | ✓ |
| Deactivate Patient | ✗ | ✗ | ✓ |
| Export Patients | ✗ | ✗ | ✓ |
| Assign Department | ✓ | ✗ | ✓ |

## Editable Fields by Role

### Receptionist
- firstName, lastName, phone, alternatePhone
- email, address, city, state, postalCode, country
- emergencyContactName, emergencyContactPhone, emergencyContactRelation
- assignedDepartmentId

### Doctor
- (Read-only view of medical fields: allergies, chronicDiseases, medications, notes)

### Admin
- All fields

## Enums

### PatientStatus
```
ACTIVE, INACTIVE, DECEASED, TRANSFERRED
```

### Gender
```
MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
```

### BloodType
```
O+, O-, A+, A-, B+, B-, AB+, AB-, UNKNOWN
```

### MaritalStatus
```
SINGLE, MARRIED, DIVORCED, WIDOWED, PREFER_NOT_TO_SAY
```

## Common Code Snippets

### Search Patients
```typescript
const { data, isLoading } = usePatientSearch({ q: 'John', page: 1 });
```

### Create Patient
```typescript
const { mutateAsync } = useCreatePatient();
await mutateAsync({ firstName: 'John', ... });
```

### Get Patient Profile
```typescript
const { data: patient } = usePatientById('pat-001');
```

### Check Permission
```typescript
const canEdit = useCanEditPatient();
if (canEdit) { /* show edit button */ }
```

### Calculate Age
```typescript
const age = calculateAge('1985-06-15');
```

### Format Phone
```typescript
const formatted = formatPhoneNumber('+254712345678');
```

### Export CSV
```typescript
const csv = exportPatientsToCsv(mockPatients);
downloadCsv(csv, 'patients.csv');
```

### Get Editable Fields
```typescript
const fields = getEditableFields('RECEPTIONIST');
// Returns: ['firstName', 'lastName', 'phone', ...]
```

### Deactivate Patient
```typescript
const { mutateAsync } = useDeactivatePatient('pat-001');
await mutateAsync({ reason: 'Relocated' });
```

## Form Validation Rules

| Field | Rules |
|-------|-------|
| First Name | 2-50 chars, letters/hyphens/dots |
| Last Name | 2-50 chars, letters/hyphens/dots |
| Phone | International format, 10+ digits |
| Email | Valid email format (optional) |
| Date of Birth | YYYY-MM-DD, age 0-150 years |
| Postal Code | 5-10 digits |
| Gender | One of 4 enum values |
| Blood Type | One of 9 enum values |
| Medical Fields | Max 1000 chars each |

## Styling Classes (Tailwind)

- Status badge (ACTIVE): `bg-green-100 text-green-800`
- Status badge (INACTIVE): `bg-red-100 text-red-800`
- Patient number: `font-mono` (monospace)
- Form label: `text-sm font-medium text-gray-700`
- Form input: `w-full px-3 py-2 border border-gray-300 rounded-lg`
- Button primary: `px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700`
- Button danger: `px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700`

## File Structure

```
patient/
├── pages/              # Page components (3)
├── components/         # UI components (8)
├── hooks/             # React Query hooks (13)
├── services/          # API service (1)
├── guards/            # RBAC utilities (12)
├── types/             # TypeScript DTOs (15+)
├── schemas/           # Zod validation (4)
├── mock/              # Mock data
├── utils/             # Helper functions (15+)
├── routes.ts          # Route configuration
├── index.ts           # Barrel export
└── README.md          # Documentation
```

## Performance Tips

1. Use hooks instead of service directly
2. Enable queries only when needed: `{ enabled: condition }`
3. Leverage React Query caching (automatic)
4. Memoize expensive computations
5. Use pagination (20 items/page)
6. Debounce search input

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Cannot read 'id' of undefined" | Add null check: `if (!patient) return null;` |
| "Permission denied" | Check user role: `const canEdit = useCanEditPatient();` |
| "Form validation failed" | Check schema: `patientRegistrationSchema.safeParse(data)` |
| "Cache not updating" | Hooks handle invalidation automatically |
| "Data not loading" | Check `enabled` flag in hook options |

---

**Last Updated**: March 2024 | **Version**: 1.0.0 | **Module Size**: ~70 files, 5000+ LOC
