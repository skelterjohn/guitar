import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Toast({ message, onDismiss, durationMs = 4000 }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      onDismiss?.();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  return createPortal(
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>,
    document.body,
  );
}
