import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import {
  catalogPath,
  defaultDescription,
  repDescription,
  repPath,
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
        <Link className="landing-link" to={repPath}>
          <span className="landing-link-title">repertoire</span>
          <span className="landing-link-desc">{repDescription}</span>
        </Link>
      </nav>
    </main>
  );
}
