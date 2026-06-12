import { useParams } from 'react-router-dom';
import catalog from '../data/catalog.json';
import PdfViewer from '../components/PdfViewer.jsx';

function findPdfLabel(filename) {
  for (const section of catalog.sections) {
    for (const piece of section.pieces) {
      for (const pdf of piece.pdfs) {
        if (pdf.file === filename) {
          return `${piece.title} — ${pdf.label}`;
        }
      }
    }
  }
  return filename;
}

export default function ViewPdf() {
  const { filename } = useParams();
  const decoded = decodeURIComponent(filename);

  return <PdfViewer filename={decoded} displayName={findPdfLabel(decoded)} />;
}
