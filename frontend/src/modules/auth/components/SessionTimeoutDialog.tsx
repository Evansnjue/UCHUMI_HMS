import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export const SessionTimeoutDialog: React.FC<{ open: boolean; onKeep: () => void; onLogout: () => void; secondsLeft?: number }> = ({ open, onKeep, onLogout, secondsLeft = 60 }) => (
  <Dialog open={open} onClose={onKeep} aria-labelledby="session-timeout-title">
    <DialogTitle id="session-timeout-title">Session expiring</DialogTitle>
    <DialogContent>
      <Typography>Your session will expire in {secondsLeft} seconds. Would you like to stay signed in?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onLogout}>Sign out</Button>
      <Button variant="contained" onClick={onKeep}>Stay signed in</Button>
    </DialogActions>
  </Dialog>
);
