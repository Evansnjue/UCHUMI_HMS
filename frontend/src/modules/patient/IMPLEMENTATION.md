# Patient Module - Implementation Guide

## Quick Start

### 1. Add Routes to Root Router

```typescript
// src/router.tsx
import { patientRoutes } from '@modules/patient';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...patientRoutes,
      // ... other routes
    ],
  },
]);
```

### 2. Access Patient Pages

Navigate to:
- `/patient` - Search and browse patients
- `/patient/register` - Register new patient
- `/patient/profile/:id` - View patient details

### 3. Use in Components

```typescript
import {
  usePatientSearch,
  useCreatePatient,
  PatientTable,
  useCanCreatePatient,
} from '@modules/patient';

export const MyComponent = () => {
  const canCreate = useCanCreatePatient();
  const { data: patients } = usePatientSearch({ q: '', page: 1 });

  return (
    <div>
      {canCreate && <button>Register Patient</button>}
      <PatientTable patients={patients?.data || []} />
    </div>
  );
};
```

## Implementation Patterns

### Pattern 1: Page Integration

```typescript
import {
  PatientRegistrationPage,
  useCanCreatePatient,
} from '@modules/patient';
import { ProtectedRoute } from '@modules/auth';

// In router
{
  path: 'register',
  element: (
    <ProtectedRoute roles={['RECEPTIONIST', 'ADMIN']}>
      <PatientRegistrationPage />
    </ProtectedRoute>
  ),
}
```

### Pattern 2: Form Integration

```typescript
import { PatientForm, useCreatePatient, PatientRegistrationFormData } from '@modules/patient';

const MyForm = () => {
  const { mutateAsync, isPending } = useCreatePatient();

  const handleSubmit = async (data: PatientRegistrationFormData) => {
    await mutateAsync(data);
  };

  return <PatientForm onSubmit={handleSubmit} isSubmitting={isPending} />;
};
```

### Pattern 3: Data Display

```typescript
import {
  usePatientById,
  PatientNumbers,
  VisitHistoryComponent,
  MedicalHistoryComponent,
  useCanViewMedicalInfo,
  useCanViewVisitHistory,
} from '@modules/patient';

const PatientDetail = ({ id }: { id: string }) => {
  const { data: patient } = usePatientById(id);
  const { data: visits } = useCanViewVisitHistory(); // hooks check permission internally
  const { data: history } = useCanViewMedicalInfo();

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <PatientNumbers patient={patient} />
      {visits && <VisitHistoryComponent visits={visits} />}
      {history && <MedicalHistoryComponent histories={history} />}
    </div>
  );
};
```

### Pattern 4: Search with Filters

```typescript
import { usePatientSearch, SearchFilterBar, PatientTable } from '@modules/patient';
import { useState } from 'react';

const SearchPage = () => {
  const [filters, setFilters] = useState({});
  const { data } = usePatientSearch({
    q: filters.q || '',
    page: 1,
    ...filters,
  });

  return (
    <div>
      <SearchFilterBar onFilterChange={setFilters} />
      <PatientTable patients={data?.data || []} total={data?.total || 0} />
    </div>
  );
};
```

### Pattern 5: Conditional Rendering by Role

```typescript
import {
  useCanEditPatient,
  useCanDeactivatePatient,
  useCanViewMedicalInfo,
} from '@modules/patient';

const PatientActions = ({ patientId }: { patientId: string }) => {
  const canEdit = useCanEditPatient();
  const canDeactivate = useCanDeactivatePatient();
  const canViewMedical = useCanViewMedicalInfo();

  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDeactivate && <button>Deactivate</button>}
      {canViewMedical && <div>Medical Info</div>}
    </div>
  );
};
```

## Component Props Reference

### PatientForm

```typescript
interface PatientFormProps {
  patient?: PatientDto;                    // Existing patient to edit
  readOnly?: boolean;                      // Disable all fields
  editableFields?: string[];               // Role-specific editable fields
  onSubmit: (data: PatientRegistrationFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string;
}
```

### PatientTable

