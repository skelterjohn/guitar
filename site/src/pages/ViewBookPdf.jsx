import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import BookAuthGate from '../components/BookAuthGate.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import { createSubpart, downloadBookPdf, fetchBookPdfBytes, fetchUserLibrary } from '../bookendClient.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookBackLabel, bookPath, bookTitle, bookViewPath, pageTitle, parseBookViewPageRange } from '../seo.js';
import { pieceId } from '../utils/pieceId.js';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { userCollectionToSections, piecePdfs } from '../utils/collectionCatalog.js';

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
  const [searchParams] = useSearchParams();
  const decoded = decodeURIComponent(filename);
  const pageRange = useMemo(
    () => parseBookViewPageRange(searchParams.toString()),
    [searchParams],
  );
  const [library, setLibrary] = useState({ pieces: [], books: [] });
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchUserLibrary(user)
      .then((nextLibrary) => {
        if (cancelled) return;
        setLibrary(nextLibrary);
        setSections(userCollectionToSections(nextLibrary));
      })
      .catch((error) => {
        console.error('Could not load collections:', error);
        if (!cancelled) {
          setLibrary({ pieces: [], books: [] });
          setSections([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const { section, piece } = useMemo(
    () => findPdfInSections(sections, decoded) ?? { section: null, piece: null },
    [sections, decoded],
  );
  const libraryPiece = useMemo(
    () => library.pieces.find((entry) => pdfFilesMatch(entry.pdf, decoded)) ?? null,
    [library.pieces, decoded],
  );
  const viewerPdfs = useMemo(() => {
    if (piece?.pdfs?.length) return piece.pdfs;
    return piecePdfs(libraryPiece);
  }, [piece, libraryPiece]);
  const pieceKey = useMemo(() => {
    if (section && piece) return pieceId(section.id, piece.title);
    if (libraryPiece?.name) return libraryPiece.name;
    return null;
  }, [section, piece, libraryPiece]);

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

  const handleCreateSubpart = useCallback(
    async ({ part, pageStart, pageEnd }) => {
      if (!libraryPiece?.name) {
        throw new Error('Save piece info first.');
      }
      await createSubpart(user, libraryPiece.name, { part, pageStart, pageEnd });
      const nextLibrary = await fetchUserLibrary(user);
      setLibrary(nextLibrary);
      setSections(userCollectionToSections(nextLibrary));
    },
    [user, libraryPiece?.name],
  );

  usePageMeta({
    title: pageTitle(decoded),
    description: `${decoded} — ${bookTitle}`,
    url: `${window.location.origin}${bookViewPath(decoded, pageRange ?? {})}`,
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
      pdfs={viewerPdfs}
      pieceKey={pieceKey}
      sectionPieces={sectionPiecesForNav(section, piece)}
      sectionTitle={section?.title ?? null}
      pageStart={pageRange?.pageStart ?? null}
      pageEnd={pageRange?.pageEnd ?? null}
      bookPieceName={libraryPiece?.name ?? null}
      onCreateSubpart={libraryPiece?.name ? handleCreateSubpart : null}
      backTo={bookPath()}
      backLabel={bookBackLabel}
      viewState={{ from: bookPath() }}
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
