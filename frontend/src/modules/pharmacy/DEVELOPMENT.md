/**
 * Pharmacy Module Development Setup Guide
 * Quick start and configuration instructions
 */

// ============================================================================
// QUICK START
// ============================================================================

/**
 * 1. INSTALL DEPENDENCIES
 * 
 * npm install @tanstack/react-query react-hook-form zod @hookform/resolvers
 * 
 * 2. ENVIRONMENT VARIABLES (.env)
 * 
 * REACT_APP_API_URL=http://localhost:3000/api
 * REACT_APP_ENABLE_MOCK_DATA=true  # For development
 * 
 * 3. IMPORT IN YOUR APP
 * 
 * import { PharmacyRoutes } from '@/modules/pharmacy';
 * 
 * // In your router:
 * <Route path="/pharmacy/*" element={<PharmacyRoutes userRole={userRole} />} />
 * 
 * 4. WRAP WITH PROVIDERS
 * 
 * import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
 * 
 * const queryClient = new QueryClient();
 * 
 * <QueryClientProvider client={queryClient}>
 *   <YourApp />
 * </QueryClientProvider>
 */

// ============================================================================
// FOLDER STRUCTURE
// ============================================================================

const FOLDER_STRUCTURE = `
pharmacy/
├── components/
│   ├── common/                      # Shared UI components
│   │   └── CommonComponents.tsx     # Buttons, Dialogs, Forms, etc.
│   ├── dialogs/                     # Modal dialogs (planned)
│   ├── forms/                       # Form components (planned)
│   └── tables/
│       └── TableComponents.tsx      # Table, Pagination, Search
│
├── constants/
│   └── index.ts                     # All constants & config
│
├── guards/
│   ├── rbac.ts                      # RBAC logic & permissions
│   └── RoleGuard.tsx                # Role guard components
│
├── hooks/
│   └── queries.ts                   # React Query hooks
│
├── mocks/
│   └── data.ts                      # Mock data fixtures
│
├── pages/
│   ├── PrescriptionQueuePage.tsx    # Prescription queue
│   ├── DispensingPage.tsx           # Dispensing workflow
│   ├── StockVisibilityPage.tsx      # Stock management
│   └── routes.tsx                   # Route configuration
│
├── services/
│   └── api.ts                       # API abstraction layer
│
├── types/
│   └── index.ts                     # TypeScript definitions
│
├── utils/
│   └── formatters.ts                # Utility functions
│
├── index.ts                         # Module exports
└── README.md                        # Documentation
`;

// ============================================================================
// KEY CONCEPTS
// ============================================================================

const KEY_CONCEPTS = {
  // 1. FEATURE-BASED MODULAR ARCHITECTURE
  modularity: `
    Each feature is isolated in its own folder:
    - Prescription Queue: handles prescription search & filtering
    - Dispensing: handles medication dispensing workflow
    - Stock Visibility: handles inventory management
    - Audit Trail: handles compliance logging
    
    No cross-module imports except from 'shared' core.
    Each module can be deployed independently.
  `,

  // 2. SERVICE LAYER ABSTRACTION
  serviceLayer: `
    All API calls are abstracted in services/:
    - prescriptionApi.ts: prescription operations
    - stockApi.ts: inventory operations
    - dispensingApi.ts: dispensing operations
    
    Benefits:
    - Easy to mock for testing
    - Single point of API configuration
    - Error handling centralized
    - Can swap implementations easily
  `,

  // 3. REACT QUERY FOR STATE MANAGEMENT
  reactQuery: `
    Uses @tanstack/react-query for data fetching:
    - Automatic caching & invalidation
    - Built-in loading/error states
    - Optimistic updates support
    - No Redux needed
    
    Query Keys:
    - [pharmacy, prescriptions, queue, filters]
    - [pharmacy, stock, all, filters]
    - [pharmacy, dispensing, history, filters]
  `,

  // 4. RBAC & PERMISSION GUARDS
  rbac: `
    Role-Based Access Control:
    - 4 roles: PHARMACIST, DOCTOR, INVENTORY_MANAGER, ADMIN
    - Each role has specific permissions
    - UI renders based on role (not hidden)
    - Backend validates everything
    
    Components:
    <RoleGuard userRole={role} allowedRoles={[...]}>
      <FeatureComponent />
    </RoleGuard>
  `,

  // 4. TYPE-SAFE FORMS
  formValidation: `
    Uses react-hook-form + Zod:
    - Typed validation schemas
    - Real-time validation feedback
    - Accessible error messages
    
    const schema = z.object({
      quantity: z.number().min(1),
      batchId: z.string().uuid()
    });
  `,
};

