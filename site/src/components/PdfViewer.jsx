import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as pdfjs from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';
import { pdfUrl } from '../config.js';
import ChevronIcon from './ChevronIcon.jsx';

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();

export default function PdfViewer({ filename, displayName }) {
  const url = pdfUrl(filename);
  const containerRef = useRef(null);
  const canvasRefs = useRef([]);
  const slotRefs = useRef([]);
  const renderIdRef = useRef(0);
  const pdfDocRef = useRef(null);
  const navigationRef = useRef({
    goToPrev: () => {},
    goToNext: () => {},
  });
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setPageCount(0);
    setCurrentPage(1);
    canvasRefs.current = [];
    slotRefs.current = [];

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

  useEffect(() => {
    if (status !== 'ready' || pageCount === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const getSlotTop = (slot) => {
      const containerRect = container.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      return slotRect.top - containerRect.top + container.scrollTop;
    };

    const getCurrentPageIndex = () => {
      const anchor = container.scrollTop + container.clientHeight / 2;
      let current = 0;

      for (let index = 0; index < pageCount; index += 1) {
        const slot = slotRefs.current[index];
        if (slot && getSlotTop(slot) <= anchor) {
          current = index;
        }
      }

      return current;
    };

    const updateCurrentPage = () => {
      setCurrentPage(getCurrentPageIndex() + 1);
    };

    const scrollToPage = (index) => {
      const slot = slotRefs.current[index];
      if (!slot) return;
      container.scrollTo({ top: getSlotTop(slot), behavior: 'auto' });
    };

    const goToPrev = () => {
      scrollToPage(Math.max(getCurrentPageIndex() - 1, 0));
    };

    const goToNext = () => {
      scrollToPage(Math.min(getCurrentPageIndex() + 1, pageCount - 1));
    };

    const goToStart = () => {
      container.scrollTo({ top: 0, behavior: 'auto' });
    };

    const goToEnd = () => {
      container.scrollTo({
        top: container.scrollHeight - container.clientHeight,
        behavior: 'auto',
      });
    };

    navigationRef.current = { goToPrev, goToNext };

    updateCurrentPage();

    const onScroll = () => {
      updateCurrentPage();
    };

    const onKeyDown = (event) => {
      if (
        event.key !== 'PageDown' &&
        event.key !== 'PageUp' &&
        event.key !== 'Home' &&
        event.key !== 'End'
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === 'PageDown') {
        goToNext();
      } else if (event.key === 'PageUp') {
        goToPrev();
      } else if (event.key === 'Home') {
        goToStart();
      } else {
        goToEnd();
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    const resizeObserver = new ResizeObserver(() => {
      updateCurrentPage();
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      resizeObserver.disconnect();
    };
  }, [status, pageCount]);

  return (
    <div className="viewer-page">
      <div className="viewer-toolbar">
        <div className="viewer-toolbar-side viewer-toolbar-start">
          <Link to="/">&larr; Catalog</Link>
        </div>
        {status === 'ready' && pageCount > 0 && (
          <div className="viewer-page-nav">
            <button
              type="button"
              className="viewer-page-arrow"
              onClick={() => navigationRef.current.goToPrev()}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <ChevronIcon direction="left" />
            </button>
            <span className="viewer-page-indicator">
              {currentPage} / {pageCount}
            </span>
            <button
              type="button"
              className="viewer-page-arrow"
              onClick={() => navigationRef.current.goToNext()}
              disabled={currentPage >= pageCount}
              aria-label="Next page"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        )}
        <div className="viewer-toolbar-side viewer-toolbar-end">
          <span className="viewer-title">{displayName ?? filename}</span>
          <a href={url} download={filename}>
            Download
          </a>
        </div>
      </div>
      <div className="viewer-content" ref={containerRef}>
        {status === 'loading' && <p className="viewer-status">Loading…</p>}
        {status === 'error' && (
          <p className="viewer-status viewer-status-error">{errorMessage}</p>
        )}
        {status === 'ready' &&
          Array.from({ length: pageCount }, (_, index) => (
            <div
              className="viewer-page-slot"
              key={index}
              ref={(element) => {
                slotRefs.current[index] = element;
              }}
            >
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
