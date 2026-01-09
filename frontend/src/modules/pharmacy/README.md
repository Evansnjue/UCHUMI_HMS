# Pharmacy Module - Production-Grade Frontend

A comprehensive, enterprise-ready pharmacy management system frontend built with React, TypeScript, and Tailwind CSS.

## Overview

The Pharmacy Module is a feature-rich, RBAC-enabled pharmacy management system that handles prescription queue management, medication dispensing workflows, real-time stock visibility, and comprehensive audit trails. It's designed to integrate seamlessly with hospital systems while enforcing strict business rules and compliance requirements.

## Key Features

### 1. **Prescription Queue Management**
- Real-time prescription queue with status filtering (Pending, Partial, Dispensed, Expired)
- Advanced search and filtering capabilities
- Responsive table with pagination and sorting
- Prescription detail modals with comprehensive information
- Support for prescription cancellation (with audit trail)
- Doctor and patient information display

### 2. **Drug Dispensing Workflow**
- Multi-step dispensing process with validation
- Real-time stock availability checking
- Batch selection with expiry date visibility
- Quantity validation with remaining supply tracking
- Doctor daily drug-category limit enforcement (read-only UI)
- Partial dispensing support
- Complete audit trail for every dispensing action

### 3. **Real-Time Stock Management**
- Comprehensive inventory visibility
- Stock status indicators (In Stock, Low Stock, Out of Stock, Expired)
- Batch tracking with FIFO prioritization
- Expiry date monitoring and alerts
- Reorder level indicators
- Category-based filtering
- Stock summary statistics

### 4. **Comprehensive Audit Trails**
- Complete logging of all pharmacy operations
- User action tracking with timestamps
- Resource-level audit history
- Compliance-ready audit logs
- Advanced filtering and search

### 5. **RBAC & Access Control**
- Role-based UI rendering (Pharmacist, Doctor, Inventory Manager, Admin)
- Permission-based feature visibility
- Data filtering based on user role
- Read-only views for restricted roles
- Sensitive data protection

## Architecture

### Module Structure

```
pharmacy/
├── components/
│   ├── common/              # Shared UI components
│   │   └── CommonComponents.tsx
│   ├── dialogs/             # Modal dialogs
│   ├── forms/               # Form components
│   └── tables/              # Table & data components
│       └── TableComponents.tsx
├── constants/
│   └── index.ts             # Constants & configuration
├── guards/
│   ├── rbac.ts              # RBAC logic & permissions
│   └── RoleGuard.tsx        # RBAC React components
├── hooks/
│   └── queries.ts           # React Query hooks (data fetching)
├── mocks/
│   └── data.ts              # Mock data for development
├── pages/
│   ├── PrescriptionQueuePage.tsx
│   ├── DispensingPage.tsx
│   ├── StockVisibilityPage.tsx
│   └── routes.tsx           # Route configuration
├── services/
│   └── api.ts               # Abstracted API layer
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   └── formatters.ts        # Utility functions
└── index.ts                 # Module exports
```

### Design Principles

1. **Modularity**: Each component is self-contained and reusable
2. **Type Safety**: Strict TypeScript with Zod validation
3. **Separation of Concerns**: Clear layers (API, hooks, components, pages)
4. **RBAC-First**: Every feature respects user roles
5. **Business Rule Enforcement**: UI prevents invalid operations
6. **Audit-Ready**: All actions are logged and traceable
7. **Accessibility**: WCAG-compliant components
8. **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+

### Dependencies

```bash
npm install @tanstack/react-query react-hook-form zod @hookform/resolvers
```

### Setup

1. **Copy the pharmacy module** to your frontend:
```bash
cp -r pharmacy/ frontend/src/modules/
```

2. **Configure API base URL** in your environment:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENABLE_MOCK_DATA=false
```

3. **Import the module** in your main app:
```tsx
import { PharmacyRoutes } from '@/modules/pharmacy';

