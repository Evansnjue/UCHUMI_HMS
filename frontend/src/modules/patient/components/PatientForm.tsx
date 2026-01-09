/**
 * Patient Form Component
 * Comprehensive form for creating and editing patients
 */

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientRegistrationSchema, PatientRegistrationFormData } from '../schemas';
import { PatientDto, Gender, BloodType, MaritalStatus, DepartmentDto } from '../types';
import { useDepartments } from '../hooks';

interface PatientFormProps {
  patient?: PatientDto;
  readOnly?: boolean;
  editableFields?: string[];
  onSubmit: (data: PatientRegistrationFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string;
  departments?: DepartmentDto[];
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  readOnly = false,
  editableFields,
  onSubmit,
  isSubmitting = false,
  error,
  departments = [],
}) => {
  const { data: depts, isLoading: deptsLoading } = useDepartments();
  const allDepartments = departments.length > 0 ? departments : (depts || []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PatientRegistrationFormData>({
    resolver: zodResolver(patientRegistrationSchema),
    mode: 'onChange',
    defaultValues: patient
      ? {
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email || '',
          phone: patient.phone,
          alternatePhone: patient.alternatePhone || '',
          dateOfBirth: patient.dateOfBirth.split('T')[0],
          gender: patient.gender,
          bloodType: patient.bloodType,
          maritalStatus: patient.maritalStatus,
          nationality: patient.nationality || '',
          address: patient.address,
          city: patient.city,
          state: patient.state,
          postalCode: patient.postalCode,
          country: patient.country,
          emergencyContactName: patient.emergencyContactName || '',
          emergencyContactPhone: patient.emergencyContactPhone || '',
          emergencyContactRelation: patient.emergencyContactRelation || '',
          allergies: patient.allergies || '',
          chronicDiseases: patient.chronicDiseases || '',
          medications: patient.medications || '',
          notes: patient.notes || '',
          assignedDepartmentId: patient.assignedDepartmentId || '',
        }
      : undefined,
  });

  const isFieldEditable = (fieldName: string): boolean => {
    if (!readOnly) return true;
    if (!editableFields) return false;
    return editableFields.includes(fieldName);
  };

  const renderField = (
    label: string,
    fieldName: keyof PatientRegistrationFormData,
    type: string = 'text',
    placeholder?: string,
    required: boolean = true
  ) => {
    const isEditable = isFieldEditable(fieldName);
    const inputProps = {
      disabled: isSubmitting || !isEditable,
      className: `w-full px-3 py-2 border rounded-md ${
        errors[fieldName]
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 bg-white'
      } ${isSubmitting || !isEditable ? 'bg-gray-100 text-gray-500' : ''}`,
      placeholder,
    };

    return (
      <div key={fieldName}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        <input
          type={type}
          {...register(fieldName)}
          {...inputProps}
        />
        {errors[fieldName] && (
          <p className="mt-1 text-sm text-red-600">{errors[fieldName]?.message}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderField('First Name', 'firstName')}
          {renderField('Last Name', 'lastName')}
          {renderField('Email', 'email', 'email', undefined, false)}
          {renderField('Phone', 'phone')}
          {renderField('Alternate Phone', 'alternatePhone', 'tel', undefined, false)}
          {renderField('Date of Birth', 'dateOfBirth', 'date')}
          {renderField('Nationality', 'nationality', 'text', undefined, false)}

          {/* Gender Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-600">*</span>
            </label>
            <select
              {...register('gender')}
              disabled={isSubmitting || !isFieldEditable('gender')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">Select gender</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
              <option value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
          </div>

          {/* Blood Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type <span className="text-red-600">*</span>
            </label>
            <select
              {...register('bloodType')}
              disabled={isSubmitting || !isFieldEditable('bloodType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">Select blood type</option>
              <option value={BloodType.O_POSITIVE}>O+</option>
              <option value={BloodType.O_NEGATIVE}>O-</option>
              <option value={BloodType.A_POSITIVE}>A+</option>
              <option value={BloodType.A_NEGATIVE}>A-</option>
              <option value={BloodType.B_POSITIVE}>B+</option>
              <option value={BloodType.B_NEGATIVE}>B-</option>
              <option value={BloodType.AB_POSITIVE}>AB+</option>
              <option value={BloodType.AB_NEGATIVE}>AB-</option>
              <option value={BloodType.UNKNOWN}>Unknown</option>
            </select>
            {errors.bloodType && (
              <p className="mt-1 text-sm text-red-600">{errors.bloodType.message}</p>
            )}
          </div>

          {/* Marital Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status <span className="text-red-600">*</span>
            </label>
            <select
              {...register('maritalStatus')}
              disabled={isSubmitting || !isFieldEditable('maritalStatus')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">Select status</option>
              <option value={MaritalStatus.SINGLE}>Single</option>
              <option value={MaritalStatus.MARRIED}>Married</option>
              <option value={MaritalStatus.DIVORCED}>Divorced</option>
              <option value={MaritalStatus.WIDOWED}>Widowed</option>
              <option value={MaritalStatus.PREFER_NOT_TO_SAY}>Prefer not to say</option>
            </select>
            {errors.maritalStatus && (
              <p className="mt-1 text-sm text-red-600">{errors.maritalStatus.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderField('Address', 'address')}
          {renderField('City', 'city')}
          {renderField('State', 'state')}
          {renderField('Postal Code', 'postalCode')}
          {renderField('Country', 'country')}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderField('Emergency Contact Name', 'emergencyContactName', 'text', undefined, false)}
          {renderField('Emergency Contact Phone', 'emergencyContactPhone', 'tel', undefined, false)}
          {renderField('Relation', 'emergencyContactRelation', 'text', undefined, false)}
        </div>
      </div>

      {/* Medical Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
            <textarea
              {...register('allergies')}
              disabled={isSubmitting || !isFieldEditable('allergies')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              placeholder="List any allergies..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chronic Diseases
            </label>
            <textarea
              {...register('chronicDiseases')}
              disabled={isSubmitting || !isFieldEditable('chronicDiseases')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              placeholder="List any chronic diseases..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
            <textarea
              {...register('medications')}
              disabled={isSubmitting || !isFieldEditable('medications')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              placeholder="List current medications..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              {...register('notes')}
              disabled={isSubmitting || !isFieldEditable('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Department Assignment */}
      {isFieldEditable('assignedDepartmentId') && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Assignment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Department
            </label>
            <select
              {...register('assignedDepartmentId')}
              disabled={isSubmitting || deptsLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">Select department</option>
              {allDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.assignedDepartmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedDepartmentId.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!readOnly && (
        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : patient ? 'Update Patient' : 'Register Patient'}
          </button>
        </div>
      )}
    </form>
  );
};
