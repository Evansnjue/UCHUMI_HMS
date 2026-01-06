import React, { useEffect, useState } from 'react';
import { listInventoryItems, listLowStock } from './api';

export const InventoryDashboard: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [low, setLow] = useState<any[]>([]);

  useEffect(() => {
    listInventoryItems().then(setItems).catch(console.error);
    listLowStock().then(setLow).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Inventory Dashboard</h2>
      <h3>Low stock</h3>
      <ul>
        {low.map((i) => (
          <li key={i.id}>{i.name} — {i.quantity}</li>
        ))}
      </ul>
      <h3>All items</h3>
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.name} — {i.quantity} — {i.department?.name}</li>
        ))}
      </ul>
    </div>
  );
};