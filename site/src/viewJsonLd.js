import { siteOrigin, viewPageUrl } from './seo.js';

function pieceDescription(piece) {
  return piece.description?.split('\n\n').find(Boolean);
}

function pdfContentUrl(file) {
  const encoded = file.split('/').map(encodeURIComponent).join('/');
  return `${siteOrigin}/pdf/${encoded}`;
}

export function viewMusicCompositionJsonLd(piece, pdf, routeName) {
  const item = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: piece.title,
    url: viewPageUrl(routeName),
  };

  const description = pieceDescription(piece);
  if (description) item.description = description;
  if (pdf?.file) {
    item.encoding = {
      '@type': 'MediaObject',
      contentUrl: pdfContentUrl(pdf.file),
      encodingFormat: 'application/pdf',
    };
  }

  return item;
}
