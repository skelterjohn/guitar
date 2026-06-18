export const siteTitle = 'skj :: guitar';
export const siteHeading = 'skelterjohn :: guitar';
export const repTitle = 'skj :: rep';
export const repHeading = 'skelterjohn :: repertoire';
export const repDescription = 'performance repertoire';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const defaultDescription =
  'Classical guitar scores — original compositions, arrangements, and transcriptions by skelterjohn. Free PDFs.';

export function pageTitle(name) {
  return name === siteTitle ? siteTitle : `${name} — ${siteTitle}`;
}

export function viewPageUrl(filename) {
  return `${siteOrigin}/view/${encodeURIComponent(filename)}`;
}
