import { Link } from 'react-router-dom';
import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import { repPath } from '../seo.js';

const PUBLIC_LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/GuitarNJ/' },
  {
    label: 'Join the NJGO',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScaoHIsS4QA0h27dhL8k-moKiY4I3B_FiiC8TAJ4p-LlAYwJg/viewform',
  },
  { label: 'Events', url: 'https://jaysonmartinez.org/events' },
  { label: 'Youtube', url: 'https://www.youtube.com/@newjerseyguitarorchestra/videos' },
];

const MEMBERS_ONLY_LINKS = [
  { label: 'Repertoire', to: repPath },
  {
    label: 'Google Drive',
    url: 'https://drive.google.com/drive/folders/11ZELfmvoDKx2DguiJBllHKZuQDzNGorW',
  },
];

function linkKey(link) {
  return link.to ?? link.url;
}

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
      <section
        className="njgo-overview-links-public"
        aria-labelledby="njgo-links-heading"
      >
        <h3 id="njgo-links-heading" className="njgo-overview-links-heading">
          Links
        </h3>
        {PUBLIC_LINKS.map((link) => (
          <OverviewLink key={linkKey(link)} link={link} />
        ))}
      </section>
      <section
        className="njgo-overview-links-members"
        aria-labelledby="njgo-members-only-heading"
      >
        <h3 id="njgo-members-only-heading" className="njgo-overview-links-heading">
          Members only
        </h3>
        {MEMBERS_ONLY_LINKS.map((link) => (
          <OverviewLink key={linkKey(link)} link={link} />
        ))}
      </section>
    </nav>
  );
}
