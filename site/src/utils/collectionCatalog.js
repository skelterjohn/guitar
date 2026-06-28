function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

/**
 * Build viewer/catalog pdf links for a library piece, including subparts.
 * @param {{ part?: string, pdf: string, subparts?: Array<{ part: string, pageStart: number, pageEnd: number }> }} piece
 */
export function piecePdfs(piece) {
  if (!piece?.pdf) return [];

  const pdfs = [
    {
      label: piece.part?.trim() || 'score',
      file: piece.pdf,
    },
  ];

  for (const subpart of piece.subparts ?? []) {
    pdfs.push({
      label: subpart.part?.trim() || 'score',
      file: piece.pdf,
      pageStart: subpart.pageStart,
      pageEnd: subpart.pageEnd,
    });
  }

  return pdfs;
}

/**
 * @param {{ part?: string, pageStart: number, pageEnd: number }} subpart
 * @param {{ pdf: string }} piece
 */
export function subpartPdf(subpart, piece) {
  return {
    label: subpart.part?.trim() || 'score',
    file: piece.pdf,
    pageStart: subpart.pageStart,
    pageEnd: subpart.pageEnd,
  };
}

/**
 * Map a user library into catalog.yaml-shaped sections.
 * @param {{ pieces?: Array<{ id: string, name: string, composer?: string, part?: string, pdf: string, subparts?: Array<{ id: string, part?: string, pageStart: number, pageEnd: number }> }>, books?: Array<{ id: string, name: string, pieces: Array<{ id: string, name: string, composer?: string, part?: string, pdf: string, subparts?: Array<{ id: string, part?: string, pageStart: number, pageEnd: number }> }>, subparts?: Array<{ id: string, pieceId?: string, part?: string, pageStart: number, pageEnd: number }> }> }} library
 */
export function userCollectionToSections(library) {
  const usedIds = new Set();
  const piecesById = new Map((library?.pieces ?? []).map((piece) => [piece.id, piece]));

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

  const pieceEntry = (piece, pdfs) => {
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
  };

  return (library?.books ?? [])
    .map((book) => {
      const wholePieceIds = new Set((book.pieces ?? []).map((piece) => piece.id));
      const entries = [];

      for (const piece of book.pieces ?? []) {
        if (!piece.pdf) continue;
        entries.push(pieceEntry(piece, piecePdfs(piece)));
      }

      const subpartsByPieceId = new Map();
      for (const subpart of book.subparts ?? []) {
        const pieceId = subpart.pieceId;
        if (!pieceId || wholePieceIds.has(pieceId)) continue;

        const piece = piecesById.get(pieceId);
        if (!piece?.pdf) continue;

        if (!subpartsByPieceId.has(pieceId)) {
          subpartsByPieceId.set(pieceId, { piece, subparts: [] });
        }
        subpartsByPieceId.get(pieceId).subparts.push(subpart);
      }

      for (const { piece, subparts } of subpartsByPieceId.values()) {
        entries.push(pieceEntry(piece, subparts.map((subpart) => subpartPdf(subpart, piece))));
      }

      if (entries.length === 0) return null;

      return {
        id: uniqueSectionId(book.name),
        title: book.name,
        bookKey: book.name,
        pieces: entries,
      };
    })
    .filter(Boolean);
}
