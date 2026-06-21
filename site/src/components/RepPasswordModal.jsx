import { useId, useState } from 'react';
import { createPortal } from 'react-dom';

export default function RepPasswordModal({ onSubmit }) {
  const [value, setValue] = useState('');
  const inputId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(value);
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
            onChange={(event) => setValue(event.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          <div className="rep-password-actions">
            <button className="rep-password-submit" type="submit" disabled={!value.trim()}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
