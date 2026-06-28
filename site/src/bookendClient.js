import { bookendBaseUrl } from './config.js';
import { auth } from './firebase.js';
import { remoteAnnotationsToPages } from './utils/annotationSync.js';

async function authHeaders(user) {
  const activeUser = user ?? auth?.currentUser;
  if (!activeUser) {
    throw new Error('You must be signed in.');
  }
  const token = await activeUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

function bookZipDownloadName(email) {
  return `bluebridge-${email.trim().toLowerCase()}-export.zip`;
}

function bookListEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/book/${encodeURIComponent(email)}`;
}

function bookZipEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/book/${encodeURIComponent(email)}/zip`;
}

function bookEndpoint(email, filename) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/book/${encodeURIComponent(email)}/${encodeURIComponent(filename)}`;
}

function bookAnnotationsEndpoint(email, filename) {
  return `${bookEndpoint(email, filename)}/annotations`;
}

function bookAnnotationRasterEndpoint(email, filename, rasterName) {
  return `${bookAnnotationsEndpoint(email, filename)}/rasters/${encodeURIComponent(rasterName)}`;
}

function libraryBookEndpoint(email, book) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/books/${enc(book)}`;
}

function libraryBooksEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/users/${encodeURIComponent(email)}/books`;
}

function libraryPieceEndpoint(email, piece) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/pieces/${enc(piece)}`;
}

function librarySubpartsEndpoint(email, piece) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/pieces/${enc(piece)}/subparts`;
}

function librarySubpartEndpoint(email, piece, subpart) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/pieces/${enc(piece)}/subparts/${enc(subpart)}`;
}

function libraryPiecesEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/users/${encodeURIComponent(email)}/pieces`;
}

function libraryBookPieceEndpoint(email, { book, piece }) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/books/${enc(book)}/pieces/${enc(piece)}`;
}

function userLibraryEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/users/${encodeURIComponent(email)}`;
}

function requireUserEmail(user) {
  const email = user?.email;
  if (!email) {
    throw new Error('Signed-in user has no email address.');
  }
  return email;
}

async function errorMessage(res, fallback) {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
  } catch {
    // response was not JSON
  }
  return fallback;
}

export async function listBookPdfs(user) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookListEndpoint(email), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not list PDFs (${res.status}).`));
  }
  const data = await res.json();
  if (!Array.isArray(data.files)) return [];

  return data.files
    .map((file) => {
      if (typeof file === 'string') {
        return { name: file, modifiedAt: '' };
      }
      return {
        name: typeof file?.name === 'string' ? file.name : '',
        modifiedAt: typeof file?.modifiedAt === 'string' ? file.modifiedAt : '',
      };
    })
    .filter((file) => file.name);
}

export async function uploadBookPdf(user, filename, file) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookEndpoint(email, filename), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/pdf' },
    body: file,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Upload failed (${res.status}).`));
  }
}

export async function uploadBookZip(user, file) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookZipEndpoint(email), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/zip' },
    body: file,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Zip upload failed (${res.status}).`));
  }
  const data = await res.json();
  return Array.isArray(data.files) ? data.files : [];
}

export async function deleteBookPdf(user, filename) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookEndpoint(email, filename), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Delete failed (${res.status}).`));
  }
}

export async function fetchBookPdf(user, filename) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookEndpoint(email, filename), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load PDF (${res.status}).`));
  }
  return res.blob();
}

export async function downloadBookPdf(user, filename) {
  const blob = await fetchBookPdf(user, filename);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function downloadBookPdfZip(user) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookZipEndpoint(email), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Export failed (${res.status}).`));
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = bookZipDownloadName(email);
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function fetchBookPdfBytes(user, filename, onPhase) {
  onPhase?.('downloading');
  const blob = await fetchBookPdf(user, filename);
  onPhase?.('loading');
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function storeAnnotationRasters(user, pdfFilename, { hash, color, pages, rasters }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const form = new FormData();
  form.append('hash', hash);
  if (color) {
    form.append('color', color);
  }
  form.append('pages', JSON.stringify(pages));
  for (const raster of rasters) {
    form.append('rasters', raster.blob, raster.name);
  }

  const res = await fetch(bookAnnotationsEndpoint(email, pdfFilename), {
    method: 'POST',
    headers,
    body: form,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not sync annotations (${res.status}).`));
  }
  return res.json();
}

function normalizeAnnotationRasterEntry(entry) {
  return {
    name: typeof entry?.name === 'string' ? entry.name : '',
    page: Number.isFinite(entry?.page) ? entry.page : 0,
    layer: typeof entry?.layer === 'string' ? entry.layer : '',
    width: Number.isFinite(entry?.width) ? entry.width : 0,
    height: Number.isFinite(entry?.height) ? entry.height : 0,
  };
}

function normalizeRemoteAnnotations(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const result = {
    pdf: typeof data.pdf === 'string' ? data.pdf : '',
    hash: typeof data.hash === 'string' ? data.hash : '',
    match: data.match === true,
    color: typeof data.color === 'string' ? data.color : '',
    pages: data.pages && typeof data.pages === 'object' ? data.pages : {},
    rasters: Array.isArray(data.rasters)
      ? data.rasters.map(normalizeAnnotationRasterEntry).filter((entry) => entry.name)
      : [],
  };

  if (!result.hash) {
    return null;
  }

  return result;
}

