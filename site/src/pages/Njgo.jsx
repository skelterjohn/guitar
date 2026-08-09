import NjgoFooter from '../components/NjgoFooter.jsx';
import NjgoOverview from '../components/NjgoOverview.jsx';
import NjgoRoster from '../components/NjgoRoster.jsx';
import director from '../data/njgo-director.js';
import events from '../data/events.js';
import overview from '../data/njgo-overview.js';
import useNjgoRoster from '../hooks/useNjgoRoster.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { njgoDescription, njgoPageTitle, njgoUrl } from '../seo.js';

export default function Njgo() {
  const { roster } = useNjgoRoster();

  usePageMeta({
    title: njgoPageTitle,
    description: njgoDescription,
    url: njgoUrl,
  });

  return (
    <main className="page page--njgo">
      <div className="njgo-page">
        <NjgoOverview logo={overview.logo} paragraphs={overview.paragraphs} />
        <NjgoRoster
          members={roster.members}
          director={director}
          eventYears={events.eventYears}
        />
      </div>
      <NjgoFooter />
    </main>
  );
}
