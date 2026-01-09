/**
 * Table Components
 * Reusable table components with pagination, sorting, and filtering
 */

import React, { useState } from 'react';
import { Button, Skeleton } from '../common/CommonComponents';

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (
    {
      columns,
      data,
      isLoading = false,
      rowKey,
      onRowClick,
      onSort,
      className = '',
      striped = true,
      hoverable = true,
      sortKey,
      sortDirection,
    },
    ref
  ) => {
    const [localSortKey, setLocalSortKey] = useState<any>(sortKey);
    const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(
      sortDirection || 'asc'
    );

    const handleSort = (columnKey: any) => {
      let newDirection: 'asc' | 'desc' = 'asc';

      if (localSortKey === columnKey && localSortDirection === 'asc') {
        newDirection = 'desc';
      }

      setLocalSortKey(columnKey);
      setLocalSortDirection(newDirection);

      onSort?.(columnKey, newDirection);
    };

    if (isLoading) {
      return <Skeleton count={5} className="h-12" />;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table ref={ref} className={`w-full border-collapse ${className}`}>
          {/* Header */}
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                    col.width ? `w-${col.width}` : ''
                  }`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-2 hover:text-gray-900 transition"
                    >
                      {col.label}
                      <span className="text-xs">
                        {localSortKey === col.key ? (localSortDirection === 'asc' ? '↑' : '↓') : '⇅'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={String(row[rowKey])}
                className={`border-b border-gray-200 ${
                  striped && idx % 2 === 1 ? 'bg-gray-50' : ''
                } ${hoverable ? 'hover:bg-blue-50 transition' : ''} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore?: boolean;
  isLoading?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasMore = false,
  isLoading = false,
  pageSize = 10,
  onPageSizeChange,
  className = '',
}) => {
  const pages = [];

  // Show first page, last page, and pages around current
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) pages.push(1);
  if (startPage > 2) pages.push('...');

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) pages.push('...');
  if (endPage < totalPages) pages.push(totalPages);

  return (
    <div className={`flex items-center justify-between py-4 ${className}`}>
      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Items per page:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          ← Previous
        </Button>

        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || !hasMore || isLoading}
        >
          Next →
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

// ============================================================================
// SEARCH & FILTER BAR
// ============================================================================

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  icon?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  debounceMs = 300,
  icon = '🔍',
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debounceRef = React.useRef<NodeJS.Timeout>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce the search callback
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="absolute left-3 text-gray-400">{icon}</span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

// ============================================================================
// FILTER CHIPS
// ============================================================================

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onRemove,
  onClearAll,
  className = '',
}) => {
  if (chips.length === 0) return null;

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemove(chip.id)}
            className="text-blue-600 hover:text-blue-800 font-bold"
            aria-label={`Remove filter: ${chip.label}`}
          >
            ×
          </button>
        </div>
      ))}
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

// ============================================================================
// DATA TABLE WITH EXPORT
// ============================================================================

interface DataTableProps<T> extends TableProps<T> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  showExportButtons?: boolean;
}

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      title,
      subtitle,
      actions,
      onExportCSV,
      onExportPDF,
      showExportButtons = false,
      ...tableProps
    },
    ref
  ) => {
    return (
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        {(title || actions || showExportButtons) && (
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                {showExportButtons && (
                  <>
                    {onExportCSV && (
                      <Button variant="secondary" size="sm" onClick={onExportCSV}>
                        📥 CSV
                      </Button>
                    )}
                    {onExportPDF && (
                      <Button variant="secondary" size="sm" onClick={onExportPDF}>
                        📄 PDF
                      </Button>
                    )}
                  </>
                )}
                {actions}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="p-4">
          <Table ref={ref} {...tableProps} />
        </div>
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
