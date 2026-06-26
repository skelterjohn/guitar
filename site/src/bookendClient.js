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
  const email = user?.email;
  if (!email) {
    throw new Error('Signed-in user has no email address.');
  }
  const headers = await authHeaders(user);
  const res = await fetch(bookListEndpoint(email), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not list PDFs (${res.status}).`));
  }
  const data = await res.json();
  return Array.isArray(data.files) ? data.files : [];
}

export async function uploadBookPdf(user, filename, file) {
  const email = user?.email;
  if (!email) {
    throw new Error('Signed-in user has no email address.');
  }
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

export async function fetchBookPdf(user, filename) {
  const email = user?.email;
  if (!email) {
    throw new Error('Signed-in user has no email address.');
  }
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
