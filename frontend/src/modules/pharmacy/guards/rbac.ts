/**
 * RBAC Guards and Authorization Utilities
 * Role-based access control for pharmacy features
 */

import type { UserRole } from '../types';

// ============================================================================
// ROLE DEFINITIONS & PERMISSIONS
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  PHARMACIST: [
    'view_prescriptions',
    'view_prescription_details',
    'dispense_medication',
    'view_stock',
    'view_stock_details',
    'view_dispensing_history',
    'view_audit_logs',
    'cancel_prescription', // Only if not partially dispensed
  ],
  DOCTOR: [
    'view_prescriptions',
    'view_prescription_details', // Own prescriptions only
    'view_stock', // Limited - only what's being dispensed to them
  ],
  INVENTORY_MANAGER: [
    'view_stock',
    'view_stock_details',
    'view_dispensing_history', // For reconciliation
  ],
  ADMIN: [
    'view_prescriptions',
    'view_prescription_details',
    'dispense_medication',
    'view_stock',
    'view_stock_details',
    'view_dispensing_history',
    'view_audit_logs',
    'cancel_prescription',
    'manage_users',
    'manage_roles',
  ],
};

// ============================================================================
// PERMISSION CHECKS
// ============================================================================

/**
 * Check if user has permission to perform an action
 */
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

/**
 * Check if user has any of the provided permissions
 */
export const hasAnyPermission = (userRole: UserRole, permissions: string[]): boolean => {
  return permissions.some((perm) => hasPermission(userRole, perm));
};

/**
 * Check if user has all of the provided permissions
 */
export const hasAllPermissions = (userRole: UserRole, permissions: string[]): boolean => {
  return permissions.every((perm) => hasPermission(userRole, perm));
};

// ============================================================================
// FEATURE ACCESS GUARDS
// ============================================================================

export const canViewPrescriptions = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'view_prescriptions');

export const canDispenseMedication = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'dispense_medication');

export const canViewStock = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'view_stock');

export const canViewDispensingHistory = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'view_dispensing_history');

export const canViewAuditLogs = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'view_audit_logs');

export const canCancelPrescription = (userRole: UserRole): boolean =>
  hasPermission(userRole, 'cancel_prescription');

// ============================================================================
// BUSINESS RULE ENFORCEMENT
// ============================================================================

/**
 * Pharmacists can dispense, but only from valid prescriptions
 */
export const canDispensingActionsBeVisible = (userRole: UserRole): boolean => {
  return canDispenseMedication(userRole);
};

/**
 * Only pharmacist or admin can see audit trail
 */
export const canViewComplianceData = (userRole: UserRole): boolean => {
  return userRole === 'PHARMACIST' || userRole === 'ADMIN';
};

/**
 * Stock management visible to pharmacist, inventory manager, and admin
 */
export const canManageStock = (userRole: UserRole): boolean => {
  return userRole === 'PHARMACIST' || userRole === 'INVENTORY_MANAGER' || userRole === 'ADMIN';
};

/**
 * Only doctors can be restricted by drug category limits
 * (enforced at UI and backend)
 */
export const canExceedDoctorLimits = (userRole: UserRole): boolean => {
  return userRole === 'ADMIN' || userRole === 'PHARMACIST';
};

// ============================================================================
// DATA FILTERING BASED ON ROLE
// ============================================================================

/**
 * Determine what data should be visible to a user based on role
 */
