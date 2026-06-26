import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function BookSignInModal() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (signInError) {
      if (signInError?.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error('Google sign-in failed:', signInError);
      setError('Could not sign in with Google. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="book-auth-backdrop">
      <div
        className="book-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-auth-title"
      >
        <h2 id="book-auth-title">Sign in</h2>
        <p className="book-auth-lead">Sign in to upload and view your PDFs.</p>
        <p
          className="book-auth-error"
          role={error ? 'alert' : undefined}
          aria-live="polite"
        >
          {error}
        </p>
        <div className="book-auth-actions">
          <button
            className="book-auth-submit"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
