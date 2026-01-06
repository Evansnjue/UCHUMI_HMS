import React, { useEffect, useState } from 'react';
import { visitHistoryForPatient } from './api';

export const VisitHistory: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => { if (patientId) visitHistoryForPatient(patientId).then(setVisits); }, [patientId]);

  return (
    <div>
      <h3>Visit History</h3>
      <table>
        <thead>
          <tr><th>Visit#</th><th>Department</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {visits.map(v => (
            <tr key={v.id}>
              <td>{v.visitNumber}</td>
              <td>{v.department?.name}</td>
              <td>{v.status?.name}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
