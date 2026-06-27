function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

/**
 * Map a user library into catalog.yaml-shaped sections.
 * @param {{ pieces?: Array<{ id: string, name: string, composer?: string, part?: string, pdf: string }>, books?: Array<{ id: string, name: string, pieces: Array<{ id: string, name: string, composer?: string, part?: string, pdf: string }> }> }} library
 */
export function userCollectionToSections(library) {
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

  return (library?.books ?? [])
    .map((book) => {
      const pieces = (book.pieces ?? [])
        .filter((piece) => piece.pdf)
        .map((piece) => {
          const pdfs = [
            {
              label: piece.part?.trim() || 'score',
              file: piece.pdf,
            },
          ];

          for (const subpart of piece.subparts ?? []) {
            pdfs.push({
              label: subpart.part,
              file: piece.pdf,
              pageStart: subpart.pageStart,
              pageEnd: subpart.pageEnd,
            });
          }

          const entry = {
            pieceKey: piece.name,
            title: piece.name,
            pdf: piece.pdf,
            pdfs,
          };
          if (piece.composer) {
            entry.composer = piece.composer;
          }
          return entry;
        })
        .filter((entry) => entry.pdf);

      if (pieces.length === 0) return null;

      return {
        id: uniqueSectionId(book.name),
        title: book.name,
        bookKey: book.name,
        pieces,
      };
    })
    .filter(Boolean);
}
