import { useEffect, useState } from 'react';
import bundledRoster, { loadNjgoRoster } from '../data/njgo-roster.js';

export default function useNjgoRoster() {
  const [roster, setRoster] = useState(bundledRoster);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadNjgoRoster().then((data) => {
      if (cancelled) return;
      setRoster((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { roster, loading };
}
