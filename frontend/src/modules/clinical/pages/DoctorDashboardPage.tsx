import React from 'react';
import DoctorDashboard from '../components/DoctorDashboard';
import DrugLimitsViewer from '../components/DrugLimitsViewer';

interface Props {
  clinicianId?: string;
}

export const DoctorDashboardPage: React.FC<Props> = ({ clinicianId }) => {
  // clinicianId should normally come from auth; accept prop for flexibility/testing
  if (!clinicianId) return <div className="p-4">Clinician not specified.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <DoctorDashboard clinicianId={clinicianId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DrugLimitsViewer clinicianId={clinicianId} />
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
