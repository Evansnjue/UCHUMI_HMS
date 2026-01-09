import React from 'react';
import ConsultationNoteForm from '../components/ConsultationNoteForm';
import DiagnosisForm from '../components/DiagnosisForm';
import PrescriptionForm from '../components/PrescriptionForm';
import LabRequestForm from '../components/LabRequestForm';

interface Props {
  patientId: string;
  clinicianId: string;
}

export const ConsultationPage: React.FC<Props> = ({ patientId, clinicianId }) => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Consultation: {patientId}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add Consultation Note</h3>
          <ConsultationNoteForm patientId={patientId} clinicianId={clinicianId} onSaved={() => {}} />
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add Diagnosis</h3>
          <DiagnosisForm patientId={patientId} clinicianId={clinicianId} onSaved={() => {}} />
        </section>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Create Prescription</h3>
        <PrescriptionForm patientId={patientId} clinicianId={clinicianId} onSaved={() => {}} />
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Request Labs</h3>
        <LabRequestForm patientId={patientId} clinicianId={clinicianId} onSaved={() => {}} />
      </section>
    </div>
  );
};

export default ConsultationPage;
