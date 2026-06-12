import { Link } from 'react-router-dom';

export default function CompositionCard({ piece }) {
  return (
    <article className="composition-card">
      <h3>{piece.title}</h3>
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
