import { useEffect, useState } from 'react';
import bundledRepertoire, { loadRepertoire } from '../data/repertoire.js';

export default function useRepertoire() {
  const [repertoire, setRepertoire] = useState(bundledRepertoire);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadRepertoire().then((data) => {
      if (cancelled) return;
      setRepertoire((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { repertoire, loading, setRepertoire };
}
