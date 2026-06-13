import catalog from '../data/catalog.json';
import Catalog from '../components/Catalog.jsx';

export default function Home() {
  return (
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
  );
}
