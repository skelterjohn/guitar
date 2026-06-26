export const siteTitle = 'skj :: guitar';
export const siteHeading = 'skelterjohn :: guitar';
export const repTitle = 'NJGO';
export const njgoTitle = 'NJGO';
export const njgoPageTitle = 'New Jersey Guitar Orchestra (NJGO)';
export const repHeading = 'New Jersey Guitar Orchestra';
export const repDescription = 'performance repertoire for NJGO';
export const njgoDescription =
  'The New Jersey Guitar Orchestra (NJGO) is a classical guitar ensemble rehearsing at Kean University in Union, NJ. Meet the performers, find events, and learn how to join.';
export const catalogPath = '/catalog';
export const bookPath = '/book';
export const repPath = '/rep';
export const bookTitle = 'bluebridge';
export const bookHeading = 'bluebridge';
export const bookBackLabel = 'bluebridge';
export const bookDescription = 'upload and annotate your guitar scores';
export const njgoPath = '/njgo';
export const njgoOrigin = 'https://njgo.org';
export const siteManifest = '/manifest.webmanifest';
export const njgoManifest = '/njgo-manifest.webmanifest';
export const njgoThemeColor = '#000000';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const catalogUrl = `${siteOrigin}${catalogPath}`;
export const bookUrl = `${siteOrigin}${bookPath}`;
export const repUrl = `${siteOrigin}${repPath}`;
export const njgoUrl = `${njgoOrigin}/`;
export const njgoPublicUrl = `${njgoOrigin}${njgoPath}`;
export const defaultDescription =
  'Classical guitar scores — original compositions, arrangements, and transcriptions by skelterjohn. Free PDFs.';

import { viewRouteFilename } from './utils/pdfPaths.js';

export function pageTitle(name) {
  return name === siteTitle ? siteTitle : `${name} — ${siteTitle}`;
}

export function viewPath(file, context = 'catalog') {
  const base = context === 'rep' ? repPath : catalogPath;
  return `${base}/view/${encodeURIComponent(viewRouteFilename(file))}`;
}

export function bookViewPath(filename) {
  return `${bookPath}/view/${encodeURIComponent(filename)}`;
}

export function viewPageUrl(file) {
  return `${siteOrigin}${viewPath(file)}`;
}
