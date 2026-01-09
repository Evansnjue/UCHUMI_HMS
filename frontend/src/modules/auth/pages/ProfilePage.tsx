/**
 * Profile Page
 * User can view and edit their profile
 */

import React, { useState } from 'react';
import { useAuthUser } from '../hooks';
import { UserProfileForm, ChangePasswordForm } from '../components';

type Tab = 'profile' | 'password';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const user = useAuthUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings</p>
      </div>

      {/* User Info Card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2 flex gap-2">
              {user.roles.map((role) => (
                <span
                  key={role.id}
                  className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'password'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg bg-white p-6 shadow">
        {activeTab === 'profile' && <UserProfileForm />}
        {activeTab === 'password' && <ChangePasswordForm />}
      </div>
    </div>
  );
};
