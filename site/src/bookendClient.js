import { bookendBaseUrl } from './config.js';
import { auth } from './firebase.js';

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

/** @typedef {{ id: string, name: string, composer?: string, part?: string, pdf: string }} LibraryPiece */
/** @typedef {{ id: string, name: string, pieces: LibraryPiece[] }} LibraryBook */
/** @typedef {{ pieces: LibraryPiece[], books: LibraryBook[] }} UserLibrary */

function normalizePiece(piece) {
  return {
    id: typeof piece?.id === 'string' ? piece.id : '',
    name: typeof piece?.name === 'string' ? piece.name : '',
    composer: typeof piece?.composer === 'string' ? piece.composer : '',
    part: typeof piece?.part === 'string' ? piece.part : '',
    pdf: typeof piece?.pdf === 'string' ? piece.pdf : '',
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
