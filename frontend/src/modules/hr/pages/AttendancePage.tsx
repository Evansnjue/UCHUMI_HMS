// File: frontend/src/modules/hr/pages/AttendancePage.tsx
import React, { useState } from 'react';
import { useAttendance, useRecordAttendance } from '../hooks/useAttendance';
import AttendanceTable from '../components/AttendanceTable';

export const AttendancePage: React.FC = () => {
  const [page] = useState(1);
  const { data, isLoading } = useAttendance(page, 50);
  const record = useRecordAttendance();

  async function handleRecord(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const dto = {
      employeeId: fd.get('employeeId') as string,
      date: fd.get('date') as string,
      checkIn: fd.get('checkIn') as string || null,
      checkOut: fd.get('checkOut') as string || null,
    };
    await record.mutateAsync(dto);
    form.reset();
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Attendance</h1>
      </header>
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AttendanceTable records={data?.items ?? []} loading={isLoading} />
        </div>
        <aside className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-3">Record attendance</h2>
          <form onSubmit={handleRecord} className="space-y-3">
            <input name="employeeId" placeholder="Employee ID" className="w-full p-2 border rounded" required />
            <input name="date" type="date" className="w-full p-2 border rounded" required />
            <input name="checkIn" type="time" className="w-full p-2 border rounded" />
            <input name="checkOut" type="time" className="w-full p-2 border rounded" />
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Record</button>
          </form>
        </aside>
      </section>
    </div>
  );
};

export default AttendancePage;
