import { useEffect, useState } from 'react';
import { fetchNjgoRepertoireYaml } from '../bookendNjgoClient.js';

/**
 * Whether the signed-in user is authorized to edit the njgo repertoire.
 * Probes bookend's GET /v1/njgo/repertoire (401/403 -> not an editor)
 * without keeping the YAML text — callers render from the already-loaded
 * public repertoire state instead.
 */
export default function useNjgoEditor(user) {
  const [isNjgoEditor, setIsNjgoEditor] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsNjgoEditor(false);
      return undefined;
    }

    let cancelled = false;
    fetchNjgoRepertoireYaml(user)
      .then((text) => {
        if (!cancelled) setIsNjgoEditor(text !== null);
      })
      .catch(() => {
        if (!cancelled) setIsNjgoEditor(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return isNjgoEditor;
}
