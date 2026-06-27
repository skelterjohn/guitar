import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import BookDeletePdfModal from '../components/BookDeletePdfModal.jsx';
import Catalog from '../components/Catalog.jsx';
import PencilIcon from '../components/PencilIcon.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import Toast from '../components/Toast.jsx';
import {
  addPieceToBook,
  createPiece,
  deleteBook,
  deleteBookPdf,
  deletePiece,
  downloadBookPdfZip,
  fetchUserLibrary,
  listBookPdfs,
  removePieceFromBook,
  updateBook,
  updatePiece,
  uploadBookPdf,
  uploadBookZip,
} from '../bookendClient.js';
import { auth } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookPath, bookTitle, bookUrl, bookViewPath } from '../seo.js';
import { pdfFilesMatch } from '../utils/pieceLabelPreference.js';
import { userCollectionToSections } from '../utils/collectionCatalog.js';
import { filterCatalogSections, fuzzyMatch, joinSearchFields } from '../utils/fuzzySearch.js';

function isPdfFile(file) {
  if (!file) return false;
  if (file.type === 'application/pdf') return true;
  return file.name.toLowerCase().endsWith('.pdf');
}

function isZipFile(file) {
  if (!file) return false;
  if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') return true;
  return file.name.toLowerCase().endsWith('.zip');
}

/** @param {{ pieces: Array<{ id: string, name: string, composer?: string, part?: string, pdf: string }>, books: Array<{ name: string, pieces: Array<{ id: string }> }> }} library */
function pieceForPdf(library, pdfFilename) {
  return library.pieces.find((piece) => pdfFilesMatch(piece.pdf, pdfFilename)) ?? null;
}

/** @param {{ books: Array<{ name: string, pieces: Array<{ id: string }> }> }} library */
function booksForPiece(library, piece) {
  if (!piece) return [];
  return library.books
    .filter((book) => book.pieces.some((entry) => entry.id === piece.id))
    .map((book) => book.name);
}

