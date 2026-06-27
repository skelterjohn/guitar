import { Link } from 'react-router-dom';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { bookViewPath, catalogPath, isBookPath, repPath, viewPath } from '../seo.js';

function viewLinkForPdf(pdf, viewContext) {
  if (viewContext === 'book' && pdf.pageStart) {
    return bookViewPath(pdf.file, {
      pageStart: pdf.pageStart,
      pageEnd: pdf.pageEnd ?? pdf.pageStart,
    });
  }
  return viewPath(pdf.file, viewContext);
}

function viewContextForPrefix(viewPrefix) {
  if (viewPrefix === repPath) return 'rep';
  if (isBookPath(viewPrefix)) return 'book';
  return 'catalog';
}

export default function PdfLinkList({
  pdfs,
  currentFile,
  viewState,
  viewPrefix = catalogPath,
  availableFiles,
}) {
  const linkState = { ...viewState, explicitPdf: true };
  const viewContext = viewContextForPrefix(viewPrefix);

  const isMissing = (file) => {
    if (!availableFiles) return false;
    return !availableFiles.some((available) => pdfFilesMatch(available, file));
  };

  return (
    <div className="pdf-links">
      {pdfs.map((pdf) => {
        const missing = isMissing(pdf.file);
        const classes = ['pdf-link'];
        if (pdfFilesMatch(pdf.file, currentFile)) classes.push('pdf-link-active');
        if (missing) classes.push('pdf-link-missing');

        if (missing) {
          return (
            <span
              key={pdf.file}
              className={classes.join(' ')}
              aria-disabled="true"
              title={`${pdf.file} is missing`}
            >
              {pdf.label}
            </span>
          );
        }

        return (
          <Link
            key={pdf.file}
            className={classes.join(' ')}
            to={viewLinkForPdf(pdf, viewContext)}
            state={linkState}
            aria-current={pdf.file === currentFile ? 'page' : undefined}
          >
            {pdf.label}
          </Link>
        );
      })}
    </div>
  );
}
