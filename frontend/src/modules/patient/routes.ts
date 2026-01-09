/**
 * Patient Module Routes
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';
import {
  PatientRegistrationPage,
  PatientSearchPage,
  PatientProfilePage,
} from './pages';
import { ProtectedRoute } from '@modules/auth';

export const patientRoutes: RouteObject[] = [
  {
    path: 'patient',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <PatientSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <PatientSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute roles={['RECEPTIONIST', 'ADMIN']}>
            <PatientRegistrationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'register/:id',
        element: (
          <ProtectedRoute roles={['RECEPTIONIST', 'ADMIN']}>
            <PatientRegistrationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/:id',
        element: (
          <ProtectedRoute>
            <PatientProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
