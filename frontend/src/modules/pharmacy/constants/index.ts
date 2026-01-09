/**
 * Pharmacy Module Constants
 * Shared constants and configuration values
 */

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  PRESCRIPTIONS: '/pharmacy/prescriptions',
  DRUGS: '/pharmacy/drugs',
  STOCK: '/pharmacy/stock',
  DISPENSING: '/pharmacy/dispensing',
  AUDIT_LOGS: '/pharmacy/audit-logs',
  DOCTOR_LIMITS: '/pharmacy/doctor-limits',
} as const;

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE_SIZE: 10,
  STOCK_PAGE_SIZE: 25,
  HISTORY_PAGE_SIZE: 20,
  AUDIT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// ============================================================================
// CACHE DURATIONS (in milliseconds)
// ============================================================================

export const CACHE_DURATIONS = {
  PRESCRIPTION_QUEUE: 1000 * 60 * 5, // 5 minutes
  STOCK_DATA: 1000 * 60 * 3, // 3 minutes (real-time updates)
  DRUG_CATALOG: 1000 * 60 * 30, // 30 minutes
  AUDIT_LOGS: 1000 * 60 * 10, // 10 minutes
  DOCTOR_LIMITS: 1000 * 60 * 60, // 60 minutes
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10000,
  MIN_BATCH_DAYS: 0,
  EXPIRY_WARNING_DAYS: 30,
  STOCK_REORDER_THRESHOLD: 0.2, // 20% of max level
} as const;

// ============================================================================
// MESSAGES
// ============================================================================

export const MESSAGES = {
  // Success messages
  SUCCESS_DISPENSE: 'Medication successfully dispensed',
  SUCCESS_CANCEL_PRESCRIPTION: 'Prescription cancelled successfully',
  SUCCESS_STOCK_UPDATED: 'Stock updated successfully',

  // Error messages
  ERROR_INSUFFICIENT_STOCK: 'Insufficient stock available',
  ERROR_BATCH_EXPIRED: 'Selected batch has expired',
  ERROR_BATCH_NOT_FOUND: 'Batch not found',
  ERROR_PRESCRIPTION_NOT_FOUND: 'Prescription not found',
  ERROR_PRESCRIPTION_EXPIRED: 'Prescription has expired',
  ERROR_DOCTOR_LIMIT_EXCEEDED: 'Doctor has exceeded daily limit for this category',
  ERROR_INVALID_QUANTITY: 'Invalid quantity specified',
  ERROR_PERMISSION_DENIED: 'You do not have permission to perform this action',
  ERROR_API_FAILED: 'API request failed. Please try again.',

  // Warning messages
  WARNING_BATCH_EXPIRING_SOON: 'Batch will expire soon. Consider using other batches.',
  WARNING_STOCK_LOW: 'Stock level is low. Consider reordering.',
  WARNING_PARTIAL_DISPENSING: 'Partial dispensing will be recorded separately.',

  // Info messages
  INFO_DISPENSING_LOCKED: 'Dispensing is locked due to business rule violations.',
} as const;

// ============================================================================
// UI LABELS & PLACEHOLDERS
// ============================================================================

export const LABELS = {
  PRESCRIPTION_NUMBER: 'Prescription Number',
  PATIENT_NAME: 'Patient Name',
  DOCTOR_NAME: 'Doctor Name',
  DRUG_NAME: 'Drug Name',
  QUANTITY: 'Quantity',
  UNIT: 'Unit',
  BATCH_NUMBER: 'Batch Number',
  EXPIRY_DATE: 'Expiry Date',
  STATUS: 'Status',
  ACTIONS: 'Actions',
  DISPENSE: 'Dispense',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  CLOSE: 'Close',
  SEARCH: 'Search',
  FILTER: 'Filter',
  RESET: 'Reset',
} as const;

// ============================================================================
// BUSINESS RULES
// ============================================================================

