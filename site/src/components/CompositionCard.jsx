import { useEffect, useState } from 'react';
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
  availableFiles,
}) {
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const links = piece.links ?? [];
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(piece.title);
  const [composer, setComposer] = useState(piece.composer ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) {
      setTitle(piece.title);
      setComposer(piece.composer ?? '');
    }
  }, [piece.title, piece.composer, editing]);

  const startEditing = () => {
    setTitle(piece.title);
    setComposer(piece.composer ?? '');
    setError('');
    setEditing(true);
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

  const cancelEditing = () => {
    setEditing(false);
    setTitle(piece.title);
    setComposer(piece.composer ?? '');
    setError('');
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
            <button
              type="submit"
              className="composition-card-edit"
              disabled={busy}
              aria-label="Save piece"
            >
              <SaveIcon />
            </button>
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
