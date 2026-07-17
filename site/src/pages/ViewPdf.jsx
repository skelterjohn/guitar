import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import PdfViewer from '../components/PdfViewer.jsx';
import RepPasswordGate from '../components/RepPasswordGate.jsx';
import { auth, isFirebaseConfigured } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import useRepertoire from '../hooks/useRepertoire.js';
import { catalogPath, pageTitle, repPath, viewPageUrl, viewPath } from '../seo.js';
import { pieceId } from '../utils/pieceId.js';
import {
  getPieceLabelPreference,
  pdfFileForPiece,
  pdfFilesMatch,
} from '../utils/pieceLabelPreference.js';
import { viewRouteFilename } from '../utils/pdfPaths.js';

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

function findPdf(filename, repertoireSections, preferRepertoire = false) {
  const primary = preferRepertoire ? repertoireSections : catalog.sections;
  const secondary = preferRepertoire ? catalog.sections : repertoireSections;

  return (
    findPdfInSections(primary, filename) ??
    findPdfInSections(secondary, filename) ?? {
      section: null,
      piece: null,
      pdf: null,
    }
  );
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

function viewerPageName(piece, pdf, filename) {
  if (!piece || !pdf) return filename;
  if (pdf.label === 'score') return piece.title;
  return `${piece.title} (${pdf.label})`;
}

function ViewPdfInner({ syncUser = null }) {
  const { filename } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fromRep = location.pathname.startsWith(`${repPath}/view/`);
  const { repertoire, loading: repertoireLoading } = useRepertoire();
  const decoded = decodeURIComponent(filename);
  const routeName = viewRouteFilename(decoded);
  const repertoireSections = repertoire?.sections ?? [];
  const { section, piece, pdf } = repertoireLoading
    ? { section: null, piece: null, pdf: null }
    : findPdf(routeName, repertoireSections, fromRep);
  const pieceKey =
    section && piece ? pieceId(section.id, piece.title) : null;
  const storageFile = pdf?.file ?? decoded;

  useEffect(() => {
    if (repertoireLoading) return;

    if (routeName !== decoded) {
      navigate(viewPath(routeName, fromRep ? 'rep' : 'catalog'), {
        replace: true,
        state: location.state,
      });
      return;
    }

    if (!piece?.pdfs?.length || !pieceKey || location.state?.explicitPdf) return;

    const preferredFile = pdfFileForPiece(
      piece.pdfs,
      getPieceLabelPreference(pieceKey),
    );
    if (!preferredFile || pdfFilesMatch(preferredFile, routeName)) return;

    navigate(viewPath(preferredFile, fromRep ? 'rep' : 'catalog'), {
      replace: true,
      state: location.state,
    });
  }, [
    decoded,
    routeName,
    fromRep,
    location.state,
    navigate,
    piece,
    pieceKey,
    repertoireLoading,
  ]);

  const name = viewerPageName(piece, pdf, routeName);
  const description =
    piece?.description?.split('\n\n').find(Boolean) ?? `${name} — guitar score PDF`;

  usePageMeta({
    title: pageTitle(name),
    description,
    url: fromRep
      ? `${window.location.origin}${location.pathname}`
      : viewPageUrl(routeName),
    noindex: fromRep,
  });

  if (fromRep && repertoireLoading) {
    return <p className="book-empty">Loading repertoire…</p>;
  }

  const viewer = (
    <PdfViewer
      filename={storageFile}
      pdfHash={pdf?.hash}
      pdfs={piece?.pdfs ?? []}
      pieceKey={pieceKey}
      sectionPieces={sectionPiecesForNav(section, piece)}
      sectionTitle={section?.title ?? null}
      backTo={fromRep ? repPath : catalogPath}
      backLabel={fromRep ? 'Repertoire' : 'Catalog'}
      viewState={fromRep ? { from: repPath } : undefined}
      syncUser={syncUser}
    />
  );

  return fromRep ? (
    <RepPasswordGate blockContent>{viewer}</RepPasswordGate>
  ) : (
    viewer
  );
}

function RepViewPdf() {
  const [user] = useAuthState(auth);
  return <ViewPdfInner syncUser={user?.email ? user : null} />;
}

export default function ViewPdf() {
  const location = useLocation();
  const fromRep = location.pathname.startsWith(`${repPath}/view/`);

  if (fromRep && isFirebaseConfigured()) {
    return <RepViewPdf />;
  }

  return <ViewPdfInner />;
}
