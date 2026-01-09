/**
 * Password Reset Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '../components';

export const PasswordResetPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {/* Reset Form */}
        <div className="rounded-lg bg-white p-8 shadow">
          <ResetPasswordForm />
        </div>

        {/* Footer Link */}
        <div className="text-center text-sm">
          <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
