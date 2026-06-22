import * as pdfjs from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
import { fetchPdfBytes, pdfLogLabel, resolvePdfUrl } from './pdfCache.js';

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();

const MAX_DOCS = 15;
const docCache = new Map();

function evictOldestDocument() {
  let oldestKey = null;
  let oldestAccess = Infinity;

  for (const [key, entry] of docCache) {
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

export async function acquirePdfDocument(url) {
  const resolved = resolvePdfUrl(url);
  const cached = docCache.get(resolved);
  if (cached) {
    cached.lastAccess = Date.now();
    console.log(`[pdf] cache hit (parsed): ${pdfLogLabel(resolved)}`);
    return cached.doc;
  }

  const data = await fetchPdfBytes(url);
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;

  docCache.set(resolved, {
    doc,
    loadingTask,
    lastAccess: Date.now(),
  });

  while (docCache.size > MAX_DOCS) {
    evictOldestDocument();
  }

  return doc;
}
