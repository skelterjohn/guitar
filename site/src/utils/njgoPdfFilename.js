/**
 * Filename convention for authorized njgo repertoire PDF uploads:
 * composer_piece_part_version.pdf (e.g. "asmuth_breakfast_g3_2.pdf").
 * Uploads are append-only — bookend rejects re-uploading an existing
 * filename — so the version number is what makes each upload unique and
 * keeps prior versions recoverable.
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

export function buildNjgoPdfBase({ composer = '', piece = '', part = '' } = {}) {
  return [composer, piece, part]
    .map(slug)
    .filter(Boolean)
    .join('_');
}

export function nextNjgoPdfVersion(existingFilenames = [], base = '') {
  if (!base) return 1;
  const pattern = new RegExp(`^${base}_(\\d+)\\.pdf$`);
  let max = 0;
  for (const name of existingFilenames) {
    const match = pattern.exec(name);
    if (!match) continue;
    const version = Number(match[1]);
    if (version > max) max = version;
  }
  return max + 1;
}

export function buildNjgoPdfFilename({ composer, piece, part, version } = {}) {
  const base = buildNjgoPdfBase({ composer, piece, part });
  if (!base || !version) return '';
  return `${base}_${version}.pdf`;
}

/** YYYY-MM-DD, matching the manual cache-bust convention already used for `hash:` in repertoire.yaml. */
export function todayDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
