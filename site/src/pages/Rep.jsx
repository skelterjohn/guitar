import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

function RepSignInInfoModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="book-auth-backdrop"
      onClick={() => onClose()}
    >
      <div
        className="book-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rep-sign-in-info-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="rep-sign-in-info-title">Why sign in?</h2>
        <p className="book-auth-lead">
          Sign in to sync your annotations to and from the cloud, so you can be
          confident they won’t disappear if you clear browser data or switch
          devices.
        </p>
        <div className="book-auth-actions">
          <button className="book-auth-submit" type="button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function RepAuthBar() {
  const [user, loading] = useAuthState(auth);
  const [signInOpen, setSignInOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

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
          <>
            <button
              type="button"
              className="viewer-annotation-help"
              onClick={() => setInfoOpen(true)}
              title="Why sign in?"
              aria-label="Why sign in?"
            >
              ?
            </button>
            <button
              className="book-sign-out"
              type="button"
              onClick={() => setSignInOpen(true)}
            >
              sign in
            </button>
          </>
        )}
      </div>
      {signInOpen && !user && (
        <BookSignInModal
          title={`Sign in to ${repHeading}`}
          description={repDescription}
          onClose={() => setSignInOpen(false)}
        />
      )}
      {infoOpen && !user && (
        <RepSignInInfoModal onClose={() => setInfoOpen(false)} />
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
