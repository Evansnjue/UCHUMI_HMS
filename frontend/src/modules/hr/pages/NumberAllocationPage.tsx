// File: frontend/src/modules/hr/pages/NumberAllocationPage.tsx
import React, { useState } from 'react';
import { useEmployees, useAllocateEmployeeNumber } from '../hooks/useEmployees';

export const NumberAllocationPage: React.FC = () => {
  const [page] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useEmployees(page, 25, q);
  const allocate = useAllocateEmployeeNumber();

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Employee Number Allocation</h1>
      </header>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="p-2 border rounded w-full" />
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-2">Name</th><th className="p-2">Number</th><th className="p-2">Action</th></tr></thead>
          <tbody>
            {isLoading && (<tr><td colSpan={3} className="p-6 text-center">Loading…</td></tr>)}
            {!isLoading && (data?.items ?? []).map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.firstName} {e.lastName}</td>
                <td className="p-2">{e.employeeNumber ?? '—'}</td>
                <td className="p-2">
                  <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => allocate.mutate(e.id)} disabled={Boolean(e.employeeNumber) || allocate.status === 'pending'}>Allocate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NumberAllocationPage;
