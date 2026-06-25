import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import NjgoDirector from './NjgoDirector.jsx';

const TABS = [
  { id: 'director', label: 'Meet the NJGO Director' },
  { id: 'performers', label: 'Meet the NJGO Performers' },
];

function bioParagraphs(bio) {
  if (typeof bio !== 'string' || !bio.trim()) return [];
  return bio.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean);
}

function cropObjectPosition(crop) {
  const point = crop?.focal_point;
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return undefined;
  }
  return `${point.x * 100}% ${point.y * 100}%`;
}

function shuffleMembers(members) {
  const items = [...members];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function NjgoRosterCard({ member }) {
  const paragraphs = bioParagraphs(member.bio);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const bioRef = useRef(null);

  useLayoutEffect(() => {
    const el = bioRef.current;
    if (!el || expanded) return undefined;

    const checkOverflow = () => {
      setHasOverflow(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [paragraphs, expanded]);

  return (
    <article
      className={[
        'njgo-roster-card',
        expanded ? 'njgo-roster-card--expanded' : '',
      ].filter(Boolean).join(' ')}
    >
      {member.image && (
        <div className="njgo-roster-photo-frame">
          <img
            className="njgo-roster-photo"
            src={member.image}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: cropObjectPosition(member.crop) }}
          />
        </div>
      )}
      <div className="njgo-roster-card-body">
        <h2 className="njgo-roster-name">{member.name}</h2>
        {paragraphs.length > 0 && (
          <div className="njgo-roster-bio-shell">
            <div
              ref={bioRef}
              className={[
                'njgo-roster-bio',
                'njgo-roster-bio--clamped',
                expanded ? 'njgo-roster-bio--clamped-hidden' : '',
              ].filter(Boolean).join(' ')}
              aria-hidden={expanded}
            >
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {expanded && (
              <div className="njgo-roster-bio njgo-roster-bio--overlay">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <button
                  type="button"
                  className="njgo-roster-read-more"
                  onClick={() => setExpanded(false)}
                  aria-expanded
                >
                  Read less
                </button>
              </div>
            )}
          </div>
        )}
        {hasOverflow && (
          <button
            type="button"
            className={[
              'njgo-roster-read-more',
              expanded ? 'njgo-roster-read-more--hidden' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            tabIndex={expanded ? -1 : 0}
          >
            Read more
          </button>
        )}
      </div>
    </article>
  );
}

export default function NjgoRoster({ members, director }) {
  const [activeTab, setActiveTab] = useState('director');
  const shuffledMembers = useMemo(() => shuffleMembers(members), [members]);

  return (
    <section className="njgo-roster" aria-label="People">
      <div className="njgo-roster-tablist" role="tablist" aria-label="People">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`njgo-tab-${tab.id}`}
            className="njgo-roster-tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`njgo-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="njgo-panel-director"
        role="tabpanel"
        className="njgo-roster-panel"
        aria-labelledby="njgo-tab-director"
        hidden={activeTab !== 'director'}
      >
        <NjgoDirector
          name={director?.name}
          image={director?.image}
          bio={director?.bio}
        />
      </div>

      <div
        id="njgo-panel-performers"
        role="tabpanel"
        className="njgo-roster-panel"
        aria-labelledby="njgo-tab-performers"
        hidden={activeTab !== 'performers'}
      >
        <p className="njgo-roster-note">in no particular order, past and present</p>
        <ul className="njgo-roster-grid">
          {shuffledMembers.map((member) => (
            <li key={member.name}>
              <NjgoRosterCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
