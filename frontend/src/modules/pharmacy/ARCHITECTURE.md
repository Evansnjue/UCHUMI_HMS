# Pharmacy Module - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOSPITAL MANAGEMENT SYSTEM                  │
│                         (React Frontend)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PHARMACY MODULE                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PAGES LAYER                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Prescription │  │ Dispensing   │  │ Stock        │  │   │
│  │  │ Queue Page   │  │ Page         │  │ Visibility   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↑                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  COMPONENTS LAYER                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Common       │  │ Tables       │  │ Forms        │  │   │
│  │  │ Components   │  │ Components   │  │ Components   │  │   │
│  │  │ (Button,     │  │ (Table,      │  │ (Input,      │  │   │
│  │  │  Dialog,     │  │  Pagination) │  │  Select)     │  │   │
│  │  │  Alert)      │  │              │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↑                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   HOOKS LAYER (STATE)                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ React Query Hooks (usePrescriptionQueue, etc.)   │   │   │
│  │  │ - Data fetching & caching                        │   │   │
│  │  │ - Automatic invalidation                         │   │   │
│  │  │ - Loading/error states                           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↑                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  SERVICES LAYER (API)                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │   │
│  │  │ Prescription│  │ Stock API  │  │ Dispensing API │   │   │
│  │  │ API        │  │            │  │                │   │   │
│  │  └────────────┘  └────────────┘  └────────────────┘   │   │
│  │  ┌────────────┐  ┌────────────┐                        │   │
│  │  │ Audit API  │  │ Business   │                        │   │
│  │  │            │  │ Rules API  │                        │   │
│  │  └────────────┘  └────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               AUTHORIZATION LAYER (RBAC)               │   │
│  │  ┌──────────────┐  ┌──────────────────────────────┐    │   │
│  │  │ Role Guards  │  │ Permission Checks            │    │   │
│  │  │ (Pharmacist, │  │ - hasPermission()            │    │   │
│  │  │  Doctor,     │  │ - canDispenseMedication()    │    │   │
│  │  │  Inventory   │  │ - Data visibility scope      │    │   │
│  │  │  Manager)    │  │                              │    │   │
│  │  └──────────────┘  └──────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              UTILITIES & CONSTANTS LAYER                │   │
│  │  ┌──────────────┐  ┌──────────────────────────────┐    │   │
│  │  │ Formatters   │  │ Constants                    │    │   │
│  │  │ - Date/Time  │  │ - API endpoints              │    │   │
│  │  │ - Currency   │  │ - Validation rules           │    │   │
│  │  │ - Status     │  │ - Business rules             │    │   │
│  │  │ - Validation │  │ - Enum labels                │    │   │
│  │  └──────────────┘  └──────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                          │
│  ┌──────────────────────┐              ┌────────────────────┐   │
│  │   REST API SERVER    │              │  LOCAL STORAGE     │   │
│  │ (Backend Hospital    │              │  (JWT Token)       │   │
│  │  Management System)  │              │                    │   │
│  └──────────────────────┘              └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Prescription Queue Flow

```
User Opens Prescriptions Page
         ↓
PrescriptionQueuePage Component Mounts
         ↓
usePrescriptionQueue Hook Called
         ↓
React Query Checks Cache
    ├─ CACHED? Return from cache
    └─ NOT CACHED? Fetch from API
         ↓
prescriptionApi.getPrescriptionQueue(filters)
         ↓
HTTP GET /pharmacy/prescriptions/queue?filters
         ↓
Backend Validates Auth Token + RBAC
         ↓
Backend Returns Prescription Data
         ↓
React Query Caches Results
         ↓
usePrescriptionQueue Hook Returns Data
         ↓
PrescriptionQueuePage Renders Table
         ↓
User Sees Prescriptions with Filters & Sorting
```

### Dispensing Flow

```
User Selects Prescription → Navigates to Dispensing Page
         ↓
DispensingPage Component Loads
         ↓
usePrescriptionDetail Hook Fetches Rx Data
useDrugStock Hook Fetches Stock Data
useDoctorLimits Hook Fetches Doctor Limits
         ↓
User Selects Prescription Item & Batch
         ↓
User Enters Quantity & Notes
         ↓
User Clicks "Validate & Review"
         ↓
validateDispensingRequest() Mutation Triggers
         ↓
API POST /pharmacy/dispensing/validate
         ↓
Backend Validates:
  ├─ Stock Available? ✓/✗
  ├─ Batch Not Expired? ✓/✗
  ├─ Doctor Limits? ✓/✗
  ├─ Prescription Valid? ✓/✗
         ↓
API Returns ValidationResult with Errors/Warnings
         ↓
DispensingPage Shows Validation Results
         ↓
IF VALID → Show Confirmation Dialog
         ↓
User Reviews & Clicks "Confirm Dispensing"
         ↓
dispense() Mutation Triggers
         ↓
API POST /pharmacy/dispensing
         ↓
Backend Creates:
  ├─ DispensingRecord
  ├─ AuditLog Entry
  └─ Updates Stock
         ↓
React Query Invalidates:
  ├─ Prescriptions Cache
  ├─ Stock Cache
  └─ Dispensing History Cache
         ↓
Page Redirects to Queue
         ↓
Success Message Shown
```