export async function getAnnotationRasters(user, pdfFilename, clientHash) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  let url = bookAnnotationsEndpoint(email, pdfFilename);
  if (clientHash) {
    url += `?hash=${encodeURIComponent(clientHash)}`;
  }

  const res = await fetch(url, { headers });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load annotations (${res.status}).`));
  }

  return normalizeRemoteAnnotations(await res.json());
}

export async function fetchAnnotationRaster(user, pdfFilename, rasterName) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(bookAnnotationRasterEndpoint(email, pdfFilename, rasterName), {
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load annotation raster (${res.status}).`));
  }
  return res.blob();
}

export async function downloadRemoteAnnotations(user, pdfFilename, remote) {
  const rasterBlobsByName = {};
  for (const raster of remote.rasters) {
    rasterBlobsByName[raster.name] = await fetchAnnotationRaster(user, pdfFilename, raster.name);
  }

  return {
    pages: remoteAnnotationsToPages(remote.pages, rasterBlobsByName, remote.rasters),
    hash: remote.hash,
    color: remote.color,
  };
}

/** @typedef {{ id: string, part: string, pageStart: number, pageEnd: number }} LibrarySubpart */
/** @typedef {{ id: string, name: string, composer?: string, part?: string, pdf: string, subparts?: LibrarySubpart[] }} LibraryPiece */
/** @typedef {{ id: string, name: string, pieces: LibraryPiece[] }} LibraryBook */
/** @typedef {{ pieces: LibraryPiece[], books: LibraryBook[] }} UserLibrary */

function normalizeSubpart(subpart) {
  return {
    id: typeof subpart?.id === 'string' ? subpart.id : '',
    part: typeof subpart?.part === 'string' ? subpart.part : '',
    pageStart: Number.isFinite(subpart?.pageStart) ? subpart.pageStart : 0,
    pageEnd: Number.isFinite(subpart?.pageEnd) ? subpart.pageEnd : 0,
  };
}

function normalizePiece(piece) {
  const subparts = Array.isArray(piece?.subparts) ? piece.subparts : [];
  return {
    id: typeof piece?.id === 'string' ? piece.id : '',
    name: typeof piece?.name === 'string' ? piece.name : '',
    composer: typeof piece?.composer === 'string' ? piece.composer : '',
    part: typeof piece?.part === 'string' ? piece.part : '',
    pdf: typeof piece?.pdf === 'string' ? piece.pdf : '',
    subparts: subparts.map(normalizeSubpart).filter((entry) => entry.id),
  };
}

function normalizeUserLibrary(data) {
  const pieces = Array.isArray(data?.pieces) ? data.pieces : [];
  const books = Array.isArray(data?.books) ? data.books : [];
  return {
    pieces: pieces.map(normalizePiece),
    books: books.map((book) => ({
      id: typeof book?.id === 'string' ? book.id : '',
      name: typeof book?.name === 'string' ? book.name : '',
      pieces: (Array.isArray(book?.pieces) ? book.pieces : []).map(normalizePiece),
    })),
  };
}

/**
 * Fetch the user's pieces and books.
 * @returns {Promise<UserLibrary>}
 */
export async function fetchUserLibrary(user) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(userLibraryEndpoint(email), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load library (${res.status}).`));
  }
  const data = await res.json();
  return normalizeUserLibrary(data);
}

/** @deprecated use fetchUserLibrary */
export const fetchUserCollection = fetchUserLibrary;

export async function createPiece(user, { name, composer = '', part = '', pdf }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryPiecesEndpoint(email), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, composer, part, pdf }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not create piece (${res.status}).`));
  }
  const data = await res.json();
  return normalizePiece(data);
}

export async function updatePiece(user, pieceKey, { name, composer = '', part = '', pdf }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryPieceEndpoint(email, pieceKey), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, composer, part, pdf }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not save piece (${res.status}).`));
  }
  const data = await res.json();
  return normalizePiece(data);
}

export async function deletePiece(user, pieceKey) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryPieceEndpoint(email, pieceKey), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not delete piece (${res.status}).`));
  }
}

export async function createSubpart(user, pieceKey, { part, pageStart, pageEnd }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(librarySubpartsEndpoint(email, pieceKey), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ part, pageStart, pageEnd }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not create part (${res.status}).`));
  }
  const data = await res.json();
  return normalizeSubpart(data);
}

export async function deleteSubpart(user, pieceKey, subpartKey) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(librarySubpartEndpoint(email, pieceKey, subpartKey), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not delete part (${res.status}).`));
  }
}

export async function createBook(user, { name }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryBooksEndpoint(email), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not create book (${res.status}).`));
  }
  const data = await res.json();
  return {
    id: typeof data?.id === 'string' ? data.id : '',
    name: typeof data?.name === 'string' ? data.name : name,
    pieces: [],
  };
}

export async function updateBook(user, bookKey, { name }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryBookEndpoint(email, bookKey), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not save book (${res.status}).`));
  }
  const data = await res.json();
  return typeof data.name === 'string' ? data.name : name;
}

export async function deleteBook(user, bookKey) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryBookEndpoint(email, bookKey), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not delete book (${res.status}).`));
  }
}

export async function addPieceToBook(user, { book, piece }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryBookPieceEndpoint(email, { book, piece }), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not add piece to book (${res.status}).`));
  }
}

export async function removePieceFromBook(user, { book, piece }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(libraryBookPieceEndpoint(email, { book, piece }), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not remove piece from book (${res.status}).`));
  }
}
