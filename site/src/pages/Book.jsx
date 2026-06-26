import { useCallback, useEffect, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import { fetchBookPdf, listBookPdfs, uploadBookPdf } from '../bookendClient.js';
import { auth } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookTitle, bookUrl } from '../seo.js';

function BookLibrary({ user }) {
  const [filenames, setFilenames] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const refreshList = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const files = await listBookPdfs(user);
      setFilenames(files);
    } catch (listError) {
      setError(listError.message);
      setFilenames([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Choose a PDF to upload.');
      return;
    }
    const filename = file.name;
    if (!filename.toLowerCase().endsWith('.pdf')) {
      setError('File must be a .pdf.');
      return;
    }

    setBusy(true);
    try {
      await uploadBookPdf(user, filename, file);
      await refreshList();
      setStatus(`Uploaded ${filename}.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async (filename) => {
    setError('');
    setStatus('');
    setBusy(true);
    try {
      const blob = await fetchBookPdf(user, filename);
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (openError) {
      setError(openError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page book-page">
      <header className="page-header">
        <h1>{bookHeading}</h1>
        <p>{bookDescription}</p>
      </header>

      <form className="book-upload" onSubmit={handleUpload}>
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" disabled={busy} />
        <button type="submit" disabled={busy}>
          {busy ? 'Working…' : 'Upload PDF'}
        </button>
      </form>

      {error && (
        <p className="book-status book-status-error" role="alert">
          {error}
        </p>
      )}
      {status && (
        <p className="book-status" role="status">
          {status}
        </p>
      )}

      <section className="book-library" aria-labelledby="book-library-heading">
        <h2 id="book-library-heading">your pdfs</h2>
        {loading ? (
          <p className="book-empty">Loading…</p>
        ) : filenames.length === 0 ? (
          <p className="book-empty">No PDFs uploaded yet.</p>
        ) : (
          <ul className="book-file-list">
            {filenames.map((filename) => (
              <li key={filename} className="book-file-item">
                <button
                  type="button"
                  className="book-file-open"
                  onClick={() => handleOpen(filename)}
                  disabled={busy}
                >
                  {filename}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default function Book() {
  usePageMeta({
    title: bookTitle,
    description: bookDescription,
    url: bookUrl,
    noindex: true,
  });

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out failed:', error);
    });
  };

  return (
    <BookAuthGate>
      {(user) =>
        user?.email ? (
          <div className="page-shell">
            <div className="book-user-bar">
              <button className="book-sign-out" type="button" onClick={handleSignOut}>
                sign out
              </button>
              <span className="book-user-email">{user.email}</span>
            </div>
            <BookLibrary user={user} />
          </div>
        ) : null
      }
    </BookAuthGate>
  );
}
