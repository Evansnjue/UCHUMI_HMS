/**
 * Unauthorized Page
 * Shown when user lacks required permissions
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-900">Access Denied</p>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this resource.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
};
