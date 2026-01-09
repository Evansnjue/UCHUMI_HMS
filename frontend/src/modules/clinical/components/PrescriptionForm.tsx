/**
 * PrescriptionForm - create a prescription with multiple lines
 * Enforces immutability and drug category limits at UI level (best-effort)
 */
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  prescriptionSchema,
  PrescriptionForm,
  prescriptionLineSchema,
  PrescriptionLineForm,
} from '../schemas';
import { useCreatePrescription, useDrugDailyLimits } from '../hooks';
import { useCanCreatePrescription, useCanPrescribeCategory } from '../guards';
import { DrugCategory } from '../types/clinical.dto';

interface Props {
  patientId: string;
  clinicianId: string;
  onSaved?: () => void;
}

export const PrescriptionForm: React.FC<Props> = ({ patientId, clinicianId, onSaved }) => {
  const canCreate = useCanCreatePrescription();
  const { data: limits } = useDrugDailyLimits();
  const createMutation = useCreatePrescription();

  const { register, control, handleSubmit, formState, reset } = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { patientId, clinicianId, lines: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

  const onSubmit = async (values: PrescriptionForm) => {
    try {
      // best-effort check for blocked categories
      for (const line of values.lines) {
        const { allowed, reason } = useCanPrescribeCategory(line.drugCategory);
        if (!allowed) throw new Error(reason || 'Not allowed to prescribe this category');
      }

      await createMutation.mutateAsync(values);
      reset({ patientId, clinicianId, lines: [] });
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to create prescription');
    }
  };

  if (!canCreate) {
    return <p className="text-sm text-gray-600">You are not authorized to create prescriptions.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        {fields.map((f, idx) => (
          <div key={f.id} className="p-3 border rounded bg-gray-50">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Drug Name</label>
                <input {...register(`lines.${idx}.drugName` as const)} className="w-full mt-1 px-2 py-1 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Category</label>
                <select {...register(`lines.${idx}.drugCategory` as const)} className="w-full mt-1 px-2 py-1 border rounded">
                  {Object.values(DrugCategory).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Dose & Frequency</label>
                <input {...register(`lines.${idx}.dose` as const)} placeholder="e.g., 500mg" className="w-full mt-1 px-2 py-1 border rounded" />
                <input {...register(`lines.${idx}.frequency` as const)} placeholder="e.g., BID" className="w-full mt-1 px-2 py-1 border rounded" />
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-2">
                <input type="number" {...register(`lines.${idx}.durationDays` as const)} placeholder="Days" className="w-24 px-2 py-1 border rounded" />
                <input {...register(`lines.${idx}.instructions` as const)} placeholder="Instructions (optional)" className="px-2 py-1 border rounded" />
              </div>
              <button type="button" onClick={() => remove(idx)} className="text-red-600">Remove</button>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={() =>
              append({
                drugId: crypto.randomUUID(),
                drugName: '',
                drugCategory: DrugCategory.OTHER,
                dose: '',
                frequency: '',
                durationDays: 1,
              } as unknown as PrescriptionLineForm)
            }
            className="px-3 py-1 bg-gray-100 rounded"
          >
            + Add line
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={createMutation.isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {createMutation.isLoading ? 'Submitting...' : 'Submit Prescription'}
        </button>
      </div>

      {formState.errors && (
        <div className="text-red-600 text-sm">
          {JSON.stringify(formState.errors)}
        </div>
      )}
    </form>
  );
};

export default PrescriptionForm;
