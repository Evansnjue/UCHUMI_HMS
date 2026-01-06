import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

const UserEditDialog: React.FC<{ user: any; onClose: () => void; onSave: (payload:any) => void }> = ({ user, onClose, onSave }) => {
  const { register, handleSubmit } = useForm({ defaultValues: user });
  const onSubmit = (d:any) => { onSave({ ...user, ...d }); onClose(); };
  return (
    <Dialog open onClose={onClose} aria-labelledby="edit-user">
      <DialogTitle id="edit-user">Edit user</DialogTitle>
      <DialogContent>
        <form id="user-edit-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Email" fullWidth margin="normal" {...register('email')} />
          <TextField label="First name" fullWidth margin="normal" {...register('firstName')} />
          <TextField label="Last name" fullWidth margin="normal" {...register('lastName')} />
          <TextField label="Roles (comma)" fullWidth margin="normal" {...register('roles')} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="user-edit-form" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;