// ============================================================================
// COMMON TASKS
// ============================================================================

const COMMON_TASKS = {
  // Task 1: Add a new page
  addNewPage: `
    1. Create page component in pages/:
       pages/NewPage.tsx
    
    2. Import necessary hooks:
       import { useData } from '../hooks/queries';
    
    3. Add route in pages/routes.tsx:
       <Route path="new" element={<NewPage userRole={userRole} />} />
    
    4. Export from index.ts
  `,

  // Task 2: Add new API endpoint
  addApiEndpoint: `
    1. Add to services/api.ts:
       export const newApi = {
         getData: async (params) => {
           const response = await fetch(...);
           return response.json();
         }
       };
    
    2. Create hook in hooks/queries.ts:
       export const useGetData = (params) => {
         return useQuery({
           queryKey: [...],
           queryFn: () => newApi.getData(params)
         });
       };
    
    3. Use in component:
       const { data } = useGetData(params);
  `,

  // Task 3: Add permission check
  addPermission: `
    1. Update guards/rbac.ts ROLE_PERMISSIONS:
       ROLE_PERMISSIONS[PHARMACIST].push('new_action');
    
    2. Create guard function:
       export const canPerformAction = (role) =>
         hasPermission(role, 'new_action');
    
    3. Use in component:
       {canPerformAction(userRole) && <Component />}
  `,

  // Task 4: Use mock data for development
  useMockData: `
    1. Set environment variable:
       REACT_APP_ENABLE_MOCK_DATA=true
    
    2. In your component:
       import { mockPrescriptions } from '../mocks/data';
       
       // Use mockPrescriptions directly
       const [data] = useState(mockPrescriptions);
    
    3. To simulate API latency:
       import { simulateApiLatency } from '../mocks/data';
       await simulateApiLatency(500);
  `,

  // Task 5: Add new component type
  addComponent: `
    1. Create in components/common/CommonComponents.tsx or appropriate subfolder
    
    2. Make it reusable and composable:
       - Accept props for customization
       - No hardcoded values
       - Use Tailwind classes
    
    3. Export from components/common/index.ts (create if needed)
    
    4. Use in pages:
       import { MyComponent } from '../components/common';
       <MyComponent prop={value} />
  `,

  // Task 6: Add validation
  addValidation: `
    1. Create Zod schema:
       const schema = z.object({
         field1: z.string().min(1),
         field2: z.number().positive()
       });
    
    2. Use with react-hook-form:
       const { register, formState: { errors } } = 
         useForm({ resolver: zodResolver(schema) });
    
    3. Show validation errors:
       {errors.field1 && <p>{errors.field1.message}</p>}
  `,
};

// ============================================================================
// DEBUGGING TIPS
// ============================================================================

const DEBUGGING_TIPS = {
  reactQueryDevtools: `
    Install and enable React Query DevTools:
    npm install @tanstack/react-query-devtools
    
    import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
    
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    
    Open in browser to inspect queries, cache, etc.
  `,

  consoleLogging: `
    // Check mock data in development
    console.log(getMockData());
    
    // Check query cache
    console.log(queryClient.getQueryData(['pharmacy', 'prescriptions']));
    
    // Check RBAC permissions
    import { hasPermission } from '../guards/rbac';
    console.log(hasPermission('PHARMACIST', 'dispense_medication'));
  `,

  networkTabs: `
    1. Open browser DevTools (F12)
    2. Go to Network tab
    3. Filter by API calls
    4. Check request/response headers and body
    5. Verify Content-Type: application/json
    6. Check Authorization: Bearer {token}
  `,

  storageInspection: `
    // Check auth token
    console.log(localStorage.getItem('auth_token'));
    
    // Check React Query cache
    const cache = queryClient.getQueryCache();
    cache.getAll().forEach(query => console.log(query));
  `,
};

// ============================================================================
// TESTING
// ============================================================================

