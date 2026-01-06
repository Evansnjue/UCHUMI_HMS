import React, { useState } from 'react';
import { createVisit } from '../visit/api';
import { createPrescription } from './api';

export const ConsultationPage: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const onCreateConsult = async () => {
    try {
      const res = await fetch('/clinical/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId, diagnosis, notes }) });
      const data = await res.json();
      setMsg('Consultation created: ' + data.id);
    } catch (err: any) {
      setMsg('Failed to create consultation');
    }
  };

  return (
    <div>
      <h3>Consultation for patient {patientId}</h3>
      <div>
        <label>Diagnosis</label>
        <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
      </div>
      <div>
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button onClick={onCreateConsult}>Create Consultation</button>
      {msg && <div>{msg}</div>}
    </div>
  );
};
