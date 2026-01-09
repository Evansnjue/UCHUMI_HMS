/**
 * Patient Registration Page
 * Create or edit a patient
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PatientForm } from '../components';
import {
  usePatientById,
  useCreatePatient,
  useUpdatePatient,
} from '../hooks';
import { PatientRegistrationFormData } from '../schemas';
import {
  useCanCreatePatient,
  useCanEditPatient,
  isPatientEditable,
  getEditableFields,
} from '../guards';
import { useAuthUser } from '@modules/auth';

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const user = useAuthUser();
  const canCreate = useCanCreatePatient();
  const canEdit = useCanEditPatient();

  const { data: patient, isLoading: patientLoading } = usePatientById(id || '', {
    enabled: !!id,
  });

  const { mutateAsync: createPatient, isPending: isCreating, error: createError } =
    useCreatePatient();
  const { mutateAsync: updatePatient, isPending: isUpdating, error: updateError } =
    useUpdatePatient(id || '');

  const isLoading = patientLoading;
  const isSubmitting = isCreating || isUpdating;
  const error = createError || updateError;

  // Check permissions
  if (!id && !canCreate) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">You don't have permission to register patients.</p>
      </div>
    );
  }

  if (id && !canEdit) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">You don't have permission to edit patients.</p>
      </div>
    );
  }

  const handleSubmit = async (data: PatientRegistrationFormData) => {
    try {
      if (id) {
        await updatePatient(data);
        navigate(`/patient/profile/${id}`, { state: { updated: true } });
      } else {
        const newPatient = await createPatient(data);
        navigate(`/patient/profile/${newPatient.id}`, { state: { created: true } });
      }
    } catch (err) {
      console.error('Error saving patient:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const isReadOnly = id && patient && !isPatientEditable(patient);
  const editableFields = user && id ? getEditableFields(user.roles[0]?.code || '') : undefined;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Patient' : 'Register New Patient'}
        </h1>
        <p className="text-gray-600 mt-2">
          {id
            ? 'Update patient information'
            : 'Enter patient details to create a new patient record'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PatientForm
          patient={patient}
          readOnly={isReadOnly}
          editableFields={editableFields}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error ? (error as any).response?.data?.message : undefined}
        />
      </div>
    </div>
  );
};
