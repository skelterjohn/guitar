import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import repertoire from '../data/repertoire.js';
import PdfViewer from '../components/PdfViewer.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { catalogPath, pageTitle, repPath, viewPageUrl, viewPath } from '../seo.js';
import { pieceId } from '../utils/pieceId.js';
import {
  getPieceLabelPreference,
  pdfFileForPiece,
  pdfFilesMatch,
} from '../utils/pieceLabelPreference.js';

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

function findPdf(filename, preferRepertoire = false) {
  const primary = preferRepertoire ? repertoire.sections : catalog.sections;
  const secondary = preferRepertoire ? catalog.sections : repertoire.sections;

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

export default function ViewPdf() {
  const { filename } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fromRep = location.pathname.startsWith(`${repPath}/view/`);
  const decoded = decodeURIComponent(filename);
  const { section, piece, pdf } = findPdf(decoded, fromRep);
  const pieceKey =
    section && piece ? pieceId(section.id, piece.title) : null;

  useEffect(() => {
    if (!piece?.pdfs?.length || !pieceKey || location.state?.explicitPdf) return;

    const preferredFile = pdfFileForPiece(
      piece.pdfs,
      getPieceLabelPreference(pieceKey),
    );
    if (!preferredFile || pdfFilesMatch(preferredFile, decoded)) return;

    navigate(viewPath(preferredFile, fromRep ? 'rep' : 'catalog'), {
      replace: true,
      state: location.state,
    });
  }, [decoded, location.state, navigate, piece, pieceKey]);

  const name = viewerPageName(piece, pdf, decoded);
  const description =
    piece?.description?.split('\n\n').find(Boolean) ?? `${name} — guitar score PDF`;

  usePageMeta({
    title: pageTitle(name),
    description,
    url: viewPageUrl(decoded),
  });

  return (
    <PdfViewer
      filename={decoded}
      pdfHash={pdf?.hash}
      pdfs={piece?.pdfs ?? []}
      pieceKey={pieceKey}
      sectionPieces={sectionPiecesForNav(section, piece)}
      sectionTitle={section?.title ?? null}
      backTo={fromRep ? repPath : catalogPath}
      backLabel={fromRep ? 'Repertoire' : 'Catalog'}
      viewState={fromRep ? { from: repPath } : undefined}
    />
  );
}
