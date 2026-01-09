/**
 * Visit History Component
 * Display patient's visit history in a tabular format
 */

import React from 'react';
import { PatientVisitDto } from '../types';

interface VisitHistoryComponentProps {
  visits: PatientVisitDto[];
  isLoading?: boolean;
  onRowClick?: (visit: PatientVisitDto) => void;
}

export const VisitHistoryComponent: React.FC<VisitHistoryComponentProps> = ({
  visits,
  isLoading = false,
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">No visits recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Doctor</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr
              key={visit.id}
              onClick={() => onRowClick?.(visit)}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(visit.visitDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{visit.visitType}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{visit.department?.name || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{visit.doctor?.fullName || '-'}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    visit.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : visit.status === 'SCHEDULED'
                        ? 'bg-blue-100 text-blue-800'
                        : visit.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {visit.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 truncate">
                {visit.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
