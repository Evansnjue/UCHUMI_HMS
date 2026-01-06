import React, { useState } from 'react';
import { attendanceReport } from './api';

export default function AttendanceReport() {
  const [rows, setRows] = useState<any[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const run = async () => {
    const res = await attendanceReport(start, end);
    setRows(res);
  };

  return (
    <div>
      <h3>Attendance Report</h3>
      <div>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button onClick={run}>Run</button>
      </div>
      <table>
        <thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>Overtime</th></tr></thead>
        <tbody>
          {rows.map((r: any) => <tr key={r.id}><td>{r.employee?.firstName} {r.employee?.lastName}</td><td>{r.shiftDate}</td><td>{r.status}</td><td>{r.overtimeSeconds}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
