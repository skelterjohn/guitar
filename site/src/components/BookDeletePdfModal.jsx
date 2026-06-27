import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function BookDeletePdfModal({
  open,
  filename,
  membershipCount = 0,
  busy = false,
  error = '',
  onCancel,
  onConfirm,
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
        aria-labelledby="book-delete-pdf-title"
      >
        <h2 id="book-delete-pdf-title">Delete score?</h2>
        <p className="book-delete-pdf-lead">
          <strong className="book-delete-pdf-filename">{filename}</strong> will be
          permanently removed. This cannot be undone.
        </p>
        {membershipCount > 0 && (
          <p className="book-delete-pdf-warning">
            This file is linked from {membershipCount} collection{' '}
            {membershipCount === 1 ? 'entry' : 'entries'}. Those links will
            break.
          </p>
        )}
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
            type="button"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
