import repertoire from '../data/repertoire.js';
import { isRepPdfPath, resolveRepPdfPath } from './repPassword.js';

function repProbePdfFile() {
  for (const section of repertoire.sections) {
    for (const piece of section.pieces) {
      const pdf = piece.pdfs.find((entry) => isRepPdfPath(entry.file));
      if (pdf) return pdf.file;
    }
  }
  return null;
}

function pdfFetchUrl(resolvedPath) {
  const base = (import.meta.env.VITE_PDF_BASE_URL ?? '/pdf').replace(/\/$/, '');
  const encoded = resolvedPath.split('/').map(encodeURIComponent).join('/');
  return `${base}/${encoded}`;
}

async function probePdfUrl(url) {
  let response = await fetch(url, { method: 'HEAD' });
  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, { headers: { Range: 'bytes=0-0' } });
    return response.ok || response.status === 206;
  }
  return response.ok;
}

export async function validateRepPassword(password) {
  const trimmed = password?.trim();
  if (!trimmed) return false;

  const probe = repProbePdfFile();
  if (!probe) return true;

  const url = pdfFetchUrl(resolveRepPdfPath(probe, trimmed));
  try {
    return await probePdfUrl(url);
  } catch {
    return false;
  }
}