export const BUSINESS_RULES = {
  // Prescription rules
  PRESCRIPTION_VALIDITY_DAYS: 90,
  ALLOW_PARTIAL_DISPENSING: true,
  ALLOW_FUTURE_DISPENSING: false,

  // Stock rules
  MIN_REORDER_QUANTITY: 50,
  EXPIRY_CHECK_ON_DISPENSING: true,
  PREFER_FIFO_BATCH: true, // First In, First Out

  // Doctor limits (can be overridden by rules in backend)
  DEFAULT_DAILY_LIMIT: 100,
  DEFAULT_WEEKLY_LIMIT: 500,
  DEFAULT_MONTHLY_LIMIT: 2000,

  // Audit rules
  AUDIT_ALL_DISPENSES: true,
  AUDIT_STOCK_CHANGES: true,
  AUDIT_PRESCRIPTION_VIEWS: false,
  AUDIT_RETENTION_DAYS: 365,
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  ENABLE_BATCH_MANAGEMENT: true,
  ENABLE_STOCK_FORECASTING: false,
  ENABLE_AUTOMATED_REORDER: false,
  ENABLE_MULTI_PHARMACY: false,
  ENABLE_DOCTOR_LIMITS: true,
  ENABLE_AUDIT_TRAIL: true,
  ENABLE_EXPORT_REPORTS: true,
  ENABLE_PDF_GENERATION: false,
} as const;

// ============================================================================
// SORTING OPTIONS
// ============================================================================

export const SORT_OPTIONS = {
  prescriptions: [
    { key: 'issuedAt', label: 'Issued Date' },
    { key: 'expiresAt', label: 'Expiry Date' },
    { key: 'patientName', label: 'Patient Name' },
  ],
  stock: [
    { key: 'name', label: 'Drug Name' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ],
  dispensingHistory: [
    { key: 'dispensedAt', label: 'Date Dispensed' },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'drugName', label: 'Drug Name' },
  ],
  auditLogs: [
    { key: 'createdAt', label: 'Date' },
    { key: 'action', label: 'Action' },
  ],
} as const;

// ============================================================================
// ENUM LABELS
// ============================================================================

export const ENUM_LABELS = {
  PrescriptionStatus: {
    PENDING: 'Pending',
    PARTIAL: 'Partially Dispensed',
    DISPENSED: 'Fully Dispensed',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
  },
  DispensingStatus: {
    SUCCESS: 'Successful',
    PARTIAL: 'Partially Dispensed',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
  },
  StockStatus: {
    IN_STOCK: 'In Stock',
    LOW_STOCK: 'Low Stock',
    OUT_OF_STOCK: 'Out of Stock',
    EXPIRED: 'Expired',
  },
  DrugCategory: {
    ANTIBIOTICS: 'Antibiotics',
    ANALGESICS: 'Analgesics',
    ANTIHISTAMINES: 'Antihistamines',
    CARDIOVASCULAR: 'Cardiovascular',
    GASTROINTESTINAL: 'Gastrointestinal',
    RESPIRATORY: 'Respiratory',
    ENDOCRINE: 'Endocrine',
    DERMATOLOGICAL: 'Dermatological',
    OPHTHALMIC: 'Ophthalmic',
    OTHER: 'Other',
  },
  AuditAction: {
    DISPENSE: 'Dispensing',
    STOCK_ADJUST: 'Stock Adjustment',
    STOCK_IN: 'Stock In',
    STOCK_OUT: 'Stock Out',
    BATCH_RECEIVE: 'Batch Received',
    BATCH_EXPIRE: 'Batch Expired',
    PRESCRIPTION_CANCEL: 'Prescription Cancelled',
    PRESCRIPTION_VIEW: 'Prescription Viewed',
  },
  UserRole: {
    PHARMACIST: 'Pharmacist',
    DOCTOR: 'Doctor',
    INVENTORY_MANAGER: 'Inventory Manager',
    ADMIN: 'Administrator',
  },
} as const;

// ============================================================================
// TIME ZONES & FORMATTING
// ============================================================================

export const FORMATTING = {
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  TIMEZONE: 'Africa/Nairobi',
  LOCALE: 'en-KE',
  CURRENCY: 'KES',
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const A11Y = {
  SKIP_LINK_ID: 'skip-to-main',
  MAIN_CONTENT_ID: 'main-content',
  DIALOG_ROLE: 'dialog',
  ALERT_ROLE: 'alert',
  BUTTON_ARIA_LABEL_PREFIX: 'Action:',
} as const;
