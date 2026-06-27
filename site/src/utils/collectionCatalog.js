function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

/**
 * Map a bookend user collection into catalog.yaml-shaped sections.
 * books -> sections, pieces -> pieces, parts -> pdfs with labels.
 *
 * @param {{ books?: Array<{ name: string, pieces: Array<{ name: string, parts: Array<{ name: string, pdf: string }> }> }> }} collection
 */
export function userCollectionToSections(collection) {
  const usedIds = new Set();

  const uniqueSectionId = (name) => {
    let id = slugify(name);
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${slugify(name)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    return id;
  };

  return (collection?.books ?? [])
    .map((book) => {
      const pieces = (book.pieces ?? [])
        .map((piece) => {
          const pdfs = (piece.parts ?? [])
            .filter((part) => part.pdf)
            .map((part) => ({
              label: part.name,
              file: part.pdf,
            }));
          if (pdfs.length === 0) return null;
          const entry = {
            title: piece.name,
            pdfs,
          };
          if (piece.composer) {
            entry.composer = piece.composer;
          }
          return entry;
        })
        .filter(Boolean);

      if (pieces.length === 0) return null;

      return {
        id: uniqueSectionId(book.name),
        title: book.name,
        pieces,
      };
    })
    .filter(Boolean);
}
