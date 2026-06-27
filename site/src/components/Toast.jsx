import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Toast({ message, tone = 'info', onDismiss, durationMs = 4000 }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      onDismiss?.();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  const isError = tone === 'error';

  return createPortal(
    <div
      className={`toast${isError ? ' toast-error' : ''}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {message}
    </div>,
    document.body,
  );
}