function uniqueSorted(names) {
  return [...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function collectionFieldId(filename) {
  return encodeURIComponent(filename).replace(/%/g, '_');
}

function pdfCardSearchText(filename, library) {
  const piece = pieceForPdf(library, filename);
  const books = booksForPiece(library, piece);
  return joinSearchFields(filename, piece?.name, piece?.composer, piece?.part, ...books);
}

function BookScoreItem({ user, filename, library, onLibraryChange, onPdfDeleted }) {
  const linkedPiece = pieceForPdf(library, filename);
  const cardRef = useRef(null);
  const pieceFormRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(linkedPiece?.name ?? '');
  const [composer, setComposer] = useState(linkedPiece?.composer ?? '');
  const [part, setPart] = useState(linkedPiece?.part ?? '');
  const [book, setBook] = useState('');
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingBook, setRemovingBook] = useState('');
  const [itemError, setItemError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const memberships = booksForPiece(library, linkedPiece);
  const fieldId = collectionFieldId(filename);
  const pieceFormId = `book-score-piece-form-${fieldId}`;
  const bookOptions = uniqueSorted(library.books.map((entry) => entry.name));

  useEffect(() => {
    if (!editing) {
      setName(linkedPiece?.name ?? '');
      setComposer(linkedPiece?.composer ?? '');
      setPart(linkedPiece?.part ?? '');
    }
  }, [linkedPiece?.name, linkedPiece?.composer, linkedPiece?.part, linkedPiece?.id, editing]);

  const startEditing = () => {
    setName(linkedPiece?.name ?? '');
    setComposer(linkedPiece?.composer ?? '');
    setPart(linkedPiece?.part ?? '');
    setItemError('');
    setEditing(true);
  };

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setName(linkedPiece?.name ?? '');
    setComposer(linkedPiece?.composer ?? '');
    setPart(linkedPiece?.part ?? '');
    setItemError('');
  }, [linkedPiece?.name, linkedPiece?.composer, linkedPiece?.part]);

  useEffect(() => {
    if (!editing) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (deleteOpen) return;
      event.preventDefault();
      cancelEditing();
    };

    const handlePointerDown = (event) => {
      if (deleteOpen || saving) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (pieceFormRef.current?.contains(target)) return;
      if (target instanceof Element && cardRef.current?.contains(target) && target.closest('.book-score-delete')) return;
      cancelEditing();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [editing, deleteOpen, saving, cancelEditing]);

  const handleSavePiece = async () => {
    const pieceName = name.trim();
    if (!pieceName) {
      setItemError('Piece name is required.');
      return;
    }

    setSaving(true);
    setItemError('');
    try {
      const payload = {
        name: pieceName,
        composer: composer.trim(),
        part: part.trim(),
        pdf: filename,
      };
      if (linkedPiece) {
        await updatePiece(user, linkedPiece.name, payload);
      } else {
        await createPiece(user, payload);
      }
      await onLibraryChange();
      setEditing(false);
    } catch (saveError) {
      setItemError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSubmit = (event) => {
    event.preventDefault();
    void handleSavePiece();
  };

  const handleAddToBook = async () => {
    const bookName = book.trim();
    if (!bookName) {
      setItemError('Enter a book name.');
      return;
    }
    if (!linkedPiece) {
      setItemError('Save piece info first.');
      return;
    }
    if (memberships.includes(bookName)) {
      setItemError('Already in that book.');
      return;
    }

    setAdding(true);
    setItemError('');
    try {
      await addPieceToBook(user, { book: bookName, piece: linkedPiece.name });
      setBook('');
      await onLibraryChange();
    } catch (addError) {
      setItemError(addError.message);
    } finally {
      setAdding(false);
    }
  };

  const handleAddSubmit = (event) => {
    event.preventDefault();
    void handleAddToBook();
  };

  const handleRemoveFromBook = async (bookName) => {
    if (!linkedPiece) return;
    setRemovingBook(bookName);
    setItemError('');
    try {
      await removePieceFromBook(user, { book: bookName, piece: linkedPiece.name });
      await onLibraryChange();
    } catch (removeError) {
      setItemError(removeError.message);
    } finally {
      setRemovingBook('');
    }
  };

  const openDeleteModal = () => {
    setDeleteError('');
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteBookPdf(user, filename);
      setDeleteOpen(false);
      await onPdfDeleted(filename);
    } catch (deleteErr) {
      setDeleteError(deleteErr.message);
    } finally {
      setDeleting(false);
    }
  };

  const busy = saving || adding || Boolean(removingBook);

  return (
    <li ref={cardRef} className="book-score-item">
      <div className="book-score-header">
        <Link className="book-file-open" to={bookViewPath(filename)}>
          {filename}
        </Link>
        {editing ? (
          <button
            className="book-score-delete"
            type="button"
            onClick={openDeleteModal}
            disabled={busy || deleting}
            aria-label={`Delete ${filename}`}
          >
            delete
          </button>
        ) : (
          <button
            className="book-score-edit"
            type="button"
            onClick={startEditing}
            disabled={busy || deleting}
            aria-label={`Edit ${filename}`}
          >
            <PencilIcon />
          </button>
        )}
      </div>

      <BookDeletePdfModal
        open={deleteOpen}
        filename={filename}
        membershipCount={linkedPiece ? memberships.length : 0}
        busy={deleting}
        error={deleteError}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />

      <div className="book-score-collections">
        {editing ? (
          <form
            ref={pieceFormRef}
            id={pieceFormId}
            className="book-score-piece-form"
            onSubmit={handleSaveSubmit}
          >
            <input
              className="book-score-field"
              type="text"
              placeholder="piece"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={busy}
              autoComplete="off"
              aria-label={`Piece name for ${filename}`}
            />
            <input
              className="book-score-field"
              type="text"
              placeholder="composer"
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              disabled={busy}
              autoComplete="off"
              aria-label={`Composer for ${filename}`}
            />
            <input
              className="book-score-field"
              type="text"
              placeholder="part"
              value={part}
              onChange={(event) => setPart(event.target.value)}
              disabled={busy}
              autoComplete="off"
              aria-label={`Part for ${filename}`}
            />
            <button type="submit" className="book-score-submit-hidden" tabIndex={-1} aria-hidden="true">
              save
            </button>
          </form>
        ) : (
          <dl className="book-score-meta">
            <div className="book-score-meta-row">
              <dt>piece</dt>
              <dd>{linkedPiece?.name || '—'}</dd>
            </div>
            <div className="book-score-meta-row">
              <dt>composer</dt>
              <dd>{linkedPiece?.composer || '—'}</dd>
            </div>
            <div className="book-score-meta-row">
              <dt>part</dt>
              <dd>{linkedPiece?.part || '—'}</dd>
            </div>
          </dl>
        )}

        {memberships.length > 0 && (
          <ul className="book-score-memberships">
            {memberships.map((bookName) => (
              <li key={bookName}>
                <span>{bookName}</span>
                <button
                  type="button"
                  className="book-score-remove-book"
                  onClick={() => {
                    void handleRemoveFromBook(bookName);
                  }}
                  disabled={busy}
                  aria-label={`Remove from ${bookName}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="book-score-add" onSubmit={handleAddSubmit}>
          <input
            className="book-score-field book-score-field-book"
            type="text"
            placeholder="add to book"
            value={book}
            onChange={(event) => setBook(event.target.value)}
            disabled={busy || !linkedPiece}
            autoComplete="off"
            list={`book-options-${fieldId}`}
            aria-label={`Book for ${filename}`}
          />
          <datalist id={`book-options-${fieldId}`}>
            {bookOptions.map((bookName) => (
              <option key={bookName} value={bookName} />
            ))}
          </datalist>
          <button
            className="book-score-add-btn"
            type="submit"
            disabled={busy || !linkedPiece}
            aria-label={`Add ${filename} to book`}
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
  const [library, setLibrary] = useState({ pieces: [], books: [] });
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const refreshLibrary = useCallback(async () => {
    try {
      const nextLibrary = await fetchUserLibrary(user);
      setLibrary(nextLibrary);
    } catch (libraryError) {
      console.error('Could not load library:', libraryError);
      setLibrary({ pieces: [], books: [] });
    } finally {
      setLibraryLoaded(true);
    }
  }, [user]);

  const collectionSections = useMemo(
    () => userCollectionToSections(library),
    [library],
  );

  const filteredFilenames = useMemo(() => {
    if (!searchQuery.trim()) return filenames;
    return filenames.filter((filename) => fuzzyMatch(pdfCardSearchText(filename, library), searchQuery));
  }, [filenames, library, searchQuery]);

  const filteredSections = useMemo(
    () => filterCatalogSections(collectionSections, searchQuery),
    [collectionSections, searchQuery],
  );

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
    refreshLibrary();
  }, [refreshList, refreshLibrary]);

  const uploadFile = useCallback(
    async (file) => {
      setError('');
      setStatus('');

      if (!file) return;
      if (!isPdfFile(file) && !isZipFile(file)) {
        setError(`"${file.name}" is not a PDF or zip file.`);
        return;
      }

      setBusy(true);
      try {
        if (isZipFile(file)) {
          const uploaded = await uploadBookZip(user, file);
          await refreshList();
          setStatus(
            uploaded.length === 1
              ? `Uploaded 1 PDF from ${file.name}.`
              : `Uploaded ${uploaded.length} PDFs from ${file.name}.`,
          );
        } else {
          await uploadBookPdf(user, file.name, file);
          await refreshList();
          setStatus(`Uploaded ${file.name}.`);
        }
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

  const handleBookSave = useCallback(
    async (bookKey, name) => {
      await updateBook(user, bookKey, { name });
      await refreshLibrary();
    },
    [user, refreshLibrary],
  );

  const handlePieceDelete = useCallback(
    async (pieceKey) => {
      await deletePiece(user, pieceKey);
      await refreshLibrary();
      setToast(`Deleted ${pieceKey}.`);
    },
    [user, refreshLibrary],
  );

  const handleBookDelete = useCallback(
    async (bookKey) => {
      await deleteBook(user, bookKey);
      await refreshLibrary();
      setToast(`Deleted ${bookKey}.`);
    },
    [user, refreshLibrary],
  );

  const handlePdfDeleted = useCallback(
    async (filename) => {
      await refreshList();
      setToast(`Deleted ${filename}.`);
    },
    [refreshList],
  );

  const openFilePicker = () => {
    if (!busy) fileInputRef.current?.click();
  };

  const handleExportZip = useCallback(async () => {
    setExportingZip(true);
    setError('');
    try {
      await downloadBookPdfZip(user);
    } catch (zipError) {
      setError(zipError.message);
    } finally {
      setExportingZip(false);
    }
  }, [user]);

  return (
    <>
      <Toast message={toast} onDismiss={() => setToast('')} />
      {libraryLoaded && filteredSections.length > 0 && (
        <TableOfContents sections={filteredSections} />
      )}
      <main className="page book-page">
        <header className="page-header">
          <div className="page-header-top">
            <h1>{bookHeading}</h1>
            <div className="page-header-actions">
              <input
                className="book-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="search"
                aria-label="Search scores"
              />
            </div>
          </div>
          <p>{bookDescription}</p>
        </header>

        <details className="book-library">
        <summary className="book-library-summary">
          <span className="book-library-summary-label">all scores</span>
          {filenames.length > 0 && (
            <button
              type="button"
              className="book-export-zip"
              disabled={exportingZip}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void handleExportZip();
              }}
            >
              {exportingZip ? 'exporting…' : 'export zip'}
            </button>
          )}
        </summary>

        <button
          type="button"
          className={`book-dropzone${dragActive ? ' is-drag-active' : ''}${busy ? ' is-busy' : ''}`}
          onClick={openFilePicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={busy}
          aria-label="Upload a PDF or zip file by clicking or dragging a file here"
        >
          <span className="book-dropzone-icon" aria-hidden="true">+</span>
          <span className="book-dropzone-primary">
            {busy ? 'Uploading…' : 'Drag a PDF or ZIP (of PDFs) here'}
          </span>
          <span className="book-dropzone-secondary">or click to choose a file</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf,application/zip,.zip"
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
        ) : filteredFilenames.length === 0 ? (
          <p className="book-empty">No matches.</p>
        ) : (
          <ul className="book-file-list">
            {filteredFilenames.map((filename) => (
              <BookScoreItem
                key={filename}
                user={user}
                filename={filename}
                library={library}
                onLibraryChange={refreshLibrary}
                onPdfDeleted={handlePdfDeleted}
              />
            ))}
          </ul>
        )}
      </details>

        {!libraryLoaded ? (
          <p className="book-empty book-catalog-loading">loading catalog…</p>
        ) : collectionSections.length > 0 ? (
          filteredSections.length > 0 ? (
          <Catalog
            sections={filteredSections}
            viewState={{ from: bookPath() }}
            viewPrefix={bookPath()}
            availableFiles={filenames}
            onPieceDelete={handlePieceDelete}
            onBookSave={handleBookSave}
            onBookDelete={handleBookDelete}
          />
          ) : (
            <p className="book-empty">No matches.</p>
          )
        ) : null}
      </main>
    </>
  );
}

export default function Book() {
  usePageMeta({
    title: bookTitle,
    description: bookDescription,
    url: bookUrl(),
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
