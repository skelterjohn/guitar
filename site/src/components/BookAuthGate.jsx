import { useAuthState } from 'react-firebase-hooks/auth';
import { bookDescription, bookHeading } from '../seo.js';
import { auth, isFirebaseConfigured } from '../firebase.js';
import BookSignInModal from './BookSignInModal.jsx';

function BookAuthGateInner({ children, heading, description, signInTitle }) {
  const [user, loading, authError] = useAuthState(auth);

  if (loading) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>{heading}</h1>
          <p>Loading…</p>
        </header>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>{heading}</h1>
          <p className="book-auth-config-error">{authError.message}</p>
        </header>
      </main>
    );
  }

  return (
    <>
      {children(user)}
      {!user && (
        <BookSignInModal title={signInTitle} description={description} />
      )}
    </>
  );
}

export default function BookAuthGate({
  children,
  heading = bookHeading,
  description = bookDescription,
  signInTitle = `Sign in to ${bookHeading}`,
}) {
  if (!isFirebaseConfigured()) {
    return (
      <main className="page book-page">
        <header className="page-header">
          <h1>{heading}</h1>
          <p className="book-auth-config-error">
            Firebase is not configured. Add VITE_FIREBASE_* variables to your environment.
          </p>
        </header>
      </main>
    );
  }

  return (
    <BookAuthGateInner
      heading={heading}
      description={description}
      signInTitle={signInTitle}
    >
      {children}
    </BookAuthGateInner>
  );
}
