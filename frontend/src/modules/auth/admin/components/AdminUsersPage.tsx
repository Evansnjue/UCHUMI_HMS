import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import UserEditDialog from './UserEditDialog';

const AdminUsersPage: React.FC = () => {
  const { usersQ, updateUser } = useUsers();
  const [editing, setEditing] = useState<any | null>(null);
  if (usersQ.isLoading) return <div>Loading users...</div>;
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Users</Typography>
        <Button onClick={() => setEditing({})}>Create user</Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow><TableCell>Email</TableCell><TableCell>Name</TableCell><TableCell>Roles</TableCell><TableCell>Actions</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {usersQ.data?.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.firstName} {u.lastName}</TableCell>
              <TableCell>{u.roles.join(', ')}</TableCell>
              <TableCell><Button onClick={() => setEditing(u)}>Edit</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && <UserEditDialog user={editing} onClose={() => setEditing(null)} onSave={(payload) => updateUser.mutate({ id: payload.id, ...payload })} />}
    </Box>
  );
};

export default AdminUsersPage;