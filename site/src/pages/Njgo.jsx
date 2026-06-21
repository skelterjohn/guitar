import { useLocation } from 'react-router-dom';
import NjgoRoster from '../components/NjgoRoster.jsx';
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
        <h1>NJGO</h1>
      </header>
      <NjgoRoster members={roster.members} />
    </main>
  );
}