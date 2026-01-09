/**
 * Patient Card Component
 * Displays patient information in card format
 */

import React from 'react';
import { PatientDto, PatientStatus } from '../types';
import { PatientNumbers } from './PatientNumbers';

interface PatientCardProps {
  patient: PatientDto;
  onViewDetails?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewDetails }) => {
  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dateOfBirth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div
      onClick={onViewDetails}
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{patient.fullName}</h3>
          <p className="text-sm text-gray-600">{patient.phone}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            patient.status === PatientStatus.ACTIVE
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {patient.status}
        </span>
      </div>

      {/* Patient Numbers */}
      <div className="mb-3">
        <PatientNumbers patient={patient} compact />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-3 gap-2 text-sm mb-3 pb-3 border-t border-b">
        <div>
          <span className="text-gray-600">Age</span>
          <p className="font-semibold">{age} yrs</p>
        </div>
        <div>
          <span className="text-gray-600">Gender</span>
          <p className="font-semibold">{patient.gender}</p>
        </div>
        <div>
          <span className="text-gray-600">Blood</span>
          <p className="font-semibold">{patient.bloodType}</p>
        </div>
      </div>

      {/* Department */}
      {patient.assignedDepartment && (
        <div className="text-sm mb-3">
          <span className="text-gray-600">Department</span>
          <p className="font-semibold">{patient.assignedDepartment.name}</p>
        </div>
      )}

      {/* Contact */}
      {patient.email && (
        <div className="text-xs text-gray-500">
          Email: {patient.email}
        </div>
      )}
    </div>
  );
};
