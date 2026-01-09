/**
 * Pharmacy API Service Layer
 * Abstracted REST API calls for prescription, dispensing, stock, and audit operations
 */

import type {
  Prescription,
  PrescriptionFilters,
  PrescriptionQueueResponse,
  DrugStock,
  StockFilters,
  Drug,
  DispensingRecord,
  CreateDispensingDTO,
  DispensingHistoryFilters,
  AuditLog,
  AuditLogFilters,
  DispensingValidationResult,
  DoctorDrugLimitRule,
  StockBatch,
  PaginatedResponse,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const PHARMACY_BASE = `${API_BASE_URL}/pharmacy`;

// ============================================================================
// PRESCRIPTION API
// ============================================================================

export const prescriptionApi = {
  /**
   * Get prescription queue with filtering and pagination
   */
  getPrescriptionQueue: async (
    filters: PrescriptionFilters = {}
  ): Promise<PrescriptionQueueResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${PHARMACY_BASE}/prescriptions/queue?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch prescription queue: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get single prescription details
   */
  getPrescriptionById: async (prescriptionId: string): Promise<Prescription> => {
    const response = await fetch(`${PHARMACY_BASE}/prescriptions/${prescriptionId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch prescription: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get prescription by number (alternative lookup)
   */
  getPrescriptionByNumber: async (prescriptionNumber: string): Promise<Prescription> => {
    const response = await fetch(`${PHARMACY_BASE}/prescriptions/number/${prescriptionNumber}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch prescription: ${response.statusText}`);
    return response.json();
  },

  /**
   * Cancel a prescription (only if not fully dispensed)
   */
  cancelPrescription: async (prescriptionId: string, reason: string): Promise<Prescription> => {
    const response = await fetch(`${PHARMACY_BASE}/prescriptions/${prescriptionId}/cancel`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) throw new Error(`Failed to cancel prescription: ${response.statusText}`);
    return response.json();
  },
};

// ============================================================================
// DRUG & STOCK API
// ============================================================================

export const stockApi = {
  /**
   * Get drug inventory with filtering
   */
  getDrugs: async (filters: StockFilters = {}): Promise<PaginatedResponse<Drug>> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${PHARMACY_BASE}/drugs?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch drugs: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get single drug details
   */
  getDrugById: async (drugId: string): Promise<Drug> => {
    const response = await fetch(`${PHARMACY_BASE}/drugs/${drugId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch drug: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get drug stock with batch details
   */
  getDrugStock: async (drugId: string): Promise<DrugStock> => {
    const response = await fetch(`${PHARMACY_BASE}/stock/${drugId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch drug stock: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get all stock with filtering
   */
  getAllStock: async (filters: StockFilters = {}): Promise<PaginatedResponse<DrugStock>> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${PHARMACY_BASE}/stock?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch stock: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get batch details for a drug
   */
  getStockBatches: async (drugId: string): Promise<StockBatch[]> => {
    const response = await fetch(`${PHARMACY_BASE}/stock/${drugId}/batches`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch batches: ${response.statusText}`);
    return response.json();
  },
};

// ============================================================================
// DISPENSING API
// ============================================================================

export const dispensingApi = {
  /**
   * Validate dispensing before executing
   * Checks stock availability, batch expiry, and doctor limit rules
   */
  validateDispensingRequest: async (
    dto: CreateDispensingDTO
  ): Promise<DispensingValidationResult> => {
    const response = await fetch(`${PHARMACY_BASE}/dispensing/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    
    if (!response.ok) throw new Error(`Failed to validate dispensing: ${response.statusText}`);
    return response.json();
  },

  /**
   * Execute dispensing transaction
   * Only call after validation passes
   */
  dispense: async (dto: CreateDispensingDTO): Promise<DispensingRecord> => {
    const response = await fetch(`${PHARMACY_BASE}/dispensing`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    
    if (!response.ok) throw new Error(`Failed to dispense: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get dispensing history with filtering and pagination
   */
  getDispensingHistory: async (
    filters: DispensingHistoryFilters = {}
  ): Promise<PaginatedResponse<DispensingRecord>> => {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.prescriptionNumber) params.append('prescriptionNumber', filters.prescriptionNumber);
    if (filters.drugName) params.append('drugName', filters.drugName);
    if (filters.patientName) params.append('patientName', filters.patientName);
    if (filters.dispensedBy) params.append('dispensedBy', filters.dispensedBy);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${PHARMACY_BASE}/dispensing/history?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch dispensing history: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get single dispensing record
   */
  getDispensingRecord: async (recordId: string): Promise<DispensingRecord> => {
    const response = await fetch(`${PHARMACY_BASE}/dispensing/${recordId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch dispensing record: ${response.statusText}`);
    return response.json();
  },

  /**
   * Partial dispense (when full quantity not available)
   * Creates partial dispensing record and maintains prescription item balance
   */
  dispensePartial: async (dto: CreateDispensingDTO): Promise<DispensingRecord> => {
    const response = await fetch(`${PHARMACY_BASE}/dispensing/partial`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    
    if (!response.ok) throw new Error(`Failed to dispense partially: ${response.statusText}`);
    return response.json();
  },
};

// ============================================================================
// AUDIT TRAIL API
// ============================================================================

export const auditApi = {
  /**
   * Get audit logs with filtering and pagination
   */
  getAuditLogs: async (
    filters: AuditLogFilters = {}
  ): Promise<PaginatedResponse<AuditLog>> => {
    const params = new URLSearchParams();
    
    if (filters.action) params.append('action', filters.action);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.resourceType) params.append('resourceType', filters.resourceType);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${PHARMACY_BASE}/audit-logs?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
    return response.json();
  },

  /**
   * Get audit trail for specific resource
   */
  getResourceAuditTrail: async (
    resourceType: string,
    resourceId: string
  ): Promise<AuditLog[]> => {
    const response = await fetch(
      `${PHARMACY_BASE}/audit-logs/${resourceType}/${resourceId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    
    if (!response.ok) throw new Error(`Failed to fetch audit trail: ${response.statusText}`);
    return response.json();
  },
};

// ============================================================================
// BUSINESS RULES API
// ============================================================================

export const businessRulesApi = {
  /**
   * Get doctor's daily drug category limits
   */
  getDoctorLimits: async (doctorId: string): Promise<DoctorDrugLimitRule[]> => {
    const response = await fetch(`${PHARMACY_BASE}/doctor-limits/${doctorId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch doctor limits: ${response.statusText}`);
    return response.json();
  },

  /**
   * Check if prescription violates doctor limits
   */
  checkDoctorLimitViolation: async (
    doctorId: string,
    prescriptionItemId: string,
    drugCategory: string
  ): Promise<boolean> => {
    const response = await fetch(
      `${PHARMACY_BASE}/doctor-limits/${doctorId}/check-violation`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prescriptionItemId, drugCategory }),
      }
    );
    
    if (!response.ok) throw new Error(`Failed to check limit violation: ${response.statusText}`);
    const result = await response.json();
    return result.violated;
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get JWT token from localStorage
 * Assumes token is stored under 'auth_token' key
 */
function getToken(): string {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No authentication token found');
  return token;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`API Error: ${error.message}`);
  }
  throw new Error('An unexpected error occurred');
}
