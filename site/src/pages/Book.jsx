import { signOut } from 'firebase/auth';
import BookAuthGate from '../components/BookAuthGate.jsx';
import { auth } from '../firebase.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookTitle, bookUrl } from '../seo.js';

export default function Book() {
  usePageMeta({
    title: bookTitle,
    description: bookDescription,
    url: bookUrl,
    noindex: true,
  });

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out failed:', error);
    });
  };

  return (
    <BookAuthGate>
      {(user) => (
        <div className="page-shell">
          {user?.email && (
            <div className="book-user-bar">
              <button className="book-sign-out" type="button" onClick={handleSignOut}>
                sign out
              </button>
              <span className="book-user-email">{user.email}</span>
            </div>
          )}
          <main className="page book-page">
            <header className="page-header">
              <h1>{bookHeading}</h1>
              <p>{bookDescription}</p>
            </header>
          </main>
        </div>
      )}
    </BookAuthGate>
  );
}
