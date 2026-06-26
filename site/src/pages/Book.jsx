import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import { fetchUserCollection, listBookPdfs, setCollectionPartPdf, uploadBookPdf } from '../bookendClient.js';
import { auth } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookTitle, bookUrl, bookViewPath } from '../seo.js';

function isPdfFile(file) {
  if (!file) return false;
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

/** @param {{ books: Array<{ name: string, pieces: Array<{ name: string, parts: Array<{ name: string, pdf: string }> }> }> }} collection */
function collectionsForPdf(collection, pdfFilename) {
  const entries = [];
  for (const book of collection.books) {
    for (const piece of book.pieces) {
      for (const part of piece.parts) {
        if (part.pdf === pdfFilename) {
          entries.push({ book: book.name, piece: piece.name, part: part.name });
        }
      }
    }
  }
  return entries;
}

function BookScoreItem({ user, filename, collection, onCollectionChange }) {
  const [book, setBook] = useState('');
  const [piece, setPiece] = useState('');
  const [part, setPart] = useState('');
  const [adding, setAdding] = useState(false);
  const [itemError, setItemError] = useState('');

  const memberships = collectionsForPdf(collection, filename);

  const handleAdd = async () => {
    const bookName = book.trim();
    const pieceName = piece.trim();
    const partName = part.trim();
    if (!bookName || !pieceName || !partName) {
      setItemError('Fill in book, piece, and part.');
      return;
    }

    const duplicate = memberships.some(
      (entry) =>
        entry.book === bookName && entry.piece === pieceName && entry.part === partName,
    );
    if (duplicate) {
      setItemError('Already in collection.');
      return;
    }

    setAdding(true);
    setItemError('');
    try {
      await setCollectionPartPdf(
        user,
        { book: bookName, piece: pieceName, part: partName },
        filename,
      );
      setBook('');
      setPiece('');
      setPart('');
      await onCollectionChange();
    } catch (addError) {
      setItemError(addError.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void handleAdd();
  };

  return (
    <li className="book-score-item">
      <Link className="book-file-open" to={bookViewPath(filename)}>
        {filename}
      </Link>

      <div className="book-score-collections">
        {memberships.length > 0 && (
          <ul className="book-score-memberships">
            {memberships.map((entry) => (
              <li key={`${entry.book}/${entry.piece}/${entry.part}`}>
                {entry.book} / {entry.piece} / {entry.part}
              </li>
            ))}
          </ul>
        )}

        <form className="book-score-add" onSubmit={handleSubmit}>
          <input
            className="book-score-field"
            type="text"
            placeholder="book"
            value={book}
            onChange={(event) => setBook(event.target.value)}
            disabled={adding}
            aria-label={`Book for ${filename}`}
          />
          <input
            className="book-score-field"
            type="text"
            placeholder="piece"
            value={piece}
            onChange={(event) => setPiece(event.target.value)}
            disabled={adding}
            aria-label={`Piece for ${filename}`}
          />
          <input
            className="book-score-field"
            type="text"
            placeholder="part"
            value={part}
            onChange={(event) => setPart(event.target.value)}
            disabled={adding}
            aria-label={`Part for ${filename}`}
          />
          <button
            className="book-score-add-btn"
            type="submit"
            disabled={adding}
            aria-label={`Add ${filename} to collection`}
          >
            +
          </button>
        </form>
        {itemError && (
          <p className="book-score-error" role="alert">
            {itemError}
          </p>
        )}
      </div>
    </li>
  );
}

function BookLibrary({ user }) {
  const [filenames, setFilenames] = useState([]);
  const [collection, setCollection] = useState({ books: [] });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const refreshCollection = useCallback(async () => {
    try {
      const nextCollection = await fetchUserCollection(user);
      setCollection(nextCollection);
    } catch (collectionError) {
      console.error('Could not load collections:', collectionError);
      setCollection({ books: [] });
    }
  }, [user]);

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
    refreshCollection();
  }, [refreshList, refreshCollection]);

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

      <details className="book-library">
        <summary className="book-library-summary">all scores</summary>

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

        {loading ? (
          <p className="book-empty">Loading…</p>
        ) : filenames.length === 0 ? (
          <p className="book-empty">No PDFs uploaded yet.</p>
        ) : (
          <ul className="book-file-list">
            {filenames.map((filename) => (
              <BookScoreItem
                key={filename}
                user={user}
                filename={filename}
                collection={collection}
                onCollectionChange={refreshCollection}
              />
            ))}
          </ul>
        )}
      </details>
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
