/**
 * Search Filter Bar Component
 * Filter patients by status, department, and other criteria
 */

import React, { useState } from 'react';
import { PatientStatus } from '../types';
import { useDepartments } from '../hooks';

interface SearchFilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  isLoading?: boolean;
}

export interface FilterOptions {
  status?: PatientStatus;
  departmentId?: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const { data: departments = [] } = useDepartments();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Basic Filters */}
      <div className="flex gap-4 flex-wrap">
        {/* Status Filter */}
        <div className="flex-1 min-w-fit">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                status: (e.target.value as PatientStatus) || undefined,
              })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Statuses</option>
            <option value={PatientStatus.ACTIVE}>Active</option>
            <option value={PatientStatus.INACTIVE}>Inactive</option>
            <option value={PatientStatus.DECEASED}>Deceased</option>
            <option value={PatientStatus.TRANSFERRED}>Transferred</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex-1 min-w-fit">
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filters.departmentId || ''}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                departmentId: e.target.value || undefined,
              })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Toggle */}
        <div className="flex items-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          {Object.values(filters).some((v) => v !== undefined && v !== '') && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filters.gender || ''}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  gender: e.target.value || undefined,
                })
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>

          {/* Min Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
            <input
              type="number"
              min="0"
              max="150"
              value={filters.minAge || ''}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  minAge: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="0"
            />
          </div>

          {/* Max Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
            <input
              type="number"
              min="0"
              max="150"
              value={filters.maxAge || ''}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  maxAge: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="150"
            />
          </div>
        </div>
      )}
    </div>
  );
};
