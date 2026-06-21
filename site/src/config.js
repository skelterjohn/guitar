import { resolveRepPdfPath } from './utils/repPassword.js';

export const pdfBaseUrl = import.meta.env.VITE_PDF_BASE_URL ?? '/pdf';

export function pdfUrl(file, hash) {
  const base = pdfBaseUrl.replace(/\/$/, '');
  const resolved = resolveRepPdfPath(file);
  const encoded = resolved.split('/').map(encodeURIComponent).join('/');
  if (!hash) return `${base}/${encoded}`;
  return `${base}/${encoded}?v=${hash}`;
}
