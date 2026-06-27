import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function parsePageRange(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const rangeMatch = trimmed.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (rangeMatch) {
    return {
      pageStart: Number.parseInt(rangeMatch[1], 10),
      pageEnd: Number.parseInt(rangeMatch[2], 10),
    };
  }

  if (/^\d+$/.test(trimmed)) {
    const page = Number.parseInt(trimmed, 10);
    return { pageStart: page, pageEnd: page };
  }

  return null;
}

export default function BookNewSubpartModal({
  open,
  filename,
  busy = false,
  error = '',
  onCancel,
  onConfirm,
}) {
  const [part, setPart] = useState('');
  const [pages, setPages] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, busy, onCancel]);

  useEffect(() => {
    if (!open) {
      setPart('');
      setPages('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const partLabel = part.trim();
    if (!partLabel) return;

    const parsed = parsePageRange(pages);
    if (!parsed) return;

    onConfirm({
      part: partLabel,
      pageStart: parsed.pageStart,
      pageEnd: parsed.pageEnd,
    });
  };

  return createPortal(
    <div
      className="book-delete-pdf-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onCancel();
        }
      }}
    >
      <div
        className="book-delete-pdf-modal book-new-subpart-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-new-subpart-title"
      >
        <h2 id="book-new-subpart-title">New part</h2>
        <p className="book-delete-pdf-lead">
          Add another labeled part for{' '}
          <strong className="book-delete-pdf-filename">{filename}</strong>.
        </p>
        <form className="book-new-subpart-form" onSubmit={handleSubmit}>
          <label className="book-new-subpart-field">
            <span>part</span>
            <input
              type="text"
              value={part}
              onChange={(event) => setPart(event.target.value)}
              disabled={busy}
              autoComplete="off"
              placeholder="guitar 1"
            />
          </label>
          <label className="book-new-subpart-field">
            <span>pages</span>
            <input
              type="text"
              value={pages}
              onChange={(event) => setPages(event.target.value)}
              disabled={busy}
              autoComplete="off"
              placeholder="3 or 3-5"
            />
          </label>
          {error && (
            <p className="book-delete-pdf-error" role="alert">
              {error}
            </p>
          )}
          <div className="book-delete-pdf-actions">
            <button
              className="book-delete-pdf-cancel"
              type="button"
              onClick={onCancel}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="book-delete-pdf-confirm"
              type="submit"
              disabled={busy || !part.trim() || !parsePageRange(pages)}
            >
              {busy ? 'Saving…' : 'Add part'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { parsePageRange };
