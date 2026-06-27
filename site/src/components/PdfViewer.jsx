import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { pdfUrl } from '../config.js';
import { acquirePdfDocument, releasePdfDocument } from '../pdfDocumentCache.js';
import { getCachedRender, setCachedRender } from '../pdfRenderCache.js';
import {
  findPdfByFile,
  getPieceLabelPreference,
  pdfFileForPiece,
  pdfFilesMatch,
  setPieceLabelPreference,
} from '../utils/pieceLabelPreference.js';
import AnnotationHelpModal from './AnnotationHelpModal.jsx';
import AnnotationOverlay from './AnnotationOverlay.jsx';
import AnnotationMenu from './AnnotationMenu.jsx';
import ChevronIcon from './ChevronIcon.jsx';
import DownloadIcon from './DownloadIcon.jsx';
import PdfLinkList from './PdfLinkList.jsx';
import PrintIcon from './PrintIcon.jsx';
import {
  getAnnotationColorPreference,
  resolveAnnotationColor,
  setAnnotationColorPreference,
} from '../utils/annotationColorPreference.js';
import { createDebouncedSave, createStrokeId, loadAnnotations, requestPersistentStorage } from '../utils/pdfAnnotations.js';
import { createPenScrollLock } from '../utils/penScrollLock.js';
import { glyphDrawSpecFromDrop } from '../utils/annotationRaster.js';
import {
  createLayerRasterRecord,
  createPageLayersRecord,
  normalizePageEntry,
  normalizePages,
  pageHasLayers,
} from '../utils/annotationPages.js';
import { PEN_COLOR } from '../utils/stylusInput.js';
import { viewRouteFilename } from '../utils/pdfPaths.js';
import { buildPrintSheets } from '../utils/printPdf.js';
import { catalogPath, isBookPath, repPath, viewPath } from '../seo.js';

function loadStatusMessage(phase) {
  switch (phase) {
    case 'downloading':
      return 'Downloading…';
    case 'rendering':
      return 'Rendering…';
    default:
      return 'Loading…';
  }
}

