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

export function isFutureEventDate(value) {
  const date = parseEventDate(value);
  return date ? date.getTime() > Date.now() : false;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function localDateKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENT_DATE_OPTIONS.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Status badge label for an event card, or null for events with no badge
 * (i.e. past events that aren't "today"). Checked in order of urgency:
 * started within the last hour, happening today, or upcoming on a later day.
 */
export function eventBadgeLabel(value) {
  const date = parseEventDate(value);
  if (!date) {
    return null;
  }

  const now = Date.now();
  const msSinceStart = now - date.getTime();

  if (msSinceStart >= 0 && msSinceStart < ONE_HOUR_MS) {
    return 'Right now!';
  }

  if (localDateKey(date) === localDateKey(new Date(now))) {
    return 'Today!';
  }

  return date.getTime() > now ? 'Upcoming!' : null;
}
