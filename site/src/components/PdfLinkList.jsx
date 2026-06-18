import { Link } from 'react-router-dom';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';

export default function PdfLinkList({ pdfs, currentFile, viewState }) {
  const linkState = { ...viewState, explicitPdf: true };

  return (
    <div className="pdf-links">
      {pdfs.map((pdf) => (
        <Link
          key={pdf.file}
          className={`pdf-link${pdfFilesMatch(pdf.file, currentFile) ? ' pdf-link-active' : ''}`}
          to={`/view/${encodeURIComponent(pdf.file)}`}
          state={linkState}
          aria-current={pdf.file === currentFile ? 'page' : undefined}
        >
          {pdf.label}
        </Link>
      ))}
    </div>
  );
}
