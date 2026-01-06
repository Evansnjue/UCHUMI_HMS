import React, { useEffect, useState } from 'react';
import { listReports } from './api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportingDashboard() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const end = new Date().toISOString().substring(0,10);
    const start = end;
    listReports(undefined, start, end).then(setReports).catch(() => setReports([]));
  }, []);

  const latest = reports.slice(0,10);

  return (
    <div>
      <h2>Reporting Dashboard</h2>
      <p>KPIs & recent reports</p>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={latest.map(r => ({ name: r.generated_at?.substring(0,10), revenue: r.payload?.kpis?.revenue || 0 }))}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h3>Recent reports</h3>
      <ul>
        {reports.map(r => <li key={r.id}>{r.name} — {r.periodStart} to {r.periodEnd} — {r.status}</li>)}
      </ul>
    </div>
  );
}
