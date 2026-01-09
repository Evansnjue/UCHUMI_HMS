/**
 * Session Timeout Warning Modal
 * Warns user before session expires and allows them to extend or logout
 */

import React from 'react';
import { useSessionTimeout, useLogout } from '../hooks';

export const SessionTimeoutWarning: React.FC = () => {
  const { sessionTimeoutWarning, setSessionTimeoutWarning } = useSessionTimeout();
  const logout = useLogout();

  if (!sessionTimeoutWarning) return null;

  const handleExtendSession = () => {
    setSessionTimeoutWarning(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Session Timeout Warning
        </h2>
        <p className="mb-6 text-gray-600">
          Your session will expire soon due to inactivity. Would you like to extend it?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExtendSession}
            className="flex-1 rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Extend Session
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
