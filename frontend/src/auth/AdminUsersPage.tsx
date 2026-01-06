import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import * as api from './api';

export const AdminUsersPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // For demo: fetch users endpoint would be implemented in backend
    // api.getUsers(token).then(setUsers);
  }, [token]);

  return (
    <div>
      <h2>Admin — Users</h2>
      <p>Manage user roles and accounts (requires Admin)</p>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.roles?.map((r) => r.name).join(', ')}</td>
              <td>
                {/* Example action: Set roles (requires Admin token) */}
                <button>Set Roles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
