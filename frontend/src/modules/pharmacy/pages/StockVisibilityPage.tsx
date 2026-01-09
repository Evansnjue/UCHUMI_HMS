/**
 * Stock Visibility Page
 * Real-time inventory management with batch and expiry tracking
 */

import React, { useState } from 'react';
import type { DrugStock, StockFilters, DrugCategory } from '../types';
import { useAllStock } from '../hooks/queries';
import {
  DataTable,
  TableColumn,
  Pagination,
  SearchBar,
} from '../components/tables/TableComponents';
import {
  Alert,
  EmptyState,
  Button,
  SpinnerLoader,
  Dialog,
  Badge,
  StatusIndicator,
} from '../components/common/CommonComponents';
import { RoleGuard } from '../guards/RoleGuard';
import {
  getStatusColor,
  getStatusLabel,
  getDaysUntilExpiry,
  isBatchExpiringsSoon,
  formatQuantity,
  getCategoryLabel,
} from '../utils/formatters';
import type { UserRole } from '../types';

interface StockVisibilityPageProps {
  userRole: UserRole;
}

export const StockVisibilityPage: React.FC<StockVisibilityPageProps> = ({ userRole }) => {
  const [filters, setFilters] = useState<StockFilters>({
    page: 1,
    pageSize: 25,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [selectedStock, setSelectedStock] = useState<DrugStock | null>(null);

  const { data, isLoading, error } = useAllStock(filters);

  const handleSearch = (term: string) => {
    setFilters({ ...filters, searchTerm: term, page: 1 });
  };

  const handleFilterCategory = (category: DrugCategory | undefined) => {
    setFilters({
      ...filters,
      category: category === filters.category ? undefined : category,
      page: 1,
    });
  };

  const handleFilterStatus = (status: any) => {
    setFilters({
      ...filters,
      status: status === filters.status ? undefined : status,
      page: 1,
    });
  };

  const handleSort = (key: keyof DrugStock, direction: 'asc' | 'desc') => {
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

  const columns: TableColumn<DrugStock>[] = [
    {
      key: 'drug.name',
      label: 'Drug Name',
      sortable: true,
      width: '150px',
      render: (_, row) => (
        <button
          onClick={() => setSelectedStock(row)}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          {row.drug.name}
        </button>
      ),
    },
    {
      key: 'drug.strength',
      label: 'Strength',
      width: '80px',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: 'drug.category',
      label: 'Category',
      width: '120px',
      render: (value: DrugCategory) => <span className="text-sm">{getCategoryLabel(value)}</span>,
    },
    {
      key: 'availableQuantity',
      label: 'Available',
      sortable: true,
      width: '100px',
      render: (value, row) => (
        <span className="font-medium">
          {formatQuantity(value, row.drug.dosageForm.toLowerCase())}
        </span>
      ),
    },
    {
      key: 'totalQuantity',
      label: 'Total',
      width: '80px',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (value) => (
        <Badge label={getStatusLabel(value)} color={getStatusColor(value)} />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '120px',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedStock(row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          title="Failed to Load Stock"
          message={error.message}
          onDismiss={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <RoleGuard
      userRole={userRole}
      allowedRoles={['PHARMACIST', 'INVENTORY_MANAGER', 'ADMIN']}
      fallback={
        <EmptyState
          title="Access Denied"
          description="You do not have permission to view stock information."
        />
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-2">
            Real-time inventory visibility with batch tracking
          </p>
        </div>

        {/* Stock Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Drugs"
            value={data?.data.length || 0}
            color="bg-blue-100 text-blue-800"
            icon="💊"
          />
          <SummaryCard
            title="In Stock"
            value={data?.data.filter((s) => s.status === 'IN_STOCK').length || 0}
            color="bg-green-100 text-green-800"
            icon="✓"
          />
          <SummaryCard
            title="Low Stock"
            value={data?.data.filter((s) => s.status === 'LOW_STOCK').length || 0}
            color="bg-amber-100 text-amber-800"
            icon="⚠️"
          />
          <SummaryCard
            title="Out of Stock"
            value={data?.data.filter((s) => s.status === 'OUT_OF_STOCK').length || 0}
            color="bg-red-100 text-red-800"
            icon="✕"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by drug name, generic name..."
              className="flex-1"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <Button
              variant={!filters.status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus(undefined)}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'IN_STOCK' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus('IN_STOCK')}
            >
              In Stock
            </Button>
            <Button
              variant={filters.status === 'LOW_STOCK' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus('LOW_STOCK')}
            >
              Low Stock
            </Button>
            <Button
              variant={filters.status === 'OUT_OF_STOCK' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterStatus('OUT_OF_STOCK')}
            >
              Out of Stock
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <SpinnerLoader />
            </div>
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No Stock Found"
              description="No drugs match your current filters."
              icon="📦"
              className="py-12"
            />
          ) : (
            <>
              <DataTable
                title="Drug Inventory"
                columns={columns}
                data={data?.data || []}
                rowKey="id"
                isLoading={isLoading}
                onSort={handleSort}
                sortKey={filters.sortBy as any}
                sortDirection={filters.sortOrder}
              />
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil((data?.total || 0) / (filters.pageSize || 25))}
                  onPageChange={handlePageChange}
                  hasMore={data?.total ? data.total > (filters.page || 1) * (filters.pageSize || 25) : false}
                  pageSize={filters.pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>

        {/* Stock Detail Dialog */}
        {selectedStock && (
          <StockDetailDialog
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </div>
    </RoleGuard>
  );
};

// ============================================================================
// SUPPORTING COMPONENTS
// ============================================================================

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
  icon: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-sm font-medium opacity-75">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

interface StockDetailDialogProps {
  stock: DrugStock;
  onClose: () => void;
}

const StockDetailDialog: React.FC<StockDetailDialogProps> = ({ stock, onClose }) => {
  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title={`Stock Details: ${stock.drug.name}`}
      size="lg"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Drug Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Generic Name</label>
            <p className="font-medium text-gray-900">{stock.drug.genericName}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Dosage Form</label>
            <p className="font-medium text-gray-900">{stock.drug.dosageForm}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Strength</label>
            <p className="font-medium text-gray-900">{stock.drug.strength}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Category</label>
            <p className="font-medium text-gray-900">{getCategoryLabel(stock.drug.category)}</p>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Stock Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Total Quantity</label>
              <p className="text-2xl font-bold text-gray-900">{stock.totalQuantity}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Available</label>
              <p className="text-2xl font-bold text-green-600">{stock.availableQuantity}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Reserved</label>
              <p className="text-2xl font-bold text-amber-600">{stock.reservedQuantity}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <div className="mt-1">
                <Badge
                  label={getStatusLabel(stock.status)}
                  color={getStatusColor(stock.status)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reorder Info */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Reorder Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-blue-700">Reorder Level</label>
              <p className="font-medium text-blue-900">{stock.drug.reorderLevel}</p>
            </div>
            <div>
              <label className="text-sm text-blue-700">Max Level</label>
              <p className="font-medium text-blue-900">{stock.drug.maxStockLevel}</p>
            </div>
            <div>
              <label className="text-sm text-blue-700">Unit Price</label>
              <p className="font-medium text-blue-900">KES {stock.drug.unitPrice}</p>
            </div>
          </div>
        </div>

        {/* Batches */}
        {stock.batches.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Stock Batches (FIFO)</h3>
            <div className="space-y-2">
              {stock.batches.map((batch) => {
                const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                const isSoon = isBatchExpiringsSoon(batch.expiryDate);

                return (
                  <div
                    key={batch.id}
                    className={`p-3 rounded border ${
                      isSoon ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-mono text-sm font-medium">{batch.batchNumber}</p>
                        <p className="text-xs text-gray-600">{batch.supplier}</p>
                      </div>
                      {isSoon && (
                        <Badge label={`Expires in ${daysLeft} days`} color="bg-amber-100 text-amber-800" />
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium">{batch.availableQuantity} / {batch.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Expiry:</span>
                        <p className="font-medium">
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost:</span>
                        <p className="font-medium">KES {batch.unitCost}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default StockVisibilityPage;
