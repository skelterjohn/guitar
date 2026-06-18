import catalog from '../data/catalog.js';
import Catalog from '../components/Catalog.jsx';
import JsonLd from '../components/JsonLd.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { buildHomeJsonLd } from '../homeJsonLd.js';
import { catalogUrl, defaultDescription, siteHeading, siteTitle } from '../seo.js';

export default function Home() {
  usePageMeta({
    title: siteTitle,
    description: defaultDescription,
    url: catalogUrl,
  });

  return (
    <div className="page-shell">
      <JsonLd data={buildHomeJsonLd(catalog)} />
      <TableOfContents sections={catalog.sections} />
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
        <Catalog sections={catalog.sections} />
      </main>
    </div>
  );
}
