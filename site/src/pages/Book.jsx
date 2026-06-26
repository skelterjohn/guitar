import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import { listBookPdfs, uploadBookPdf } from '../bookendClient.js';
import { auth } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookTitle, bookUrl, bookViewPath } from '../seo.js';

function isPdfFile(file) {
  if (!file) return false;
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

function BookLibrary({ user }) {
  const [filenames, setFilenames] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
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

  const uploadFile = useCallback(
    async (file) => {
      setError('');
      setStatus('');

      if (!file) return;
      if (!isPdfFile(file)) {
        setError(`"${file.name}" is not a PDF.`);
        return;
      }

      setBusy(true);
      try {
        await uploadBookPdf(user, file.name, file);
        await refreshList();
        setStatus(`Uploaded ${file.name}.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (uploadError) {
        setError(uploadError.message);
      } finally {
        setBusy(false);
      }
    },
    [user, refreshList],
  );

  const handleInputChange = (event) => {
    void uploadFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (busy) return;
    void uploadFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!busy) setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const openFilePicker = () => {
    if (!busy) fileInputRef.current?.click();
  };

  return (
    <main className="page book-page">
      <header className="page-header">
        <h1>{bookHeading}</h1>
        <p>{bookDescription}</p>
      </header>

      <button
        type="button"
        className={`book-dropzone${dragActive ? ' is-drag-active' : ''}${busy ? ' is-busy' : ''}`}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={busy}
        aria-label="Upload a PDF by clicking or dragging a file here"
      >
        <span className="book-dropzone-icon" aria-hidden="true">+</span>
        <span className="book-dropzone-primary">
          {busy ? 'Uploading…' : 'Drag a PDF here'}
        </span>
        <span className="book-dropzone-secondary">or click to choose a file</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInputChange}
        disabled={busy}
        hidden
      />

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
                <Link className="book-file-open" to={bookViewPath(filename)}>
                  {filename}
                </Link>
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
