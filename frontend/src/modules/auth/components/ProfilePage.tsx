import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(profileUpdateSchema) as any, defaultValues: user || {} });
  const onSubmit = async (d: any) => {
    try {
      // call PUT /users/:id
      await fetch(`/users/${user?.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      setUser({ ...(user as any), ...d });
    } catch (e) { console.error(e); }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ width: 720, p: 3 }}>
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="First name" fullWidth margin="normal" {...register('firstName')} />
          <TextField label="Last name" fullWidth margin="normal" {...register('lastName')} />
          <TextField label="Email" fullWidth margin="normal" {...register('email')} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
        </form>
      </Paper>
    </Box>
  );
};
