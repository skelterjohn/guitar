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
  flow = 'form',
  initialPart = '',
  pageStart: fixedPageStart = null,
  pageEnd: fixedPageEnd = null,
  onCancel,
  onConfirm,
}) {
  const [part, setPart] = useState('');
  const [pages, setPages] = useState('');
  const viewerBegin = flow === 'viewer-begin';
  const fixedRange = !viewerBegin && fixedPageStart != null && fixedPageEnd != null;

  const formatFixedPages = () => {
    if (!fixedRange) return '';
    if (fixedPageEnd === fixedPageStart) return `p. ${fixedPageStart}`;
    return `pp. ${fixedPageStart}–${fixedPageEnd}`;
  };

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
      return;
    }
    setPart(initialPart);
  }, [open, initialPart]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const partLabel = part.trim();
    if (!partLabel) return;

    if (viewerBegin) {
      onConfirm({ part: partLabel });
      return;
    }

    let pageStart;
    let pageEnd;
    if (fixedRange) {
      pageStart = fixedPageStart;
      pageEnd = fixedPageEnd;
    } else {
      const parsed = parsePageRange(pages);
      if (!parsed) return;
      pageStart = parsed.pageStart;
      pageEnd = parsed.pageEnd;
    }

    onConfirm({
      part: partLabel,
      pageStart,
      pageEnd,
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
        {viewerBegin ? (
          <p className="book-delete-pdf-lead">
            Name the new part for{' '}
            <strong className="book-delete-pdf-filename">{filename}</strong>.
          </p>
        ) : (
          <p className="book-delete-pdf-lead">
            Add another labeled part for{' '}
            <strong className="book-delete-pdf-filename">{filename}</strong>.
          </p>
        )}
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
          {viewerBegin && (
            <ul className="book-new-subpart-instructions">
              <li>
                Go to the last page of the part and click{' '}
                <strong>{part.trim() || 'your part name'}</strong>.
              </li>
              <li>Hit <kbd>Escape</kbd> any time to cancel.</li>
            </ul>
          )}
          {fixedRange ? (
            <p className="book-new-subpart-fixed-pages">
              pages <strong>{formatFixedPages()}</strong>
            </p>
          ) : !viewerBegin ? (
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
          ) : null}
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
              disabled={busy || !part.trim() || (!viewerBegin && !fixedRange && !parsePageRange(pages))}
            >
              {busy ? 'Saving…' : viewerBegin ? 'Begin' : 'Add part'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { parsePageRange };
