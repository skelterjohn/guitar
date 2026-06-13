import { pieceId } from '../utils/pieceId.js';

export default function TableOfContents({ sections }) {
  return (
    <nav className="toc" aria-label="Table of contents">
      <ol className="toc-list">
        {sections.map((section) => (
          <li key={section.id} className="toc-section">
            <span className="toc-section-title">{section.title}</span>
            <ol className="toc-pieces">
              {section.pieces.map((piece) => (
                <li key={piece.title}>
                  <a href={`#${pieceId(section.id, piece.title)}`}>{piece.title}</a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