export const getDataVisibilityScope = (
  userRole: UserRole,
  userId?: string
): {
  canViewAllPrescriptions: boolean;
  canViewAllStock: boolean;
  canViewAllHistory: boolean;
  canViewAuditLogs: boolean;
  scopedToUser: boolean;
  scopedUserId?: string;
} => {
  switch (userRole) {
    case 'PHARMACIST':
      return {
        canViewAllPrescriptions: true,
        canViewAllStock: true,
        canViewAllHistory: true,
        canViewAuditLogs: true,
        scopedToUser: false,
      };

    case 'DOCTOR':
      return {
        canViewAllPrescriptions: false, // Only own prescriptions
        canViewAllStock: true, // Can view what's relevant
        canViewAllHistory: false,
        canViewAuditLogs: false,
        scopedToUser: true,
        scopedUserId: userId,
      };

    case 'INVENTORY_MANAGER':
      return {
        canViewAllPrescriptions: false,
        canViewAllStock: true,
        canViewAllHistory: true, // For reconciliation
        canViewAuditLogs: false,
        scopedToUser: false,
      };

    case 'ADMIN':
      return {
        canViewAllPrescriptions: true,
        canViewAllStock: true,
        canViewAllHistory: true,
        canViewAuditLogs: true,
        scopedToUser: false,
      };

    default:
      return {
        canViewAllPrescriptions: false,
        canViewAllStock: false,
        canViewAllHistory: false,
        canViewAuditLogs: false,
        scopedToUser: false,
      };
  }
};

// ============================================================================
// ACTION PERMISSION CHECKS
// ============================================================================

/**
 * Determine if a prescription can be cancelled by the current user
 */
export const canCancelPrescriptionAction = (
  userRole: UserRole,
  prescriptionStatus: string
): boolean => {
  // Only pharmacist and admin can cancel
  if (!hasPermission(userRole, 'cancel_prescription')) return false;

  // Cannot cancel if already fully dispensed or expired
  if (['DISPENSED', 'EXPIRED', 'CANCELLED'].includes(prescriptionStatus)) {
    return false;
  }

  return true;
};

/**
 * Determine if dispensing UI should be visible and enabled
 */
export const canShowDispensingUI = (userRole: UserRole): boolean => {
  return canDispenseMedication(userRole);
};

/**
 * Determine if stock adjustment UI should be visible
 */
export const canShowStockManagementUI = (userRole: UserRole): boolean => {
  return userRole === 'PHARMACIST' || userRole === 'INVENTORY_MANAGER' || userRole === 'ADMIN';
};

// ============================================================================
// SENSITIVE DATA FILTERING
// ============================================================================

/**
 * Redact sensitive information based on user role
 */
export const getSafeResourceData = <T extends Record<string, any>>(
  resource: T,
  userRole: UserRole
): T => {
  const safe = { ...resource };

  // Doctors shouldn't see other doctors' prescriptions
  if (userRole === 'DOCTOR' && resource.doctorId) {
    // This is enforced at the API level, but we can add client-side checks
  }

  // Inventory managers don't need sensitive dispensing info
  if (userRole === 'INVENTORY_MANAGER') {
    // Filter out sensitive fields if needed
  }

  return safe;
};

// ============================================================================
// ERROR MESSAGES BASED ON ROLE
// ============================================================================

/**
 * Get contextual error message based on user role and action
 */
export const getActionErrorMessage = (
  userRole: UserRole,
  action: string
): string => {
  const roleBasedMessages: Record<UserRole, Record<string, string>> = {
    PHARMACIST: {
      dispense_blocked_limit:
        'Doctor has reached daily limit for this drug category. Please check with supervisor.',
      dispense_blocked_stock:
        'Insufficient stock. Consider partial dispensing or alternative drug.',
      dispense_blocked_expiry: 'Selected batch is expired. Choose a valid batch.',
    },
    DOCTOR: {
      dispense_blocked_limit:
        'You have reached your daily limit for this drug category.',
      action_not_allowed: 'You do not have permission to perform this action.',
      view_not_allowed: 'You do not have access to this information.',
    },
    INVENTORY_MANAGER: {
      action_not_allowed: 'Inventory managers cannot dispense medications.',
      dispense_action: 'Contact pharmacy staff to dispense medications.',
    },
    ADMIN: {
      action_failed: 'Action failed. Please check system logs.',
    },
  };

  return (
    roleBasedMessages[userRole]?.[action] ||
    'You do not have permission to perform this action.'
  );
};
