import catalog from '../data/catalog.json';
import Catalog from '../components/Catalog.jsx';

export default function Home() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Guitar Scores</h1>
        <p>Original compositions, arrangements, and transcriptions.</p>
      </header>
      <Catalog sections={catalog.sections} />
    </main>
  );
}
