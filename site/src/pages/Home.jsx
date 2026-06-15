import catalog from '../data/catalog.js';
import Catalog from '../components/Catalog.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { defaultDescription, siteName, siteOrigin } from '../seo.js';

export default function Home() {
  usePageMeta({
    title: siteName,
    description: defaultDescription,
    url: `${siteOrigin}/`,
  });

  return (
    <div className="page-shell">
      <TableOfContents sections={catalog.sections} />
      <main className="page">
        <header className="page-header">
          <div className="page-header-top">
            <h1>skelterjohn's guitar scores</h1>
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
