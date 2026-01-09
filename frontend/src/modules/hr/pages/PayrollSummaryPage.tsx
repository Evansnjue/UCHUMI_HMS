// File: frontend/src/modules/hr/pages/PayrollSummaryPage.tsx
import React, { useState } from 'react';
import { usePayrollSummary } from '../hooks/usePayroll';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const PayrollSummaryPage: React.FC = () => {
  const [start, setStart] = useState(() => new Date().toISOString().slice(0,10));
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0,10));
  const { data, isLoading } = usePayrollSummary(start, end);

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Payroll Summary</h1>
      </header>
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="p-2 border rounded" />
        </div>
        {isLoading && <div className="p-4 text-gray-600">Loading…</div>}
        {!isLoading && data && (
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.map(d => ({ name: d.employeeNumber ?? d.employeeId, hours: d.totalHours }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#0ea5a4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="p-2">Employee</th><th className="p-2">Hours</th><th className="p-2">Overtime</th><th className="p-2">Late (min)</th><th className="p-2">Est. Pay</th></tr></thead>
                <tbody>
                  {data.map(d => (
                    <tr key={d.employeeId} className="border-t"><td className="p-2">{d.employeeNumber ?? d.employeeId}</td><td className="p-2">{d.totalHours}</td><td className="p-2">{d.totalOvertime}</td><td className="p-2">{d.totalLateMinutes}</td><td className="p-2">${d.grossPayEstimate.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollSummaryPage;