```typescript
interface PatientTableProps {
  patients: PatientDto[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (patient: PatientDto) => void;
  onEditClick?: (patient: PatientDto) => void;
  onDeactivateClick?: (patient: PatientDto) => void;
  canEdit?: boolean;
  canDeactivate?: boolean;
}
```

### PatientCard

```typescript
interface PatientCardProps {
  patient: PatientDto;
  onClick?: () => void;
  showDepartment?: boolean;
}
```

### PatientNumbers

```typescript
interface PatientNumbersProps {
  patient: PatientDto;
  compact?: boolean; // Default: false (full display)
}
```

### SearchFilterBar

```typescript
interface SearchFilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  isLoading?: boolean;
}
```

### DeactivateConfirmationModal

```typescript
interface DeactivateConfirmationModalProps {
  patientName: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  error?: string;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
}
```

## Hook Parameters & Options

### usePatientSearch

```typescript
const { data, isLoading, error } = usePatientSearch(
  {
    q?: string;              // Search query
    page?: number;           // Page number (default: 1)
    limit?: number;          // Items per page (default: 20)
    sortBy?: string;         // Field to sort by
    sortOrder?: 'asc' | 'desc';
    status?: PatientStatus;  // Filter by status
    departmentId?: string;   // Filter by department
  },
  {
    enabled?: boolean;       // Enable/disable query
  }
);
```

### useCreatePatient

```typescript
const { mutateAsync, isPending, error } = useCreatePatient();

await mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1985-06-15',
  phone: '+254712345678',
  // ... all required fields from PatientRegistrationFormData
});
```

### useUpdatePatient

```typescript
const { mutateAsync, isPending, error } = useUpdatePatient(patientId);

await mutateAsync({
  firstName: 'Jane',
  // ... only fields to update (partial)
});
```

### useDeactivatePatient

```typescript
const { mutateAsync, isPending, error } = useDeactivatePatient(patientId);

await mutateAsync({
  reason: 'Patient relocated to another facility',
});
```

## Common Workflows

### Workflow 1: Register New Patient

```typescript
import { useNavigate } from 'react-router-dom';
import { useCreatePatient, PatientForm } from '@modules/patient';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreatePatient();

  const handleSubmit = async (formData) => {
    const newPatient = await mutateAsync(formData);
    navigate(`/patient/profile/${newPatient.id}`, {
      state: { message: 'Patient registered successfully' },
    });
  };

  return <PatientForm onSubmit={handleSubmit} isSubmitting={isPending} />;
};
```

### Workflow 2: Update Patient Info

```typescript
import { useParams } from 'react-router-dom';
import {
  usePatientById,
  useUpdatePatient,
  PatientForm,
  useCanEditPatient,
  getEditableFields,
} from '@modules/patient';

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const canEdit = useCanEditPatient();
  const { data: patient } = usePatientById(id || '');
  const { mutateAsync, isPending } = useUpdatePatient(id || '');

  if (!canEdit) return <p>Not authorized</p>;

  const editableFields = getEditableFields('RECEPTIONIST');

  return (
    <PatientForm
      patient={patient}
      editableFields={editableFields}
      onSubmit={(data) => mutateAsync(data)}
      isSubmitting={isPending}
    />
  );
};
```

### Workflow 3: Search and Filter

```typescript
import { usePatientSearch, SearchFilterBar, PatientTable } from '@modules/patient';
import { useState } from 'react';

const SearchPatients = () => {
  const [searchParams, setSearchParams] = useState({
    q: '',
    page: 1,
    status: 'ACTIVE',
  });

  const { data, isLoading } = usePatientSearch(searchParams);

  const handleSearch = (value) => {
    setSearchParams((prev) => ({ ...prev, q: value, page: 1 }));
  };

  const handleFilter = (filters) => {
    setSearchParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <SearchFilterBar onFilterChange={handleFilter} />
      <PatientTable
        patients={data?.data || []}
        total={data?.total || 0}
        isLoading={isLoading}
        page={searchParams.page}
      />
    </div>
  );
};
```

### Workflow 4: Deactivate Patient

