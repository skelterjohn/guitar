import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import BookDeletePdfModal from '../components/BookDeletePdfModal.jsx';
import BookNewSubpartModal from '../components/BookNewSubpartModal.jsx';
import Catalog from '../components/Catalog.jsx';
import PencilIcon from '../components/PencilIcon.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import Toast from '../components/Toast.jsx';
import {
  addPieceToBook,
  createPiece,
  createSubpart,
  deleteBook,
  deleteBookPdf,
  deletePiece,
  deleteSubpart,
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

/** @param {{ books: Array<{ name: string, pieces: Array<{ id: string }> }>, pieces: Array<{ id: string, name?: string, composer?: string, part?: string, pdf: string }> }} library */
function isFileLabeled(library, filename) {
  const piece = pieceForPdf(library, filename);
  if ((piece?.subparts ?? []).length > 0) return true;
  if (piece?.name?.trim()) return true;
  if (piece?.composer?.trim()) return true;
  if (piece?.part?.trim()) return true;
  return booksForPiece(library, piece).length > 0;
}

function formatUploadedAt(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatPageRange(pageStart, pageEnd) {
  if (!pageStart) return '';
  if (pageEnd === pageStart) return `p. ${pageStart}`;
  return `pp. ${pageStart}–${pageEnd}`;
}

function buildScoreEntries(bookFiles, library) {
  const entries = [];
  for (const file of bookFiles) {
    entries.push({ kind: 'pdf', file });
    const piece = pieceForPdf(library, file.name);
    for (const subpart of piece?.subparts ?? []) {
      entries.push({ kind: 'subpart', file, piece, subpart });
    }
  }
  return entries;
}

function scoreEntryKey(entry) {
  if (entry.kind === 'subpart') {
    return `${entry.file.name}::subpart::${entry.subpart.id}`;
  }
  return entry.file.name;
}

function scoreEntrySearchText(entry, library) {
  if (entry.kind === 'subpart') {
    return joinSearchFields(
      entry.file.name,
      entry.piece?.name,
      entry.piece?.composer,
      entry.subpart.part,
      formatPageRange(entry.subpart.pageStart, entry.subpart.pageEnd),
      ...booksForPiece(library, entry.piece),
    );
  }
  return pdfCardSearchText(entry.file.name, library);
}

function scoreEntrySortValue(entry, library, field) {
  if (entry.kind === 'subpart') {
    switch (field) {
      case 'piece':
        return entry.piece?.name ?? '';
      case 'composer':
        return entry.piece?.composer ?? '';
      case 'part':
        return entry.subpart.part ?? '';
      case 'upload':
        return entry.file.modifiedAt ?? '';
      case 'book':
        return booksForPiece(library, entry.piece).join(', ');
      case 'labeled':
        return '1';
      default:
        return entry.file.name;
    }
  }
  return scoreSortValue(entry.file, library, field);
}

/** @param {ReturnType<typeof buildScoreEntries>} entries */
function sortScoreEntries(entries, library, field, direction) {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...entries].sort((a, b) => {
    if (field === 'labeled') {
      const aLabeled = a.kind === 'subpart' || isFileLabeled(library, a.file.name) ? 1 : 0;
      const bLabeled = b.kind === 'subpart' || isFileLabeled(library, b.file.name) ? 1 : 0;
      if (aLabeled !== bLabeled) return (aLabeled - bLabeled) * multiplier;
    } else if (field === 'upload') {
      const aTime = Date.parse(a.file.modifiedAt ?? '') || 0;
      const bTime = Date.parse(b.file.modifiedAt ?? '') || 0;
      if (aTime !== bTime) return (aTime - bTime) * multiplier;
    } else {
      const cmp = scoreEntrySortValue(a, library, field).localeCompare(
        scoreEntrySortValue(b, library, field),
        undefined,
        { sensitivity: 'base' },
      );
      if (cmp !== 0) return cmp * multiplier;
    }
    return scoreEntryKey(a).localeCompare(scoreEntryKey(b), undefined, { sensitivity: 'base' });
  });
}

const SCORE_SORT_FIELDS = [
  { id: 'filename', label: 'filename' },
  { id: 'piece', label: 'piece' },
  { id: 'composer', label: 'composer' },
  { id: 'upload', label: 'upload' },
  { id: 'book', label: 'book' },
  { id: 'labeled', label: 'labeled' },
];

/** @param {{ name: string, modifiedAt?: string }} file */
function scoreSortValue(file, library, field) {
  const piece = pieceForPdf(library, file.name);
  switch (field) {
    case 'piece':
      return piece?.name ?? '';
    case 'composer':
      return piece?.composer ?? '';
    case 'upload':
      return file.modifiedAt ?? '';
    case 'book':
      return booksForPiece(library, piece).join(', ');
    case 'part':
      return piece?.part ?? '';
    default:
      return file.name;
  }
}

function BookSubpartScoreItem({ user, filename, modifiedAt, piece, subpart, library, onLibraryChange }) {
  const [deleting, setDeleting] = useState(false);
  const [itemError, setItemError] = useState('');
  const memberships = booksForPiece(library, piece);

  const handleDelete = async () => {
    setDeleting(true);
    setItemError('');
    try {
      await deleteSubpart(user, piece.name, subpart.id);
      await onLibraryChange();
    } catch (deleteError) {
      setItemError(deleteError.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li className="book-score-item book-score-item--subpart">
      <div className="book-score-header">
        <div className="book-score-title">
          <span className="book-score-subpart-badge">sub-part</span>
          <Link
            className="book-file-open"
            to={bookViewPath(filename, {
              pageStart: subpart.pageStart,
              pageEnd: subpart.pageEnd,
            })}
          >
            {filename}
          </Link>
          {modifiedAt && (
            <time className="book-file-uploaded" dateTime={modifiedAt}>
              {formatUploadedAt(modifiedAt)}
            </time>
          )}
        </div>
        <button
          className="book-score-delete"
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting}
          aria-label={`Delete sub-part ${subpart.part} for ${filename}`}
        >
          delete
        </button>
      </div>

      <div className="book-score-collections">
        <dl className="book-score-meta">
          <div className="book-score-meta-row">
            <dt>piece</dt>
            <dd>{piece?.name || '—'}</dd>
          </div>
          <div className="book-score-meta-row">
            <dt>part</dt>
            <dd>{subpart.part || '—'}</dd>
          </div>
          <div className="book-score-meta-row">
            <dt>pages</dt>
            <dd>{formatPageRange(subpart.pageStart, subpart.pageEnd) || '—'}</dd>
          </div>
        </dl>

        {memberships.length > 0 && (
          <ul className="book-score-memberships">
            {memberships.map((bookName) => (
              <li key={bookName}>
                <span>{bookName}</span>
              </li>
            ))}
          </ul>
        )}

        {itemError && (
          <p className="book-score-error" role="alert">
            {itemError}
          </p>
        )}
      </div>
    </li>
  );
}

function BookScoreItem({ user, filename, modifiedAt, library, onLibraryChange, onPdfDeleted }) {
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
  const [subpartOpen, setSubpartOpen] = useState(false);
  const [subpartBusy, setSubpartBusy] = useState(false);
  const [subpartError, setSubpartError] = useState('');

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

  const openSubpartModal = () => {
    setSubpartError('');
    setSubpartOpen(true);
  };

  const closeSubpartModal = () => {
    if (subpartBusy) return;
    setSubpartOpen(false);
    setSubpartError('');
  };

  const handleCreateSubpart = async ({ part: partLabel, pageStart, pageEnd }) => {
    if (!linkedPiece) {
      setSubpartError('Save piece info first.');
      return;
    }

    setSubpartBusy(true);
    setSubpartError('');
    try {
      await createSubpart(user, linkedPiece.name, { part: partLabel, pageStart, pageEnd });
      setSubpartOpen(false);
      await onLibraryChange();
    } catch (createError) {
      setSubpartError(createError.message);
    } finally {
      setSubpartBusy(false);
    }
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
        <div className="book-score-title">
          <Link className="book-file-open" to={bookViewPath(filename)}>
            {filename}
          </Link>
          {modifiedAt && (
            <time className="book-file-uploaded" dateTime={modifiedAt}>
              {formatUploadedAt(modifiedAt)}
            </time>
          )}
        </div>
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

      <BookNewSubpartModal
        open={subpartOpen}
        filename={filename}
        busy={subpartBusy}
        error={subpartError}
        onCancel={closeSubpartModal}
        onConfirm={(payload) => {
          void handleCreateSubpart(payload);
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
            <button
              type="button"
              className="book-score-add-subpart"
              onClick={openSubpartModal}
              disabled={busy || !linkedPiece}
              aria-label={`Add sub-part for ${filename}`}
              title={linkedPiece ? 'Add sub-part' : 'Save piece info first'}
            >
              +
            </button>
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
            <div className="book-score-meta-row book-score-meta-row--part">
              <dt>part</dt>
              <dd className="book-score-part-value">
                <span>{linkedPiece?.part || '—'}</span>
                <button
                  type="button"
                  className="book-score-add-subpart"
                  onClick={openSubpartModal}
                  disabled={!linkedPiece}
                  aria-label={`Add sub-part for ${filename}`}
                  title={linkedPiece ? 'Add sub-part' : 'Save piece info first'}
                >
                  +
                </button>
              </dd>
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
  const [bookFiles, setBookFiles] = useState([]);
  const [library, setLibrary] = useState({ pieces: [], books: [] });
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');
  const [sortField, setSortField] = useState('filename');
  const [sortDirection, setSortDirection] = useState('asc');
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

  const filenames = useMemo(() => bookFiles.map((file) => file.name), [bookFiles]);

  const scoreEntries = useMemo(
    () => buildScoreEntries(bookFiles, library),
    [bookFiles, library],
  );

  const filteredScoreEntries = useMemo(() => {
    if (!searchQuery.trim()) return scoreEntries;
    return scoreEntries.filter((entry) => fuzzyMatch(scoreEntrySearchText(entry, library), searchQuery));
  }, [scoreEntries, library, searchQuery]);

  const sortedScoreEntries = useMemo(
    () => sortScoreEntries(filteredScoreEntries, library, sortField, sortDirection),
    [filteredScoreEntries, library, sortField, sortDirection],
  );

  const filteredSections = useMemo(
    () => filterCatalogSections(collectionSections, searchQuery),
    [collectionSections, searchQuery],
  );

  const refreshList = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const files = await listBookPdfs(user);
      setBookFiles(files);
    } catch (listError) {
      setError(listError.message);
      setBookFiles([]);
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
          setToast(
            uploaded.length === 1
              ? `Uploaded 1 PDF from ${file.name}.`
              : `Uploaded ${uploaded.length} PDFs from ${file.name}.`,
          );
        } else {
          await uploadBookPdf(user, file.name, file);
          await refreshList();
          setToast(`Uploaded ${file.name}.`);
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

        <div className="book-tabs">
          <div className="book-tablist" role="tablist" aria-label="Library views">
            <button
              type="button"
              role="tab"
              id="book-tab-catalog"
              aria-selected={activeTab === 'catalog'}
              aria-controls="book-panel-catalog"
              className={`book-tab${activeTab === 'catalog' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              catalog
            </button>
            <button
              type="button"
              role="tab"
              id="book-tab-scores"
              aria-selected={activeTab === 'scores'}
              aria-controls="book-panel-scores"
              className={`book-tab${activeTab === 'scores' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('scores')}
            >
              all scores
            </button>
            {activeTab === 'scores' && filenames.length > 0 && (
              <button
                type="button"
                className="book-export-zip book-tab-action"
                disabled={exportingZip}
                onClick={() => void handleExportZip()}
              >
                {exportingZip ? 'exporting…' : 'export zip'}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'scores' ? (
          <section
            id="book-panel-scores"
            role="tabpanel"
            aria-labelledby="book-tab-scores"
            className="book-tabpanel"
          >
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

            {!loading && filenames.length > 0 && (
              <div className="book-sort" role="group" aria-label="Sort scores">
                <span className="book-sort-direction" role="group" aria-label="Sort direction">
                  <button
                    type="button"
                    className={`book-sort-btn${sortDirection === 'asc' ? ' is-active' : ''}`}
                    aria-pressed={sortDirection === 'asc'}
                    aria-label="Ascending"
                    onClick={() => setSortDirection('asc')}
                  >
                    <span aria-hidden="true">▲</span>
                  </button>
                  <button
                    type="button"
                    className={`book-sort-btn${sortDirection === 'desc' ? ' is-active' : ''}`}
                    aria-pressed={sortDirection === 'desc'}
                    aria-label="Descending"
                    onClick={() => setSortDirection('desc')}
                  >
                    <span aria-hidden="true">▼</span>
                  </button>
                </span>
                <span className="book-sort-label">sort by</span>
                {SCORE_SORT_FIELDS.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    className={`book-sort-btn${sortField === field.id ? ' is-active' : ''}`}
                    aria-pressed={sortField === field.id}
                    onClick={() => setSortField(field.id)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="book-status book-status-error" role="alert">
                {error}
              </p>
            )}

            {loading ? (
              <p className="book-empty">Loading…</p>
            ) : filenames.length === 0 ? (
              <p className="book-empty">No PDFs uploaded yet.</p>
            ) : filteredScoreEntries.length === 0 ? (
              <p className="book-empty">No matches.</p>
            ) : (
              <ul className="book-file-list">
                {sortedScoreEntries.map((entry) =>
                  entry.kind === 'subpart' ? (
                    <BookSubpartScoreItem
                      key={scoreEntryKey(entry)}
                      user={user}
                      filename={entry.file.name}
                      modifiedAt={entry.file.modifiedAt}
                      piece={entry.piece}
                      subpart={entry.subpart}
                      library={library}
                      onLibraryChange={refreshLibrary}
                    />
                  ) : (
                    <BookScoreItem
                      key={scoreEntryKey(entry)}
                      user={user}
                      filename={entry.file.name}
                      modifiedAt={entry.file.modifiedAt}
                      library={library}
                      onLibraryChange={refreshLibrary}
                      onPdfDeleted={handlePdfDeleted}
                    />
                  ),
                )}
              </ul>
            )}
          </section>
        ) : (
          <section
            id="book-panel-catalog"
            role="tabpanel"
            aria-labelledby="book-tab-catalog"
            className="book-tabpanel"
          >
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
            ) : (
              <p className="book-empty">No catalog entries yet.</p>
            )}
          </section>
        )}
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
