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

function bookListEndpoint(email) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/book/${encodeURIComponent(email)}`;
}

function bookEndpoint(email, filename) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  return `${base}/v1/book/${encodeURIComponent(email)}/${encodeURIComponent(filename)}`;
}

function collectionPartEndpoint(email, { book, piece, part }) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/books/${enc(book)}/piece/${enc(piece)}/parts/${enc(part)}`;
}

function collectionPieceEndpoint(email, { book, piece }) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/books/${enc(book)}/piece/${enc(piece)}`;
}

function collectionBookEndpoint(email, { book }) {
  const base = bookendBaseUrl.replace(/\/$/, '');
  const enc = encodeURIComponent;
  return `${base}/v1/users/${enc(email)}/books/${enc(book)}`;
}

function userCollectionEndpoint(email) {
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
  return Array.isArray(data.files) ? data.files : [];
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

export async function fetchBookPdfBytes(user, filename, onPhase) {
  onPhase?.('downloading');
  const blob = await fetchBookPdf(user, filename);
  onPhase?.('loading');
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

/** @typedef {{ book: string, piece: string, part: string }} CollectionPartPath */
/** @typedef {{ name: string, pdf: string }} CollectionPart */
/** @typedef {{ name: string, composer?: string, parts: CollectionPart[] }} CollectionPiece */
/** @typedef {{ name: string, pieces: CollectionPiece[] }} CollectionBook */
/** @typedef {{ books: CollectionBook[] }} UserCollection */

function normalizeUserCollection(data) {
  const books = Array.isArray(data?.books) ? data.books : [];
  return {
    books: books.map((book) => ({
      name: typeof book?.name === 'string' ? book.name : '',
      pieces: (Array.isArray(book?.pieces) ? book.pieces : []).map((piece) => ({
        name: typeof piece?.name === 'string' ? piece.name : '',
        composer: typeof piece?.composer === 'string' ? piece.composer : '',
        parts: (Array.isArray(piece?.parts) ? piece.parts : []).map((part) => ({
          name: typeof part?.name === 'string' ? part.name : '',
          pdf: typeof part?.pdf === 'string' ? part.pdf : '',
        })),
      })),
    })),
  };
}

/**
 * Fetch the user's full music collection tree.
 * @returns {Promise<UserCollection>}
 */
export async function fetchUserCollection(user) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(userCollectionEndpoint(email), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load collection (${res.status}).`));
  }
  const data = await res.json();
  return normalizeUserCollection(data);
}

/**
 * Fetch the PDF filename stored for a collection part.
 * @param {CollectionPartPath} path
 * @returns {Promise<string>}
 */
export async function getCollectionPartPdf(user, { book, piece, part }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionPartEndpoint(email, { book, piece, part }), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load collection part (${res.status}).`));
  }
  const data = await res.json();
  return typeof data.pdf === 'string' ? data.pdf : '';
}

/**
 * Store a PDF filename for a collection part.
 * @param {CollectionPartPath} path
 * @param {string} pdf
 * @returns {Promise<string>}
 */
export async function setCollectionPartPdf(user, { book, piece, part }, pdf) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionPartEndpoint(email, { book, piece, part }), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdf }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not save collection part (${res.status}).`));
  }
  const data = await res.json();
  return typeof data.pdf === 'string' ? data.pdf : pdf;
}

/**
 * Update a collection book's display name.
 * @param {{ book: string }} path
 * @param {{ name: string }} updates
 * @returns {Promise<string>}
 */
export async function updateCollectionBook(user, { book }, { name }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionBookEndpoint(email, { book }), {
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

export async function deleteCollectionBook(user, { book }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionBookEndpoint(email, { book }), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not delete book (${res.status}).`));
  }
}

/**
 * Update a collection piece's display name and composer.
 * @param {{ book: string, piece: string }} path
 * @param {{ name: string, composer?: string }} updates
 * @returns {Promise<{ name: string, composer: string }>}
 */
export async function updateCollectionPiece(user, { book, piece }, { name, composer = '' }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionPieceEndpoint(email, { book, piece }), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, composer }),
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not save piece (${res.status}).`));
  }
  const data = await res.json();
  return {
    name: typeof data.name === 'string' ? data.name : name,
    composer: typeof data.composer === 'string' ? data.composer : composer,
  };
}

export async function deleteCollectionPiece(user, { book, piece }) {
  const email = requireUserEmail(user);
  const headers = await authHeaders(user);
  const res = await fetch(collectionPieceEndpoint(email, { book, piece }), {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not delete piece (${res.status}).`));
  }
}
