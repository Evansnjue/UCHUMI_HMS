import React, { useState } from 'react';
import api from '../auth/api';

export const AdminDoctorLimitsPage: React.FC = () => {
  const [doctorId, setDoctorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dailyLimit, setDailyLimit] = useState(0);
  const [limits, setLimits] = useState<any[]>([]);

  const load = async () => {
    if (!doctorId) return;
    const res = await api.get(`/clinical/admin/doctor-limits/${doctorId}`);
    setLimits(res.data);
  };

  const setLimit = async () => {
    await api.post('/clinical/admin/doctor-limits', { doctorId, categoryId, dailyLimit: Number(dailyLimit) });
    load();
  };

  return (
    <div>
      <h3>Doctor Drug Limits</h3>
      <div>
        <input placeholder="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        <input placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
        <input placeholder="Daily limit" type="number" value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} />
        <button onClick={setLimit}>Set</button>
        <button onClick={load}>Load</button>
      </div>
      <div>
        <h4>Current Limits</h4>
        <ul>
          {limits.map(l => (<li key={l.id}>{l.category?.name}: {l.dailyLimit}</li>))}
        </ul>
      </div>
    </div>
  );
};