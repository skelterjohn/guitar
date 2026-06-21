import { useId, useState } from 'react';
import { createPortal } from 'react-dom';

export default function RepPasswordModal({ onSubmit }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const accepted = await onSubmit(value);
      if (!accepted) {
        setError('Incorrect password.');
      }
    } catch {
      setError('Could not verify password. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="rep-password-backdrop">
      <div
        className="rep-password-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rep-password-title"
      >
        <h2 id="rep-password-title">Password required</h2>
        <p className="rep-password-lead">Enter the password to view NJGO repertoire.</p>
        <form className="rep-password-form" onSubmit={handleSubmit}>
          <label className="rep-password-label" htmlFor={inputId}>
            Password
          </label>
          <input
            id={inputId}
            className="rep-password-input"
            type="password"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError('');
            }}
            autoComplete="current-password"
            autoFocus
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined}
            disabled={submitting}
          />
          <p
            id={errorId}
            className="rep-password-error"
            role={error ? 'alert' : undefined}
            aria-live="polite"
          >
            {error}
          </p>
          <div className="rep-password-actions">
            <button
              className="rep-password-submit"
              type="submit"
              disabled={!value.trim() || submitting}
            >
              {submitting ? 'Checking…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
