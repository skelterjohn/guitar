import { REP_PDF_PREFIX } from './repPassword.js';

export const PDF_PUB_PREFIX = 'pub/';

export function viewRouteFilename(file) {
  if (!file) return file;
  if (file.startsWith(PDF_PUB_PREFIX)) return file.slice(PDF_PUB_PREFIX.length);
  if (file.startsWith(`${REP_PDF_PREFIX}/`)) {
    return file.slice(REP_PDF_PREFIX.length + 1);
  }
  return file;
}

export function pdfPathsMatch(a, b) {
  if (!a || !b) return false;
  const left = viewRouteFilename(a).normalize('NFC');
  const right = viewRouteFilename(b).normalize('NFC');
  return left === right;
}
