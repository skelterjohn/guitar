import { useEffect, useState } from 'react';
import CompositionCard from './CompositionCard.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import DeleteIcon from './DeleteIcon.jsx';
import PencilIcon from './PencilIcon.jsx';
import SaveIcon from './SaveIcon.jsx';
import { pieceId } from '../utils/pieceId.js';

function BookSectionHeading({
  title,
  onBookSave,
  onBookDelete,
  editing,
  onStartEdit,
  onEndEdit,
}) {
  const [name, setName] = useState(title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!editing) {
      setName(title);
      setError('');
      setDeleteOpen(false);
      setDeleteError('');
    }
  }, [title, editing]);

  const handleSave = async () => {
    const nextName = name.trim();
    if (!nextName) {
      setError('Book name is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onBookSave(nextName);
      onEndEdit();
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

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setName(title);
      setError('');
      onEndEdit();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onBookDelete) return;
    setDeleteBusy(true);
    setDeleteError('');
    try {
      await onBookDelete();
      setDeleteOpen(false);
      onEndEdit();
    } catch (deleteErr) {
      setDeleteError(deleteErr.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  if (!onBookSave) {
    return <h2>{title}</h2>;
  }

  return (
    <div className="catalog-section-heading">
      {editing ? (
        <form className="catalog-section-edit-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <input
            className="catalog-section-input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy || deleteBusy}
            aria-label="Book name"
          />
          <div className="catalog-section-edit-actions">
            {onBookDelete && (
              <button
                type="button"
                className="catalog-section-edit catalog-section-edit-delete"
                onClick={() => {
                  setDeleteError('');
                  setDeleteOpen(true);
                }}
                disabled={busy || deleteBusy}
                aria-label="Delete book"
              >
                <DeleteIcon />
              </button>
            )}
            <button
              type="submit"
              className="catalog-section-edit"
              disabled={busy || deleteBusy}
              aria-label="Save book"
            >
              <SaveIcon />
            </button>
          </div>
        </form>
      ) : (
        <div className="catalog-section-heading-row">
          <h2>{title}</h2>
          <button
            type="button"
            className="catalog-section-edit"
            onClick={() => {
              setName(title);
              setError('');
              onStartEdit();
            }}
            aria-label="Edit book"
          >
            <PencilIcon />
          </button>
        </div>
      )}
      {error && (
        <p className="catalog-section-error" role="alert">
          {error}
        </p>
      )}
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete book?"
        itemName={title}
        lead="will be permanently removed. Pieces in your library are not deleted."
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
    </div>
  );
}

export default function Catalog({
  sections,
  viewState,
  viewPrefix,
  onPieceDelete,
  onBookSave,
  onBookDelete,
  availableFiles,
  foldable = false,
  expandedSectionIds,
  onExpandSection,
  onCollapseSection,
}) {
  const [activeEditId, setActiveEditId] = useState(null);

  const expandSection = (sectionId) => {
    onExpandSection?.(sectionId);
  };

  const collapseSection = (sectionId) => {
    onCollapseSection?.(sectionId);
    setActiveEditId((current) => (current === `book:${sectionId}` ? null : current));
  };

  return (
    <>
      {sections.map((section) => {
        const expanded = !foldable || expandedSectionIds?.has(section.id);
        const pieceTitles = section.pieces.map((piece) => piece.title).filter(Boolean).join(', ');

        if (foldable && !expanded) {
          return (
            <section
              key={section.id}
              id={section.id}
              className="catalog-section catalog-section--folded"
              role="button"
              tabIndex={0}
              onClick={() => expandSection(section.id)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                expandSection(section.id);
              }}
              aria-expanded={false}
              aria-label={`Expand ${section.title}`}
            >
              <div className="catalog-section-folded">
                <span className="book-score-fold-toggle" aria-hidden="true">
                  ▸
                </span>
                <span className="catalog-section-folded-title">{section.title}</span>
                {pieceTitles && (
                  <span className="catalog-section-folded-pieces">{pieceTitles}</span>
                )}
              </div>
            </section>
          );
        }

        return (
          <section key={section.id} id={section.id} className="catalog-section">
            {foldable ? (
              <div className="catalog-section-heading-row catalog-section-heading-row--foldable">
                <button
                  type="button"
                  className="book-score-fold-toggle"
                  onClick={() => collapseSection(section.id)}
                  aria-expanded
                  aria-label={`Collapse ${section.title}`}
                >
                  ▾
                </button>
                <BookSectionHeading
                  title={section.title}
                  editing={activeEditId === `book:${section.id}`}
                  onStartEdit={() => setActiveEditId(`book:${section.id}`)}
                  onEndEdit={() => setActiveEditId(null)}
                  onBookSave={onBookSave ? (name) => onBookSave(section.bookKey ?? section.title, name) : undefined}
                  onBookDelete={onBookDelete ? () => onBookDelete(section.bookKey ?? section.title) : undefined}
                />
              </div>
            ) : (
              <BookSectionHeading
                title={section.title}
                editing={activeEditId === `book:${section.id}`}
                onStartEdit={() => setActiveEditId(`book:${section.id}`)}
                onEndEdit={() => setActiveEditId(null)}
                onBookSave={onBookSave ? (name) => onBookSave(section.bookKey ?? section.title, name) : undefined}
                onBookDelete={onBookDelete ? () => onBookDelete(section.bookKey ?? section.title) : undefined}
              />
            )}
            {section.pieces.map((piece) => (
              <CompositionCard
                key={piece.title}
                id={pieceId(section.id, piece.title)}
                piece={piece}
                viewState={viewState}
                viewPrefix={viewPrefix}
                availableFiles={availableFiles}
                onPieceDelete={
                  onPieceDelete
                    ? () => onPieceDelete(piece.pieceKey ?? piece.title)
                    : undefined
                }
              />
            ))}
          </section>
        );
      })}
    </>
  );
}
