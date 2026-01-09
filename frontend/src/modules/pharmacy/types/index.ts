/**
 * Pharmacy Module Type Definitions
 * All DTOs for prescriptions, drugs, stock, and dispensing operations
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  DISPENSED = 'DISPENSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum DispensingStatus {
  SUCCESS = 'SUCCESS',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DrugCategory {
  ANTIBIOTICS = 'ANTIBIOTICS',
  ANALGESICS = 'ANALGESICS',
  ANTIHISTAMINES = 'ANTIHISTAMINES',
  CARDIOVASCULAR = 'CARDIOVASCULAR',
  GASTROINTESTINAL = 'GASTROINTESTINAL',
  RESPIRATORY = 'RESPIRATORY',
  ENDOCRINE = 'ENDOCRINE',
  DERMATOLOGICAL = 'DERMATOLOGICAL',
  OPHTHALMIC = 'OPHTHALMIC',
  OTHER = 'OTHER',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED',
}

export enum AuditAction {
  DISPENSE = 'DISPENSE',
  STOCK_ADJUST = 'STOCK_ADJUST',
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  BATCH_RECEIVE = 'BATCH_RECEIVE',
  BATCH_EXPIRE = 'BATCH_EXPIRE',
  PRESCRIPTION_CANCEL = 'PRESCRIPTION_CANCEL',
  PRESCRIPTION_VIEW = 'PRESCRIPTION_VIEW',
}

export enum UserRole {
  PHARMACIST = 'PHARMACIST',
  DOCTOR = 'DOCTOR',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  ADMIN = 'ADMIN',
}

// ============================================================================
// PRESCRIPTION TYPES
// ============================================================================

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  doctorId: string;
  doctorName: string;
  items: PrescriptionItem[];
  status: PrescriptionStatus;
  issuedAt: string;
  expiresAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  drugId: string;
  drugName: string;
  category: DrugCategory;
  quantity: number;
  unit: string;
  frequency: string; // e.g., "twice daily"
  duration: string; // e.g., "7 days"
  instructions?: string;
  dispensedQuantity: number;
  status: PrescriptionStatus;
}

export interface CreatePrescriptionDTO {
  patientId: string;
  doctorId: string;
  items: CreatePrescriptionItemDTO[];
  notes?: string;
}

export interface CreatePrescriptionItemDTO {
  drugId: string;
  quantity: number;
  unit: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// ============================================================================
// DRUG & STOCK TYPES
// ============================================================================

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: DrugCategory;
  description?: string;
  dosageForm: string; // e.g., "tablet", "capsule", "liquid"
  strength: string; // e.g., "500mg"
  manufacturer?: string;
  reorderLevel: number; // Minimum quantity before reorder
  maxStockLevel: number; // Maximum quantity to hold
  unitPrice: number;
  status: 'ACTIVE' | 'DISCONTINUED' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface DrugStock {
  id: string;
  drugId: string;
  drug: Drug;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  expiredQuantity: number;
  batches: StockBatch[];
  status: StockStatus;
  lastUpdated: string;
}

export interface StockBatch {
  id: string;
  batchNumber: string;
  drugId: string;
  quantity: number;
  availableQuantity: number;
  expiryDate: string;
  manufacturingDate: string;
  unitCost: number;
  supplier?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DAMAGED' | 'DISCARDED';
  receivedAt: string;
  notes?: string;
}

// ============================================================================
// DISPENSING TYPES
// ============================================================================

export interface DispensingRecord {
  id: string;
  dispensingNumber: string;
  prescriptionItemId: string;
  prescriptionId: string;
  prescriptionNumber: string;
  drugId: string;
  drugName: string;
  batchId: string;
  batchNumber: string;
  quantityDispensed: number;
  unit: string;
  dispensedAt: string;
  dispensedBy: {
    userId: string;
    userName: string;
    role: UserRole;
  };
  patientId: string;
  patientName: string;
  doctorName: string;
  status: DispensingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDispensingDTO {
  prescriptionItemId: string;
  drugId: string;
  batchId: string;
  quantityDispensed: number;
  unit: string;
  notes?: string;
}

// ============================================================================
// AUDIT TRAIL TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  userName: string;
  userRole: UserRole;
  resourceType: 'PRESCRIPTION' | 'DRUG' | 'STOCK' | 'BATCH' | 'DISPENSING';
  resourceId: string;
  resourceName: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ============================================================================
// BUSINESS RULE TYPES
// ============================================================================

export interface DoctorDrugLimitRule {
  id: string;
  doctorId: string;
  category: DrugCategory;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DoctorLimitViolation {
  doctorId: string;
  doctorName: string;
  category: DrugCategory;
  currentUsage: number;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  violated: boolean;
  violationType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
}

// ============================================================================
// VALIDATION & ERROR TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface DispensingValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  violations: {
    stockShortage: boolean;
    batchExpired: boolean;
    limitViolation: DoctorLimitViolation | null;
  };
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PrescriptionQueueResponse {
  pendingCount: number;
  partialCount: number;
  total: number;
  prescriptions: Prescription[];
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface PrescriptionFilters {
  status?: PrescriptionStatus;
  doctorId?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'issuedAt' | 'expiresAt' | 'patientName';
  sortOrder?: 'asc' | 'desc';
}

export interface StockFilters {
  category?: DrugCategory;
  status?: StockStatus;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'quantity' | 'lastUpdated';
  sortOrder?: 'asc' | 'desc';
}

export interface DispensingHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  prescriptionNumber?: string;
  drugName?: string;
  patientName?: string;
  dispensedBy?: string;
  status?: DispensingStatus;
  page?: number;
  pageSize?: number;
  sortBy?: 'dispensedAt' | 'patientName' | 'drugName';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogFilters {
  action?: AuditAction;
  userId?: string;
  resourceType?: 'PRESCRIPTION' | 'DRUG' | 'STOCK' | 'BATCH' | 'DISPENSING';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'action';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportOptions {
  format: 'csv' | 'pdf';
  includeColumns: string[];
  filename: string;
}
