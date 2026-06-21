import { Link } from 'react-router-dom';
import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import { repPath } from '../seo.js';

const PUBLIC_LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/GuitarNJ/' },
  {
    label: 'Join the NJGO',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScaoHIsS4QA0h27dhL8k-moKiY4I3B_FiiC8TAJ4p-LlAYwJg/viewform',
  },
];

function OverviewLink({ link }) {
  if (link.to) {
    return (
      <Link className="njgo-overview-link" to={link.to}>
        <span className="njgo-overview-link-label">{link.label}</span>
      </Link>
    );
  }

  return (
    <a
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
  );
}

export default function NjgoLinks() {
  return (
    <nav className="njgo-overview-links" aria-label="Links">
      <div className="njgo-overview-links-row">
        {PUBLIC_LINKS.map((link) => (
          <OverviewLink key={link.url} link={link} />
        ))}
      </div>
      <section
        className="njgo-overview-links-members"
        aria-labelledby="njgo-members-only-heading"
      >
        <h3 id="njgo-members-only-heading" className="njgo-overview-links-heading">
          members only
        </h3>
        <OverviewLink link={{ label: 'Repertoire', to: repPath }} />
      </section>
    </nav>
  );
}
