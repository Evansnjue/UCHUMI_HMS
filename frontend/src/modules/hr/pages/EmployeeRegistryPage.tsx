// File: frontend/src/modules/hr/pages/EmployeeRegistryPage.tsx
import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';

export const EmployeeRegistryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useEmployees(page, 25, q);

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employee Registry</h1>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-3 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name…"
              className="p-2 border rounded flex-1"
            />
          </div>
          <EmployeeTable employees={data?.items ?? []} loading={isLoading} />
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-600">Total: {data?.total ?? '—'}</div>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded border">Prev</button>
              <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border">Next</button>
            </div>
          </div>
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-3">Create employee</h2>
          <EmployeeForm onCreated={() => setPage(1)} />
        </aside>
      </section>
    </div>
  );
};

export default EmployeeRegistryPage;
