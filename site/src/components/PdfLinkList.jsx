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

function pdfLinkIsActive(pdf, currentFile, pageStart, pageEnd) {
  if (!pdfFilesMatch(pdf.file, currentFile)) return false;

  const linkStart = pdf.pageStart ?? null;
  const linkEnd = pdf.pageEnd ?? linkStart;
  const activeStart = pageStart ?? null;
  const activeEnd = pageEnd ?? pageStart;

  if (linkStart != null) {
    return linkStart === activeStart && linkEnd === activeEnd;
  }

  return activeStart == null;
}

export default function PdfLinkList({
  pdfs,
  currentFile,
  viewState,
  viewPrefix = catalogPath,
  availableFiles,
  pageStart = null,
  pageEnd = null,
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
        const active = pdfLinkIsActive(pdf, currentFile, pageStart, pageEnd);
        const classes = ['pdf-link'];
        if (active) classes.push('pdf-link-active');
        if (missing) classes.push('pdf-link-missing');
        const linkKey = `${pdf.file}:${pdf.label}:${pdf.pageStart ?? ''}:${pdf.pageEnd ?? ''}`;

        if (missing) {
          return (
            <span
              key={linkKey}
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
            key={linkKey}
            className={classes.join(' ')}
            to={viewLinkForPdf(pdf, viewContext)}
            state={linkState}
            aria-current={active ? 'page' : undefined}
          >
            {pdf.label}
          </Link>
        );
      })}
    </div>
  );
}
