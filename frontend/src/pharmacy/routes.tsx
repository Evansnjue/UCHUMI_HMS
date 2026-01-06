import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { PharmacistDashboard } from './PharmacistDashboard';
import { FulfillPrescription } from './FulfillPrescription';
import { InventoryDashboard } from '../inventory/InventoryDashboard';
import { StockAdmin } from './StockAdmin';

// Insert these routes into your App router to expose the Pharmacy and Inventory pages
export const PharmacyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/pharmacy"
        element={<ProtectedRoute roles={['Pharmacist', 'Admin']}><PharmacistDashboard /></ProtectedRoute>}
      />
      <Route
        path="/pharmacy/fulfill/:id"
        element={<ProtectedRoute roles={['Pharmacist', 'Admin']}><FulfillPrescription /></ProtectedRoute>}
      />
      <Route
        path="/inventory"
        element={<ProtectedRoute roles={['Admin', 'SupplyManager', 'Pharmacist']}><InventoryDashboard /></ProtectedRoute>}
      />
      <Route
        path="/inventory/admin"
        element={<ProtectedRoute roles={['Admin', 'SupplyManager']}><StockAdmin /></ProtectedRoute>}
      />
    </Routes>
  );
};