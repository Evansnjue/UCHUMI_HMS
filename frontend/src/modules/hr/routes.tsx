// File: frontend/src/modules/hr/routes.tsx
import React from 'react';
import EmployeeRegistryPage from './pages/EmployeeRegistryPage';
import NumberAllocationPage from './pages/NumberAllocationPage';
import AttendancePage from './pages/AttendancePage';
import PayrollSummaryPage from './pages/PayrollSummaryPage';

export const HR_ROUTES = [
  { path: '/hr/employees', element: <EmployeeRegistryPage />, requiredRoles: ['HR Officer', 'Admin'] },
  { path: '/hr/allocate', element: <NumberAllocationPage />, requiredRoles: ['HR Officer', 'Admin'] },
  { path: '/hr/attendance', element: <AttendancePage />, requiredRoles: ['HR Officer', 'Admin'] },
  { path: '/hr/payroll', element: <PayrollSummaryPage />, requiredRoles: ['HR Officer', 'Admin'] },
];

export default HR_ROUTES;
