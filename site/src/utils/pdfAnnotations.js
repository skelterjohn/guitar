const DB_NAME = 'guitar-annotations-v2';
const STORE_NAME = 'annotations';
const DB_VERSION = 1;

let dbPromise = null;
let persistRequested = false;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });

  return dbPromise;
}

export function annotationKey(pdfFile) {
  return pdfFile;
}

export async function requestPersistentStorage() {
  if (persistRequested) return;
  persistRequested = true;

  try {
    await navigator.storage?.persist?.();
  } catch {
    // Best-effort only.
  }
}

export async function loadAnnotations(pdfFile) {
  const key = annotationKey(pdfFile);

  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const record = request.result;
        if (!record || typeof record !== 'object') {
          resolve(null);
          return;
        }
        resolve(record);
      };
      request.onerror = () => reject(request.error ?? new Error('Failed to load annotations'));
    });
  } catch (err) {
    console.warn('Failed to load annotations:', err);
    return null;
  }
}

export async function saveAnnotations(pdfFile, pages, color, syncHash) {
  const key = annotationKey(pdfFile);
  const record = {
    pdfFile,
    pages,
    updatedAt: new Date().toISOString(),
  };

  if (typeof color === 'string' && color) {
    record.color = color;
  }

  // Loaded once and reused below for both syncHash carry-forward and the
  // prompted-remote-hash marker, which is orthogonal to sync state and must
  // survive ordinary content edits (drawing invalidates syncHash on every
  // stroke, but shouldn't make the app forget it already asked the user
  // about a given remote version).
  let existing = null;
  if (syncHash === undefined) {
    existing = await loadAnnotations(pdfFile);
    if (existing?.syncHash) {
      record.syncHash = existing.syncHash;
    }
  } else if (syncHash) {
    record.syncHash = syncHash;
  }

  if (existing === null) {
    existing = await loadAnnotations(pdfFile);
  }
  if (existing?.promptedRemoteHash) {
    record.promptedRemoteHash = existing.promptedRemoteHash;
  }

  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error('Failed to save annotations'));
    });
    return true;
  } catch (err) {
    console.warn('Failed to save annotations:', err);
    return false;
  }
}

export async function setAnnotationSyncHash(pdfFile, syncHash) {
  const existing = await loadAnnotations(pdfFile);
  if (!existing || existing.pages == null) {
    return false;
  }
  return saveAnnotations(pdfFile, existing.pages, existing.color, syncHash || null);
}

/**
 * Remembers the remote annotation hash the user was last asked to
 * merge/overwrite/download against for a given PDF, so the same question
 * isn't repeated every time the remote still hasn't changed.
 */
export async function getPromptedRemoteHash(pdfFile) {
  const record = await loadAnnotations(pdfFile);
  return typeof record?.promptedRemoteHash === 'string' ? record.promptedRemoteHash : null;
}

export async function setPromptedRemoteHash(pdfFile, hash) {
  const key = annotationKey(pdfFile);
  const existing = await loadAnnotations(pdfFile);
  const record = {
    pdfFile,
    pages: existing?.pages ?? {},
    updatedAt: existing?.updatedAt ?? new Date().toISOString(),
    promptedRemoteHash: hash,
  };
  if (existing?.color) {
    record.color = existing.color;
  }
  if (existing?.syncHash) {
    record.syncHash = existing.syncHash;
  }

  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new Error('Failed to save prompt marker'));
    });
    return true;
  } catch (err) {
    console.warn('Failed to save prompted remote hash:', err);
    return false;
  }
}

export async function clearAnnotationSyncHash(pdfFile) {
  return setAnnotationSyncHash(pdfFile, null);
}

export function createDebouncedSave(delayMs = 400, onResult) {
  let timer = null;
  let pending = null;

  const flush = async () => {
    if (!pending) return true;
    const { pdfFile, pages, color, syncHash } = pending;
    pending = null;
    const saved = await saveAnnotations(pdfFile, pages, color, syncHash);
    onResult?.(saved);
    return saved;
  };

  return {
    schedule(pdfFile, pages, color, syncHash) {
      pending = { pdfFile, pages, color, syncHash };
      clearTimeout(timer);
      timer = setTimeout(() => {
        flush();
      }, delayMs);
    },
    async flushNow() {
      clearTimeout(timer);
      return flush();
    },
    cancel() {
      clearTimeout(timer);
      pending = null;
    },
  };
}

export function createStrokeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
