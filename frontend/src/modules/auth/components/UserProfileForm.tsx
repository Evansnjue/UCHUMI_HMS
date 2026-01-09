/**
 * User Profile Form
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthUser } from '../hooks';
import { useUpdateProfile } from '../hooks';

const profileSchema = z.object({
  firstName: z.string().min(2, 'auth.validation.first_name_min'),
  lastName: z.string().min(2, 'auth.validation.last_name_min'),
  email: z.string().email('auth.validation.invalid_email'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileFormProps {
  onSuccess?: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSuccess }) => {
  const user = useAuthUser();
  const { mutate: updateProfile, isPending, error, isSuccess } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSuccess && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            disabled={isPending}
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            disabled={isPending}
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          disabled={isPending}
          {...register('email')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(error as any)?.response?.data?.message || 'Failed to update profile.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || !isDirty || isPending}
        className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};
