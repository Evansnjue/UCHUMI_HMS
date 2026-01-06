import React, { useEffect, useState } from 'react';
import { listPending, resultsForRequest, createResult } from './api';

export const LabDashboard: React.FC = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [value, setValue] = useState('');

  const load = async () => {
    const res = await listPending();
    setPending(res);
  };

  useEffect(() => { load(); }, []);

  const open = async (r: any) => {
    setSelected(r);
    const res = await resultsForRequest(r.id);
    // show results or single-entry
  };

  const submit = async () => {
    if (!selected) return;
    await createResult({ labRequestId: selected.id, testId: selected.testId || selected.id /* heuristic */, value });
    setValue('');
    load();
  };

  return (
    <div>
      <h3>Lab Technician Dashboard</h3>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h4>Pending Requests</h4>
          <ul>
            {pending.map(p => (
              <li key={p.id}><button onClick={() => open(p)}>{p.testName} for {p.consultation?.patient?.firstName}</button></li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h4>Enter Result</h4>
          {selected ? (
            <div>
              <div>Request: {selected.testName}</div>
              <textarea value={value} onChange={(e) => setValue(e.target.value)} />
              <button onClick={submit}>Submit Result</button>
            </div>
          ) : <div>Select a request</div>}
        </div>
      </div>
    </div>
  );
};