```typescript
import { useDeactivatePatient, DeactivateConfirmationModal } from '@modules/patient';
import { useState } from 'react';

const PatientActions = ({ patientId, patientName }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const { mutateAsync, isPending } = useDeactivatePatient(patientId);

  const handleDeactivate = async (reason: string) => {
    await mutateAsync({ reason });
    setShowDeactivateModal(false);
  };

  return (
    <>
      <button onClick={() => setShowDeactivateModal(true)}>Deactivate</button>
      <DeactivateConfirmationModal
        patientName={patientName}
        isOpen={showDeactivateModal}
        isSubmitting={isPending}
        onConfirm={handleDeactivate}
        onCancel={() => setShowDeactivateModal(false)}
      />
    </>
  );
};
```

### Workflow 5: View Patient Profile

```typescript
import { useParams } from 'react-router-dom';
import {
  usePatientById,
  usePatientVisits,
  usePatientMedicalHistory,
  VisitHistoryComponent,
  MedicalHistoryComponent,
  useCanViewVisitHistory,
  useCanViewMedicalInfo,
} from '@modules/patient';

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const canViewVisits = useCanViewVisitHistory();
  const canViewMedical = useCanViewMedicalInfo();

  const { data: patient, isLoading } = usePatientById(id || '');
  const { data: visits = [] } = usePatientVisits(id || '', {
    enabled: canViewVisits,
  });
  const { data: medicalHistory = [] } = usePatientMedicalHistory(id || '', {
    enabled: canViewMedical,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{patient?.fullName}</h1>
      {canViewVisits && <VisitHistoryComponent visits={visits} />}
      {canViewMedical && <MedicalHistoryComponent histories={medicalHistory} />}
    </div>
  );
};
```

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { PatientCard } from '@modules/patient';
import { mockPatients } from '@modules/patient';

describe('PatientCard', () => {
  it('should display patient name', () => {
    const patient = mockPatients[0];
    render(<PatientCard patient={patient} />);
    expect(screen.getByText(patient.fullName)).toBeInTheDocument();
  });

  it('should display patient numbers', () => {
    const patient = mockPatients[0];
    render(<PatientCard patient={patient} />);
    expect(screen.getByText(patient.opdNumber!)).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatientSearch } from '@modules/patient';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('usePatientSearch', () => {
  it('should fetch patients', async () => {
    const { result } = renderHook(
      () => usePatientSearch({ q: '', page: 1 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.data).toBeDefined();
  });
});
```

## Troubleshooting

### Issue: "Cannot read property 'id' of undefined"
**Cause**: Patient data hasn't loaded yet  
**Solution**: Add null check or use loading state

```typescript
if (!patient) return <div>Loading...</div>;
```

### Issue: "User doesn't have permission"
**Cause**: RBAC check failed  
**Solution**: Verify user has correct role

```typescript
const canEdit = useCanEditPatient();
console.log('Can edit:', canEdit);
```

### Issue: Form validation errors
**Cause**: Data doesn't match schema  
**Solution**: Check schema requirements in `patient.schema.ts`

```typescript
// Validate before submit
const result = patientRegistrationSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.flatten());
}
```

### Issue: Cache not updating
**Cause**: React Query cache not invalidated  
**Solution**: Hooks handle this automatically, but verify `enabled` flags

```typescript
const { data } = usePatientSearch(query, {
  enabled: query.q.length > 0,
});
```

## Best Practices

1. **Always use hooks for data**: Never call `PatientService` directly in components
2. **Validate early**: Use schemas to validate before API calls
3. **Handle loading states**: Show skeleton or spinner while loading
4. **Check permissions first**: Use guard hooks before rendering
5. **Use barrel exports**: Import from module root, not subfolders
6. **Type your forms**: Use `PatientRegistrationFormData` type
7. **Cache appropriately**: Stale times are pre-configured
8. **Error boundaries**: Wrap pages in error boundaries
9. **Optimize renders**: Memoize expensive components
10. **Test coverage**: Aim for 80%+ coverage on critical flows

---

**Last Updated**: March 2024  
**Version**: 1.0.0
