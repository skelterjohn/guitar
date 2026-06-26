import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isFirebaseConfigured } from '../firebase.js';
import BookSignInModal from './BookSignInModal.jsx';

function BookAuthGateInner({ children }) {
  const [user, loading, authError] = useAuthState(auth);

  if (loading) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>book</h1>
          <p>Loading…</p>
        </header>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>book</h1>
          <p className="book-auth-config-error">{authError.message}</p>
        </header>
      </main>
    );
  }

  return (
    <>
      {children(user)}
      {!user && <BookSignInModal />}
    </>
  );
}

export default function BookAuthGate({ children }) {
  if (!isFirebaseConfigured()) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>book</h1>
          <p className="book-auth-config-error">
            Firebase is not configured. Add VITE_FIREBASE_* variables to your environment.
          </p>
        </header>
      </main>
    );
  }

  return <BookAuthGateInner>{children}</BookAuthGateInner>;
}
