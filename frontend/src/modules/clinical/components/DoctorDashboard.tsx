/**
 * DoctorDashboard - compact dashboard widget for clinicians
 */
import React from 'react';
import { useDashboard } from '../hooks';
import { useAuthUser } from '@modules/auth';

export const DoctorDashboard: React.FC = () => {
  const user = useAuthUser();
  const clinicianId = user?.id || '';
  const { data, isLoading, isError } = useDashboard(clinicianId);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-red-600 font-semibold">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="text-sm text-gray-600 mt-1">Overview for today</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{data.assignedPatientsCount}</p>
          <p className="text-sm text-gray-500">Assigned patients</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Today's Appointments</p>
          <p className="font-semibold">{data.todaysAppointments.length}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Pending Lab Results</p>
          <p className="font-semibold">{data.pendingLabResultsCount}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Recent Prescriptions</p>
          <p className="font-semibold">{data.recentPrescriptions.length}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Upcoming</h3>
        <ul className="divide-y divide-gray-100">
          {data.todaysAppointments.slice(0, 5).map((a) => (
            <li key={a.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{a.patientName}</p>
                <p className="text-sm text-gray-600">{a.time} • {a.visitType}</p>
              </div>
            </li>
          ))}
          {data.todaysAppointments.length === 0 && (
            <li className="py-3 text-gray-500 italic">No appointments today</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
