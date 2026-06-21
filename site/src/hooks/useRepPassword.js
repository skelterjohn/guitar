import { useCallback, useState } from 'react';
import { getRepPassword, setRepPassword as saveRepPassword } from '../utils/repPassword.js';
import { validateRepPassword } from '../utils/validateRepPassword.js';

export default function useRepPassword() {
  const [password, setPasswordState] = useState(() => getRepPassword());

  const setPassword = useCallback(async (value) => {
    const trimmed = value?.trim();
    if (!trimmed) return false;

    const valid = await validateRepPassword(trimmed);
    if (!valid) return false;

    saveRepPassword(trimmed);
    setPasswordState(trimmed);
    return true;
  }, []);

  return {
    password,
    setPassword,
    hasPassword: Boolean(password),
  };
}
