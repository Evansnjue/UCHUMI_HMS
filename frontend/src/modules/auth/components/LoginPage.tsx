import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

type Form = { email: string; password: string };

export const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(loginSchema) as any });
  const { login } = useAuth();

  const onSubmit = async (data: Form) => {
    try {
      await login(data);
      // redirect handled by consumer/app router
    } catch (e) {
      // show error toast (left as exercise)
      console.error(e);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper sx={{ width: 360, p: 3 }} role="form" aria-label="login form">
        <Typography variant="h6" component="h1" gutterBottom>Sign in</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" fullWidth margin="normal" {...register('email')} />
          <TextField label="Password" type="password" fullWidth margin="normal" {...register('password')} />
          <Button type="submit" variant="contained" fullWidth disabled={formState.isSubmitting} sx={{ mt: 2 }}>Sign in</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;