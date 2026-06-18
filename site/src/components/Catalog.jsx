import CompositionCard from './CompositionCard.jsx';
import { pieceId } from '../utils/pieceId.js';

export default function Catalog({ sections, viewState }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="catalog-section">
          <h2>{section.title}</h2>
          {section.pieces.map((piece) => (
            <CompositionCard
              key={piece.title}
              id={pieceId(section.id, piece.title)}
              piece={piece}
              viewState={viewState}
            />
          ))}
        </section>
      ))}
    </>
  );
}
