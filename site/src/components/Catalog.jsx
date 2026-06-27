import { useEffect, useState } from 'react';
import CompositionCard from './CompositionCard.jsx';
import PencilIcon from './PencilIcon.jsx';
import SaveIcon from './SaveIcon.jsx';
import { pieceId } from '../utils/pieceId.js';

function BookSectionHeading({ title, onBookSave }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) setName(title);
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
      setEditing(false);
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

  if (!onBookSave) {
    return <h2>{title}</h2>;
  }

  return (
    <div className="catalog-section-heading">
      {editing ? (
        <form className="catalog-section-edit-form" onSubmit={handleSubmit}>
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
              setEditing(true);
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

export default function Catalog({ sections, viewState, viewPrefix, onPieceSave, onBookSave }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="catalog-section">
          <BookSectionHeading
            title={section.title}
            onBookSave={onBookSave ? (name) => onBookSave(section.title, name) : undefined}
          />
          {section.pieces.map((piece) => (
            <CompositionCard
              key={piece.title}
              id={pieceId(section.id, piece.title)}
              piece={piece}
              viewState={viewState}
              viewPrefix={viewPrefix}
              onPieceSave={
                onPieceSave
                  ? (updates) => onPieceSave(section.title, piece.title, updates)
                  : undefined
              }
            />
          ))}
        </section>
      ))}
    </>
  );
}
