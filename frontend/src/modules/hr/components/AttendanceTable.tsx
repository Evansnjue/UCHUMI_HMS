// File: frontend/src/modules/hr/components/AttendanceTable.tsx
import React from 'react';
import type { AttendanceRecord } from '../types';
import { useApproveAttendance } from '../hooks/useAttendance';
import { useHasRole } from '../rbac/hrAuth';

type Props = {
  records: AttendanceRecord[];
  loading: boolean;
};

export const AttendanceTable: React.FC<Props> = ({ records, loading }) => {
  const approve = useApproveAttendance();
  const canManage = useHasRole(['HR Officer', 'Admin']);

  return (
    <div className="bg-white shadow-sm rounded-md overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Employee ID</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Late / OT</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">Loading…</td>
            </tr>
          )}
          {!loading && records.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">No attendance records.</td>
            </tr>
          )}
          {records.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.employeeId}</td>
              <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-3">{r.checkIn ?? '—'}</td>
              <td className="p-3">{r.checkOut ?? '—'}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">{r.lateMinutes}m / {r.overtimeMinutes}m</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-50"
                    onClick={() => approve.mutate(r.id)}
                    disabled={!canManage || r.status === 'APPROVED' || approve.status === 'pending'}
                    title={r.status === 'APPROVED' ? 'Attendance immutable after approval' : undefined}
                  >
                    Approve
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