// In your router configuration
<Route path="/pharmacy/*" element={<PharmacyRoutes userRole={userRole} />} />
```

## Usage

### Basic Integration

```tsx
import { PharmacyRoutes, PrescriptionQueuePage } from '@/modules/pharmacy';

export function App() {
  const userRole = 'PHARMACIST'; // From auth context

  return (
    <QueryClientProvider client={queryClient}>
      <PharmacyRoutes userRole={userRole} />
    </QueryClientProvider>
  );
}
```

### Using Individual Pages

```tsx
import { PrescriptionQueuePage, DispensingPage, StockVisibilityPage } from '@/modules/pharmacy';

<PrescriptionQueuePage 
  userRole="PHARMACIST"
  onSelectPrescription={(rx) => console.log(rx)}
/>

<DispensingPage 
  userRole="PHARMACIST"
  prescriptionId="PRES_001"
  onDispensingComplete={() => alert('Done!')}
/>
```

### Using Hooks

```tsx
import { usePrescriptionQueue, useDispense, useAllStock } from '@/modules/pharmacy';

function MyComponent() {
  // Fetch prescriptions
  const { data, isLoading } = usePrescriptionQueue({
    status: 'PENDING',
    page: 1,
    pageSize: 10
  });

  // Dispense medication
  const { mutate: dispense } = useDispense();
  dispense({
    prescriptionItemId: 'PRES_ITEM_001',
    drugId: 'DRUG_001',
    batchId: 'BATCH_001',
    quantityDispensed: 10
  });

  // View stock
  const { data: stock } = useAllStock({ category: 'ANTIBIOTICS' });

  return (
    // Your UI here
  );
}
```

### RBAC Examples

```tsx
import { 
  RoleGuard, 
  DispensingGuard, 
  canDispenseMedication,
  hasPermission 
} from '@/modules/pharmacy';

// Conditional rendering
<RoleGuard userRole={userRole} allowedRoles={['PHARMACIST', 'ADMIN']}>
  <DispenseButton />
</RoleGuard>

// Permission checks
{canDispenseMedication(userRole) && <DispenseSection />}

// Specific permission
{hasPermission(userRole, 'view_audit_logs') && <AuditPanel />}
```

## API Integration

The module expects a backend API with the following endpoints:

### Prescriptions
- `GET /pharmacy/prescriptions/queue` - Prescription queue
- `GET /pharmacy/prescriptions/:id` - Single prescription
- `PUT /pharmacy/prescriptions/:id/cancel` - Cancel prescription

### Drugs & Stock
- `GET /pharmacy/drugs` - Drug catalog
- `GET /pharmacy/stock` - Inventory
- `GET /pharmacy/stock/:drugId` - Drug stock details
- `GET /pharmacy/stock/:drugId/batches` - Stock batches

### Dispensing
- `POST /pharmacy/dispensing/validate` - Validate dispensing
- `POST /pharmacy/dispensing` - Execute dispensing
- `GET /pharmacy/dispensing/history` - Dispensing history

### Business Rules
- `GET /pharmacy/doctor-limits/:doctorId` - Doctor limits
- `POST /pharmacy/doctor-limits/:doctorId/check-violation` - Check violations

### Audit
- `GET /pharmacy/audit-logs` - Audit logs
- `GET /pharmacy/audit-logs/:resourceType/:resourceId` - Resource audit trail

## Type Definitions

Core types are exported from the module:

```tsx
import type { 
  Prescription, 
  DispensingRecord, 
  DrugStock,
  AuditLog,
  UserRole,
  PrescriptionStatus 
} from '@/modules/pharmacy';
```

See [types/index.ts](./types/index.ts) for complete type definitions.

## Styling

The module uses **Tailwind CSS** for styling. Customize by modifying the component classes:

```tsx
// Theme customization in tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      danger: '#ef4444',
    }
  }
}
```

## Mock Data

For development without a backend:

```tsx
import { getMockData, simulateApiLatency } from '@/modules/pharmacy';

