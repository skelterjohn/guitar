export const siteTitle = 'skj :: guitar';
export const siteHeading = 'skelterjohn :: guitar';
export const repTitle = 'skj :: rep';
export const repHeading = 'skelterjohn :: repertoire';
export const repDescription = 'performance repertoire';
export const catalogPath = '/catalog';
export const repPath = '/rep';
export const siteManifest = '/manifest.webmanifest';
export const repManifest = '/rep.webmanifest';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const catalogUrl = `${siteOrigin}${catalogPath}`;
export const repUrl = `${siteOrigin}${repPath}`;
export const defaultDescription =
  'Classical guitar scores — original compositions, arrangements, and transcriptions by skelterjohn. Free PDFs.';

export function pageTitle(name) {
  return name === siteTitle ? siteTitle : `${name} — ${siteTitle}`;
}

export function viewPath(filename, context = 'catalog') {
  const base = context === 'rep' ? repPath : catalogPath;
  return `${base}/view/${encodeURIComponent(filename)}`;
}

export function viewPageUrl(filename) {
  return `${siteOrigin}${viewPath(filename)}`;
}
