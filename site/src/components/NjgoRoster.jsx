import { useLayoutEffect, useRef, useState } from 'react';

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
    <article className="njgo-roster-card">
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
          <div
            ref={bioRef}
            className={[
              'njgo-roster-bio',
              !expanded ? 'njgo-roster-bio--clamped' : '',
            ].filter(Boolean).join(' ')}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        {hasOverflow && (
          <button
            type="button"
            className="njgo-roster-read-more"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  );
}

export default function NjgoRoster({ members }) {
  return (
    <section className="njgo-roster" aria-label="Members">
      <ul className="njgo-roster-grid">
        {members.map((member) => (
          <li key={member.name}>
            <NjgoRosterCard member={member} />
          </li>
        ))}
      </ul>
    </section>
  );
}
