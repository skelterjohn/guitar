import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AnnotationDownloadModal({
  open,
  filename,
  busy = false,
  error = '',
  onKeepCurrent,
  onDownload,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        onKeepCurrent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, busy, onKeepCurrent]);

  if (!open) return null;

  return createPortal(
    <div
      className="book-delete-pdf-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onKeepCurrent();
        }
      }}
    >
      <div
        className="book-delete-pdf-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="annotation-download-title"
      >
        <h2 id="annotation-download-title">Download annotations?</h2>
        <p className="book-delete-pdf-lead">
          Saved annotations for{' '}
          <strong className="book-delete-pdf-filename">{filename}</strong> differ from what is on
          this device.
        </p>
        <p className="book-delete-pdf-warning">
          Downloading will replace the local annotations for this PDF.
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
            onClick={onKeepCurrent}
            disabled={busy}
          >
            Keep current
          </button>
          <button
            type="button"
            className="book-delete-pdf-confirm"
            onClick={() => void onDownload()}
            disabled={busy}
          >
            {busy ? 'Downloading…' : 'Download'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
