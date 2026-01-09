/**
 * Mock Data for Pharmacy Module
 * Development fixtures for testing and UI development
 */

import type {
  Prescription,
  PrescriptionItem,
  Drug,
  DrugStock,
  StockBatch,
  DispensingRecord,
  AuditLog,
  DoctorDrugLimitRule,
  PrescriptionStatus,
  DispensingStatus,
  StockStatus,
  DrugCategory,
  AuditAction,
  UserRole,
} from '../types';

// ============================================================================
// MOCK DRUGS
// ============================================================================

export const mockDrugs: Drug[] = [
  {
    id: 'DRUG_001',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    category: 'ANTIBIOTICS',
    description: 'Beta-lactam antibiotic',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'Cipla Limited',
    reorderLevel: 50,
    maxStockLevel: 500,
    unitPrice: 25,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'DRUG_002',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'ANALGESICS',
    description: 'Pain reliever and fever reducer',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'GSK',
    reorderLevel: 100,
    maxStockLevel: 1000,
    unitPrice: 5,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'DRUG_003',
    name: 'Enalapril',
    genericName: 'Enalapril Maleate',
    category: 'CARDIOVASCULAR',
    description: 'ACE inhibitor for hypertension',
    dosageForm: 'Tablet',
    strength: '5mg',
    manufacturer: 'Merck',
    reorderLevel: 30,
    maxStockLevel: 300,
    unitPrice: 45,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'DRUG_004',
    name: 'Loratadine',
    genericName: 'Loratadine',
    category: 'ANTIHISTAMINES',
    description: 'Non-drowsy antihistamine',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'Schering-Plough',
    reorderLevel: 40,
    maxStockLevel: 400,
    unitPrice: 15,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'DRUG_005',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'ENDOCRINE',
    description: 'Type 2 diabetes management',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Diabetes Care',
    reorderLevel: 60,
    maxStockLevel: 600,
    unitPrice: 35,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
];

// ============================================================================
// MOCK STOCK BATCHES
// ============================================================================

export const mockStockBatches: StockBatch[] = [
  {
    id: 'BATCH_001',
    batchNumber: 'AMX-2024-001',
    drugId: 'DRUG_001',
    quantity: 200,
    availableQuantity: 150,
    expiryDate: '2026-12-31T00:00:00Z',
    manufacturingDate: '2023-12-01T00:00:00Z',
    unitCost: 20,
    supplier: 'Cipla Limited',
    status: 'ACTIVE',
    receivedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'BATCH_002',
    batchNumber: 'AMX-2024-002',
    drugId: 'DRUG_001',
    quantity: 150,
    availableQuantity: 120,
    expiryDate: '2025-06-30T00:00:00Z',
    manufacturingDate: '2024-06-01T00:00:00Z',
    unitCost: 20,
    supplier: 'Cipla Limited',
    status: 'ACTIVE',
    receivedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 'BATCH_003',
    batchNumber: 'PARA-2024-001',
    drugId: 'DRUG_002',
    quantity: 500,
    availableQuantity: 450,
    expiryDate: '2027-03-15T00:00:00Z',
    manufacturingDate: '2023-03-15T00:00:00Z',
    unitCost: 4,
    supplier: 'GSK',
    status: 'ACTIVE',
    receivedAt: '2024-01-05T00:00:00Z',
  },
];

// ============================================================================
// MOCK DRUG STOCK
// ============================================================================

export const mockDrugStocks: DrugStock[] = [
  {
    id: 'STOCK_001',
    drugId: 'DRUG_001',
    drug: mockDrugs[0],
    totalQuantity: 350,
    availableQuantity: 270,
    reservedQuantity: 80,
    expiredQuantity: 0,
    batches: [mockStockBatches[0], mockStockBatches[1]],
    status: 'IN_STOCK',
    lastUpdated: '2024-01-08T10:30:00Z',
  },
  {
    id: 'STOCK_002',
    drugId: 'DRUG_002',
    drug: mockDrugs[1],
    totalQuantity: 950,
    availableQuantity: 450,
    reservedQuantity: 500,
    expiredQuantity: 0,
    batches: [mockStockBatches[2]],
    status: 'IN_STOCK',
    lastUpdated: '2024-01-08T10:30:00Z',
  },
  {
    id: 'STOCK_003',
    drugId: 'DRUG_003',
    drug: mockDrugs[2],
    totalQuantity: 45,
    availableQuantity: 40,
    reservedQuantity: 5,
    expiredQuantity: 0,
    batches: [],
    status: 'LOW_STOCK',
    lastUpdated: '2024-01-08T10:30:00Z',
  },
];

// ============================================================================
// MOCK PRESCRIPTIONS
// ============================================================================

export const mockPrescriptions: Prescription[] = [
  {
    id: 'PRES_001',
    prescriptionNumber: 'RX-2024-00001',
    patientId: 'PAT_001',
    patientName: 'John Doe',
    patientDob: '1985-03-15T00:00:00Z',
    doctorId: 'DOC_001',
    doctorName: 'Dr. Jane Smith',
    items: [
      {
        id: 'PRES_ITEM_001',
        prescriptionId: 'PRES_001',
        drugId: 'DRUG_001',
        drugName: 'Amoxicillin',
        category: 'ANTIBIOTICS',
        quantity: 20,
        unit: 'capsules',
        frequency: 'three times daily',
        duration: '7 days',
        instructions: 'Take with water after meals',
        dispensedQuantity: 0,
        status: 'PENDING',
      },
    ],
    status: 'PENDING',
    issuedAt: '2024-01-08T09:00:00Z',
    expiresAt: '2024-02-08T09:00:00Z',
    notes: 'Patient allergic to penicillin alternatives',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z',
  },
  {
    id: 'PRES_002',
    prescriptionNumber: 'RX-2024-00002',
    patientId: 'PAT_002',
    patientName: 'Mary Johnson',
    patientDob: '1992-07-22T00:00:00Z',
    doctorId: 'DOC_002',
    doctorName: 'Dr. Robert Brown',
    items: [
      {
        id: 'PRES_ITEM_002',
        prescriptionId: 'PRES_002',
        drugId: 'DRUG_002',
        drugName: 'Paracetamol',
        category: 'ANALGESICS',
        quantity: 30,
        unit: 'tablets',
        frequency: 'twice daily',
        duration: '5 days',
        instructions: 'For fever and pain',
        dispensedQuantity: 30,
        status: 'DISPENSED',
      },
    ],
    status: 'DISPENSED',
    issuedAt: '2024-01-07T14:00:00Z',
    expiresAt: '2024-02-07T14:00:00Z',
    notes: '',
    createdAt: '2024-01-07T14:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 'PRES_003',
    prescriptionNumber: 'RX-2024-00003',
    patientId: 'PAT_003',
    patientName: 'Sarah Wilson',
    patientDob: '1978-11-30T00:00:00Z',
    doctorId: 'DOC_001',
    doctorName: 'Dr. Jane Smith',
    items: [
      {
        id: 'PRES_ITEM_003',
        prescriptionId: 'PRES_003',
        drugId: 'DRUG_003',
        drugName: 'Enalapril',
        category: 'CARDIOVASCULAR',
        quantity: 60,
        unit: 'tablets',
        frequency: 'once daily',
        duration: '30 days',
        instructions: 'Take in morning before breakfast',
        dispensedQuantity: 30,
        status: 'PARTIAL',
      },
    ],
    status: 'PARTIAL',
    issuedAt: '2024-01-05T10:00:00Z',
    expiresAt: '2024-02-05T10:00:00Z',
    notes: 'Chronic hypertension management',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-08T11:00:00Z',
  },
];

// ============================================================================
// MOCK DISPENSING RECORDS
// ============================================================================

export const mockDispensingRecords: DispensingRecord[] = [
  {
    id: 'DISP_001',
    dispensingNumber: 'DSP-2024-00001',
    prescriptionItemId: 'PRES_ITEM_002',
    prescriptionId: 'PRES_002',
    prescriptionNumber: 'RX-2024-00002',
    drugId: 'DRUG_002',
    drugName: 'Paracetamol',
    batchId: 'BATCH_003',
    batchNumber: 'PARA-2024-001',
    quantityDispensed: 30,
    unit: 'tablets',
    dispensedAt: '2024-01-08T10:00:00Z',
    dispensedBy: {
      userId: 'USR_002',
      userName: 'John Pharmacist',
      role: 'PHARMACIST',
    },
    patientId: 'PAT_002',
    patientName: 'Mary Johnson',
    doctorName: 'Dr. Robert Brown',
    status: 'SUCCESS',
    notes: '',
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 'DISP_002',
    dispensingNumber: 'DSP-2024-00002',
    prescriptionItemId: 'PRES_ITEM_003',
    prescriptionId: 'PRES_003',
    prescriptionNumber: 'RX-2024-00003',
    drugId: 'DRUG_003',
    drugName: 'Enalapril',
    batchId: 'BATCH_001',
    batchNumber: 'ENA-2024-001',
    quantityDispensed: 30,
    unit: 'tablets',
    dispensedAt: '2024-01-05T11:30:00Z',
    dispensedBy: {
      userId: 'USR_002',
      userName: 'John Pharmacist',
      role: 'PHARMACIST',
    },
    patientId: 'PAT_003',
    patientName: 'Sarah Wilson',
    doctorName: 'Dr. Jane Smith',
    status: 'SUCCESS',
    notes: 'Patient counseled on side effects',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-05T11:30:00Z',
  },
];

// ============================================================================
// MOCK AUDIT LOGS
// ============================================================================

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUDIT_001',
    action: 'DISPENSE',
    userId: 'USR_002',
    userName: 'John Pharmacist',
    userRole: 'PHARMACIST',
    resourceType: 'DISPENSING',
    resourceId: 'DISP_001',
    resourceName: 'DSP-2024-00001',
    details: 'Dispensed 30 tablets of Paracetamol',
    createdAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 'AUDIT_002',
    action: 'PRESCRIPTION_VIEW',
    userId: 'USR_003',
    userName: 'Dr. Robert Brown',
    userRole: 'DOCTOR',
    resourceType: 'PRESCRIPTION',
    resourceId: 'PRES_002',
    resourceName: 'RX-2024-00002',
    details: 'Viewed prescription details',
    createdAt: '2024-01-08T09:45:00Z',
  },
  {
    id: 'AUDIT_003',
    action: 'STOCK_ADJUST',
    userId: 'USR_001',
    userName: 'Admin User',
    userRole: 'ADMIN',
    resourceType: 'STOCK',
    resourceId: 'STOCK_001',
    resourceName: 'Amoxicillin',
    oldValue: { quantity: 280 },
    newValue: { quantity: 270 },
    details: 'Stock adjusted due to damage',
    createdAt: '2024-01-08T08:00:00Z',
  },
];

