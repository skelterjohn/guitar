import { pieceId } from '../utils/pieceId.js';

export default function TableOfContents({ sections, expandedSectionIds, onSectionActivate }) {
  const isFoldable = Boolean(expandedSectionIds);

  return (
    <nav className="toc" aria-label="Table of contents">
      <ol className="toc-list">
        {sections.map((section) => {
          const expanded = !isFoldable || expandedSectionIds.has(section.id);

          if (!expanded) {
            return (
              <li key={section.id} className="toc-section toc-section--folded">
                <a
                  href={`#${section.id}`}
                  className="toc-section-folded"
                  onClick={() => onSectionActivate?.(section.id)}
                >
                  <span className="toc-section-folded-title">{section.title}</span>
                </a>
              </li>
            );
          }

          return (
            <li key={section.id} className="toc-section">
              <span className="toc-section-title">{section.title}</span>
              <ol className="toc-pieces">
                {section.pieces.map((piece) => (
                  <li key={piece.title}>
                    <a
                      href={`#${pieceId(section.id, piece.title)}`}
                      onClick={() => onSectionActivate?.(section.id)}
                    >
                      {piece.title}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
