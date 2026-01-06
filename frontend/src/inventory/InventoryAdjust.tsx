import React, { useState } from 'react';
import { addStock, removeStock } from './api';

export const InventoryAdjust: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState('');

  return (
    <div>
      <h3>Adjust Inventory</h3>
      <div>
        <label>Quantity</label>
        <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </div>
      <div>
        <label>Reason</label>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <div>
        <button onClick={() => addStock(itemId, qty, reason)}>Add</button>
        <button onClick={() => removeStock(itemId, qty, reason)}>Remove</button>
      </div>
    </div>
  );
};