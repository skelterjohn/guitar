import { Link } from 'react-router-dom';
import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import { repPath } from '../seo.js';

const LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/GuitarNJ/' },
  {
    label: 'Join the NJGO',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScaoHIsS4QA0h27dhL8k-moKiY4I3B_FiiC8TAJ4p-LlAYwJg/viewform',
  },
  { label: 'Repertoire', to: repPath, membersOnly: true },
];

export default function NjgoLinks() {
  return (
    <nav className="njgo-overview-links" aria-label="Links">
      {LINKS.map((link) =>
        link.to ? (
          <Link key={link.to} className="njgo-overview-link" to={link.to}>
            <span className="njgo-overview-link-label">{link.label}</span>
            {link.membersOnly && (
              <span className="njgo-overview-link-note">members only</span>
            )}
          </Link>
        ) : (
          <a
            key={link.url}
            className="njgo-overview-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="njgo-overview-link-label">
              {link.label}
              <ExternalLinkIcon />
            </span>
          </a>
        ),
      )}
    </nav>
  );
}
