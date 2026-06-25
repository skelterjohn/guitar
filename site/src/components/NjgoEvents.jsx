import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import NjgoEventPhoto from './NjgoEventPhoto.jsx';
import { eventTitle } from '../utils/eventLocation.js';
import { eventDateTimeAttr, formatEventDate } from '../utils/formatEventDate.js';
export default function NjgoEvents({ events }) {
  const items = Array.isArray(events) ? events : [];
  if (items.length === 0) {
    return null;
  }

  const sortedEvents = [...items].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <ul className="njgo-events">
      {sortedEvents.map((event) => {
        const formattedDate = formatEventDate(event.date);
        const dateTimeAttr = eventDateTimeAttr(event.date);
        const key = `${event.name}-${eventDateTimeAttr(event.date) ?? event.date}`;

        return (
          <li key={key}>
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
                {formattedDate && dateTimeAttr && (
                  <p className="njgo-event-date">
                    <time dateTime={dateTimeAttr}>{formattedDate}</time>
                  </p>
                )}
                {event.address && (
                  <p className="njgo-event-address">{event.address}</p>
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
          </li>
        );
      })}
    </ul>
  );
}
