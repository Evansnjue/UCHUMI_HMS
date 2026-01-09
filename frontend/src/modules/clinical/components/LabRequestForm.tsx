/**
 * LabRequestForm - create lab requests
 */
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { labRequestSchema, LabRequestForm } from '../schemas';
import { useCreateLabRequest } from '../hooks';
import { useCanCreateLabRequest } from '../guards';

interface Props {
  patientId: string;
  clinicianId: string;
  onSaved?: () => void;
}

export const LabRequestForm: React.FC<Props> = ({ patientId, clinicianId, onSaved }) => {
  const canCreate = useCanCreateLabRequest();
  const mutation = useCreateLabRequest();

  const { register, control, handleSubmit, reset, formState } = useForm<LabRequestForm>({
    resolver: zodResolver(labRequestSchema),
    defaultValues: { patientId, clinicianId, tests: [], priority: 'ROUTINE', notes: '' },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'tests' });

  const onSubmit = async (values: LabRequestForm) => {
    try {
      await mutation.mutateAsync(values as any);
      reset({ patientId, clinicianId, tests: [], priority: 'ROUTINE', notes: '' });
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to submit lab request');
    }
  };

  if (!canCreate) {
    return <p className="text-sm text-gray-600">You are not authorized to create lab requests.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tests</label>
        <div className="space-y-2">
          {fields.map((f, idx) => (
            <div key={f.id} className="flex gap-2">
              <input {...register(`tests.${idx}.code` as const)} placeholder="Code" className="px-2 py-1 border rounded" />
              <input {...register(`tests.${idx}.name` as const)} placeholder="Test name" className="px-2 py-1 border rounded flex-1" />
              <button type="button" onClick={() => remove(idx)} className="text-red-600">Remove</button>
            </div>
          ))}

          <button type="button" onClick={() => append({ code: `T${Date.now()}`, name: '' })} className="px-3 py-1 bg-gray-100 rounded">
            + Add test
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select {...register('priority')} className="px-3 py-2 border rounded">
          <option value="ROUTINE">Routine</option>
          <option value="STAT">Stat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea {...register('notes')} rows={3} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={mutation.isLoading} className="px-4 py-2 bg-yellow-600 text-white rounded">
          {mutation.isLoading ? 'Submitting...' : 'Submit Lab Request'}
        </button>
      </div>

      {formState.errors && <div className="text-red-600 text-sm">{JSON.stringify(formState.errors)}</div>}
    </form>
  );
};

export default LabRequestForm;
