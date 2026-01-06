import React, { useEffect, useState } from 'react';
import { getPrescription, fulfillPrescription } from './api';
import { useParams, useNavigate } from 'react-router-dom';

export const FulfillPrescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getPrescription(id).then(setPrescription).catch(console.error);
  }, [id]);

  if (!prescription) return <div>Loading...</div>;

  const handleChange = (itemId: string, value: string) => {
    setQuantities((q) => ({ ...q, [itemId]: Number(value) }));
  };

  const submit = async () => {
    const items = prescription.items.map((it: any) => ({ prescriptionItemId: it.id, quantity: quantities[it.id] || 0 })).filter((it: any) => it.quantity > 0);
    await fulfillPrescription(prescription.id, items);
    navigate('/pharmacy');
  };

  return (
    <div>
      <h2>Fulfill Prescription {prescription.id}</h2>
      <ul>
        {prescription.items.map((it: any) => (
          <li key={it.id}>
            {it.drug?.name} — prescribed: {it.quantity}
            <input type="number" min={0} onChange={(e) => handleChange(it.id, e.target.value)} />
          </li>
        ))}
      </ul>
      <button onClick={submit}>Dispense</button>
    </div>
  );
};