export default function PdfViewer({
  filename,
  currentFile: currentFileOverride,
  pdfHash,
  pdfUrl: pdfUrlOverride,
  loadPdfBytes,
  downloadHref,
  downloadName: downloadNameOverride,
  onDownload,
  pdfs = [],
  pieceKey = null,
  sectionPieces = [],
  sectionTitle = null,
  backTo = catalogPath,
  backLabel = 'Catalog',
  viewState,
}) {
  const currentFile = currentFileOverride ?? filename;
  const url = pdfUrlOverride ?? pdfUrl(filename, pdfHash);
  const downloadLink = downloadHref === undefined ? url : downloadHref;
  const downloadName = downloadNameOverride ?? viewRouteFilename(filename);
  const viewContext = backTo === repPath ? 'rep' : isBookPath(backTo) ? 'book' : 'catalog';
  const currentLabel = findPdfByFile(pdfs, currentFile)?.label;

  useEffect(() => {
    if (pieceKey && currentLabel) {
      setPieceLabelPreference(pieceKey, currentLabel);
    }
  }, [pieceKey, currentLabel]);
  const containerRef = useRef(null);
  const canvasRefs = useRef([]);
  const slotRefs = useRef([]);
  const renderIdRef = useRef(0);
  const renderTasksRef = useRef([]);
  const pdfDocRef = useRef(null);
  const navigationRef = useRef({
    goToPrev: () => {},
    goToNext: () => {},
  });
  const toolbarRef = useRef(null);
  const toolbarStartRef = useRef(null);
  const toolbarEndRef = useRef(null);
  const pageNavRef = useRef(null);
  const resetPageScrollRef = useRef(() => {});
  const scrollToTopPendingRef = useRef(true);
  const loadedUrlRef = useRef(null);
  const headerHiddenRef = useRef(false);
  const currentPageRef = useRef(1);
  const [pageNavLeft, setPageNavLeft] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageMediaSizes, setPageMediaSizes] = useState([]);
  const [pageBaseDisplaySizes, setPageBaseDisplaySizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [loadPhase, setLoadPhase] = useState('loading');
  const [displayReady, setDisplayReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [headerHidden, setHeaderHidden] = useState(false);
  const [footerHidden, setFooterHidden] = useState(true);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [pageAnnotations, setPageAnnotations] = useState({});
  const [annotationMenu, setAnnotationMenu] = useState(null);
  const [glyphDragActive, setGlyphDragActive] = useState(false);
  const [glyphDragPreview, setGlyphDragPreview] = useState(null);
  const [glyphDropRequest, setGlyphDropRequest] = useState(null);
  const [layerClearRequest, setLayerClearRequest] = useState(null);
  const [annotationTool, setAnnotationTool] = useState(null);
  const [annotationColor, setAnnotationColor] = useState(
    () => getAnnotationColorPreference() ?? PEN_COLOR,
  );
  const [storageWarning, setStorageWarning] = useState('');
  const [annotationHelpOpen, setAnnotationHelpOpen] = useState(false);
  const [printSheets, setPrintSheets] = useState(null);
  const [printBusy, setPrintBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);

  const pdfZoomRef = useRef(1);
  const pendingZoomScrollRef = useRef(null);
  const pageBaseDisplaySizesRef = useRef([]);
  const isPinchingRef = useRef(false);
  const penScrollLockRef = useRef(null);
  const lastPenTapRef = useRef(null);
  const saveAnnotationsRef = useRef(null);
  const pageRastersRef = useRef({});
  const annotationColorRef = useRef(annotationColor);
  const annotationMenuRef = useRef(null);
  const annotationToolRef = useRef(null);
  const dismissTapPointerIdRef = useRef(null);
  const glyphDragActiveRef = useRef(false);
  const onSaveResultRef = useRef(() => {});

  onSaveResultRef.current = (saved) => {
    if (saved === false) {
      setStorageWarning('Annotations could not be saved locally.');
    } else {
      setStorageWarning('');
    }
  };

  if (!saveAnnotationsRef.current) {
    saveAnnotationsRef.current = createDebouncedSave(400, (saved) => {
      onSaveResultRef.current(saved);
    });
  }

  headerHiddenRef.current = headerHidden;
  currentPageRef.current = currentPage;
  pdfZoomRef.current = pdfZoom;
  annotationColorRef.current = annotationColor;
  annotationMenuRef.current = annotationMenu;
  annotationToolRef.current = annotationTool;
  glyphDragActiveRef.current = glyphDragActive;

  const isTouchAnnotating =
    Boolean(annotationMenu) &&
    (annotationTool === 'pen' || annotationTool === 'eraser');

  const getCurrentPageFrame = () => {
    const slot = slotRefs.current[currentPageRef.current - 1];
    return slot?.querySelector('.viewer-page-frame') ?? null;
  };

  const resetPageScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const applyScroll = () => {
      container.scrollTop = 0;
    };

    applyScroll();
    requestAnimationFrame(() => {
      applyScroll();
      requestAnimationFrame(applyScroll);
    });
  };

  resetPageScrollRef.current = resetPageScroll;

  const finishScrollToTopPending = () => {
    if (!scrollToTopPendingRef.current) return;
    scrollToTopPendingRef.current = false;
    resetPageScrollRef.current();
    setCurrentPage(1);
  };

  useLayoutEffect(() => {
    scrollToTopPendingRef.current = true;
    setCurrentPage(1);
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [url]);

  useLayoutEffect(() => {
    if (status !== 'ready') return;
    const container = containerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [status, url]);

  useEffect(() => {
    if (status !== 'ready') return undefined;

    let cancelled = false;
    requestPersistentStorage();

    loadAnnotations(filename).then((record) => {
      if (cancelled) return;
      const pages = normalizePages(record?.pages);
      pageRastersRef.current = pages;
      setPageAnnotations(pages);
      setAnnotationColor(resolveAnnotationColor(record?.color));
      setStorageWarning('');
    });

    return () => {
      cancelled = true;
    };
  }, [filename, status]);

  useEffect(() => {
    if (status !== 'ready' || pageCount === 0) return undefined;

    const timeout = window.setTimeout(() => {
      scrollToTopPendingRef.current = false;
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [status, pageCount, url]);

  useLayoutEffect(() => {
    loadedUrlRef.current = null;
    setStatus('loading');
    setLoadPhase('loading');
    setDisplayReady(false);
    setPageCount(0);
    setPageMediaSizes([]);
    setPageBaseDisplaySizes([]);
    setCurrentPage(1);
    setPdfZoom(1);
    setPageAnnotations({});
    pageRastersRef.current = {};
    setAnnotationMenu(null);
    setGlyphDragActive(false);
    setGlyphDragPreview(null);
    setGlyphDropRequest(null);
    setStorageWarning('');
    lastPenTapRef.current = null;
    saveAnnotationsRef.current?.cancel();
    scrollToTopPendingRef.current = true;
    canvasRefs.current = [];
    slotRefs.current = [];
    pageBaseDisplaySizesRef.current = [];
    pdfDocRef.current = null;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [url]);

  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      if (cancelled) return;

      try {
        const doc = await acquirePdfDocument(url, {
          onPhase: (phase) => {
            if (!cancelled) setLoadPhase(phase);
          },
          loadBytes: loadPdfBytes,
        });
        if (cancelled) return;

        pdfDocRef.current = doc;
        loadedUrlRef.current = url;
        setPageCount(doc.numPages);
        setStatus('ready');
        setLoadPhase('rendering');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(err.message ?? 'Failed to load PDF');
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
      void saveAnnotationsRef.current?.flushNow();
      if (loadedUrlRef.current === url) {
        loadedUrlRef.current = null;
      }
      pdfDocRef.current = null;
      releasePdfDocument(url);
    };
  }, [url, loadPdfBytes]);

  const persistPageAnnotations = (pages, color = annotationColorRef.current) => {
    const storagePages = Object.fromEntries(
      Object.entries(pages).map(([key, page]) => {
        const layers = Object.fromEntries(
          Object.entries(page.layers ?? {}).map(([layerColor, layer]) => [
            layerColor,
            createLayerRasterRecord(layer.blob),
          ]),
        );
        return [key, createPageLayersRecord(page.width, page.height, layers)];
      }),
    );
    saveAnnotationsRef.current.schedule(filename, storagePages, color);
  };

  const handleAnnotationColorChange = (color) => {
    setAnnotationColor(color);
    setAnnotationColorPreference(color);
    persistPageAnnotations(pageRastersRef.current, color);
  };

  const dismissAnnotationMenu = (pointerId = null) => {
    if (pointerId != null) {
      dismissTapPointerIdRef.current = pointerId;
    }
    setGlyphDragActive(false);
    setGlyphDragPreview(null);
    setGlyphDropRequest(null);
    annotationMenuRef.current = null;
    annotationToolRef.current = null;
    setAnnotationMenu(null);
    setAnnotationTool(null);
  };

  const openAnnotationMenuAt = useCallback((clientX, clientY) => {
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
      return;
    }

    setAnnotationMenu({ clientX, clientY, openId: performance.now() });
  }, []);

  const handleRasterChange = (pageNumber, color, blob, width, height) => {
    const key = String(pageNumber);
    const existing = pageRastersRef.current[key];
    const nextLayers = { ...(existing?.layers ?? {}) };

    if (blob) {
      nextLayers[color] = { blob };
    } else {
      delete nextLayers[color];
    }

    const next = { ...pageRastersRef.current };
    if (Object.keys(nextLayers).length === 0) {
      delete next[key];
    } else {
      next[key] = {
        width,
        height,
        layers: nextLayers,
      };
    }

    pageRastersRef.current = next;
    setPageAnnotations(next);
    persistPageAnnotations(next);
  };

  const handleClearCurrentLayer = () => {
    setLayerClearRequest({
      id: createStrokeId(),
      pageNumber: currentPage,
      color: annotationColorRef.current,
    });
  };

  const handleClearCurrentPage = () => {
    const key = String(currentPage);
    if (!pageHasLayers(pageRastersRef.current[key])) {
      return;
    }

    const next = { ...pageRastersRef.current };
    delete next[key];
    pageRastersRef.current = next;
    setPageAnnotations(next);
    persistPageAnnotations(next);
  };

  const handleGlyphDragPreview = (preview) => {
    setGlyphDragPreview(preview);
  };

  const handleGlyphDrop = ({ pageNumber, glyphId, x, y, text, chord }) => {
    setGlyphDragPreview(null);
    setGlyphDropRequest({
      id: createStrokeId(),
      pageNumber,
      x,
      y,
      spec: glyphDrawSpecFromDrop({
        glyphId,
        text,
        chord,
        color: annotationColorRef.current,
      }),
    });
  };

  const handlePrint = async () => {
    const doc = pdfDocRef.current;
    if (!doc || printBusy || status !== 'ready' || pageCount === 0) return;

    setPrintBusy(true);
    try {
      const sheets = await buildPrintSheets(
        doc,
        pageCount,
        pageRastersRef.current,
      );

      flushSync(() => {
        setPrintSheets(sheets);
      });

      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });

      const cleanup = () => {
        setPrintSheets(null);
        setPrintBusy(false);
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      window.print();
    } catch (err) {
      console.error('Print failed:', err);
      setPrintSheets(null);
      setPrintBusy(false);
    }
  };

  const handleDownload = async () => {
    if (!onDownload || downloadBusy) return;

    setDownloadBusy(true);
    try {
      await onDownload();
    } catch (err) {
      console.error('Download failed:', err);
      setErrorMessage(err.message ?? 'Download failed');
    } finally {
      setDownloadBusy(false);
    }
  };

  useLayoutEffect(() => {
    if (status !== 'ready' || pageCount === 0 || !containerRef.current) return;
    if (loadedUrlRef.current !== url) return;

    const container = containerRef.current;
    let cancelled = false;
    let resizeTimer = null;
    let lastContainerWidth = 0;
    let lastContainerHeight = 0;
    let renderAttempts = 0;

    setLoadPhase('rendering');

    const cancelActiveRenders = async () => {
      const tasks = renderTasksRef.current.filter(Boolean);
      renderTasksRef.current = [];
      if (tasks.length === 0) return;

      for (const task of tasks) {
        task.cancel();
      }

      await Promise.all(
        tasks.map((task) =>
          task.promise.catch((err) => {
            if (err?.name !== 'RenderingCancelledException') {
              throw err;
            }
          }),
        ),
      );
    };

    const renderPages = async () => {
      const renderId = ++renderIdRef.current;
      const renderUrl = url;

      await cancelActiveRenders();
      if (cancelled || renderId !== renderIdRef.current) return;

      const doc = pdfDocRef.current;
      if (!doc) return;

      const numPages = doc.numPages;
      if (numPages === 0) return;

      const isRenderActive = () =>
        !cancelled &&
        renderId === renderIdRef.current &&
        loadedUrlRef.current === renderUrl &&
        pdfDocRef.current === doc;

      const isBenignRenderError = (err) =>
        err?.name === 'RenderingCancelledException' ||
        String(err?.message ?? '').includes('Invalid page request');

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      if (availableWidth === 0 || availableHeight === 0) return;

      lastContainerWidth = availableWidth;
      lastContainerHeight = availableHeight;

      const outputScale = window.devicePixelRatio || 1;
      const nextPageMediaSizes = Array.from({ length: numPages });

      const renderOnePage = async (pageNum) => {
        if (!isRenderActive()) return null;
        if (pageNum < 1 || pageNum > numPages) return null;

        const canvas = canvasRefs.current[pageNum - 1];
        if (!canvas) return null;

        let page;
        try {
          page = await doc.getPage(pageNum);
        } catch (err) {
          if (!isRenderActive() || isBenignRenderError(err)) return null;
          console.error('PDF render failed:', err);
          return null;
        }
        if (!isRenderActive()) return null;

        const baseViewport = page.getViewport({ scale: 1 });
        const mediaSize = {
          width: baseViewport.width,
          height: baseViewport.height,
        };
        const scale = Math.min(
          availableWidth / baseViewport.width,
          availableHeight / baseViewport.height,
        );
        const viewport = page.getViewport({ scale });

        const baseWidth = Math.floor(viewport.width);
        const baseHeight = Math.floor(viewport.height);
        pageBaseDisplaySizesRef.current[pageNum - 1] = {
          width: baseWidth,
          height: baseHeight,
        };

        const canvasWidth = Math.floor(viewport.width * outputScale);
        const canvasHeight = Math.floor(viewport.height * outputScale);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${baseWidth}px`;
        canvas.style.height = `${baseHeight}px`;

        const context = canvas.getContext('2d');
        const renderKey = `${url}|${pageNum}|${canvasWidth}|${canvasHeight}`;
        const cachedRender = getCachedRender(renderKey);

        if (cachedRender) {
          context.drawImage(cachedRender.bitmap, 0, 0);
          return { pageNum, mediaSize };
        }

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
        const renderTask = page.render({
          canvasContext: context,
          viewport,
          transform,
          canvas,
        });
        renderTasksRef.current[pageNum - 1] = renderTask;

        try {
          await renderTask.promise;
        } catch (err) {
          if (!isRenderActive() || isBenignRenderError(err)) return null;
          console.error('PDF render failed:', err);
          return null;
        } finally {
          renderTasksRef.current[pageNum - 1] = null;
        }

        if (!isRenderActive()) return null;

        try {
          const bitmap = await createImageBitmap(canvas);
          setCachedRender(renderKey, bitmap);
        } catch {
          // Skip caching if the browser cannot retain this bitmap.
        }

        return { pageNum, mediaSize };
      };

      const results = await Promise.all(
        Array.from({ length: numPages }, (_, index) => renderOnePage(index + 1)),
      );
      const renderedCount = results.filter(Boolean).length;

      for (const result of results) {
        if (!result) continue;
        nextPageMediaSizes[result.pageNum - 1] = result.mediaSize;
      }

      if (scrollToTopPendingRef.current) {
        container.scrollTop = 0;
      }

      if (cancelled || renderId !== renderIdRef.current) return;

      if (renderedCount > 0) {
        setPageMediaSizes(nextPageMediaSizes);
        setPageBaseDisplaySizes([...pageBaseDisplaySizesRef.current]);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled || renderId !== renderIdRef.current) return;
            resetPageScrollRef.current();
            if (scrollToTopPendingRef.current) {
              finishScrollToTopPending();
            } else if (headerHiddenRef.current) {
              resetPageScrollRef.current();
            }
            setDisplayReady(true);
          });
        });
      }

      if (
        renderedCount === 0 &&
        !cancelled &&
        renderId === renderIdRef.current
      ) {
        if (renderAttempts < 5) {
          renderAttempts += 1;
          requestAnimationFrame(queueRender);
        } else {
          scrollToTopPendingRef.current = false;
        }
      }
    };

    let renderChain = Promise.resolve();
    const queueRender = () => {
      renderChain = renderChain
        .then(() => renderPages())
        .catch((err) => {
          if (String(err?.message ?? '').includes('Invalid page request')) return;
          console.error('PDF render failed:', err);
        });
    };

    const scheduleRender = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      if (width === lastContainerWidth && height === lastContainerHeight) return;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(queueRender, 100);
    };

    lastContainerWidth = container.clientWidth;
    lastContainerHeight = container.clientHeight;
    requestAnimationFrame(queueRender);

    const observer = new ResizeObserver(scheduleRender);
    observer.observe(container);

    return () => {
      cancelled = true;
      setDisplayReady(false);
      clearTimeout(resizeTimer);
      renderIdRef.current += 1;
      observer.disconnect();
      for (const task of renderTasksRef.current) {
        task?.cancel();
      }
      renderTasksRef.current = [];
    };
  }, [status, pageCount, url]);

  useEffect(() => {
    if (status !== 'ready' || pageCount === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const goToPage = (pageNumber) => {
      const next = Math.min(Math.max(pageNumber, 1), pageCount);
      scrollToTopPendingRef.current = false;
      resetPageScrollRef.current();
      setCurrentPage(next);
    };

    const goToPrev = () => {
      goToPage(currentPageRef.current - 1);
    };

    const goToNext = () => {
      goToPage(currentPageRef.current + 1);
    };

    const goToStart = () => {
      goToPage(1);
    };

    const goToEnd = () => {
      goToPage(pageCount);
    };

    navigationRef.current = { goToPrev, goToNext };

    const onScroll = () => {
      if (scrollToTopPendingRef.current) {
        if (container.scrollTop !== 0) {
          container.scrollTop = 0;
        }
        return;
      }
      penScrollLockRef.current?.restoreScroll();
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

    const TAP_MOVE_THRESHOLD = 10;
    const LONG_PRESS_MS = 500;
    let tapStartX = null;
    let tapStartY = null;
    let longPressTimer = null;
    let longPressTriggered = false;

    const clearLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'pen') return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (annotationMenuRef.current) return;

      longPressTriggered = false;
      tapStartX = event.clientX;
      tapStartY = event.clientY;

      if (event.pointerType === 'touch') {
        clearLongPress();
        longPressTimer = setTimeout(() => {
          longPressTimer = null;
          longPressTriggered = true;
          const clientX = tapStartX;
          const clientY = tapStartY;
          tapStartX = null;
          tapStartY = null;
          openAnnotationMenuAt(clientX, clientY);
        }, LONG_PRESS_MS);
      }
    };

    const onPointerMove = (event) => {
      if (!longPressTimer || tapStartX == null || tapStartY == null) return;
      if (event.pointerType !== 'touch') return;

      const dx = Math.abs(event.clientX - tapStartX);
      const dy = Math.abs(event.clientY - tapStartY);
      if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) {
        clearLongPress();
      }
    };

    const onPointerUp = (event) => {
      clearLongPress();

      if (longPressTriggered) {
        longPressTriggered = false;
        tapStartX = null;
        tapStartY = null;
        return;
      }

      if (event.pointerId === dismissTapPointerIdRef.current) {
        dismissTapPointerIdRef.current = null;
        tapStartX = null;
        tapStartY = null;
        return;
      }

      if (annotationMenuRef.current) {
        tapStartX = null;
        tapStartY = null;
        return;
      }

      if (pageCount <= 1 || tapStartX == null || tapStartY == null) return;
      if (event.pointerType === 'pen') return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (isPinchingRef.current) return;

      const dx = Math.abs(event.clientX - tapStartX);
      const dy = Math.abs(event.clientY - tapStartY);
      tapStartX = null;
      tapStartY = null;

      if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) return;

      const { left, width } = container.getBoundingClientRect();
      if (event.clientX - left < width / 2) {
        goToPrev();
      } else {
        goToNext();
      }
    };

    const onPointerCancel = () => {
      clearLongPress();
      longPressTriggered = false;
      tapStartX = null;
      tapStartY = null;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerCancel);

    const onContextMenu = (event) => {
      if (!event.target.closest('.viewer-page-frame')) return;

      event.preventDefault();
      event.stopPropagation();
      if (annotationMenuRef.current) {
        dismissAnnotationMenu();
        return;
      }
      openAnnotationMenuAt(event.clientX, event.clientY);
    };

    container.addEventListener('contextmenu', onContextMenu, { capture: true });

    const resizeObserver = new ResizeObserver(() => {
      if (scrollToTopPendingRef.current) {
        if (container.scrollTop !== 0) {
          container.scrollTop = 0;
        }
        return;
      }
      if (headerHiddenRef.current) {
        resetPageScrollRef.current();
      }
    });
    resizeObserver.observe(container);

    return () => {
      clearLongPress();
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('contextmenu', onContextMenu, { capture: true });
      resizeObserver.disconnect();
    };
  }, [status, pageCount, openAnnotationMenuAt]);

  useEffect(() => {
    if (status !== 'ready') return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    penScrollLockRef.current?.destroy();
    penScrollLockRef.current = createPenScrollLock(container, () => {
      if (glyphDragActiveRef.current) return false;
      if (!annotationMenuRef.current) return false;
      const tool = annotationToolRef.current;
      return tool === 'pen' || tool === 'eraser';
    });

    return () => {
      penScrollLockRef.current?.destroy();
      penScrollLockRef.current = null;
    };
  }, [status]);

  useLayoutEffect(() => {
    if (status !== 'ready') return;

    const pending = pendingZoomScrollRef.current;
    if (!pending) return;
    pendingZoomScrollRef.current = null;

    const container = containerRef.current;
    const frame = getCurrentPageFrame();
    if (!container || !frame) return;

    const frameRect = frame.getBoundingClientRect();
    const pointX = frameRect.left + pending.pageX * pending.newZoom;
    const pointY = frameRect.top + pending.pageY * pending.newZoom;

    container.scrollLeft = Math.min(
      Math.max(0, container.scrollLeft + pointX - pending.clientX),
      Math.max(0, container.scrollWidth - container.clientWidth),
    );
    container.scrollTop = Math.min(
      Math.max(0, container.scrollTop + pointY - pending.clientY),
      Math.max(0, container.scrollHeight - container.clientHeight),
    );
  }, [pdfZoom, status]);

  useEffect(() => {
    if (status !== 'ready') return;

    const container = containerRef.current;
    if (!container) return;

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;

    const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

    const getTouchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const getTouchMidpoint = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const applyZoomAtFocalPoint = (newZoom, clientX, clientY) => {
      const oldZoom = pdfZoomRef.current;
      const clampedZoom = clampZoom(newZoom);
      if (clampedZoom === oldZoom) return;

      const frame = getCurrentPageFrame();
      if (!frame) return;

      const frameRect = frame.getBoundingClientRect();
      if (frameRect.width === 0 || frameRect.height === 0) return;

      pendingZoomScrollRef.current = {
        clientX,
        clientY,
        pageX: (clientX - frameRect.left) / oldZoom,
        pageY: (clientY - frameRect.top) / oldZoom,
        newZoom: clampedZoom,
      };
      pdfZoomRef.current = clampedZoom;
      setPdfZoom(clampedZoom);
    };

    let pinchStartDistance = 0;
    let pinchStartZoom = 1;
    let wheelAccumulator = 0;
    let wheelPageCooldown = false;
    const WHEEL_THRESHOLD = 80;
    const WHEEL_PAGE_COOLDOWN_MS = 350;

    const tryChangePage = (direction) => {
      if (wheelPageCooldown) return;
      wheelPageCooldown = true;
      window.setTimeout(() => {
        wheelPageCooldown = false;
      }, WHEEL_PAGE_COOLDOWN_MS);

      if (direction > 0) {
        navigationRef.current.goToNext();
      } else {
        navigationRef.current.goToPrev();
      }
    };

    const onWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const newZoom = pdfZoomRef.current - event.deltaY * 0.001;
        applyZoomAtFocalPoint(newZoom, event.clientX, event.clientY);
        return;
      }

      if (
        scrollToTopPendingRef.current ||
        annotationMenuRef.current ||
        glyphDragActiveRef.current ||
        pageCount <= 1
      ) {
        return;
      }

      const zoom = pdfZoomRef.current;

      if (zoom > 1) {
        const atTop = container.scrollTop <= 0;
        const atBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 1;

        if (event.deltaY > 0 && atBottom) {
          event.preventDefault();
          tryChangePage(1);
        } else if (event.deltaY < 0 && atTop) {
          event.preventDefault();
          tryChangePage(-1);
        }
        return;
      }

      event.preventDefault();
      wheelAccumulator += event.deltaY;
      if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;

      tryChangePage(wheelAccumulator > 0 ? 1 : -1);
      wheelAccumulator = 0;
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 2) return;
      isPinchingRef.current = true;
      pinchStartDistance = getTouchDistance(event.touches);
      pinchStartZoom = pdfZoomRef.current;
    };

    const onTouchMove = (event) => {
      if (event.touches.length !== 2 || pinchStartDistance === 0) return;
      event.preventDefault();
      const distance = getTouchDistance(event.touches);
      const newZoom = pinchStartZoom * (distance / pinchStartDistance);
      const { x, y } = getTouchMidpoint(event.touches);
      applyZoomAtFocalPoint(newZoom, x, y);
    };

    const onTouchEnd = (event) => {
      if (event.touches.length >= 2) return;
      pinchStartDistance = 0;
      if (event.touches.length === 0) {
        isPinchingRef.current = false;
        if (pdfZoomRef.current <= 1) {
          resetPageScrollRef.current();
        }
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
    };
  }, [status, pageCount]);

  useLayoutEffect(() => {
    if (status !== 'ready' || pageCount === 0) return;
    resetPageScrollRef.current();
  }, [headerHidden, footerHidden, status, pageCount]);

  useLayoutEffect(() => {
    if (status !== 'ready' || pageCount === 0 || !displayReady) {
      setPageNavLeft(null);
      return;
    }

    if (headerHidden) {
      setPageNavLeft(null);
      return;
    }

    const toolbar = toolbarRef.current;
    const start = toolbarStartRef.current;
    const end = toolbarEndRef.current;
    const nav = pageNavRef.current;
    const chrome = toolbar?.closest('.viewer-chrome');
    if (!toolbar || !start || !nav || !chrome) return;

    const gap = 12;
    const pushPadding = 8;

    const updatePageNavPosition = () => {
      const originLeft = chrome.getBoundingClientRect().left;
      const toolbarRect = toolbar.getBoundingClientRect();
      const toolbarOffset = toolbarRect.left - originLeft;
      const toolbarWidth = toolbarRect.width;
      const navWidth = nav.getBoundingClientRect().width;
      const clusterRight = start.getBoundingClientRect().right - originLeft;
      const endLeft = end
        ? end.getBoundingClientRect().left - originLeft
        : toolbarOffset + toolbarWidth;

      const idealLeft = toolbarOffset + (toolbarWidth - navWidth) / 2;
      const minLeft = clusterRight + gap + pushPadding;
      const maxLeft = endLeft - gap - navWidth;

      let left = idealLeft;
      if (maxLeft >= minLeft) {
        left = Math.min(Math.max(left, minLeft), maxLeft);
      } else {
        left = maxLeft;
      }

      setPageNavLeft(left);
    };

    updatePageNavPosition();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePageNavPosition);
    });
    observer.observe(toolbar);
    observer.observe(start);
    if (end) observer.observe(end);
    observer.observe(nav);
    const pdfLinks = start.querySelector('.pdf-links');
    if (pdfLinks) observer.observe(pdfLinks);

    return () => observer.disconnect();
  }, [headerHidden, status, pageCount, displayReady, pdfs, filename]);

  const showLoading =
    status === 'loading' || (status === 'ready' && !displayReady);

  return (
    <div className="viewer-page">
      <div className={`viewer-chrome${headerHidden ? ' is-collapsed' : ''}`}>
        <header className="viewer-header">
          <div className="viewer-toolbar" ref={toolbarRef}>
            <div className="viewer-toolbar-start" ref={toolbarStartRef}>
              <Link to={backTo}>&larr; {backLabel}</Link>
              {pdfs.length > 0 && (
                <PdfLinkList
                  pdfs={pdfs}
                  currentFile={currentFile}
                  viewState={viewState}
                  viewPrefix={backTo}
                />
              )}
            </div>
            <div className="viewer-toolbar-end" ref={toolbarEndRef}>
              <button
                type="button"
                className="viewer-annotation-help"
                onClick={() => setAnnotationHelpOpen(true)}
                aria-label="Annotation help"
              >
                ?
              </button>
              <button
                type="button"
                className="viewer-print-button"
                onClick={() => void handlePrint()}
                disabled={printBusy}
                aria-label={printBusy ? 'Preparing print' : 'Print'}
                aria-busy={printBusy || undefined}
              >
                <PrintIcon />
              </button>
              {onDownload ? (
                <button
                  type="button"
                  className="viewer-download-link"
                  onClick={() => void handleDownload()}
                  disabled={downloadBusy}
                  aria-label={downloadBusy ? 'Downloading' : 'Download'}
                  aria-busy={downloadBusy || undefined}
                >
                  <DownloadIcon />
                </button>
              ) : (
                downloadLink && (
                  <a
                    href={downloadLink}
                    download={downloadName}
                    className="viewer-download-link"
                    aria-label="Download"
                  >
                    <DownloadIcon />
                  </a>
                )
              )}
            </div>
          </div>
        </header>
        {status === 'ready' && pageCount > 0 && displayReady && (
          <div
            className={`viewer-page-nav${headerHidden ? ' is-floating' : ''}`}
            ref={pageNavRef}
            style={
              !headerHidden && pageNavLeft != null
                ? { left: `${pageNavLeft}px`, transform: 'translateY(-50%)' }
                : undefined
            }
          >
            {!headerHidden && (
              <button
                type="button"
                className="viewer-page-arrow"
                onClick={() => navigationRef.current.goToPrev()}
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <ChevronIcon direction="left" />
              </button>
            )}
            <div
              className="viewer-page-indicator"
              aria-label={`Page ${currentPage} of ${pageCount}`}
            >
              <span className="viewer-page-current">{currentPage}</span>
              <span className="viewer-page-separator" aria-hidden="true">
                /
              </span>
              <span className="viewer-page-total">{pageCount}</span>
            </div>
            {!headerHidden && (
              <button
                type="button"
                className="viewer-page-arrow"
                onClick={() => navigationRef.current.goToNext()}
                disabled={currentPage >= pageCount}
                aria-label="Next page"
              >
                <ChevronIcon direction="right" />
              </button>
            )}
          </div>
        )}
        <button
          type="button"
          className="viewer-header-tab"
          onClick={() => setHeaderHidden((hidden) => !hidden)}
          aria-label={headerHidden ? 'Show toolbar' : 'Hide toolbar'}
          aria-expanded={!headerHidden}
        >
          <ChevronIcon direction={headerHidden ? 'down' : 'up'} />
        </button>
      </div>
      {storageWarning && (
        <p className="viewer-storage-warning" role="status">
          {storageWarning}
        </p>
      )}
      <div
        className={`viewer-content${headerHidden ? ' is-header-hidden' : ''}${
          isTouchAnnotating ? ' is-touch-annotating' : ''
        }${
          showLoading ? ' is-loading' : ''
        }`}
        ref={containerRef}
      >
        {showLoading && (
          <p className="viewer-status" role="status" aria-live="polite">
            {loadStatusMessage(loadPhase)}
          </p>
        )}
        {status === 'error' && (
          <p className="viewer-status viewer-status-error">{errorMessage}</p>
        )}
        {status === 'ready' && (
          <div
            className={`viewer-zoom-surface${
              displayReady ? '' : ' is-preparing'
            }`}
          >
            {Array.from({ length: pageCount }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrent = pageNumber === currentPage;
              const pageLayers = normalizePageEntry(
                pageAnnotations[String(pageNumber)],
              );
              const baseSize = pageBaseDisplaySizes[index];
              const pageZoom = isCurrent ? pdfZoom : 1;
              const scaledWidth = baseSize
                ? Math.floor(baseSize.width * pageZoom)
                : undefined;
              const scaledHeight = baseSize
                ? Math.floor(baseSize.height * pageZoom)
                : undefined;

              return (
              <div
                className={`viewer-page-slot${isCurrent ? ' is-current' : ''}`}
                key={index}
                hidden={!isCurrent}
                aria-hidden={!isCurrent}
                ref={(element) => {
                  slotRefs.current[index] = element;
                }}
              >
                <div
                  className="viewer-page-scaler"
                  style={
                    scaledWidth && scaledHeight
                      ? { width: scaledWidth, height: scaledHeight }
                      : undefined
                  }
                >
                  <div
                    className="viewer-page-frame"
                    data-page-number={pageNumber}
                    style={
                      baseSize
                        ? {
                            width: baseSize.width,
                            height: baseSize.height,
                            transform: `scale(${pageZoom})`,
                          }
                        : undefined
                    }
                  >
                  <canvas
                    ref={(element) => {
                      canvasRefs.current[index] = element;
                    }}
                  />
                  <AnnotationOverlay
                    pageNumber={pageNumber}
                    pageLayers={pageLayers}
                    pageMediaSize={pageMediaSizes[index] ?? null}
                    glyphPreview={glyphDragPreview}
                    glyphDropRequest={glyphDropRequest}
                    layerClearRequest={layerClearRequest}
                    annotationColor={annotationColor}
                    annotationTool={annotationTool}
                    isAnnotationMenuOpen={Boolean(annotationMenu)}
                    menuPointerActive={Boolean(annotationMenu)}
                    touchDrawActive={isTouchAnnotating}
                    isGlyphDragActive={glyphDragActive}
                    lastPenTapRef={lastPenTapRef}
                    onRasterChange={handleRasterChange}
                    onOpenMenu={openAnnotationMenuAt}
                    onDismissMenu={dismissAnnotationMenu}
                  />
                </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
      {sectionPieces.length > 0 && (
        <div className={`viewer-footer-chrome${footerHidden ? ' is-collapsed' : ''}`}>
          <footer className="viewer-footer">
            <div className="viewer-toolbar viewer-footer-toolbar">
              <div className="viewer-toolbar-start">
                <div className="viewer-section-nav">
                {sectionPieces.map((entry) => {
                  const className = `pdf-link${entry.isCurrent ? ' pdf-link-active' : ''}`;

                  if (entry.isCurrent) {
                    return (
                      <span
                        key={entry.title}
                        className={className}
                        aria-current="page"
                      >
                        {entry.title}
                      </span>
                    );
                  }

                  const file = pdfFileForPiece(
                    entry.pdfs,
                    getPieceLabelPreference(entry.pieceKey),
                    currentLabel,
                  );
                  if (!file) return null;

                  return (
                    <Link
                      key={entry.title}
                      className={className}
                      to={viewPath(file, viewContext)}
                      state={viewState}
                    >
                      {entry.title}
                    </Link>
                  );
                })}
                </div>
              </div>
              {sectionTitle && (
                <div className="viewer-toolbar-end viewer-section-label">
                  {sectionTitle}
                </div>
              )}
            </div>
          </footer>
          <button
            type="button"
            className="viewer-footer-tab"
            onClick={() => setFooterHidden((hidden) => !hidden)}
            aria-label={footerHidden ? 'Show section navigation' : 'Hide section navigation'}
            aria-expanded={!footerHidden}
          >
            <ChevronIcon direction={footerHidden ? 'up' : 'down'} />
          </button>
        </div>
      )}
      <AnnotationMenu
        anchor={annotationMenu}
        pdfZoom={pdfZoom}
        annotationColor={annotationColor}
        onAnnotationColorChange={handleAnnotationColorChange}
        onClose={dismissAnnotationMenu}
        annotationTool={annotationTool}
        onAnnotationToolChange={setAnnotationTool}
        onGlyphDrop={handleGlyphDrop}
        onGlyphDragPreview={handleGlyphDragPreview}
        onClearPage={handleClearCurrentPage}
        onClearLayer={handleClearCurrentLayer}
        onGlyphDragChange={setGlyphDragActive}
      />
      <AnnotationHelpModal
        open={annotationHelpOpen}
        onClose={() => setAnnotationHelpOpen(false)}
      />
      {printSheets && (
        <div className="viewer-print-sheets" aria-hidden="true">
          {printSheets.map((sheet, index) => (
            <div className="viewer-print-sheet" key={index}>
              <img src={sheet.src} alt="" width={sheet.width} height={sheet.height} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
