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
export const repPath = '/rep';
export const bookTitle = 'bluebridge';
export const bookHeading = 'bluebridge';
export const bookBackLabel = 'bluebridge';
export const bookDescription = 'upload and annotate your guitar scores';
export const bluebridgeOrigin = 'https://bluebridge.skelterjohn.me';
export const njgoPath = '/njgo';
export const njgoOrigin = 'https://njgo.org';
export const siteManifest = '/manifest.webmanifest';
export const njgoManifest = '/njgo-manifest.webmanifest';
export const bluebridgeManifest = '/bluebridge-manifest.webmanifest';
export const njgoThemeColor = '#000000';
export const bluebridgeThemeColor = '#f1f5f9';
export const siteOrigin = 'https://guitar.skelterjohn.me';
export const catalogUrl = `${siteOrigin}${catalogPath}`;
export const repUrl = `${siteOrigin}${repPath}`;
export const njgoUrl = `${njgoOrigin}/`;
export const njgoPublicUrl = `${njgoOrigin}${njgoPath}`;
export const defaultDescription =
  'Classical guitar scores — original compositions, arrangements, and transcriptions by skelterjohn. Free PDFs.';

import { viewRouteFilename } from './utils/pdfPaths.js';
import { isBluebridgeDomain } from './utils/siteDomain.js';

export function bookPath() {
  if (typeof window !== 'undefined' && isBluebridgeDomain()) return '/';
  return '/book';
}

export function isBookPath(path) {
  return path === '/book' || path === '/';
}

export function bookUrl() {
  const origin = typeof window !== 'undefined' && isBluebridgeDomain()
    ? window.location.origin
    : siteOrigin;
  const path = bookPath();
  return path === '/' ? `${origin}/` : `${origin}${path}`;
}

export function pageTitle(name) {
  return name === siteTitle ? siteTitle : `${name} — ${siteTitle}`;
}

export function viewPath(file, context = 'catalog') {
  if (context === 'book') {
    return bookViewPath(file);
  }
  const base = context === 'rep' ? repPath : catalogPath;
  return `${base}/view/${encodeURIComponent(viewRouteFilename(file))}`;
}

export function bookViewPath(filename, { pageStart, pageEnd } = {}) {
  const base = bookPath();
  const encoded = encodeURIComponent(filename);
  const path = base === '/' ? `/view/${encoded}` : `${base}/view/${encoded}`;
  const start = Number(pageStart);
  if (!Number.isFinite(start) || start < 1) return path;
  const endRaw = pageEnd ?? start;
  const end = Number(endRaw);
  const safeEnd = Number.isFinite(end) && end >= start ? end : start;
  const pages = safeEnd === start ? String(start) : `${start}-${safeEnd}`;
  return `${path}?pages=${pages}`;
}

export function parseBookViewPageRange(search) {
  const query = typeof search === 'string' ? search.trim() : '';
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const pages = params.get('pages')?.trim();
  if (!pages) return null;

  const rangeMatch = pages.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    const pageStart = Number.parseInt(rangeMatch[1], 10);
    const pageEnd = Number.parseInt(rangeMatch[2], 10);
    if (!Number.isFinite(pageStart) || pageStart < 1) return null;
    if (!Number.isFinite(pageEnd) || pageEnd < pageStart) return null;
    return { pageStart, pageEnd };
  }

  if (!/^\d+$/.test(pages)) return null;
  const page = Number.parseInt(pages, 10);
  if (!Number.isFinite(page) || page < 1) return null;
  return { pageStart: page, pageEnd: page };
}

export function bookViewNavBounds(pageCount, pageRange) {
  if (!pageCount) return { min: 1, max: 1, restricted: false };
  if (!pageRange) return { min: 1, max: pageCount, restricted: false };
  const min = Math.min(Math.max(pageRange.pageStart, 1), pageCount);
  const max = Math.min(Math.max(pageRange.pageEnd, min), pageCount);
  return { min, max, restricted: true };
}

export function viewPageUrl(file) {
  return `${siteOrigin}${viewPath(file)}`;
}
