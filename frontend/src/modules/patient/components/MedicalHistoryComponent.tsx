/**
 * Medical History Component
 * Display patient's medical history in a timeline or list format
 */

import React from 'react';
import { PatientMedicalHistoryDto } from '../types';

interface MedicalHistoryComponentProps {
  histories: PatientMedicalHistoryDto[];
  isLoading?: boolean;
  onRowClick?: (history: PatientMedicalHistoryDto) => void;
}

export const MedicalHistoryComponent: React.FC<MedicalHistoryComponentProps> = ({
  histories,
  isLoading = false,
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">No medical history recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {histories.map((history, index) => (
        <div
          key={history.id}
          className="border-l-4 border-blue-500 pl-4 py-4 bg-white rounded-lg hover:shadow-md cursor-pointer transition-shadow"
          onClick={() => onRowClick?.(history)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{history.diagnosis}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {history.department?.name && (
                  <>
                    <span className="font-medium">{history.department.name}</span>
                    {history.doctor?.fullName && <span> • {history.doctor.fullName}</span>}
                  </>
                )}
              </p>

              {history.notes && (
                <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded p-3">
                  {history.notes}
                </p>
              )}

              {history.treatment && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Treatment Plan:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                    {history.treatment}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right ml-4">
              <p className="text-xs font-medium text-gray-600">
                {new Date(history.recordedDate).toLocaleDateString()}
              </p>
              {history.resolvedDate && (
                <p className="text-xs text-green-600 mt-1">
                  Resolved: {new Date(history.resolvedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {(history.isActive || history.isCritical) && (
            <div className="flex gap-2 mt-3">
              {history.isActive && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                  Ongoing
                </span>
              )}
              {history.isCritical && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                  Critical
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
