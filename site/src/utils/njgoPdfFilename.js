/**
 * Filename convention for authorized njgo repertoire PDF uploads:
 * key_part_YYYYMMDD.pdf, e.g. "breakfast_around_3_20260820.pdf" for the
 * "guitar 3" part of the piece with key "breakfast_around", uploaded
 * 2026-08-20 (the "guitar" word is dropped from the part). If that exact
 * name is already taken (a same-day re-upload), a letter suffix
 * disambiguates (…_20260820a.pdf, …_20260820b.pdf, …). Uploads are
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

/** "guitar 3" -> "3"; anything else (e.g. "score", "bass") passes through unchanged. */
function dropGuitarWord(text) {
  return (text ?? '')
    .toString()
    .replace(/\bguitar\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildNjgoPdfBase({ key = '', part = '' } = {}) {
  return [slug(key), slug(dropGuitarWord(part))].filter(Boolean).join('_');
}

/** YYYY-MM-DD, matching the manual cache-bust convention used for `updated:` in repertoire.yaml. */
export function todayDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** YYYYMMDD (no dashes), for filenames. */
export function todayFilenameDateStamp(date = new Date()) {
  return todayDateStamp(date).replace(/-/g, '');
}

/**
 * The letter to disambiguate a same-day re-upload that would otherwise
 * collide ('' for the first upload of this base+date, then 'a', 'b', 'c', ...).
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
  key,
  part,
  dateStamp = todayFilenameDateStamp(),
  suffix = '',
} = {}) {
  const base = buildNjgoPdfBase({ key, part });
  if (!base) return '';
  return `${base}_${dateStamp}${suffix}.pdf`;
}
