import { useLocation } from 'react-router-dom';
import NjgoFooter from '../components/NjgoFooter.jsx';
import NjgoOverview from '../components/NjgoOverview.jsx';
import NjgoRoster from '../components/NjgoRoster.jsx';
import overview from '../data/njgo-overview.js';
import roster from '../data/njgo-roster.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { njgoTitle, repDescription } from '../seo.js';

export default function Njgo() {
  const location = useLocation();

  usePageMeta({
    title: njgoTitle,
    description: repDescription,
    url: `${window.location.origin}${location.pathname}`,
  });

  return (
    <main className="page">
      <header className="page-header">
        <h1 className="njgo-page-title">
          <span className="njgo-page-title-line">New Jersey</span>
          <span className="njgo-page-title-line">Guitar Orchestra</span>
        </h1>
      </header>
      <div className="njgo-page">
        <NjgoOverview logo={overview.logo} paragraphs={overview.paragraphs} />
        <NjgoRoster members={roster.members} />
      </div>
      <NjgoFooter />
    </main>
  );
}