export const NJGO_TABS = [
  { id: 'director', label: 'Meet the NJGO Director' },
  { id: 'roster', label: 'Meet the NJGO Performers' },
  { id: 'events', label: 'See the NJGO In Concert' },
];

export const NJGO_TAB_IDS = NJGO_TABS.map((tab) => tab.id);

export const NJGO_DEFAULT_TAB = 'director';

export function njgoTabFromHash(hash = '') {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  return NJGO_TAB_IDS.includes(id) ? id : NJGO_DEFAULT_TAB;
}

export function njgoTabHash(tabId) {
  return `#${tabId}`;
}
