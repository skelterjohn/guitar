import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchNjgoRepertoireYaml,
  saveNjgoRepertoireYaml,
  listNjgoPdfs,
  uploadNjgoPdf,
  NjgoPdfAlreadyExistsError,
} from '../bookendNjgoClient.js';
import {
  buildNjgoPdfBase,
  buildNjgoPdfFilename,
  nextNjgoPdfVersion,
} from '../utils/njgoPdfFilename.js';

export default function RepEditorPanel({ user }) {
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);

  const [yamlText, setYamlText] = useState('');
  const [savedYamlText, setSavedYamlText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [pdfFiles, setPdfFiles] = useState([]);
  const [composer, setComposer] = useState('');
  const [piece, setPiece] = useState('');
  const [part, setPart] = useState('');
  const [version, setVersion] = useState(1);
  const [filenameOverride, setFilenameOverride] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedName, setUploadedName] = useState('');

  const refreshPdfs = useCallback(async () => {
    try {
      const files = await listNjgoPdfs(user);
      setPdfFiles(files);
    } catch {
      // Version history is a convenience, not required for upload/save to work.
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAvailable(false);
      setChecking(false);
      return undefined;
    }

    let cancelled = false;
    setChecking(true);

    fetchNjgoRepertoireYaml(user)
      .then((text) => {
        if (cancelled) return;
        if (text === null) {
          setAvailable(false);
          return;
        }
        setAvailable(true);
        setYamlText(text);
        setSavedYamlText(text);
        refreshPdfs();
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, refreshPdfs]);

  const base = useMemo(
    () => buildNjgoPdfBase({ composer, piece, part }),
    [composer, piece, part],
  );

  useEffect(() => {
    setVersion(nextNjgoPdfVersion(pdfFiles.map((entry) => entry.name), base));
  }, [pdfFiles, base]);

  const generatedFilename = useMemo(
    () => buildNjgoPdfFilename({ composer, piece, part, version }),
    [composer, piece, part, version],
  );
  const filename = filenameOverride || generatedFilename;
  const yamlDirty = yamlText !== savedYamlText;

  if (checking || !available) return null;

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      await saveNjgoRepertoireYaml(user, yamlText);
      window.location.reload();
    } catch (error) {
      setSaveError(error.message);
      setSaving(false);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !filename) return;
    setUploading(true);
    setUploadError('');
    setUploadedName('');
    try {
      await uploadNjgoPdf(user, filename, file);
      setUploadedName(filename);
      setFile(null);
      setFilenameOverride('');
      await refreshPdfs();
    } catch (error) {
      if (error instanceof NjgoPdfAlreadyExistsError) {
        setUploadError(`"${filename}" already exists — bump the version number.`);
      } else {
        setUploadError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <details className="rep-editor">
      <summary className="rep-editor-summary">Edit repertoire (authorized editors only)</summary>
      <div className="rep-editor-body">
        <form className="rep-editor-section" onSubmit={handleSave}>
          <label className="rep-editor-label" htmlFor="rep-editor-yaml">
            repertoire.yaml
          </label>
          <textarea
            id="rep-editor-yaml"
            className="rep-editor-yaml"
            value={yamlText}
            onChange={(event) => setYamlText(event.target.value)}
            spellCheck={false}
            rows={20}
          />
          {saveError && (
            <p className="rep-editor-error" role="alert">
              {saveError}
            </p>
          )}
          <div className="rep-editor-actions">
            <button className="rep-editor-submit" type="submit" disabled={saving || !yamlDirty}>
              {saving ? 'Saving…' : 'Save repertoire'}
            </button>
          </div>
        </form>

        <form className="rep-editor-section" onSubmit={handleUpload}>
          <h3 className="rep-editor-heading">Upload a new PDF version</h3>
          <p className="rep-editor-hint">
            Uploads are permanent — every filename can only be used once, so old
            versions are never lost. Paste the resulting filename into the matching{' '}
            <code>pdfs:</code> entry above (and update its <code>hash:</code> date), then
            save.
          </p>
          <div className="rep-editor-fields">
            <label className="rep-editor-field">
              Composer
              <input value={composer} onChange={(event) => setComposer(event.target.value)} />
            </label>
            <label className="rep-editor-field">
              Piece
              <input value={piece} onChange={(event) => setPiece(event.target.value)} />
            </label>
            <label className="rep-editor-field">
              Part
              <input value={part} onChange={(event) => setPart(event.target.value)} />
            </label>
            <label className="rep-editor-field rep-editor-field-version">
              Version
              <input
                type="number"
                min="1"
                value={version}
                onChange={(event) => setVersion(Number(event.target.value) || 1)}
              />
            </label>
          </div>
          <label className="rep-editor-field">
            Filename
            <input
              value={filename}
              onChange={(event) => setFilenameOverride(event.target.value)}
              placeholder="composer_piece_part_version.pdf"
            />
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          {uploadError && (
            <p className="rep-editor-error" role="alert">
              {uploadError}
            </p>
          )}
          {uploadedName && (
            <p className="rep-editor-success">
              Uploaded <code>{uploadedName}</code>.
            </p>
          )}
          <div className="rep-editor-actions">
            <button
              className="rep-editor-submit"
              type="submit"
              disabled={uploading || !file || !filename}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>

        <div className="rep-editor-section">
          <h3 className="rep-editor-heading">Existing PDF versions</h3>
          {pdfFiles.length === 0 ? (
            <p className="rep-editor-hint">No PDFs uploaded yet.</p>
          ) : (
            <ul className="rep-editor-history-list">
              {pdfFiles.map((entry) => (
                <li key={entry.name}>{entry.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </details>
  );
}
