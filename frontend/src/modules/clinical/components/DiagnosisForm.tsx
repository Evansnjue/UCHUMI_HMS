/**
 * DiagnosisForm - create a diagnosis linked to a consultation
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diagnosisSchema, DiagnosisForm } from '../schemas';
import { useCreateDiagnosis } from '../hooks';
import { useIsDoctor, useIsAdmin } from '../guards';

interface Props {
  consultationId: string;
  clinicianId: string;
  onSaved?: () => void;
}

export const DiagnosisForm: React.FC<Props> = ({ consultationId, clinicianId, onSaved }) => {
  const isDoctor = useIsDoctor();
  const isAdmin = useIsAdmin();
  const canEdit = isDoctor || isAdmin;
  const { mutateAsync, isLoading } = useCreateDiagnosis();

  const { register, handleSubmit, formState, reset } = useForm<DiagnosisForm>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: { consultationId, clinicianId, icd10Code: '', description: '' },
  });

  const onSubmit = async (values: DiagnosisForm) => {
    try {
      await mutateAsync(values);
      reset({ ...values, description: '' });
      onSaved?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (!canEdit) {
    return <p className="text-sm text-gray-600">Only doctors or admins may add diagnoses.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ICD-10 Code (optional)</label>
        <input {...register('icd10Code')} className="w-full mt-1 px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} rows={4} className="w-full mt-1 px-3 py-2 border rounded" />
        {formState.errors.description && <p className="text-sm text-red-600">{formState.errors.description.message}</p>}
      </div>
      <div className="flex justify-end">
        <button disabled={isLoading} type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          {isLoading ? 'Saving...' : 'Add Diagnosis'}
        </button>
      </div>
    </form>
  );
};

export default DiagnosisForm;
