import React, { useEffect, useState } from 'react';
import { listPendingPrescriptions } from './api';
import { Link } from 'react-router-dom';

export const PharmacistDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    listPendingPrescriptions().then(setPrescriptions).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Pending Prescriptions</h2>
      <ul>
        {prescriptions.map((p) => (
          <li key={p.id}>
            <Link to={`/pharmacy/fulfill/${p.id}`}>Prescription {p.id}</Link> — by {p?.prescribedBy?.firstName || 'Unknown'} — items: {p.items?.length}
          </li>
        ))}
      </ul>
    </div>
  );
};
