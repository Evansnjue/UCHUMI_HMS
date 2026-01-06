import React, { useState } from 'react';
import { payInvoice } from './api';

export const PaymentEntry: React.FC<{ invoiceId: string, onPaid?: () => void }> = ({ invoiceId, onPaid }) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<'CASH'|'MOBILE_MONEY'|'INSURANCE'>('CASH');
  const [provider, setProvider] = useState('');

  const submit = async () => {
    await payInvoice(invoiceId, { amount, method, provider });
    if (onPaid) onPaid();
  };

  return (
    <div>
      <h3>Record Payment</h3>
      <div>
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div>
        <label>Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value as any)}>
          <option value="CASH">Cash</option>
          <option value="MOBILE_MONEY">Mobile Money</option>
          <option value="INSURANCE">Insurance</option>
        </select>
      </div>
      <div>
        <label>Provider</label>
        <input type="text" value={provider} onChange={(e) => setProvider(e.target.value)} />
      </div>
      <button onClick={submit}>Submit Payment</button>
    </div>
  );
};