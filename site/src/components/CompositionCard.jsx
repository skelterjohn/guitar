import { Link } from 'react-router-dom';
import ExternalLinkIcon from './ExternalLinkIcon.jsx';

export default function CompositionCard({ piece }) {
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const links = piece.links ?? [];

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
      {links.length > 0 && (
        <div className="external-links">
          {links.map((link) => (
            <a
              key={link.url}
              className="external-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
