import NjgoFooter from '../components/NjgoFooter.jsx';
import NjgoOverview from '../components/NjgoOverview.jsx';
import NjgoRoster from '../components/NjgoRoster.jsx';
import director from '../data/njgo-director.js';
import overview from '../data/njgo-overview.js';
import roster from '../data/njgo-roster.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { njgoDescription, njgoPageTitle, njgoUrl } from '../seo.js';

export default function Njgo() {
  usePageMeta({
    title: njgoPageTitle,
    description: njgoDescription,
    url: njgoUrl,
  });

  return (
    <main className="page page--njgo">
      <div className="njgo-page">
        <NjgoOverview logo={overview.logo} paragraphs={overview.paragraphs} />
        <NjgoRoster members={roster.members} director={director} />
      </div>
      <NjgoFooter />
    </main>
  );
}
