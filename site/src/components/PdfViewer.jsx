import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { pdfUrl } from '../config.js';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export default function PdfViewer({ filename, displayName }) {
  const url = pdfUrl(filename);
  const containerRef = useRef(null);
  const canvasRefs = useRef([]);
  const renderIdRef = useRef(0);
  const pdfDocRef = useRef(null);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setPageCount(0);
    canvasRefs.current = [];

    const loadingTask = pdfjs.getDocument(url);
    loadingTask.promise
      .then((doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(err.message ?? 'Failed to load PDF');
      });

    return () => {
      cancelled = true;
      loadingTask.destroy();
      pdfDocRef.current?.destroy();
      pdfDocRef.current = null;
    };
  }, [url]);

  useLayoutEffect(() => {
    if (status !== 'ready' || pageCount === 0 || !containerRef.current) return;

    const container = containerRef.current;

    const renderPages = async () => {
      const renderId = ++renderIdRef.current;
      const doc = pdfDocRef.current;
      if (!doc) return;

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      if (availableWidth === 0 || availableHeight === 0) return;

      for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
        if (renderId !== renderIdRef.current) return;

        const canvas = canvasRefs.current[pageNum - 1];
        if (!canvas) continue;

        const page = await doc.getPage(pageNum);
        if (renderId !== renderIdRef.current) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          availableWidth / baseViewport.width,
          availableHeight / baseViewport.height,
        );
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport, canvas }).promise;
      }
    };

    renderPages();

    const observer = new ResizeObserver(() => {
      renderPages();
    });
    observer.observe(container);

    return () => {
      renderIdRef.current += 1;
      observer.disconnect();
    };
  }, [status, pageCount, url]);

  return (
    <div className="viewer-page">
      <div className="viewer-toolbar">
        <Link to="/">&larr; Catalog</Link>
        <span className="viewer-title">{displayName ?? filename}</span>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
      <div className="viewer-content" ref={containerRef}>
        {status === 'loading' && <p className="viewer-status">Loading…</p>}
        {status === 'error' && (
          <p className="viewer-status viewer-status-error">{errorMessage}</p>
        )}
        {status === 'ready' &&
          Array.from({ length: pageCount }, (_, index) => (
            <div className="viewer-page-slot" key={index}>
              <canvas
                ref={(element) => {
                  canvasRefs.current[index] = element;
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
