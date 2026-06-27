/**
 * Match when every whitespace-separated token appears in haystack, in order.
 * Each token may match as a substring or as a fuzzy subsequence.
 */
export function fuzzyMatch(haystack, query) {
  const text = String(haystack ?? '').toLowerCase();
  const tokens = String(query ?? '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    if (text.includes(token)) return true;
    let index = 0;
    for (let i = 0; i < text.length && index < token.length; i += 1) {
      if (text[i] === token[index]) index += 1;
    }
    return index === token.length;
  });
}

export function joinSearchFields(...fields) {
  return fields.filter(Boolean).join(' ');
}

/**
 * @param {{ title: string, pieces: Array<{ title: string, composer?: string, part?: string, pdf?: string, pdfs?: Array<{ file: string, label: string }> }> }} section
 */
export function filterCatalogSections(sections, query) {
  if (!query.trim()) return sections;

  return sections
    .map((section) => {
      const bookMatches = fuzzyMatch(section.title, query);
      const pieces = section.pieces.filter((piece) => {
        if (bookMatches) return true;
        return fuzzyMatch(
          joinSearchFields(
            piece.title,
            piece.composer,
            piece.part,
            piece.pdf,
            ...(piece.pdfs ?? []).flatMap((pdf) => [pdf.file, pdf.label]),
          ),
          query,
        );
      });
      if (pieces.length === 0) return null;
      return { ...section, pieces };
    })
    .filter(Boolean);
}
