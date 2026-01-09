// File: frontend/src/modules/hr/components/EmployeeForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeCreateSchema } from '../schemas/employee.schema';
import type { EmployeeCreateSchema } from '../schemas/employee.schema';
import { useCreateEmployee } from '../hooks/useEmployees';

type Props = { onCreated?: () => void };

export const EmployeeForm: React.FC<Props> = ({ onCreated }) => {
  const { register, handleSubmit, formState } = useForm<EmployeeCreateSchema>({ resolver: zodResolver(employeeCreateSchema) });
  const create = useCreateEmployee();

  async function onSubmit(values: EmployeeCreateSchema) {
    await create.mutateAsync(values);
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">First name</span>
          <input {...register('firstName')} className="mt-1 p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Last name</span>
          <input {...register('lastName')} className="mt-1 p-2 border rounded" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Department</span>
          <input {...register('department')} className="mt-1 p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Position</span>
          <input {...register('position')} className="mt-1 p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Start Date</span>
          <input {...register('startDate')} type="date" className="mt-1 p-2 border rounded" />
        </label>
      </div>
      <div>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Date of Birth</span>
          <input {...register('dateOfBirth')} type="date" className="mt-1 p-2 border rounded" />
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded" disabled={formState.isSubmitting}>
          Create
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
