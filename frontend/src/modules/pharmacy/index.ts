/**
 * Pharmacy Module Index
 * Central export point for all pharmacy module components, hooks, and types
 */

// Pages
export { PrescriptionQueuePage } from './pages/PrescriptionQueuePage';
export { DispensingPage } from './pages/DispensingPage';
export { StockVisibilityPage } from './pages/StockVisibilityPage';
export { PharmacyRoutes } from './pages/routes';

// Types & Enums
export type {
  Prescription,
  PrescriptionItem,
  Drug,
  DrugStock,
  StockBatch,
  DispensingRecord,
  AuditLog,
  DoctorDrugLimitRule,
  ValidationError,
  DispensingValidationResult,
  PaginatedResponse,
  PrescriptionFilters,
  StockFilters,
  DispensingHistoryFilters,
  AuditLogFilters,
} from './types';

export {
  PrescriptionStatus,
  DispensingStatus,
  DrugCategory,
  StockStatus,
  AuditAction,
  UserRole,
} from './types';

// Services
export * from './services/api';

// Hooks
export {
  usePrescriptionQueue,
  usePrescriptionDetail,
  usePrescriptionByNumber,
  useCancelPrescription,
  useDrugs,
  useDrugDetail,
  useDrugStock,
  useAllStock,
  useStockBatches,
  useValidateDispensingRequest,
  useDispense,
  useDispensePartial,
  useDispensingHistory,
  useDispensingRecord,
  useAuditLogs,
  useResourceAuditTrail,
  useDoctorLimits,
  useCheckDoctorLimitViolation,
} from './hooks/queries';

// RBAC & Guards
export {
  RoleGuard,
  PermissionGuard,
  PermissionGate,
  DisabledIfBlocked,
  PrescriptionViewGuard,
  DispensingGuard,
  AuditViewGuard,
} from './guards/RoleGuard';

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canViewPrescriptions,
  canDispenseMedication,
  canViewStock,
  canViewDispensingHistory,
  canViewAuditLogs,
  canCancelPrescription,
  canDispensingActionsBeVisible,
  canViewComplianceData,
  canManageStock,
  canExceedDoctorLimits,
  getDataVisibilityScope,
  canCancelPrescriptionAction,
  canShowDispensingUI,
  canShowStockManagementUI,
  getSafeResourceData,
  getActionErrorMessage,
  ROLE_PERMISSIONS,
} from './guards/rbac';

// Components
export {
  Skeleton,
  TableSkeleton,
  SpinnerLoader,
  EmptyState,
  Button,
  Alert,
  Dialog,
  ConfirmDialog,
  Badge,
  StatusIndicator,
  Divider,
  FormGroup,
  Input,
  Select,
  TextArea,
} from './components/common/CommonComponents';

export {
  Table,
  Pagination,
  SearchBar,
  FilterChips,
  DataTable,
} from './components/tables/TableComponents';

// Utilities
export {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatCurrency,
  formatQuantity,
  formatBatchNumber,
  formatPrescriptionNumber,
  getStatusColor,
  getStatusLabel,
  isBatchExpired,
  getDaysUntilExpiry,
  isBatchExpiringsSoon,
  isStockLow,
  isStockOut,
  determineStockStatus,
  validateDispensingQuantity,
  canDispensePrescription,
  formatFrequency,
  formatDuration,
  getCategoryLabel,
  toCSV,
  downloadFile,
  generateFilename,
  sortByStockPriority,
  filterExpiredBatches,
  findBestBatchForDispensingFIFO,
} from './utils/formatters';


