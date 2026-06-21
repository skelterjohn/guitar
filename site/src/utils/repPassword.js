export const REP_PDF_PREFIX = 'PASSWORD';

const COOKIE_NAME = 'guitar-rep-password';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isRepPdfPath(file) {
  return Boolean(file?.startsWith(`${REP_PDF_PREFIX}/`));
}

export function getRepPassword() {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;

  const value = decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  return value || null;
}

export function setRepPassword(password) {
  const trimmed = password?.trim();
  if (!trimmed) return;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(trimmed)}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

export function resolveRepPdfPath(file, password = getRepPassword()) {
  if (!isRepPdfPath(file) || !password) return file;
  return `${password}/${file.slice(REP_PDF_PREFIX.length + 1)}`;
}
