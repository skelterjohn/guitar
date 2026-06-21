import { useCallback, useState } from 'react';
import { getRepPassword, setRepPassword as saveRepPassword } from '../utils/repPassword.js';

export default function useRepPassword() {
  const [password, setPasswordState] = useState(() => getRepPassword());

  const setPassword = useCallback((value) => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    saveRepPassword(trimmed);
    setPasswordState(trimmed);
  }, []);

  return {
    password,
    setPassword,
    hasPassword: Boolean(password),
  };
}
