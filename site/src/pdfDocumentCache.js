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
    if (entry.lastAccess < oldestAccess) {
      oldestAccess = entry.lastAccess;
      oldestKey = key;
    }
  }

  if (!oldestKey) return;

  const entry = docCache.get(oldestKey);
  docCache.delete(oldestKey);
  void entry.doc.destroy();
}

function parsedCacheStats() {
  let bytes = 0;
  for (const entry of docCache.values()) {
    bytes += entry.byteLength ?? 0;
  }
  return { count: docCache.size, bytes };
}

export async function acquirePdfDocument(url) {
  const resolved = resolvePdfUrl(url);
  const cached = docCache.get(resolved);
  if (cached) {
    cached.refCount = (cached.refCount ?? 0) + 1;
    cached.lastAccess = Date.now();
    console.log(`[pdf] cache hit (parsed): ${pdfLogLabel(resolved)}`);
    return cached.doc;
  }

  const data = await fetchPdfBytes(url);
  const byteLength = data.byteLength;
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;

  docCache.set(resolved, {
    doc,
    loadingTask,
    lastAccess: Date.now(),
    byteLength,
    refCount: 1,
  });

  while (docCache.size > MAX_DOCS) {
    evictOldestDocument();
  }

  const { count, bytes } = parsedCacheStats();
  const sizeLabel =
    bytes > 0
      ? `${count}/${MAX_DOCS} pdfs, ${formatBytes(bytes)}`
      : `${count}/${MAX_DOCS} pdfs`;
  console.log(`[pdf] cache add (parsed): ${pdfLogLabel(resolved)} [${sizeLabel}]`);

  return doc;
}

export function releasePdfDocument(url) {
  const resolved = resolvePdfUrl(url);
  const entry = docCache.get(resolved);
  if (!entry) return;

  entry.refCount = Math.max(0, (entry.refCount ?? 1) - 1);
}
