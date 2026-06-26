import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BookAuthGate from '../components/BookAuthGate.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import { downloadBookPdf, fetchBookPdfBytes } from '../bookendClient.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookBackLabel, bookPath, bookTitle, bookViewPath, pageTitle } from '../seo.js';

function bookAnnotationKey(email, filename) {
  return `book/${email.toLowerCase()}/${filename}`;
}

function bookPdfUrl(email, filename) {
  return `book://${encodeURIComponent(email)}/${encodeURIComponent(filename)}`;
}

function ViewBookPdfInner({ user }) {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);

  const annotationKey = useMemo(
    () => bookAnnotationKey(user.email, decoded),
    [user.email, decoded],
  );
  const pdfUrl = useMemo(
    () => bookPdfUrl(user.email, decoded),
    [user.email, decoded],
  );
  const loadPdfBytes = useMemo(
    () => (onPhase) => fetchBookPdfBytes(user, decoded, onPhase),
    [user, decoded],
  );
  const handleDownload = useMemo(
    () => () => downloadBookPdf(user, decoded),
    [user, decoded],
  );

  usePageMeta({
    title: pageTitle(decoded),
    description: `${decoded} — ${bookTitle}`,
    url: `${window.location.origin}${bookViewPath(decoded)}`,
    noindex: true,
  });

  return (
    <PdfViewer
      filename={annotationKey}
      pdfUrl={pdfUrl}
      loadPdfBytes={loadPdfBytes}
      downloadName={decoded}
      onDownload={handleDownload}
      backTo={bookPath}
      backLabel={bookBackLabel}
    />
  );
}

export default function ViewBookPdf() {
  return (
    <BookAuthGate>
      {(user) => (user?.email ? <ViewBookPdfInner user={user} /> : null)}
    </BookAuthGate>
  );
}
