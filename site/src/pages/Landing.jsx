import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import {
  bookDescription,
  bookHeading,
  bookPath,
  catalogPath,
  defaultDescription,
  njgoPath,
  siteHeading,
  siteOrigin,
  siteTitle,
} from '../seo.js';

export default function Landing() {
  usePageMeta({
    title: siteTitle,
    description: defaultDescription,
    url: `${siteOrigin}/`,
  });

  return (
    <main className="page landing-page">
      <header className="page-header landing-header">
        <h1>{siteHeading}</h1>
        <p>classical guitar scores</p>
      </header>
      <nav className="landing-nav" aria-label="Site sections">
        <Link className="landing-link" to={catalogPath}>
          <span className="landing-link-title">catalog</span>
          <span className="landing-link-desc">
            original compositions, arrangements, and transcriptions
          </span>
        </Link>
        <Link className="landing-link" to={bookPath()}>
          <span className="landing-link-title">{bookHeading}</span>
          <span className="landing-link-desc">{bookDescription}</span>
        </Link>
        <Link className="landing-link" to={njgoPath}>
          <span className="landing-link-title">njgo</span>
          <span className="landing-link-desc">new jersey guitar orchestra</span>
        </Link>
      </nav>
    </main>
  );
}
