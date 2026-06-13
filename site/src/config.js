export const pdfBaseUrl = import.meta.env.VITE_PDF_BASE_URL ?? '/pdf';

export function pdfUrl(file) {
  const base = pdfBaseUrl.replace(/\/$/, '');
  return `${base}/${encodeURIComponent(file)}`;
}
