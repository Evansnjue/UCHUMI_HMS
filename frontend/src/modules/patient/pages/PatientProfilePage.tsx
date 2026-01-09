/**
 * Patient Profile Page
 * View detailed patient information
 */

import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  usePatientById,
  usePatientVisits,
  usePatientMedicalHistory,
  usePatientPrescriptions,
} from '../hooks';
import { PatientNumbers } from '../components';
import {
  useCanEditPatient,
  useCanViewMedicalInfo,
  useCanViewVisitHistory,
} from '../guards';
import { PatientStatus } from '../types';

export const PatientProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canEdit = useCanEditPatient();
  const canViewMedicalInfo = useCanViewMedicalInfo();
  const canViewVisitHistory = useCanViewVisitHistory();

  const { data: patient, isLoading: patientLoading } = usePatientById(id || '');
  const { data: visits = [] } = usePatientVisits(id || '', { enabled: canViewVisitHistory });
  const { data: medicalHistory = [] } = usePatientMedicalHistory(id || '', {
    enabled: canViewMedicalInfo,
  });
  const { data: prescriptions = [] } = usePatientPrescriptions(id || '');

  const age = useMemo(() => {
    if (!patient) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(patient.dateOfBirth).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  }, [patient]);

  if (patientLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.fullName}</h1>
          <p className="text-gray-600 mt-2">
            {age} years old • {patient.gender} • {patient.bloodType} Blood Type
          </p>
        </div>
        <div className="flex gap-2">
          {canEdit && patient.status === PatientStatus.ACTIVE && (
            <button
              onClick={() => navigate(`/patient/register/${patient.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          <span
            className={`px-4 py-2 rounded-lg font-semibold ${
              patient.status === PatientStatus.ACTIVE
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Patient Numbers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Numbers</h2>
            <PatientNumbers patient={patient} />
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">{patient.phone}</p>
              </div>
              {patient.email && (
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold break-all">{patient.email}</p>
                </div>
              )}
              {patient.alternatePhone && (
                <div>
                  <p className="text-gray-600">Alternate Phone</p>
                  <p className="font-semibold">{patient.alternatePhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-1 text-sm">
              <p>{patient.address}</p>
              <p>{patient.city}, {patient.state} {patient.postalCode}</p>
              <p>{patient.country}</p>
            </div>
          </div>

          {/* Emergency Contact Card */}
          {patient.emergencyContactName && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-semibold">{patient.emergencyContactName}</p>
                </div>
                {patient.emergencyContactPhone && (
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{patient.emergencyContactPhone}</p>
                  </div>
                )}
                {patient.emergencyContactRelation && (
                  <div>
                    <p className="text-gray-600">Relation</p>
                    <p className="font-semibold">{patient.emergencyContactRelation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Medical Information */}
          {canViewMedicalInfo && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
              <div className="space-y-4">
                {patient.allergies && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Allergies</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{patient.allergies}</p>
                  </div>
                )}
                {patient.chronicDiseases && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Chronic Diseases</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{patient.chronicDiseases}</p>
                  </div>
                )}
                {patient.medications && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Current Medications</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{patient.medications}</p>
                  </div>
                )}
                {patient.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Additional Notes</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{patient.notes}</p>
                  </div>
                )}
                {!patient.allergies &&
                  !patient.chronicDiseases &&
                  !patient.medications &&
                  !patient.notes && (
                    <p className="text-gray-500 italic">No medical information recorded</p>
                  )}
              </div>
            </div>
          )}

          {/* Visit History */}
          {canViewVisitHistory && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits</h2>
              {visits.length > 0 ? (
                <div className="space-y-3">
                  {visits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{visit.visitType}</p>
                          <p className="text-sm text-gray-600">{visit.department?.name}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            visit.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No visits recorded</p>
              )}
            </div>
          )}

          {/* Department Assignment */}
          {patient.assignedDepartment && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Department</h2>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="font-semibold text-blue-900">{patient.assignedDepartment.name}</p>
                {patient.assignedDepartment.description && (
                  <p className="text-sm text-blue-700 mt-2">{patient.assignedDepartment.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
