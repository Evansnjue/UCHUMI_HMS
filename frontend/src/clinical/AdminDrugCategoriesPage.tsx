import React, { useEffect, useState } from 'react';
import api from '../auth/api';

export const AdminDrugCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(0);

  const load = async () => {
    const res = await api.get('/clinical/admin/drug-categories');
    setCategories(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post('/clinical/admin/drug-categories', { name, dailyLimit: Number(limit) });
    setName(''); setLimit(0);
    load();
  };

  const update = async (id: string, newLimit: number) => {
    await api.patch(`/clinical/admin/drug-categories/${id}`, { dailyLimit: Number(newLimit) });
    load();
  };

  return (
    <div>
      <h3>Drug Categories</h3>
      <div>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Daily limit" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
        <button onClick={create}>Create</button>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Daily Limit</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}><td>{c.name}</td><td>{c.dailyLimit}</td><td><button onClick={() => { const nl = prompt('New limit', String(c.dailyLimit)); if (nl!==null) update(c.id, Number(nl)); }}>Update</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};