export const siteName = 'guitar scores @ skelterjohn';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const defaultDescription =
  'Classical guitar scores — original compositions, arrangements, and transcriptions by skelterjohn. Free PDFs.';

export function pageTitle(name) {
  return name === siteName ? siteName : `${name} — ${siteName}`;
}

export function viewPageUrl(filename) {
  return `${siteOrigin}/view/${encodeURIComponent(filename)}`;
}
