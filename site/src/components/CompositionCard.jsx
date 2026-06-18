import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import PdfLinkList from './PdfLinkList.jsx';

export default function CompositionCard({ piece, id, viewState, viewPrefix }) {
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const links = piece.links ?? [];

  return (
    <article id={id} className="composition-card">
      <h3>{piece.title}</h3>
      {paragraphs.length > 0 && (
        <div className="composition-description">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <PdfLinkList pdfs={piece.pdfs} viewState={viewState} viewPrefix={viewPrefix} />
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
