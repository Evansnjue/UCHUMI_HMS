// File: frontend/src/modules/hr/components/EmployeeTable.tsx
import React from 'react';
import type { Employee } from '../types';
import { useAllocateEmployeeNumber } from '../hooks/useEmployees';
import { useHasRole } from '../rbac/hrAuth';

type Props = {
  employees: Employee[];
  loading: boolean;
  onSelect?: (id: string) => void;
};

export const EmployeeTable: React.FC<Props> = ({ employees, loading, onSelect }) => {
  const allocate = useAllocateEmployeeNumber();
  const canManage = useHasRole(['HR Officer', 'Admin']);

  return (
    <div className="bg-white shadow-sm rounded-md overflow-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Employee #</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Start Date</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                Loading…
              </td>
            </tr>
          )}
          {!loading && employees.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
          {employees.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.firstName} {e.lastName}</td>
              <td className="p-3">{e.employeeNumber ?? '—'}</td>
              <td className="p-3">{e.department}</td>
              <td className="p-3">{e.position}</td>
              <td className="p-3">{new Date(e.startDate).toLocaleDateString()}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-sky-600 text-white disabled:opacity-50"
                    onClick={() => onSelect?.(e.id)}
                  >
                    View
                  </button>
                  {canManage && (
                    <button
                      className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-50"
                      onClick={() => allocate.mutate(e.id)}
                      disabled={Boolean(e.employeeNumber) || allocate.status === 'pending'}
                    >
                      {e.employeeNumber ? 'Allocated' : 'Allocate #'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
