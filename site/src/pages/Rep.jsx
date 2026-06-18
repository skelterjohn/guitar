import repertoire from '../data/repertoire.js';
import Catalog from '../components/Catalog.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { repDescription, repHeading, repTitle, siteOrigin } from '../seo.js';

export default function Rep() {
  usePageMeta({
    title: repTitle,
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
            <h1>{repHeading}</h1>
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
          <p>{repDescription}</p>
        </header>
        <Catalog sections={repertoire.sections} viewState={{ from: '/rep' }} />
      </main>
    </div>
  );
}
