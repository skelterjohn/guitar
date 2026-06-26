import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import NjgoEventPhoto from './NjgoEventPhoto.jsx';
import { eventGoogleCalendarUrl } from '../utils/eventCalendar.js';
import { eventTitle, normalizeMapLink } from '../utils/eventLocation.js';
import { eventDateTimeAttr, formatEventDate } from '../utils/formatEventDate.js';

const NJGO_LOGO = '/njgo/logo_black.png';

function EventCard({ event }) {
  const formattedDate = formatEventDate(event.date);
  const dateTimeAttr = eventDateTimeAttr(event.date);
  const mapUrl = normalizeMapLink(event.map_link ?? event.address);
  const calendarUrl = eventGoogleCalendarUrl(event);

  return (
    <article
      className={[
        'njgo-event',
        'njgo-roster-card',
        event.image ? 'njgo-event--has-image' : '',
      ].filter(Boolean).join(' ')}
    >
      {event.image && <NjgoEventPhoto src={event.image} />}
      <div className="njgo-roster-card-body">
        <h2 className="njgo-event-name">{eventTitle(event)}</h2>
        {(mapUrl || calendarUrl || (formattedDate && dateTimeAttr)) && (
          <p className="njgo-event-meta">
            {mapUrl && (
              <a
                className="njgo-overview-link njgo-event-action-link"
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Google Maps"
              >
                <span className="njgo-overview-link-label">
                  <span className="njgo-event-action-label">map</span>
                  <ExternalLinkIcon />
                </span>
              </a>
            )}
            {calendarUrl && (
              <a
                className="njgo-overview-link njgo-event-action-link"
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Add to Google Calendar"
              >
                <span className="njgo-overview-link-label">
                  <span className="njgo-event-action-label">calendar</span>
                  <ExternalLinkIcon />
                </span>
              </a>
            )}
            {formattedDate && dateTimeAttr && (
              <time className="njgo-event-date" dateTime={dateTimeAttr}>
                {formattedDate}
              </time>
            )}
          </p>
        )}
        {Array.isArray(event.links) && event.links.length > 0 && (
          <ul className="njgo-event-links">
            {event.links.map((link) => (
              <li key={link.url}>
                <a
                  className="njgo-overview-link"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="njgo-overview-link-label">
                    {link.name}
                    <ExternalLinkIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function NjgoEvents({ eventYears }) {
  const years = Array.isArray(eventYears) ? eventYears : [];
  if (years.length === 0) {
    return null;
  }

  return (
    <ul className="njgo-events">
      {years.map(({ year, events }) => {
        const items = Array.isArray(events) ? events : [];
        if (items.length === 0) {
          return null;
        }

        return (
          <li key={year} className="njgo-events-year">
            <ul className="njgo-events-year-list">
              {items.map((event) => {
                const dateTimeAttr = eventDateTimeAttr(event.date);
                const key = `${event.name}-${dateTimeAttr ?? event.date}`;

                return (
                  <li key={key}>
                    <EventCard event={event} />
                  </li>
                );
              })}
            </ul>
            <div className="njgo-events-year-divider" aria-hidden="true">
              <span className="njgo-events-year-divider-line" />
              <span className="njgo-events-year-divider-mark">
                <span className="njgo-events-year-divider-logo-wrap">
                  <img
                    className="njgo-events-year-divider-logo"
                    src={NJGO_LOGO}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="njgo-events-year-divider-label">{year}</span>
              </span>
              <span className="njgo-events-year-divider-line" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
