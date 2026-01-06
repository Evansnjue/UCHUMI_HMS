import React, { useState } from 'react';
import { registerPatient } from './api';

export const PatientRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [opd, setOpd] = useState('');
  const [ipd, setIpd] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const generate = async (type: 'OPD' | 'IPD') => {
    try {
      const res = await api.post('/patients/numbers', { type });
      if (type === 'OPD') setOpd(res.data.number || res.number);
      else setIpd(res.data.number || res.number);
    } catch (err: any) {
      setMessage('Failed to generate number');
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const numbers = [] as any[];
      if (opd) numbers.push({ type: 'OPD', number: opd });
      if (ipd) numbers.push({ type: 'IPD', number: ipd });
      const payload = { firstName, lastName, dateOfBirth: dob, gender, numbers };
      const res = await registerPatient(payload);
      setMessage(`Patient registered: ${res.id}`);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '1rem auto' }}>
      <h2>Patient Registration</h2>
      <form onSubmit={submit}>
        <div>
          <label>First name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label>Last name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label>Date of birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label>Gender</label>
          <input value={gender} onChange={(e) => setGender(e.target.value)} />
        </div>
        <div>
          <label>OPD number</label>
          <input value={opd} onChange={(e) => setOpd(e.target.value)} />
          <button type="button" onClick={() => generate('OPD')}>Generate OPD</button>
        </div>
        <div>
          <label>IPD number</label>
          <input value={ipd} onChange={(e) => setIpd(e.target.value)} />
          <button type="button" onClick={() => generate('IPD')}>Generate IPD</button>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
};
