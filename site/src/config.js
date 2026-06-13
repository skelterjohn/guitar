export const pdfBaseUrl = import.meta.env.VITE_PDF_BASE_URL ?? '/pdf';

export function pdfUrl(file, hash) {
  const base = pdfBaseUrl.replace(/\/$/, '');
  const encoded = encodeURIComponent(file);
  if (!hash) return `${base}/${encoded}`;
  return `${base}/${encoded}?v=${hash}`;
}
