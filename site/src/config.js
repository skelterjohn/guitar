import { isRepPdfPath, resolveRepPdfPath } from './utils/repPassword.js';

export const pdfBaseUrl = import.meta.env.VITE_PDF_BASE_URL ?? '/pdf';

export const bookendBaseUrl = import.meta.env.VITE_BOOKEND_BASE_URL ?? '/bookend';

export function resolvePdfStoragePath(file) {
  if (isRepPdfPath(file)) return resolveRepPdfPath(file);
  return file;
}

export function pdfUrl(file, hash) {
  const base = pdfBaseUrl.replace(/\/$/, '');
  const resolved = resolvePdfStoragePath(file);
  const encoded = resolved.split('/').map(encodeURIComponent).join('/');
  if (!hash) return `${base}/${encoded}`;
  return `${base}/${encoded}?v=${hash}`;
}
