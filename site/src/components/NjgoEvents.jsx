import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import { eventDateTimeAttr, formatEventDate } from '../utils/formatEventDate.js';

function eventTitle(event) {
  if (event.name && event.location) {
    return `${event.name} @ ${event.location}`;
  }
  return event.name || event.location || '';
}

export default function NjgoEvents({ events }) {
  const items = Array.isArray(events) ? events : [];
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="njgo-events">
      {items.map((event) => {
        const formattedDate = formatEventDate(event.date);
        const dateTimeAttr = eventDateTimeAttr(event.date);

        return (
          <li key={eventTitle(event)}>
            <article className="njgo-event">
              <h2 className="njgo-event-name">{eventTitle(event)}</h2>
              {formattedDate && dateTimeAttr && (
                <p className="njgo-event-date">
                  <time dateTime={dateTimeAttr}>{formattedDate}</time>
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
            </article>
          </li>
        );
      })}
    </ul>
  );
}
