import CompositionCard from './CompositionCard.jsx';

export default function Catalog({ sections }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="catalog-section">
          <h2>{section.title}</h2>
          {section.pieces.map((piece) => (
            <CompositionCard key={piece.title} piece={piece} />
          ))}
        </section>
      ))}
    </>
  );
}
