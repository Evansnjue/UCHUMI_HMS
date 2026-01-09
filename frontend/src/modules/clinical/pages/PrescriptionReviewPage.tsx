import React from 'react';
import { usePrescriptions } from '../hooks';

interface Props {
  patientId: string;
}

export const PrescriptionReviewPage: React.FC<Props> = ({ patientId }) => {
  const { data, isLoading, error } = usePrescriptions(patientId);

  if (isLoading) return <div className="p-4">Loading prescriptions...</div>;
  if (error) return <div className="p-4 text-red-600">Failed to load prescriptions</div>;

  const prescriptions = data?.data || [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Prescriptions</h2>
      <div className="mt-4 space-y-3">
        {prescriptions.length === 0 && <div className="text-sm text-gray-600">No prescriptions found.</div>}
        {prescriptions.map((p) => (
          <div key={p.id} className="p-3 bg-white rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{p.createdAt}</div>
                <div className="text-sm text-gray-600">Status: {p.status}</div>
              </div>
            </div>

            <ul className="mt-2">
              {p.lines.map((l) => (
                <li key={l.drugId} className="flex justify-between text-sm">
                  <span>{l.drugName} ({l.drugCategory})</span>
                  <span>{l.dose} x {l.frequency}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionReviewPage;
