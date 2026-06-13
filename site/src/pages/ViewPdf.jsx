import { useParams } from 'react-router-dom';
import catalog from '../data/catalog.js';
import PdfViewer from '../components/PdfViewer.jsx';

function findPiece(filename) {
  for (const section of catalog.sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdf.file === filename) {
          return piece;
        }
      }
    }
  }
  return null;
}

export default function ViewPdf() {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);
  const piece = findPiece(decoded);

  return (
    <PdfViewer
      filename={decoded}
      pdfs={piece?.pdfs ?? []}
    />
  );
}