const TESTING = `
// Unit test example with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PrescriptionQueuePage } from './PrescriptionQueuePage';

const queryClient = new QueryClient();

test('renders prescription queue', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <PrescriptionQueuePage userRole="PHARMACIST" />
    </QueryClientProvider>
  );
  
  expect(screen.getByText(/prescription queue/i)).toBeInTheDocument();
});

test('filters by status', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <PrescriptionQueuePage userRole="PHARMACIST" />
    </QueryClientProvider>
  );
  
  const button = screen.getByRole('button', { name: /pending/i });
  button.click();
  
  await waitFor(() => {
    expect(screen.getByText(/pending prescriptions/i)).toBeInTheDocument();
  });
});
`;

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

const PERFORMANCE_TIPS = `
// 1. Use React.memo for expensive components
const PrescriptionCard = React.memo(({ prescription }) => {
  return <div>...</div>;
});

// 2. Memoize callbacks
const handleDispense = useCallback((prescription) => {
  // ...
}, [prescriptionId]);

// 3. Use useMemo for computed values
const filteredData = useMemo(() => {
  return data.filter(item => item.status === filter);
}, [data, filter]);

// 4. Lazy load heavy components
const DispensingPage = lazy(() => import('./DispensingPage'));

// 5. Configure React Query cache appropriately
const query = useQuery({
  queryKey: [...],
  queryFn: ...,
  staleTime: 1000 * 60 * 5,  // 5 minutes
  gcTime: 1000 * 60 * 30,    // 30 minutes
});
`;

// ============================================================================
// ACCESSIBILITY CHECKLIST
// ============================================================================

const ACCESSIBILITY_CHECKLIST = `
✅ Form labels: <label htmlFor="input-id">
✅ ARIA labels: aria-label, aria-labelledby
✅ Error messages: aria-describedby
✅ Loading states: aria-busy="true"
✅ Keyboard navigation: Tab, Enter, Esc
✅ Color contrast: Check with WCAG calculator
✅ Alt text: Describe all images
✅ Dialog focus: Trap focus in modals
✅ Skip links: Navigate to main content
✅ Semantic HTML: <button>, <input>, <select>

Use aXe DevTools Chrome extension to check.
`;

// ============================================================================
// SECURITY CHECKLIST
// ============================================================================

const SECURITY_CHECKLIST = `
✅ Never expose API keys in frontend code
✅ Validate all inputs (client + server)
✅ Use HTTPS in production
✅ Store JWT securely (consider httpOnly cookies)
✅ Sanitize outputs (prevent XSS)
✅ Implement CORS properly
✅ Use CSP headers
✅ Log sensitive operations
✅ Implement rate limiting on API
✅ Use CSRF tokens for state-changing requests
✅ Never log passwords or sensitive data
✅ Regular security audits
`;

// ============================================================================
// EXPORTS & DOCUMENTATION
// ============================================================================

export const developmentGuide = {
  FOLDER_STRUCTURE,
  KEY_CONCEPTS,
  COMMON_TASKS,
  DEBUGGING_TIPS,
  TESTING,
  PERFORMANCE_TIPS,
  ACCESSIBILITY_CHECKLIST,
  SECURITY_CHECKLIST,
};

/**
 * QUICK REFERENCE
 * ===============
 * 
 * Routes:
 * - /pharmacy/prescriptions   → Prescription Queue
 * - /pharmacy/dispense        → Dispensing Workflow
 * - /pharmacy/stock           → Stock Management
 * - /pharmacy/history         → Dispensing History (planned)
 * - /pharmacy/audit           → Audit Trail (planned)
 * 
 * Main Hooks:
 * - usePrescriptionQueue()    → Get prescriptions
 * - useDispense()             → Dispense medication
 * - useAllStock()             → Get inventory
 * - useAuditLogs()            → Get audit logs
 * 
 * Main Components:
 * - <PrescriptionQueuePage />
 * - <DispensingPage />
 * - <StockVisibilityPage />
 * - <Button />, <Dialog />, <Table />, etc.
 * 
 * RBAC:
 * - <RoleGuard /> for role-based rendering
 * - <DispensingGuard /> for dispensing features
 * - hasPermission() for permission checks
 * 
 * Types:
 * - Prescription, PrescriptionItem
 * - Drug, DrugStock, StockBatch
 * - DispensingRecord, AuditLog
 * - UserRole (PHARMACIST, DOCTOR, etc.)
 */
