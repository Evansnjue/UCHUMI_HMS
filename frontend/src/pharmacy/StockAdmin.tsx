import React, { useEffect, useState } from 'react';
import { listStock, adjustStock } from './api.stock';

export const StockAdmin: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    listStock().then(setStocks).catch(console.error);
  }, []);

  const doAdjust = async (id: string) => {
    await adjustStock(id, Number(delta), reason);
    const s = await listStock();
    setStocks(s);
  };

  return (
    <div>
      <h2>Stock Admin</h2>
      <div>
        <label>Delta</label>
        <input type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value))} />
        <label>Reason</label>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <ul>
        {stocks.map((s) => (
          <li key={s.id}>
            {s.drug?.name} — {s.quantity} <button onClick={() => doAdjust(s.id)}>Apply</button>
          </li>
        ))}
      </ul>
    </div>
  );
};