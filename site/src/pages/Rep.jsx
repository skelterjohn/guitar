import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import repertoire from '../data/repertoire.js';
import BackFromRep from '../components/BackFromRep.jsx';
import BookSignInModal from '../components/BookSignInModal.jsx';
import Catalog from '../components/Catalog.jsx';
import RepPasswordGate from '../components/RepPasswordGate.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import { auth, isFirebaseConfigured } from '../firebase.js';
import useFoldableCatalogSections from '../hooks/useFoldableCatalogSections.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { repDescription, repHeading, repPath, repTitle, repUrl } from '../seo.js';

function RepAuthBar() {
  const [user, loading] = useAuthState(auth);
  const [signInOpen, setSignInOpen] = useState(false);

  if (loading) return null;

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out failed:', error);
    });
  };

  return (
    <>
      <div className="book-user-bar">
        {user?.email ? (
          <>
            <button className="book-sign-out" type="button" onClick={handleSignOut}>
              sign out
            </button>
            <span className="book-user-email">{user.email}</span>
          </>
        ) : (
          <button
            className="book-sign-out"
            type="button"
            onClick={() => setSignInOpen(true)}
          >
            sign in
          </button>
        )}
      </div>
      {signInOpen && !user && (
        <BookSignInModal
          title={`Sign in to ${repHeading}`}
          description={repDescription}
          onClose={() => setSignInOpen(false)}
        />
      )}
    </>
  );
}

export default function Rep() {
  const {
    expandedSectionIds,
    expandSection,
    collapseSection,
    revealSection,
  } = useFoldableCatalogSections();

  usePageMeta({
    title: repTitle,
    description: repDescription,
    url: repUrl,
    noindex: true,
  });

  return (
    <RepPasswordGate>
      <div className="page-shell">
        {isFirebaseConfigured() && <RepAuthBar />}
        <TableOfContents
          sections={repertoire.sections}
          expandedSectionIds={expandedSectionIds}
          onSectionActivate={revealSection}
        />
        <main className="page">
          <header className="page-header">
            <div className="page-header-top">
              <div className="page-header-title">
                <BackFromRep />
                <h1>{repHeading}</h1>
              </div>
            </div>
            <p>{repDescription}</p>
          </header>
          <Catalog
            sections={repertoire.sections}
            viewState={{ from: repPath }}
            viewPrefix={repPath}
            foldable
            expandedSectionIds={expandedSectionIds}
            onExpandSection={expandSection}
            onCollapseSection={collapseSection}
          />
        </main>
      </div>
    </RepPasswordGate>
  );
}
