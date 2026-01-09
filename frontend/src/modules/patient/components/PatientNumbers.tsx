/**
 * Patient Numbers Display Component
 * Shows OPD and IPD numbers with visual indicators
 */

import React from 'react';
import { PatientDto } from '../types';

interface PatientNumbersProps {
  patient: PatientDto;
  compact?: boolean;
}

export const PatientNumbers: React.FC<PatientNumbersProps> = ({ patient, compact = false }) => {
  if (compact) {
    return (
      <div className="flex gap-2 text-sm">
        {patient.opdNumber && (
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-mono text-xs">
            OPD: {patient.opdNumber}
          </span>
        )}
        {patient.ipdNumber && (
          <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-mono text-xs">
            IPD: {patient.ipdNumber}
          </span>
        )}
        {!patient.opdNumber && !patient.ipdNumber && (
          <span className="text-gray-500 text-xs italic">No numbers assigned</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          OPD Number
        </label>
        {patient.opdNumber ? (
          <div className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded font-mono font-semibold text-blue-900">
            {patient.opdNumber}
          </div>
        ) : (
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-500 italic">
            Not assigned
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          IPD Number
        </label>
        {patient.ipdNumber ? (
          <div className="px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded font-mono font-semibold text-purple-900">
            {patient.ipdNumber}
          </div>
        ) : (
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded text-gray-500 italic">
            Not assigned
          </div>
        )}
      </div>
    </div>
  );
};
