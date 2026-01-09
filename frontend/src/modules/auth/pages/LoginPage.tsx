/**
 * Login Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management System</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg bg-white p-8 shadow">
          <LoginForm />
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm">
          <Link
            to="/auth/reset-password"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};
