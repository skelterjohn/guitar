export function isNjgoDomain() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'njgo.org' || host === 'www.njgo.org';
}

export function isBluebridgeDomain() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'bluebridge.skelterjohn.me' || host === 'www.bluebridge.skelterjohn.me';
}
