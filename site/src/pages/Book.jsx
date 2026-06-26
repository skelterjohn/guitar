import BookAuthGate from '../components/BookAuthGate.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { bookDescription, bookHeading, bookTitle, bookUrl } from '../seo.js';

export default function Book() {
  usePageMeta({
    title: bookTitle,
    description: bookDescription,
    url: bookUrl,
    noindex: true,
  });

  return (
    <BookAuthGate>
      {(user) => (
        <div className="page-shell">
          {user?.email && (
            <div className="book-user-email" aria-label={`Signed in as ${user.email}`}>
              {user.email}
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