### Stock Lookup Flow

```
User Opens Stock Page
         ↓
StockVisibilityPage Component Mounts
         ↓
useAllStock Hook Called with Filters
         ↓
API GET /pharmacy/stock?filters
         ↓
Backend Returns DrugStock Array with Batch Details
         ↓
React Query Caches (3-minute stale time)
         ↓
DataTable Renders Stock with Columns:
  ├─ Drug Name (clickable)
  ├─ Strength & Category
  ├─ Available / Total Quantity
  ├─ Status Badge
         ↓
User Clicks Drug → StockDetailDialog Opens
         ↓
Dialog Shows:
  ├─ Drug Information
  ├─ Stock Summary (total, available, reserved)
  ├─ Batch Details (quantity, expiry, cost)
  ├─ Reorder Information
         ↓
User Can View Batch Expiry Warnings
```

## RBAC Authorization Flow

```
User Logs In
     ↓
Frontend Gets JWT Token + User Role
     ↓
Auth Context Stores { token, role }
     ↓
User Navigates to Feature
     ↓
Component Checks: hasPermission(role, 'feature')
     ├─ Permission Found → Render Component
     └─ No Permission → Show Access Denied / Empty State
     ↓
API Call Made with Authorization Header
     ↓
Backend Gets: Authorization: Bearer {token}
     ↓
Backend Decodes Token → Extracts Role
     ↓
Backend Validates Role Against Action
     ├─ Allowed → Execute Operation
     └─ Denied → Return 403 Forbidden
     ↓
AuditLog Entry Created with User Role & Action
```

## Component Hierarchy

```
<App>
  <QueryClientProvider>
    <AuthContext>
      <PharmacyRoutes userRole={role}>
        
        <Route path="prescriptions">
          <PrescriptionQueuePage>
            <StatCard />
            <SearchBar />
            <FilterButtons />
            <DataTable>
              <PrescriptionItemCard />
            </DataTable>
            <Pagination />
            <PrescriptionDetailModal />
            <ConfirmDialog />
          </PrescriptionQueuePage>
        </Route>

        <Route path="dispense">
          <DispensingPage>
            <PrescriptionSearchForm />
            <PrescriptionItemCard />
            <DispensingForm>
              <FormGroup>
                <Select /> (Batch)
                <Input /> (Quantity)
              </FormGroup>
              <Alert /> (Validation Errors)
            </DispensingForm>
            <ConfirmDialog />
          </DispensingPage>
        </Route>

        <Route path="stock">
          <StockVisibilityPage>
            <SummaryCard />
            <SearchBar />
            <FilterButtons />
            <DataTable>
              <StockRow />
            </DataTable>
            <Pagination />
            <StockDetailDialog>
              <BatchList />
            </StockDetailDialog>
          </StockVisibilityPage>
        </Route>

      </PharmacyRoutes>
    </AuthContext>
  </QueryClientProvider>
</App>
```

## State Management (React Query)

```
Query Cache
├── pharmacy
│   ├── prescriptions
│   │   ├── queue [filters]
│   │   └── detail [prescriptionId]
│   ├── stock
│   │   ├── all [filters]
│   │   ├── detail [drugId]
│   │   └── batches [drugId]
│   ├── dispensing
│   │   ├── history [filters]
│   │   └── record [recordId]
│   ├── audit
│   │   ├── logs [filters]
│   │   └── trail [resourceType, resourceId]
│   └── rules
│       └── doctor-limits [doctorId]
```

## Error Handling Strategy

```
Error at API Layer
     ↓
try-catch Block in Service
     ↓
Throw Custom Error with Message
     ↓
React Query Catches Error
     ↓
Hook Returns { error, isError }
     ↓
Component Checks isError
     ├─ TRUE → Display Alert Component
     └─ FALSE → Show Normal Content
     ↓
User Sees Error Message + Retry Option
```

## Caching & Invalidation Strategy

```
User Dispenses Medication
          ↓
useDispense() Mutation Executes
          ↓
POST /pharmacy/dispensing → Success
          ↓
Mutation onSuccess Callback Fires
          ↓
queryClient.invalidateQueries({ queryKey: [...] })
          ↓
Invalidate:
  ├─ prescriptions (queue)
  ├─ stock (all, detail)
  ├─ dispensing (history)
  └─ audit (logs)
          ↓
All Affected Queries Marked as Stale
          ↓
React Refetches Queries
          ↓
UI Updates with Fresh Data
```

## Type Safety Flow

```
Backend API Response
     ↓
Validate Against TypeScript Type
     ↓
Zod Schema Validation (if form input)
     ↓
Component Receives Typed Props
     ↓
TypeScript Compiler Checks
     ↓
✓ Type Safe or ✗ Compilation Error
```

---

**Architecture Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready
