const COOKIE_NAME = 'guitar-piece-labels';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function pdfFilesMatch(a, b) {
  if (!a || !b) return false;
  return a === b || a.normalize('NFC') === b.normalize('NFC');
}

function readAll() {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};

  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(preferences) {
  const value = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

export function getPieceLabelPreference(pieceKey) {
  if (!pieceKey) return null;
  const label = readAll()[pieceKey];
  return typeof label === 'string' ? label : null;
}

export function setPieceLabelPreference(pieceKey, label) {
  if (!pieceKey || !label) return;

  const preferences = readAll();
  if (preferences[pieceKey] === label) return;

  preferences[pieceKey] = label;
  writeAll(preferences);
}

export function findPdfByFile(pdfs, filename) {
  return pdfs.find((pdf) => pdfFilesMatch(pdf.file, filename));
}

export function pdfFileForPiece(piecePdfs, ...preferredLabels) {
  for (const label of preferredLabels) {
    if (!label) continue;
    const match = piecePdfs.find((pdf) => pdf.label === label);
    if (match) return match.file;
  }
  return piecePdfs[0]?.file;
}
