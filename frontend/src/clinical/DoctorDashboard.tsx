import React from 'react';
import { QueueDashboard } from '../visit/QueueDashboard';

export const DoctorDashboard: React.FC = () => {
  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>General Department Queue</h3>
          <QueueDashboard department="GEN" />
        </div>
      </div>
    </div>
  );
};
