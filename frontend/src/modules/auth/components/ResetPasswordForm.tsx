/**
 * Password Reset Request Form
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResetPasswordRequest } from '../hooks';

const resetPasswordSchema = z.object({
  email: z.string().email('auth.validation.invalid_email'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: requestReset, isPending, error } = useResetPasswordRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    requestReset(data, {
      onSuccess: () => {
        setSubmitted(true);
        onSuccess?.();
      },
    });
  };

  if (submitted) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-center">
        <p className="text-sm text-green-800">
          If an account exists with this email, you will receive password reset instructions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="your.email@hospital.com"
          disabled={isPending}
          {...register('email')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {(error as any)?.response?.data?.message || 'Failed to send reset email.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};
