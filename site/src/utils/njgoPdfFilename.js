/**
 * Filename convention for authorized njgo repertoire PDF uploads:
 * lastname_firstword_part_YYYYMMDD.pdf (e.g. "asmuth_breakfast_g3_20260819.pdf"
 * for "Breakfast around the Sun" by John Asmuth, uploaded 2026-08-19). If a
 * same-day upload already used that exact name, a letter suffix
 * disambiguates (…_20260819a.pdf, …_20260819b.pdf, …). Uploads are
 * append-only — bookend rejects re-uploading an existing filename — so this
 * scheme is what keeps every upload unique and prior versions recoverable.
 */

export function slug(text) {
  return (text ?? '')
    .toString()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function lastWord(text) {
  const words = (text ?? '').toString().trim().split(/\s+/).filter(Boolean);
  return words[words.length - 1] ?? '';
}

function firstWord(text) {
  const words = (text ?? '').toString().trim().split(/\s+/).filter(Boolean);
  return words[0] ?? '';
}

/** "guitar 3" -> "g3"; anything else (e.g. "score", "bass") passes through unchanged. */
function abbreviatePart(text) {
  const trimmed = (text ?? '').toString().trim();
  const match = /^guitar\s+(\d+)$/i.exec(trimmed);
  return match ? `g${match[1]}` : trimmed;
}

export function buildNjgoPdfBase({ composer = '', piece = '', part = '' } = {}) {
  return [lastWord(composer), firstWord(piece), abbreviatePart(part)]
    .map(slug)
    .filter(Boolean)
    .join('_');
}

/** YYYY-MM-DD, matching the manual cache-bust convention already used for `hash:` in repertoire.yaml. */
export function todayDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** YYYYMMDD (no dashes), for filenames. */
export function todayFilenameDateStamp(date = new Date()) {
  return todayDateStamp(date).replace(/-/g, '');
}

/**
 * The letter to disambiguate same-day re-uploads of the same base+date
 * ('' for the first upload that day, then 'a', 'b', 'c', ...).
 */
export function nextNjgoPdfSuffix(existingFilenames = [], base = '', dateStamp = todayFilenameDateStamp()) {
  if (!base) return '';
  const names = new Set(existingFilenames);
  if (!names.has(`${base}_${dateStamp}.pdf`)) return '';
  for (let i = 0; i < 26; i += 1) {
    const letter = String.fromCharCode(97 + i); // 'a'..'z'
    if (!names.has(`${base}_${dateStamp}${letter}.pdf`)) return letter;
  }
  return '';
}

export function buildNjgoPdfFilename({
  composer,
  piece,
  part,
  dateStamp = todayFilenameDateStamp(),
  suffix = '',
} = {}) {
  const base = buildNjgoPdfBase({ composer, piece, part });
  if (!base) return '';
  return `${base}_${dateStamp}${suffix}.pdf`;
}
