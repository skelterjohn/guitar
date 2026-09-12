import * as pdfjs from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
import { fetchPdfBytes, formatBytes, pdfLogLabel, resolvePdfUrl } from './pdfCache.js';

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();

const MAX_DOCS = 15;
const docCache = new Map();
const inflight = new Map();

function evictOldestDocument() {
  let oldestKey = null;
  let oldestAccess = Infinity;

  for (const [key, entry] of docCache) {
    if ((entry.refCount ?? 0) > 0) continue;
    if (entry.lastAccess < oldestAccess) {
      oldestAccess = entry.lastAccess;
      oldestKey = key;
    }
  }

  if (!oldestKey) return false;

  const entry = docCache.get(oldestKey);
  docCache.delete(oldestKey);
  void entry.doc.destroy();
  return true;
}

function parsedCacheStats() {
  let bytes = 0;
  for (const entry of docCache.values()) {
    bytes += entry.byteLength ?? 0;
  }
  return { count: docCache.size, bytes };
}

async function loadDocument(url, options) {
  const { onPhase, loadBytes } = options;
  const data = loadBytes
    ? await loadBytes(onPhase)
    : await fetchPdfBytes(url, { onPhase });
  const byteLength = data.byteLength;
  onPhase?.('loading');
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  return { doc, loadingTask, byteLength };
}

export async function acquirePdfDocument(url, options = {}) {
  const resolved = resolvePdfUrl(url);
  const cached = docCache.get(resolved);
  if (cached) {
    cached.refCount = (cached.refCount ?? 0) + 1;
    cached.lastAccess = Date.now();
    console.log(`[pdf] cache hit (parsed): ${pdfLogLabel(resolved)}`);
    return cached.doc;
  }

  // Rapidly switching back to a PDF that's still being loaded must join the
  // existing load rather than start a second pdfjs.getDocument() for the
  // same bytes — concurrent calls race on the shared worker port and one of
  // them can hang forever instead of resolving or throwing.
  let pending = inflight.get(resolved);
  if (!pending) {
    pending = loadDocument(url, options);
    inflight.set(resolved, pending);
  }

  try {
    const { doc, loadingTask, byteLength } = await pending;

    let entry = docCache.get(resolved);
    if (!entry) {
      entry = { doc, loadingTask, lastAccess: Date.now(), byteLength, refCount: 0 };
      docCache.set(resolved, entry);

      // If every entry is pinned (refCount > 0), nothing is evictable — stop
      // instead of spinning forever waiting for room that will never free up.
      while (docCache.size > MAX_DOCS && evictOldestDocument()) {
        // keep evicting
      }

      const { count, bytes } = parsedCacheStats();
      const sizeLabel =
        bytes > 0
          ? `${count}/${MAX_DOCS} pdfs, ${formatBytes(bytes)}`
          : `${count}/${MAX_DOCS} pdfs`;
      console.log(`[pdf] cache add (parsed): ${pdfLogLabel(resolved)} [${sizeLabel}]`);
    }

    entry.refCount = (entry.refCount ?? 0) + 1;
    entry.lastAccess = Date.now();
    return entry.doc;
  } finally {
    if (inflight.get(resolved) === pending) {
      inflight.delete(resolved);
    }
  }
}

export function releasePdfDocument(url) {
  const resolved = resolvePdfUrl(url);
  const entry = docCache.get(resolved);
  if (!entry) return;

  entry.refCount = Math.max(0, (entry.refCount ?? 1) - 1);
}
