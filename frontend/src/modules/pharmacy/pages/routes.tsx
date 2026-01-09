/**
 * Pharmacy Module Routes
 * React Router configuration for pharmacy features
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { UserRole } from '../types';
import { PrescriptionQueuePage } from './PrescriptionQueuePage';
import { DispensingPage } from './DispensingPage';
import { StockVisibilityPage } from './StockVisibilityPage';

/**
 * Pharmacy module routes configuration
 * Base path: /pharmacy
 */

interface PharmacyRoutesProps {
  userRole: UserRole;
  basePath?: string;
}

export const PharmacyRoutes: React.FC<PharmacyRoutesProps> = ({
  userRole,
  basePath = '/pharmacy',
}) => {
  return (
    <Routes>
      {/* Prescription Queue */}
      <Route
        path="prescriptions"
        element={
          <PrescriptionQueuePage
            userRole={userRole}
            onSelectPrescription={(prescription) => {
              // Navigate to dispensing with selected prescription
              window.location.hash = `#${basePath}/dispense?rx=${prescription.id}`;
            }}
          />
        }
      />

      {/* Dispensing Workflow */}
      <Route
        path="dispense"
        element={
          <DispensingPage
            userRole={userRole}
            onDispensingComplete={() => {
              // Navigate back to queue after successful dispensing
              window.location.hash = `#${basePath}/prescriptions`;
            }}
          />
        }
      />
      <Route
        path="dispense/:prescriptionId"
        element={<DispensingPage userRole={userRole} />}
      />

      {/* Stock Management */}
      <Route
        path="stock"
        element={<StockVisibilityPage userRole={userRole} />}
      />

      {/* Dispensing History */}
      <Route
        path="history"
        element={<DispensingHistoryPage userRole={userRole} />}
      />

      {/* Audit Trail */}
      <Route
        path="audit"
        element={<AuditTrailPage userRole={userRole} />}
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="prescriptions" replace />} />
      <Route path="*" element={<Navigate to="prescriptions" replace />} />
    </Routes>
  );
};

// Placeholder pages (will be fully implemented)
const DispensingHistoryPage = ({ userRole }: { userRole: UserRole }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">Dispensing History</h1>
    <p>Coming soon...</p>
  </div>
);

const AuditTrailPage = ({ userRole }: { userRole: UserRole }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">Audit Trail</h1>
    <p>Coming soon...</p>
  </div>
);

export { PrescriptionQueuePage, DispensingPage, StockVisibilityPage };
