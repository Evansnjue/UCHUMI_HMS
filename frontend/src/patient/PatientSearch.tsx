import React, { useState } from 'react';
import { searchPatients } from './api';

export const PatientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const onSearch = async (e: any) => {
    e.preventDefault();
    const res = await searchPatients(query);
    setResults(res);
  };

  return (
    <div style={{ maxWidth: 800, margin: '1rem auto' }}>
      <h2>Patient Search</h2>
      <form onSubmit={onSearch}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or number" />
        <button type="submit">Search</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <table width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Numbers</th>
              <th>Departments</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p) => (
              <tr key={p.id}>
                <td>{p.firstName} {p.lastName}</td>
                <td>{p.numbers?.map((n: any) => `${n.type}:${n.number}`).join(', ')}</td>
                <td>{p.departments?.map((d: any) => d.department?.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
