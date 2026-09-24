import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AnnotationSaveConflictModal({
  open,
  filename,
  busy = false,
  busyAction = null,
  error = '',
  onCancel,
  onMerge,
  onOverwrite,
}) {
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

  if (!open) return null;

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
        className="book-delete-pdf-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="annotation-save-conflict-title"
      >
        <h2 id="annotation-save-conflict-title">Saved version has changed</h2>
        <p className="book-delete-pdf-lead">
          The saved annotations for{' '}
          <strong className="book-delete-pdf-filename">{filename}</strong> differ from what you
          started with.
        </p>
        <p className="book-delete-pdf-warning">
          Merge both sets of markings together, or overwrite the saved version with what's on this
          device.
        </p>
        {error && (
          <p className="book-delete-pdf-error" role="alert">
            {error}
          </p>
        )}
        <div className="book-delete-pdf-actions">
          <button
            type="button"
            className="book-delete-pdf-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="book-delete-pdf-cancel"
            onClick={() => void onMerge()}
            disabled={busy}
          >
            {busy && busyAction === 'merge' ? 'Merging…' : 'Merge'}
          </button>
          <button
            type="button"
            className="book-delete-pdf-confirm"
            onClick={() => void onOverwrite()}
            disabled={busy}
          >
            {busy && busyAction === 'overwrite' ? 'Saving…' : 'Overwrite'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
