import repertoire from '../data/repertoire.js';
import BackFromRep from '../components/BackFromRep.jsx';
import Catalog from '../components/Catalog.jsx';
import RepPasswordGate from '../components/RepPasswordGate.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { repDescription, repHeading, repPath, repTitle, repUrl } from '../seo.js';
export default function Rep() {
  usePageMeta({
    title: repTitle,
    description: repDescription,
    url: repUrl,
    noindex: true,
  });

  return (
    <RepPasswordGate>
      <div className="page-shell">
        <TableOfContents sections={repertoire.sections} />
        <main className="page">
          <header className="page-header">
            <div className="page-header-top">
              <div className="page-header-title">
                <BackFromRep />
                <h1>{repHeading}</h1>
              </div>
            </div>
            <p>{repDescription}</p>
          </header>
          <Catalog sections={repertoire.sections} viewState={{ from: repPath }} viewPrefix={repPath} />
        </main>
      </div>
    </RepPasswordGate>
  );
}
