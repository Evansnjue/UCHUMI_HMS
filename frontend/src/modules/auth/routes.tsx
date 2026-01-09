/**
 * Auth Module Routes Configuration
 */

import { RouteObject } from 'react-router-dom';
import {
  LoginPage,
  PasswordResetPage,
  ProfilePage,
  UnauthorizedPage,
} from '../pages';
import { PublicRoute, ProtectedRoute } from '../guards';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <PublicRoute>
            <PasswordResetPage />
          </PublicRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
    ],
  },
];
