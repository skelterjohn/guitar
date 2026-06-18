import repertoire from '../data/repertoire.js';
import Catalog from '../components/Catalog.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { siteHeading, siteOrigin, siteTitle } from '../seo.js';

const repDescription = 'Personal repertoire for practicing and performing.';

export default function Rep() {
  usePageMeta({
    title: siteTitle,
    description: repDescription,
    url: `${siteOrigin}/rep`,
    noindex: true,
  });

  return (
    <div className="page-shell">
      <TableOfContents sections={repertoire.sections} />
      <main className="page">
        <header className="page-header">
          <div className="page-header-top">
            <h1>{siteHeading}</h1>
            <div className="repo-source">
              <span className="repo-label">pdfs and site built from</span>
              <a
                className="repo-link"
                href="https://github.com/skelterjohn/guitar"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/skelterjohn/guitar
              </a>
            </div>
          </div>
          <p>original compositions, arrangements, and transcriptions.</p>
        </header>
        <Catalog sections={repertoire.sections} />
      </main>
    </div>
  );
}
