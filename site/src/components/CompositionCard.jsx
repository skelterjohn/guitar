import { useEffect, useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import DeleteIcon from './DeleteIcon.jsx';
import ExternalLinkIcon from './ExternalLinkIcon.jsx';
import PencilIcon from './PencilIcon.jsx';
import PdfLinkList from './PdfLinkList.jsx';
import SaveIcon from './SaveIcon.jsx';

export default function CompositionCard({
  piece,
  id,
  viewState,
  viewPrefix,
  onPieceSave,
  onPieceDelete,
  availableFiles,
  editing = false,
  onStartEdit,
  onEndEdit,
}) {
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const links = piece.links ?? [];
  const [title, setTitle] = useState(piece.title);
  const [composer, setComposer] = useState(piece.composer ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!editing) {
      setTitle(piece.title);
      setComposer(piece.composer ?? '');
      setError('');
      setDeleteOpen(false);
      setDeleteError('');
    }
  }, [piece.title, piece.composer, editing]);

  const startEditing = () => {
    setTitle(piece.title);
    setComposer(piece.composer ?? '');
    setError('');
    onStartEdit?.();
  };

  const handleSave = async () => {
    if (!onPieceSave) return;

    const nextTitle = title.trim();
    if (!nextTitle) {
      setError('Piece name is required.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await onPieceSave({
        name: nextTitle,
        composer: composer.trim(),
      });
      onEndEdit?.();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void handleSave();
  };

  const cancelEditing = () => {
    setTitle(piece.title);
    setComposer(piece.composer ?? '');
    setError('');
    onEndEdit?.();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  };

  const handleToggle = () => {
    startEditing();
  };

  const handleDeleteConfirm = async () => {
    if (!onPieceDelete) return;
    setDeleteBusy(true);
    setDeleteError('');
    try {
      await onPieceDelete();
      setDeleteOpen(false);
      onEndEdit?.();
    } catch (deleteErr) {
      setDeleteError(deleteErr.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <article id={id} className="composition-card">
      {editing ? (
        <form className="composition-card-header composition-card-edit-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="composition-card-heading">
            <input
              className="composition-title-input"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={busy}
              aria-label="Piece name"
            />
            <input
              className="composition-composer-input"
              type="text"
              placeholder="composer"
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              disabled={busy}
              aria-label="Composer"
            />
          </div>
          {onPieceSave && (
            <div className="composition-card-edit-actions">
              {onPieceDelete && (
                <button
                  type="button"
                  className="composition-card-edit composition-card-edit-delete"
                  onClick={() => {
                    setDeleteError('');
                    setDeleteOpen(true);
                  }}
                  disabled={busy || deleteBusy}
                  aria-label="Delete piece"
                >
                  <DeleteIcon />
                </button>
              )}
              <button
                type="submit"
                className="composition-card-edit"
                disabled={busy || deleteBusy}
                aria-label="Save piece"
              >
                <SaveIcon />
              </button>
            </div>
          )}
        </form>
      ) : (
        <div className="composition-card-header">
          <div className="composition-card-heading">
            <h3>{piece.title}</h3>
            {piece.composer && (
              <p className="composition-composer">{piece.composer}</p>
            )}
          </div>
          {onPieceSave && (
            <button
              type="button"
              className="composition-card-edit"
              onClick={handleToggle}
              disabled={busy}
              aria-label="Edit piece"
            >
              <PencilIcon />
            </button>
          )}
        </div>
      )}
      {error && (
        <p className="composition-card-error" role="alert">
          {error}
        </p>
      )}
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete piece?"
        itemName={piece.title}
        lead="and all of its parts will be permanently removed. This cannot be undone."
        busy={deleteBusy}
        error={deleteError}
        onCancel={() => {
          if (deleteBusy) return;
          setDeleteOpen(false);
          setDeleteError('');
        }}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
      {paragraphs.length > 0 && (
        <div className="composition-description">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <PdfLinkList
        pdfs={piece.pdfs}
        viewState={viewState}
        viewPrefix={viewPrefix}
        availableFiles={availableFiles}
      />
      {links.length > 0 && (
        <div className="external-links">
          {links.map((link) => (
            <a
              key={link.url}
              className="external-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
