import { useEffect, useState } from 'react';
import CompositionCard from './CompositionCard.jsx';
import PencilIcon from './PencilIcon.jsx';
import SaveIcon from './SaveIcon.jsx';
import { pieceId } from '../utils/pieceId.js';

function BookSectionHeading({ sectionId, title, onBookSave, editing, onStartEdit, onEndEdit }) {
  const [name, setName] = useState(title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) {
      setName(title);
      setError('');
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
            disabled={busy}
            aria-label="Book name"
          />
          <button
            type="submit"
            className="catalog-section-edit"
            disabled={busy}
            aria-label="Save book"
          >
            <SaveIcon />
          </button>
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
    </div>
  );
}

export default function Catalog({ sections, viewState, viewPrefix, onPieceSave, onBookSave, availableFiles }) {
  const [activeEditId, setActiveEditId] = useState(null);

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="catalog-section">
          <BookSectionHeading
            sectionId={section.id}
            title={section.title}
            editing={activeEditId === `book:${section.id}`}
            onStartEdit={() => setActiveEditId(`book:${section.id}`)}
            onEndEdit={() => setActiveEditId(null)}
            onBookSave={onBookSave ? (name) => onBookSave(section.title, name) : undefined}
          />
          {section.pieces.map((piece) => {
            const pieceEditId = `piece:${pieceId(section.id, piece.title)}`;
            return (
            <CompositionCard
              key={piece.title}
              id={pieceId(section.id, piece.title)}
              piece={piece}
              viewState={viewState}
              viewPrefix={viewPrefix}
              availableFiles={availableFiles}
              editing={activeEditId === pieceEditId}
              onStartEdit={() => setActiveEditId(pieceEditId)}
              onEndEdit={() => setActiveEditId(null)}
              onPieceSave={
                onPieceSave
                  ? (updates) => onPieceSave(section.title, piece.title, updates)
                  : undefined
              }
            />
            );
          })}
        </section>
      ))}
    </>
  );
}
