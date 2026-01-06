import React, { useEffect, useState } from 'react';
import { listInvoices, revenueReport } from './api';

export const BillingDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    listInvoices().then(setInvoices).catch(console.error);
    revenueReport('day').then(setReport).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Billing Dashboard</h2>
      <div>Revenue (Today): {report?.total}</div>
      <h3>Recent Invoices</h3>
      <ul>
        {invoices.map((inv) => (
          <li key={inv.id}>{inv.patient?.firstName || 'Guest'} — {inv.totalAmount} — {inv.status}</li>
        ))}
      </ul>
    </div>
  );
};