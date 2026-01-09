/**
 * Patient Table Component
 * Displays list of patients with search, filter, and pagination
 */

import React, { useState } from 'react';
import { PatientDto, PatientStatus } from '../types';
import { PatientNumbers } from './PatientNumbers';

interface PatientTableProps {
  patients: PatientDto[];
  isLoading?: boolean;
  onRowClick?: (patient: PatientDto) => void;
  onEditClick?: (patient: PatientDto) => void;
  onDeactivateClick?: (patient: PatientDto) => void;
  canEdit?: boolean;
  canDeactivate?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  isLoading = false,
  onRowClick,
  onEditClick,
  onDeactivateClick,
  canEdit = false,
  canDeactivate = false,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No patients found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Patient Numbers</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Registered</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick?.(patient)}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-900">{patient.fullName}</div>
                  {patient.email && <div className="text-xs text-gray-600">{patient.email}</div>}
                </td>
                <td className="px-4 py-3 text-gray-700">{patient.phone}</td>
                <td className="px-4 py-3">
                  <PatientNumbers patient={patient} compact />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      patient.status === PatientStatus.ACTIVE
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {new Date(patient.registeredAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    {canEdit && patient.status === PatientStatus.ACTIVE && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick?.(patient);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                    {canDeactivate && patient.status === PatientStatus.ACTIVE && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeactivateClick?.(patient);
                        }}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} patients
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange?.(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