const mockData = getMockData();
// Use mockData.prescriptions, mockData.stock, etc.

// Simulate API latency
await simulateApiLatency(500);
```

## Business Rules Enforcement

### Doctor Daily Drug Limits

Doctors are restricted by daily/weekly/monthly limits per drug category:

```tsx
// Doctor has daily limit of 100 units of Antibiotics
// UI will show warning if exceeded
// Backend validates and prevents overdispensing
```

### Stock Validation

Before dispensing:
- ✅ Batch not expired
- ✅ Sufficient quantity available
- ✅ Doctor limits not exceeded
- ✅ Prescription not expired

### Audit Trail

Every action is logged:
- 📋 Prescription view
- 💊 Medication dispense
- 📦 Stock adjustment
- ✂️ Prescription cancellation

## Performance Optimization

### Caching Strategy

- **Prescription Queue**: 5 minutes
- **Stock Data**: 3 minutes (real-time)
- **Drug Catalog**: 30 minutes
- **Doctor Limits**: 60 minutes

### Pagination

Default page sizes:
- Prescriptions: 10 items
- Stock: 25 items
- History: 20 items
- Audit: 50 items

## Accessibility

- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast standards met
- ✅ Form labels and error messages
- ✅ ARIA attributes

## Security Considerations

1. **JWT Authentication**: Token stored securely
2. **API Validation**: All inputs validated both client and server
3. **RBAC**: Role-based access control enforced
4. **Audit Logs**: Complete operation trail
5. **Sensitive Data**: IDs and sensitive info protected
6. **CSRF Protection**: Implemented in API layer

## Error Handling

The module provides comprehensive error handling:

```tsx
try {
  await dispense({ ... });
} catch (error) {
  // Error message from backend
  // Displayed to user in Alert component
  // Logged to audit trail
}
```

## Development

### Mock API Responses

```tsx
// Enable mock mode (no API calls)
process.env.REACT_APP_ENABLE_MOCK_DATA = 'true';

// Access mock data
import { mockPrescriptions, mockDrugs } from '@/modules/pharmacy';
```

### Testing

```tsx
import { mockPrescriptions } from '@/modules/pharmacy';

test('renders prescription queue', () => {
  render(<PrescriptionQueuePage userRole="PHARMACIST" />);
  expect(screen.getByText(/prescription queue/i)).toBeInTheDocument();
});
```

## Internationalization (i18n)

The module is i18n-ready. To implement:

1. Replace hardcoded strings with i18n keys
2. Create translation files for each language
3. Use `useTranslation()` hook

## Known Limitations

- PDF export requires backend implementation
- Real-time updates via WebSocket not implemented
- Multi-facility support planned for future release
- Automated reordering not implemented

## Future Enhancements

- [ ] PDF report generation
- [ ] Real-time inventory synchronization
- [ ] Prescription refill automation
- [ ] Drug interaction checking
- [ ] Advance inventory forecasting
- [ ] Mobile app support
- [ ] Offline mode
- [ ] Advanced filtering UI
- [ ] Dashboard with KPIs
- [ ] Integration with insurance systems

## Troubleshooting

### Issue: API calls fail with 401 Unauthorized
**Solution**: Check JWT token in localStorage. Ensure `auth_token` key exists.

### Issue: Mock data not loading
**Solution**: Check environment variable `REACT_APP_ENABLE_MOCK_DATA=true`

### Issue: Styles not applying
**Solution**: Ensure Tailwind CSS is properly configured in `tailwind.config.js`

### Issue: React Query cache not updating
**Solution**: Use `queryClient.invalidateQueries({ queryKey: [...] })`

## Contributing

Follow these guidelines:
- Use TypeScript strict mode
- Follow the existing folder structure
- Add unit tests for new components
- Update documentation
- Keep components reusable and composable

## License

Proprietary - Hospital Management System

## Support

For issues and feature requests, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Compatibility**: React 18+, TypeScript 5+, Tailwind CSS 3+
