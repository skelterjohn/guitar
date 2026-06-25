const EVENT_DATE_OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York',
  timeZoneName: 'short',
};

function parseEventDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function formatEventDate(value) {
  const date = parseEventDate(value);
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', EVENT_DATE_OPTIONS).format(date);
}

export function eventDateTimeAttr(value) {
  const date = parseEventDate(value);
  return date ? date.toISOString() : null;
}