// ============================================================================
// MOCK DOCTOR LIMIT RULES
// ============================================================================

export const mockDoctorLimits: DoctorDrugLimitRule[] = [
  {
    id: 'LIMIT_001',
    doctorId: 'DOC_001',
    category: 'ANTIBIOTICS',
    dailyLimit: 100,
    weeklyLimit: 500,
    monthlyLimit: 2000,
    status: 'ACTIVE',
  },
  {
    id: 'LIMIT_002',
    doctorId: 'DOC_001',
    category: 'CARDIOVASCULAR',
    dailyLimit: 150,
    weeklyLimit: 800,
    monthlyLimit: 3000,
    status: 'ACTIVE',
  },
  {
    id: 'LIMIT_003',
    doctorId: 'DOC_002',
    category: 'ANALGESICS',
    dailyLimit: 200,
    weeklyLimit: 1000,
    monthlyLimit: 4000,
    status: 'ACTIVE',
  },
];

// ============================================================================
// HELPER FUNCTION TO GET MOCK DATA
// ============================================================================

export const getMockData = () => {
  return {
    drugs: mockDrugs,
    batches: mockStockBatches,
    stocks: mockDrugStocks,
    prescriptions: mockPrescriptions,
    dispensingRecords: mockDispensingRecords,
    auditLogs: mockAuditLogs,
    doctorLimits: mockDoctorLimits,
  };
};

/**
 * Generate mock pagination response
 */
export const generateMockPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    hasMore: end < data.length,
  };
};

/**
 * Add mock delay to simulate API latency
 */
export const simulateApiLatency = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
