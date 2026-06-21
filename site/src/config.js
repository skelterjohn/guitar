export const pdfBaseUrl = import.meta.env.VITE_PDF_BASE_URL ?? '/pdf';

export function pdfUrl(file, hash) {
  const base = pdfBaseUrl.replace(/\/$/, '');
  const encoded = file.split('/').map(encodeURIComponent).join('/');
  if (!hash) return `${base}/${encoded}`;
  return `${base}/${encoded}?v=${hash}`;
}
