import { Link } from 'react-router-dom';

export default function CompositionCard({ piece }) {
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];

  return (
    <article className="composition-card">
      <h3>{piece.title}</h3>
      {paragraphs.length > 0 && (
        <div className="composition-description">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <div className="pdf-links">
        {piece.pdfs.map((pdf) => (
          <Link
            key={pdf.file}
            className="pdf-link"
            to={`/view/${encodeURIComponent(pdf.file)}`}
          >
            {pdf.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
