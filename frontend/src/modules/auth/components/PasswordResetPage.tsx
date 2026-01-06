import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { resetPassword } from '../services/auth.api';

export const PasswordResetPage: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<{ email: string }>();
  const onSubmit = async (d: { email: string }) => {
    try { await resetPassword(d); alert('If that account exists you will receive reset instructions'); } catch (e) { console.error(e); }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper sx={{ width: 360, p: 3 }}>
        <Typography variant="h6" gutterBottom>Password reset</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" fullWidth margin="normal" {...register('email')} />
          <Button type="submit" variant="contained" fullWidth disabled={formState.isSubmitting} sx={{ mt: 2 }}>Send reset</Button>
        </form>
      </Paper>
    </Box>
  );
};
