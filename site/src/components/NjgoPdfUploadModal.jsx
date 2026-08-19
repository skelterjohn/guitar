import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { listNjgoPdfs, uploadNjgoPdf, NjgoPdfAlreadyExistsError } from '../bookendNjgoClient.js';
import {
  buildNjgoPdfBase,
  buildNjgoPdfFilename,
  nextNjgoPdfVersion,
  todayDateStamp,
} from '../utils/njgoPdfFilename.js';

export default function NjgoPdfUploadModal({ user, piece, pdf, onClose, onUploaded }) {
  const [existingNames, setExistingNames] = useState([]);
  const [version, setVersion] = useState(1);
  const [filenameOverride, setFilenameOverride] = useState('');
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const base = useMemo(
    () => buildNjgoPdfBase({ composer: piece.description, piece: piece.title, part: pdf.label }),
    [piece.description, piece.title, pdf.label],
  );

  useEffect(() => {
    let cancelled = false;
    listNjgoPdfs(user)
      .then((files) => {
        if (cancelled) return;
        const names = files.map((entry) => entry.name);
        setExistingNames(names);
        setVersion(nextNjgoPdfVersion(names, base));
      })
      .catch(() => {
        // Version history is a convenience; fall back to version 1 silently.
      });
    return () => {
      cancelled = true;
    };
  }, [user, base]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [busy, onClose]);

  const generatedFilename = useMemo(
    () => buildNjgoPdfFilename({ composer: piece.description, piece: piece.title, part: pdf.label, version }),
    [piece.description, piece.title, pdf.label, version],
  );
  const filename = filenameOverride || generatedFilename;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !filename) return;

    setBusy(true);
    setError('');
    try {
      if (!uploaded) {
        await uploadNjgoPdf(user, filename, file);
        setUploaded(true);
      }
      await onUploaded({ filename, hash: todayDateStamp() });
      onClose();
    } catch (uploadError) {
      if (uploadError instanceof NjgoPdfAlreadyExistsError) {
        setError(`"${filename}" already exists — bump the version number.`);
      } else if (uploaded) {
        setError(`Uploaded, but could not update repertoire.yaml: ${uploadError.message}`);
      } else {
        setError(uploadError.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="njgo-upload-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <form
        className="njgo-upload-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="njgo-upload-title"
        onSubmit={handleSubmit}
      >
        <h2 id="njgo-upload-title">
          Upload new version — {piece.title} ({pdf.label})
        </h2>
        <p className="njgo-upload-hint">
          Uploads are permanent — each filename can only be used once, so old
          versions stay recoverable.
        </p>

        {existingNames.length > 0 && (
          <details className="njgo-upload-history">
            <summary>Existing versions ({existingNames.length})</summary>
            <ul>
              {existingNames
                .filter((name) => name.startsWith(`${base}_`))
                .map((name) => (
                  <li key={name}>{name}</li>
                ))}
            </ul>
          </details>
        )}

        <label className="njgo-upload-field">
          Filename
          <input
            value={filename}
            onChange={(event) => setFilenameOverride(event.target.value)}
            disabled={busy || uploaded}
          />
        </label>

        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          disabled={busy || uploaded}
        />

        {error && (
          <p className="njgo-upload-error" role="alert">
            {error}
          </p>
        )}

        <div className="njgo-upload-actions">
          <button type="button" className="njgo-upload-cancel" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            type="submit"
            className="njgo-upload-submit"
            disabled={busy || (!uploaded && !file) || !filename}
          >
            {busy ? 'Working…' : uploaded ? 'Retry save' : 'Upload'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
