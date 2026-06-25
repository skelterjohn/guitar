import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import NjgoDirector from './NjgoDirector.jsx';
import NjgoEvents from './NjgoEvents.jsx';
import {
  NJGO_DEFAULT_TAB,
  NJGO_TABS,
  njgoTabFromHash,
  njgoTabHash,
} from '../utils/njgoTabs.js';

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

export default function NjgoRoster({ members, director, eventYears }) {
  const [activeTab, setActiveTab] = useState(() => (
    typeof window !== 'undefined' ? njgoTabFromHash(window.location.hash) : NJGO_DEFAULT_TAB
  ));
  const shuffledMembers = useMemo(() => shuffleMembers(members), [members]);

  useEffect(() => {
    const syncFromHash = () => {
      setActiveTab(njgoTabFromHash(window.location.hash));
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    const nextHash = njgoTabHash(tabId);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  };

  return (
    <section className="njgo-roster" aria-label="NJGO">
      <div className="njgo-roster-tablist" role="tablist" aria-label="NJGO">
        {NJGO_TABS.map((tab) => (
          <a
            key={tab.id}
            href={njgoTabHash(tab.id)}
            role="tab"
            id={`njgo-tab-${tab.id}`}
            className="njgo-roster-tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`njgo-panel-${tab.id}`}
            onClick={(event) => {
              event.preventDefault();
              selectTab(tab.id);
            }}
          >
            {tab.label}
          </a>
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
        id="njgo-panel-roster"
        role="tabpanel"
        className="njgo-roster-panel"
        aria-labelledby="njgo-tab-roster"
        hidden={activeTab !== 'roster'}
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

      <div
        id="njgo-panel-events"
        role="tabpanel"
        className="njgo-roster-panel"
        aria-labelledby="njgo-tab-events"
        hidden={activeTab !== 'events'}
      >
        <NjgoEvents eventYears={eventYears} />
      </div>
    </section>
  );
}
