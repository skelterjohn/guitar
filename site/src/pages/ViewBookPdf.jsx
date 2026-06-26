import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookAuthGate from '../components/BookAuthGate.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import { downloadBookPdf, fetchBookPdfBytes, fetchUserCollection } from '../bookendClient.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookBackLabel, bookPath, bookTitle, bookViewPath, pageTitle } from '../seo.js';
import { pieceId } from '../utils/pieceId.js';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { userCollectionToSections } from '../utils/collectionCatalog.js';

function bookAnnotationKey(email, filename) {
  return `book/${email.toLowerCase()}/${filename}`;
}

function bookPdfUrl(email, filename) {
  return `book://${encodeURIComponent(email)}/${encodeURIComponent(filename)}`;
}

function findPdfInSections(sections, filename) {
  for (const section of sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdfFilesMatch(pdf.file, filename)) {
          return { section, piece, pdf };
        }
      }
    }
  }
  return null;
}

function sectionPiecesForNav(section, currentPiece) {
  if (!section || !currentPiece) return [];

  return section.pieces
    .map((piece) => ({
      title: piece.title,
      pdfs: piece.pdfs,
      pieceKey: pieceId(section.id, piece.title),
      isCurrent: piece === currentPiece,
    }))
    .filter((entry) => entry.pdfs[0]?.file);
}

function ViewBookPdfInner({ user }) {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchUserCollection(user)
      .then((collection) => {
        if (!cancelled) setSections(userCollectionToSections(collection));
      })
      .catch((error) => {
        console.error('Could not load collections:', error);
        if (!cancelled) setSections([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const { section, piece } = useMemo(
    () => findPdfInSections(sections, decoded) ?? { section: null, piece: null },
    [sections, decoded],
  );
  const pieceKey = section && piece ? pieceId(section.id, piece.title) : null;

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
      currentFile={decoded}
      pdfUrl={pdfUrl}
      loadPdfBytes={loadPdfBytes}
      downloadName={decoded}
      onDownload={handleDownload}
      pdfs={piece?.pdfs ?? []}
      pieceKey={pieceKey}
      sectionPieces={sectionPiecesForNav(section, piece)}
      sectionTitle={section?.title ?? null}
      backTo={bookPath}
      backLabel={bookBackLabel}
      viewState={{ from: bookPath }}
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
