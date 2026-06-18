import { Link } from 'react-router-dom';

export default function PdfLinkList({ pdfs, currentFile, viewState }) {
  return (
    <div className="pdf-links">
      {pdfs.map((pdf) => (
        <Link
          key={pdf.file}
          className={`pdf-link${pdf.file === currentFile ? ' pdf-link-active' : ''}`}
          to={`/view/${encodeURIComponent(pdf.file)}`}
          state={viewState}
          aria-current={pdf.file === currentFile ? 'page' : undefined}
        >
          {pdf.label}
        </Link>
      ))}
    </div>
  );
}
