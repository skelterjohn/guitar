import { Link } from 'react-router-dom';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { catalogPath, repPath, viewPath } from '../seo.js';

export default function PdfLinkList({
  pdfs,
  currentFile,
  viewState,
  viewPrefix = catalogPath,
}) {
  const linkState = { ...viewState, explicitPdf: true };
  const viewContext = viewPrefix === repPath ? 'rep' : 'catalog';

  return (
    <div className="pdf-links">
      {pdfs.map((pdf) => (
        <Link
          key={pdf.file}
          className={`pdf-link${pdfFilesMatch(pdf.file, currentFile) ? ' pdf-link-active' : ''}`}
          to={viewPath(pdf.file, viewContext)}
          state={linkState}
          aria-current={pdf.file === currentFile ? 'page' : undefined}
        >
          {pdf.label}
        </Link>
      ))}
    </div>
  );
}
