import * as pdfjs from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
import { fetchPdfBytes, formatBytes, pdfLogLabel, resolvePdfUrl } from './pdfCache.js';

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();

const MAX_DOCS = 15;
const docCache = new Map();

function evictOldestDocument() {
  let oldestKey = null;
  let oldestAccess = Infinity;

  for (const [key, entry] of docCache) {
    if ((entry.refCount ?? 0) > 0) continue;
    // Still loading — not safe to destroy() yet, and it'll clean itself up
    // in acquirePdfDocument() once the load settles if still unwanted.
    if (!entry.doc) continue;
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

  // The cache entry is created synchronously, before the (possibly slow)
  // load even starts, so a releasePdfDocument() that arrives while it's
  // still loading — e.g. the user flips to a different score before this
  // one finishes parsing — always has a real entry to decrement. Creating
  // the entry only after the load resolved (the previous approach) left
  // that release with nothing to decrement, silently discarding it; the
  // load then landed anyway and pinned itself at refCount 1 forever, since
  // nothing was left to release it. Enough quick flips between scores leak
  // enough permanently-pinned parsed documents in the single shared pdf.js
  // worker to eventually wedge it, which is what was producing renders that
  // stall and never recover even after the watchdog's fresh-canvas retry.
  let entry = docCache.get(resolved);
  if (entry) {
    entry.refCount = (entry.refCount ?? 0) + 1;
    entry.lastAccess = Date.now();
    if (!entry.pending) {
      console.log(`[pdf] cache hit (parsed): ${pdfLogLabel(resolved)}`);
      return entry.doc;
    }
    return entry.pending;
  }

  entry = { doc: null, loadingTask: null, byteLength: 0, lastAccess: Date.now(), refCount: 1 };
  docCache.set(resolved, entry);

  entry.pending = loadDocument(url, options)
    .then(({ doc, loadingTask, byteLength }) => {
      entry.doc = doc;
      entry.loadingTask = loadingTask;
      entry.byteLength = byteLength;
      entry.pending = null;

      if ((entry.refCount ?? 0) <= 0) {
        // Every viewer that wanted this navigated away before the load
        // finished — nobody is left to release it, so clean up now instead
        // of leaving it pinned with no owner.
        if (docCache.get(resolved) === entry) docCache.delete(resolved);
        void doc.destroy();
        return doc;
      }

      while (docCache.size > MAX_DOCS && evictOldestDocument()) {
        // keep evicting
      }

      const { count, bytes } = parsedCacheStats();
      const sizeLabel =
        bytes > 0
          ? `${count}/${MAX_DOCS} pdfs, ${formatBytes(bytes)}`
          : `${count}/${MAX_DOCS} pdfs`;
      console.log(`[pdf] cache add (parsed): ${pdfLogLabel(resolved)} [${sizeLabel}]`);
      return doc;
    })
    .catch((err) => {
      entry.pending = null;
      if (docCache.get(resolved) === entry) docCache.delete(resolved);
      throw err;
    });

  return entry.pending;
}

export function releasePdfDocument(url) {
  const resolved = resolvePdfUrl(url);
  const entry = docCache.get(resolved);
  if (!entry) return;

  entry.refCount = Math.max(0, (entry.refCount ?? 1) - 1);
}
