/**
 * Prescription Queue Page
 * Displays pending and partial prescriptions ready for dispensing
 */

import React, { useState } from 'react';
import type { Prescription, PrescriptionFilters, PrescriptionStatus } from '../types';
import { usePrescriptionQueue } from '../hooks/queries';
import {
  DataTable,
  TableColumn,
  Pagination,
  SearchBar,
  FilterChips,
} from '../components/tables/TableComponents';
import {
  Alert,
  EmptyState,
  Button,
  SpinnerLoader,
  Dialog,
  ConfirmDialog,
} from '../components/common/CommonComponents';
import { RoleGuard, DispensingGuard } from '../guards/RoleGuard';
import { formatDate, formatDateTime, getStatusColor, getStatusLabel } from '../utils/formatters';
import type { UserRole } from '../types';

interface PrescriptionQueuePageProps {
  userRole: UserRole;
  onSelectPrescription?: (prescription: Prescription) => void;
}

export const PrescriptionQueuePage: React.FC<PrescriptionQueuePageProps> = ({
  userRole,
  onSelectPrescription,
}) => {
  const [filters, setFilters] = useState<PrescriptionFilters>({
    status: undefined,
    page: 1,
    pageSize: 10,
    sortBy: 'issuedAt',
    sortOrder: 'desc',
  });

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data, isLoading, error } = usePrescriptionQueue(filters);

  const handleSearch = (term: string) => {
    setFilters({ ...filters, searchTerm: term, page: 1 });
  };

  const handleFilterStatus = (status: PrescriptionStatus | undefined) => {
    setFilters({
      ...filters,
      status: status === filters.status ? undefined : status,
      page: 1,
    });
  };

  const handleSort = (key: keyof Prescription, direction: 'asc' | 'desc') => {
    setFilters({
      ...filters,
      sortBy: key as any,
      sortOrder: direction,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, pageSize, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      status: undefined,
      page: 1,
      pageSize: 10,
      sortBy: 'issuedAt',
      sortOrder: 'desc',
    });
  };

  const handleCancelPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowCancelDialog(true);
  };

  const columns: TableColumn<Prescription>[] = [
    {
      key: 'prescriptionNumber',
      label: 'RX Number',
      sortable: true,
      width: '100px',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'patientName',
      label: 'Patient',
      sortable: true,
      width: '150px',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.patientId}</div>
        </div>
      ),
    },
    {
      key: 'doctorName',
      label: 'Prescribing Doctor',
      sortable: true,
      width: '150px',
    },
    {
      key: 'issuedAt',
      label: 'Issued',
      sortable: true,
      width: '120px',
      render: (value) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '120px',
      render: (value, row) => (
        <div className="flex gap-2">
          <DispensingGuard userRole={userRole}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedPrescription(row);
                onSelectPrescription?.(row);
              }}
            >
              Dispense
            </Button>
          </DispensingGuard>
          {row.status !== 'DISPENSED' && row.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelPrescription(row)}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          title="Failed to Load Prescriptions"
          message={error.message}
          onDismiss={() => window.location.reload()}
        />
      </div>
    );
  }

  const pendingCount = data?.pendingCount || 0;
  const partialCount = data?.partialCount || 0;

  return (
    <RoleGuard
      userRole={userRole}
      allowedRoles={['PHARMACIST', 'DOCTOR', 'ADMIN']}
      fallback={
        <EmptyState
          title="Access Denied"
          description="You do not have permission to view prescriptions."
        />
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescription Queue</h1>
          <p className="text-gray-600 mt-2">
            Manage prescriptions pending dispensing
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Pending"
            value={pendingCount}
            color="bg-blue-100 text-blue-800"
            icon="📋"
          />
          <StatCard
            title="Partially Dispensed"
            value={partialCount}
            color="bg-amber-100 text-amber-800"
            icon="⚠️"
          />
          <StatCard
            title="Total Queue"
            value={data?.total || 0}
            color="bg-gray-100 text-gray-800"
            icon="📊"
          />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by patient name, RX number..."
              className="flex-1"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <Button
              variant={!filters.status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'PENDING' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus('PENDING')}
            >
              Pending
            </Button>
            <Button
              variant={filters.status === 'PARTIAL' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus('PARTIAL')}
            >
              Partial
            </Button>
            {(filters.status || filters.searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <SpinnerLoader />
            </div>
          ) : data?.prescriptions.length === 0 ? (
            <EmptyState
              title="No Prescriptions Found"
              description="There are no prescriptions matching your filters."
              icon="📋"
              action={
                filters.status || filters.searchTerm ? (
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : undefined
              }
              className="py-12"
            />
          ) : (
            <>
              <DataTable
                title="Active Prescriptions"
                columns={columns}
                data={data?.prescriptions || []}
                rowKey="id"
                isLoading={isLoading}
                onSort={handleSort}
                sortKey={filters.sortBy as any}
                sortDirection={filters.sortOrder}
              />
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil((data?.total || 0) / (filters.pageSize || 10))}
                  onPageChange={handlePageChange}
                  hasMore={data?.total ? data.total > (filters.page || 1) * (filters.pageSize || 10) : false}
                  pageSize={filters.pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>

        {/* Prescription Detail Dialog */}
        {selectedPrescription && !showCancelDialog && (
          <PrescriptionDetailModal
            prescription={selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
          />
        )}

        {/* Cancel Prescription Confirmation */}
        <ConfirmDialog
          isOpen={showCancelDialog}
          onConfirm={() => {
            // Handle cancel prescription
            setShowCancelDialog(false);
            setCancelReason('');
          }}
          onCancel={() => {
            setShowCancelDialog(false);
            setCancelReason('');
          }}
          title="Cancel Prescription"
          message="Are you sure you want to cancel this prescription? This action cannot be undone."
          confirmText="Cancel Prescription"
          cancelText="Keep Prescription"
          isDangerous={true}
        />
      </div>
    </RoleGuard>
  );
};

// ============================================================================
// SUPPORTING COMPONENTS
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-sm font-medium opacity-75">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

interface PrescriptionDetailModalProps {
  prescription: Prescription;
  onClose: () => void;
}

const PrescriptionDetailModal: React.FC<PrescriptionDetailModalProps> = ({
  prescription,
  onClose,
}) => {
  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title={`Prescription ${prescription.prescriptionNumber}`}
      size="lg"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Patient Name</label>
            <p className="font-medium text-gray-900">{prescription.patientName}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Date of Birth</label>
            <p className="font-medium text-gray-900">{formatDate(prescription.patientDob)}</p>
          </div>
        </div>

        {/* Doctor Info */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Prescribing Doctor</label>
          <p className="font-medium text-gray-900">{prescription.doctorName}</p>
        </div>

        {/* Status & Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Status</label>
            <p className={`font-medium px-2 py-1 rounded text-sm w-fit ${getStatusColor(prescription.status)}`}>
              {getStatusLabel(prescription.status)}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Expires</label>
            <p className="font-medium text-gray-900">{formatDate(prescription.expiresAt)}</p>
          </div>
        </div>

        {/* Prescription Items */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">Medications</label>
          <div className="space-y-2">
            {prescription.items.map((item) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.drugName}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit} - {item.frequency} for {item.duration}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                    {item.dispensedQuantity > 0 && item.dispensedQuantity < item.quantity ? 'Partial' : item.status}
                  </span>
                </div>
                {item.instructions && (
                  <p className="text-xs text-gray-600 mt-2 italic">{item.instructions}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Dispensed: {item.dispensedQuantity} / {item.quantity} {item.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {prescription.notes && (
          <div>
            <label className="text-xs font-semibold text-gray-600">Notes</label>
            <p className="text-sm text-gray-700 bg-amber-50 p-2 rounded border border-amber-200">
              {prescription.notes}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default PrescriptionQueuePage;
