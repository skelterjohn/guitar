export const siteTitle = 'skj :: guitar';
export const siteHeading = 'skelterjohn :: guitar';
export const repTitle = 'NJGO';
export const njgoTitle = 'NJGO';
export const repHeading = 'New Jersey Guitar Orchestra';
export const repDescription = 'performance repertoire for NJGO';
export const catalogPath = '/catalog';
export const repPath = '/rep';
export const njgoPath = '/njgo';
export const njgoOrigin = 'https://njgo.org';
export const siteManifest = '/manifest.webmanifest';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const catalogUrl = `${siteOrigin}${catalogPath}`;
export const repUrl = `${siteOrigin}${repPath}`;
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

export function viewPageUrl(file) {
  return `${siteOrigin}${viewPath(file)}`;
}
