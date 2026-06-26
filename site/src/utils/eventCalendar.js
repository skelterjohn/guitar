import { eventTitle } from './eventLocation.js';

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;
const GOOGLE_CALENDAR_BASE = 'https://calendar.google.com/calendar/render';
const EVENT_DESCRIPTION = 'The New Jersey Guitar Orchestra performs.';

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

function formatGoogleCalendarUtc(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function eventGoogleCalendarUrl(event) {
  const start = parseEventDate(event.date);
  if (!start) {
    return null;
  }

  const end = new Date(start.getTime() + DEFAULT_DURATION_MS);
  const title = eventTitle(event);
  const location = typeof event.location === 'string' ? event.location.trim() : '';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleCalendarUtc(start)}/${formatGoogleCalendarUtc(end)}`,
    details: EVENT_DESCRIPTION,
  });
  if (location) {
    params.set('location', location);
  }

  return `${GOOGLE_CALENDAR_BASE}?${params.toString()}`;
}

export function canAddEventToCalendar(event) {
  return Boolean(eventGoogleCalendarUrl(event));
}
