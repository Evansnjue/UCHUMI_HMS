import React, { useState } from 'react';
import { generatePayroll } from './api';

export default function PayrollReport() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [rows, setRows] = useState<any[]>([]);

  const run = async () => {
    const res = await generatePayroll({ periodStart: start, periodEnd: end });
    setRows(res);
  };

  return (
    <div>
      <h3>Payroll</h3>
      <div>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button onClick={run}>Generate</button>
      </div>
      <table>
        <thead><tr><th>Employee</th><th>Gross</th><th>Deductions</th><th>Net</th></tr></thead>
        <tbody>
          {rows.map((r: any) => <tr key={r.id}><td>{r.employee?.firstName}</td><td>{r.grossPay}</td><td>{r.deductions}</td><td>{r.netPay}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
