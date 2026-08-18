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

async function errorMessage(res, fallback) {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
  } catch {
    // response was not JSON
  }
  return fallback;
}

function njgoBase() {
  return bookendBaseUrl.replace(/\/$/, '');
}

function njgoRepertoireEndpoint() {
  return `${njgoBase()}/v1/njgo/repertoire`;
}

function njgoPdfsEndpoint() {
  return `${njgoBase()}/v1/njgo/pdfs`;
}

function njgoPdfEndpoint(filename) {
  return `${njgoBase()}/v1/njgo/pdfs/${encodeURIComponent(filename)}`;
}

/**
 * Fetches the raw repertoire.yaml text for editing. Returns null (rather
 * than throwing) for 401/403, since this call also doubles as the "is this
 * signed-in user an authorized njgo editor" probe.
 */
export async function fetchNjgoRepertoireYaml(user) {
  const headers = await authHeaders(user);
  const res = await fetch(njgoRepertoireEndpoint(), { headers });
  if (res.status === 401 || res.status === 403) {
    return null;
  }
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not load repertoire (${res.status}).`));
  }
  return res.text();
}

export async function saveNjgoRepertoireYaml(user, yamlText) {
  const headers = await authHeaders(user);
  const res = await fetch(njgoRepertoireEndpoint(), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'text/yaml' },
    body: yamlText,
  });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not save repertoire (${res.status}).`));
  }
}

export async function listNjgoPdfs(user) {
  const headers = await authHeaders(user);
  const res = await fetch(njgoPdfsEndpoint(), { headers });
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Could not list pdfs (${res.status}).`));
  }
  const data = await res.json();
  if (!Array.isArray(data.files)) return [];

  return data.files
    .map((file) => ({
      name: typeof file?.name === 'string' ? file.name : '',
      modifiedAt: typeof file?.modifiedAt === 'string' ? file.modifiedAt : '',
      size: Number.isFinite(file?.size) ? file.size : 0,
    }))
    .filter((file) => file.name);
}

/** Thrown by uploadNjgoPdf when the filename already exists (uploads are append-only). */
export class NjgoPdfAlreadyExistsError extends Error {}

export async function uploadNjgoPdf(user, filename, file) {
  const headers = await authHeaders(user);
  const res = await fetch(njgoPdfEndpoint(filename), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/pdf' },
    body: file,
  });
  if (res.status === 409) {
    throw new NjgoPdfAlreadyExistsError(
      await errorMessage(res, 'A file with this name already exists — bump the version number.'),
    );
  }
  if (!res.ok) {
    throw new Error(await errorMessage(res, `Upload failed (${res.status}).`));
  }
}
