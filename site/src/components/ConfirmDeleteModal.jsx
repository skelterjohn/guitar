import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmDeleteModal({
  open,
  title,
  itemName,
  lead,
  warning,
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
      className="confirm-delete-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onCancel();
        }
      }}
    >
      <div
        className="confirm-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <h2 id="confirm-delete-title">{title}</h2>
        <p className="confirm-delete-lead">
          <strong className="confirm-delete-item">{itemName}</strong> {lead}
        </p>
        {warning && <p className="confirm-delete-warning">{warning}</p>}
        {error && (
          <p className="confirm-delete-error" role="alert">
            {error}
          </p>
        )}
        <div className="confirm-delete-actions">
          <button
            className="confirm-delete-cancel"
            type="button"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="confirm-delete-confirm"
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
