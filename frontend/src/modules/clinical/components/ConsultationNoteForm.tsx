/**
 * ConsultationNoteForm - add consultation notes (doctor, nurse)
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationNoteSchema, ConsultationNoteForm } from '../schemas';
import { useCreateConsultationNote } from '../hooks';
import { useCanAddConsultationNote } from '../guards';

interface Props {
  patientId: string;
  visitId?: string | null;
  onSaved?: () => void;
}

export const ConsultationNoteForm: React.FC<Props> = ({ patientId, visitId = null, onSaved }) => {
  const canAdd = useCanAddConsultationNote();
  const { mutateAsync, isLoading } = useCreateConsultationNote();

  const { register, handleSubmit, reset, formState } = useForm<ConsultationNoteForm>({
    resolver: zodResolver(consultationNoteSchema),
    defaultValues: { patientId, clinicianId: '', clinicianRole: 'DOCTOR', visitId, note: '' },
  });

  const onSubmit = async (values: ConsultationNoteForm) => {
    try {
      await mutateAsync(values);
      reset({ ...values, note: '' });
      onSaved?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (!canAdd) {
    return <p className="text-sm text-gray-600">You do not have permission to add consultation notes.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          {...register('note')}
          rows={6}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter consultation notes"
        />
        {formState.errors.note && <p className="text-sm text-red-600">{formState.errors.note.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default ConsultationNoteForm;
