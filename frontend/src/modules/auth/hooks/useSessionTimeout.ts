import { useEffect, useRef, useState } from 'react';
import { refreshToken } from '../services/auth.api';

// very simple inactivity handler: resets on events
export const useSessionTimeout = (timeoutMs = 15 * 60 * 1000) => {
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const reset = () => {
      setExpiresIn(Date.now() + timeoutMs);
    };
    const events = ['mousemove', 'keydown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    const interval = setInterval(() => {
      if (expiresIn && Date.now() > expiresIn) {
        // try silent refresh; if fails consumer will log out via axios interceptor
        refreshToken().catch(() => {});
        setExpiresIn(null);
      }
    }, 1000);
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      clearInterval(interval);
    };
  }, [expiresIn, timeoutMs]);

  return { expiresIn };
};
