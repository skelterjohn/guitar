import { defaultDescription, siteHeading, siteOrigin, viewPageUrl } from './seo.js';

function pieceDescription(piece) {
  return piece.description?.split('\n\n').find(Boolean);
}

function musicComposition(piece) {
  const primaryPdf = piece.pdfs[0];
  const item = {
    '@type': 'MusicComposition',
    name: piece.title,
    url: viewPageUrl(primaryPdf.file),
  };

  const description = pieceDescription(piece);
  if (description) item.description = description;

  return item;
}

export function buildHomeJsonLd(catalog) {
  const pieces = catalog.sections.flatMap((section) => section.pieces);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        name: siteHeading,
        url: `${siteOrigin}/`,
        description: defaultDescription,
      },
      {
        '@type': 'ItemList',
        '@id': `${siteOrigin}/#catalog`,
        name: siteHeading,
        numberOfItems: pieces.length,
        itemListElement: pieces.map((piece, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: musicComposition(piece),
        })),
      },
    ],
  };
}
