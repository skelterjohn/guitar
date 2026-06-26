import { Link } from 'react-router-dom';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { bookPath, catalogPath, repPath, viewPath } from '../seo.js';

function viewContextForPrefix(viewPrefix) {
  if (viewPrefix === repPath) return 'rep';
  if (viewPrefix === bookPath) return 'book';
  return 'catalog';
}

export default function PdfLinkList({
  pdfs,
  currentFile,
  viewState,
  viewPrefix = catalogPath,
}) {
  const linkState = { ...viewState, explicitPdf: true };
  const viewContext = viewContextForPrefix(viewPrefix);

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
