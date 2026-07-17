import { useEffect, useState } from 'react';
import { loadRepertoire } from '../data/repertoire.js';

export default function useRepertoire() {
  const [repertoire, setRepertoire] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadRepertoire().then((data) => {
      if (cancelled) return;
      setRepertoire(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { repertoire, loading };
}
