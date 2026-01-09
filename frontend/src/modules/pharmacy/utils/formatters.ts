/**
 * Pharmacy Utility Functions
 * Formatting, validation, and helper functions
 */

import type {
  DrugStock,
  StockStatus,
  PrescriptionStatus,
  DispensingStatus,
  DrugCategory,
} from '../types';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return formatDate(then);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency = 'KES'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format quantity with unit
 */
export const formatQuantity = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}`;
};

/**
 * Format batch number
 */
export const formatBatchNumber = (batchNumber: string): string => {
  return batchNumber.toUpperCase();
};

/**
 * Format prescription number
 */
export const formatPrescriptionNumber = (number: string): string => {
  return `RX-${number}`;
};

// ============================================================================
// STATUS FORMATTING & STYLING
// ============================================================================

export const getStatusColor = (status: PrescriptionStatus | DispensingStatus | StockStatus): string => {
  const colorMap: Record<string, string> = {
    // Prescription Status
    PENDING: 'bg-blue-100 text-blue-800',
    PARTIAL: 'bg-amber-100 text-amber-800',
    DISPENSED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
    // Stock Status
    IN_STOCK: 'bg-green-100 text-green-800',
    LOW_STOCK: 'bg-amber-100 text-amber-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800',
    // Dispensing Status
    SUCCESS: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    PENDING: 'Pending',
    PARTIAL: 'Partially Dispensed',
    DISPENSED: 'Fully Dispensed',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    IN_STOCK: 'In Stock',
    LOW_STOCK: 'Low Stock',
    OUT_OF_STOCK: 'Out of Stock',
    SUCCESS: 'Successful',
    FAILED: 'Failed',
  };
  return labelMap[status] || status;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate batch expiry
 */
export const isBatchExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (expiryDate: string): number => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Check if batch is expiring soon (within 30 days)
 */
export const isBatchExpiringsSoon = (expiryDate: string, daysThreshold = 30): boolean => {
  const daysLeft = getDaysUntilExpiry(expiryDate);
  return daysLeft > 0 && daysLeft <= daysThreshold;
};

/**
 * Check if stock is low
 */
export const isStockLow = (available: number, reorderLevel: number): boolean => {
  return available > 0 && available <= reorderLevel;
};

/**
 * Check if stock is out
 */
export const isStockOut = (available: number): boolean => {
  return available <= 0;
};

/**
 * Determine stock status
 */
export const determineStockStatus = (
  available: number,
  reorderLevel: number,
  maxLevel: number
): StockStatus => {
  if (available <= 0) return 'OUT_OF_STOCK';
  if (available <= reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
};

/**
 * Validate quantity for dispensing
 */
export const validateDispensingQuantity = (
  requested: number,
  available: number,
  max?: number
): { valid: boolean; message: string } => {
  if (requested <= 0) {
    return { valid: false, message: 'Quantity must be greater than 0' };
  }

  if (requested > available) {
    return {
      valid: false,
      message: `Cannot dispense ${requested} units. Only ${available} available.`,
    };
  }

  if (max && requested > max) {
    return {
      valid: false,
      message: `Cannot dispense more than ${max} units per transaction.`,
    };
  }

  return { valid: true, message: '' };
};

// ============================================================================
// BUSINESS LOGIC UTILITIES
// ============================================================================

/**
 * Check if prescription is eligible for dispensing
 */
export const canDispensePrescription = (
  status: PrescriptionStatus,
  isExpired: boolean
): boolean => {
  if (isExpired) return false;
  if (status === 'DISPENSED' || status === 'CANCELLED') return false;
  return true;
};

/**
 * Get readable frequency string
 */
export const formatFrequency = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    'once_daily': 'Once daily',
    'twice_daily': 'Twice daily',
    'three_times_daily': 'Three times daily',
    'four_times_daily': 'Four times daily',
    'every_6_hours': 'Every 6 hours',
    'every_8_hours': 'Every 8 hours',
    'every_12_hours': 'Every 12 hours',
    'as_needed': 'As needed',
  };
  return frequencyMap[frequency] || frequency;
};

/**
 * Get readable duration string
 */
export const formatDuration = (duration: string): string => {
  const match = duration.match(/(\d+)\s*(day|week|month)/i);
  if (!match) return duration;

  const [, count, unit] = match;
  const plural = parseInt(count) > 1 ? 's' : '';
  return `${count} ${unit.toLowerCase()}${plural}`;
};

/**
 * Get category label
 */
export const getCategoryLabel = (category: DrugCategory): string => {
  const labels: Record<DrugCategory, string> = {
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
  };
  return labels[category];
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Convert array of objects to CSV string
 */
export const toCSV = <T extends Record<string, any>>(
  data: T[],
  columns: (keyof T)[]
): string => {
  // Header
  const header = columns.join(',');

  // Rows
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
};

/**
 * Download file
 */
export const downloadFile = (content: string, filename: string, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix: string, extension = 'csv'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${extension}`;
};

// ============================================================================
// ARRAY & SORTING UTILITIES
// ============================================================================

/**
 * Sort drugs by stock status priority
 */
export const sortByStockPriority = (drugs: DrugStock[]): DrugStock[] => {
  const priority: Record<StockStatus, number> = {
    OUT_OF_STOCK: 0,
    LOW_STOCK: 1,
    IN_STOCK: 2,
    EXPIRED: 3,
  };

  return [...drugs].sort((a, b) => priority[a.status] - priority[b.status]);
};

/**
 * Filter expired batches
 */
export const filterExpiredBatches = (batches: any[]) => {
  return batches.filter((batch) => !isBatchExpired(batch.expiryDate));
};

/**
 * Find valid batch for dispensing
 * Prefers batches closer to expiry (FIFO)
 */
export const findBestBatchForDispensingFIFO = (batches: any[]) => {
  const validBatches = filterExpiredBatches(batches);
  if (validBatches.length === 0) return null;

  // Sort by expiry date ascending (expires soonest first)
  return validBatches.sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  )[0];
};
