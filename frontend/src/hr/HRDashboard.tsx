import React, { useEffect, useState } from 'react';
import { attendanceReport } from './api';

export default function HRDashboard() {
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    const end = new Date().toISOString().substring(0,10);
    const start = end;
    attendanceReport(start, end).then(setReport).catch(() => setReport([]));
  }, []);

  return (
    <div>
      <h2>HR Dashboard</h2>
      <p>Today's overtime and attendance summary</p>
      <table>
        <thead>
          <tr><th>Employee</th><th>Date</th><th>Overtime (s)</th><th>Status</th></tr>
        </thead>
        <tbody>
          {report.map((r: any) => (
            <tr key={r.id}><td>{r.employee?.firstName} {r.employee?.lastName}</td><td>{r.shiftDate}</td><td>{r.overtimeSeconds}</td><td>{r.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
