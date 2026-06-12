import { Link } from 'react-router-dom';
import { pdfUrl } from '../config.js';

export default function PdfViewer({ filename, displayName }) {
  const url = pdfUrl(filename);

  return (
    <div className="viewer-page">
      <div className="viewer-toolbar">
        <Link to="/">&larr; Catalog</Link>
        <span className="viewer-title">{displayName ?? filename}</span>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
      <iframe
        className="viewer-frame"
        src={url}
        title={displayName ?? filename}
      />
    </div>
  );
}
