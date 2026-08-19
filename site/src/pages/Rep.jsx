import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import yaml from 'js-yaml';
import { saveNjgoRepertoireYaml } from '../bookendNjgoClient.js';
import BackFromRep from '../components/BackFromRep.jsx';
import BookSignInModal from '../components/BookSignInModal.jsx';
import Catalog from '../components/Catalog.jsx';
import RepPasswordGate from '../components/RepPasswordGate.jsx';
import TableOfContents from '../components/TableOfContents.jsx';
import { auth, isFirebaseConfigured } from '../firebase.js';
import useFoldableCatalogSections from '../hooks/useFoldableCatalogSections.js';
import useNjgoEditor from '../hooks/useNjgoEditor.js';
import usePageMeta from '../hooks/usePageMeta.js';
import useRepertoire from '../hooks/useRepertoire.js';
import { repDescription, repHeading, repPath, repTitle, repUrl } from '../seo.js';
import { REP_PDF_PREFIX } from '../utils/repPassword.js';

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
  const [user] = useAuthState(auth);
  const { repertoire, loading, setRepertoire } = useRepertoire();
  const njgoEditor = useNjgoEditor(user);
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

  const sections = repertoire?.sections ?? [];

  const handleNjgoPdfVersionUploaded = useCallback(
    async (piece, pdf, { filename, hash }) => {
      const nextRepertoire = {
        ...repertoire,
        sections: repertoire.sections.map((section) => ({
          ...section,
          pieces: section.pieces.map((p) => {
            if (p !== piece) return p;
            return {
              ...p,
              pdfs: p.pdfs.map((entry) =>
                entry === pdf ? { ...entry, file: `${REP_PDF_PREFIX}/${filename}`, hash } : entry,
              ),
            };
          }),
        })),
      };
      await saveNjgoRepertoireYaml(user, yaml.dump(nextRepertoire));
      setRepertoire(nextRepertoire);
    },
    [repertoire, user, setRepertoire],
  );

  return (
    <RepPasswordGate>
      <div className="page-shell">
        {isFirebaseConfigured() && <RepAuthBar />}
        {!loading && (
          <TableOfContents
            sections={sections}
            expandedSectionIds={expandedSectionIds}
            onSectionActivate={revealSection}
          />
        )}
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
          {loading ? (
            <p className="book-empty">Loading repertoire…</p>
          ) : (
            <Catalog
              sections={sections}
              viewState={{ from: repPath }}
              viewPrefix={repPath}
              foldable
              expandedSectionIds={expandedSectionIds}
              onExpandSection={expandSection}
              onCollapseSection={collapseSection}
              njgoEditor={njgoEditor}
              njgoUser={user}
              onNjgoPdfVersionUploaded={handleNjgoPdfVersionUploaded}
            />
          )}
        </main>
      </div>
    </RepPasswordGate>
  );
}
