import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import getStroke from 'perfect-freehand';
import {
  buildGlyphStamp,
  canvasToPageBlob,
  drawGlyphOnCanvas,
  drawGlyphStampAt,
  drawStrokeOnCanvas,
  eraseCircleOnCanvas,
  loadBlobOntoCanvas,
  setCanvasPixelSize,
  syncCanvasDimensions,
} from '../utils/annotationRaster.js';
import {
  clientToNormalized,
  effectivePressure,
  ERASER_CIRCLE_FILL,
  eraserRadiusPx,
  getCoalescedPointerEvents,
  matchesRecentPenTap,
  measureCssPxPerMm,
  PEN_BASE_WIDTH,
  PEN_COLOR,
  PEN_THINNING,
} from '../utils/stylusInput.js';

const TAP_MOVE_THRESHOLD = 10;
const LONG_PRESS_MS = 500;

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], index, arr) => {
      const [x1, y1] = arr[(index + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
}

function strokeToPathData(stroke, width, height) {
  if (!stroke?.points?.length || width === 0 || height === 0) return '';

  const inputPoints = stroke.points.map(([x, y, pressure = 0.5]) => [
    x * width,
    y * height,
    pressure,
  ]);
  const baseWidth = stroke.baseWidth ?? PEN_BASE_WIDTH;
  const outline = getStroke(inputPoints, {
    size: baseWidth,
    thinning: PEN_THINNING,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
  });

  return getSvgPathFromStroke(outline);
}

export default function AnnotationOverlay({
  pageNumber,
  pageRaster = null,
  glyphPreview = null,
  glyphDropRequest = null,
  pdfZoom = 1,
  lastPenTapRef,
  onRasterChange,
  onOpenMenu,
  onDismissMenu,
  isGlyphDragActive = false,
  annotationColor = PEN_COLOR,
  annotationTool = null,
  isAnnotationMenuOpen = false,
  menuPointerActive = false,
  touchDrawActive = false,
}) {
  const overlayRef = useRef(null);
  const rasterCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const referenceSizeRef = useRef({ width: 0, height: 0 });
  const activeStrokeRef = useRef(null);
  const eraserStrokeRef = useRef(false);
  const penPendingRef = useRef(null);
  const skipNextBlobLoadRef = useRef(false);
  const isGlyphDragActiveRef = useRef(isGlyphDragActive);
  const annotationColorRef = useRef(annotationColor);
  const annotationToolRef = useRef(annotationTool);
  const isMenuOpenRef = useRef(isAnnotationMenuOpen);
  const pxPerMmRef = useRef(measureCssPxPerMm());
  const callbacksRef = useRef({
    onRasterChange,
    onOpenMenu,
    onDismissMenu,
  });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [draftStroke, setDraftStroke] = useState(null);
  const [eraserCursor, setEraserCursor] = useState(null);

  callbacksRef.current = {
    onRasterChange,
    onOpenMenu,
    onDismissMenu,
  };
  isGlyphDragActiveRef.current = isGlyphDragActive;
  annotationColorRef.current = annotationColor;
  annotationToolRef.current = annotationTool;
  isMenuOpenRef.current = isAnnotationMenuOpen;

  const getReferenceLayoutSize = () => {
    const overlay = overlayRef.current;
    if (!overlay) return { width: 0, height: 0 };

    return {
      width: Math.round(overlay.offsetWidth),
      height: Math.round(overlay.offsetHeight),
    };
  };

  const getDisplaySize = () => {
    const overlay = overlayRef.current;
    if (!overlay) return { width: 0, height: 0 };

    const rect = overlay.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  };

  const syncDisplaySize = () => {
    const next = getDisplaySize();
    if (next.width === 0 || next.height === 0) return;
    setDisplaySize(next);
  };

  const getReferenceSize = () => referenceSizeRef.current;

  const getReferenceScale = () => {
    const reference = getReferenceSize();
    const display = getDisplaySize();
    if (reference.width === 0 || display.width === 0) return 1;
    return reference.width / display.width;
  };

  const initializeReferenceSize = () => {
    const layout = getReferenceLayoutSize();
    if (layout.width === 0 || layout.height === 0) return { width: 0, height: 0 };

    if (pageRaster?.width > 0 && pageRaster?.height > 0) {
      referenceSizeRef.current = {
        width: pageRaster.width,
        height: pageRaster.height,
      };
    } else if (referenceSizeRef.current.width === 0) {
      referenceSizeRef.current = layout;
    }

    return referenceSizeRef.current;
  };

  const ensureRasterCanvasSize = () => {
    const canvas = rasterCanvasRef.current;
    const reference = initializeReferenceSize();
    if (!canvas || reference.width === 0 || reference.height === 0) {
      return { width: 0, height: 0 };
    }

    setCanvasPixelSize(canvas, reference.width, reference.height);
    return reference;
  };

  const ensurePreviewCanvasSize = () => {
    const canvas = previewCanvasRef.current;
    const reference = ensureRasterCanvasSize();
    if (!canvas || reference.width === 0) return reference;
    setCanvasPixelSize(canvas, reference.width, reference.height);
    return reference;
  };

  const notifyRasterChange = async () => {
    const canvas = rasterCanvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const blob = await canvasToPageBlob(canvas);
    if (!blob) return;

    skipNextBlobLoadRef.current = true;
    callbacksRef.current.onRasterChange?.(
      pageNumber,
      blob,
      canvas.width,
      canvas.height,
    );
  };

  const resampleCanvasesToReference = (nextReference) => {
    const rasterCanvas = rasterCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!rasterCanvas || nextReference.width === 0) return;

    syncCanvasDimensions(rasterCanvas, nextReference.width, nextReference.height);
    if (previewCanvas) {
      previewCanvas.getContext('2d').clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      setCanvasPixelSize(previewCanvas, nextReference.width, nextReference.height);
    }
    referenceSizeRef.current = nextReference;
  };

  useLayoutEffect(() => {
    syncDisplaySize();
    ensurePreviewCanvasSize();
  }, [pdfZoom, pageRaster?.width, pageRaster?.height, glyphDropRequest?.id]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const observer = new ResizeObserver(() => {
      syncDisplaySize();

      const nextReference = getReferenceLayoutSize();
      if (nextReference.width === 0 || nextReference.height === 0) return;

      const currentReference = referenceSizeRef.current;
      if (currentReference.width === 0) {
        initializeReferenceSize();
        ensurePreviewCanvasSize();
        return;
      }

      if (
        nextReference.width === currentReference.width &&
        nextReference.height === currentReference.height
      ) {
        return;
      }

      resampleCanvasesToReference(nextReference);
      void notifyRasterChange();
    });
    observer.observe(overlay);

    return () => observer.disconnect();
  }, [pageNumber, pageRaster?.width, pageRaster?.height]);

  useEffect(() => {
    let cancelled = false;

    const loadRaster = async () => {
      const reference = ensureRasterCanvasSize();
      const canvas = rasterCanvasRef.current;
      if (!canvas || reference.width === 0) return;

      if (skipNextBlobLoadRef.current) {
        skipNextBlobLoadRef.current = false;
        return;
      }

      if (pageRaster?.width > 0 && pageRaster?.height > 0) {
        referenceSizeRef.current = {
          width: pageRaster.width,
          height: pageRaster.height,
        };
        setCanvasPixelSize(canvas, pageRaster.width, pageRaster.height);
      }

      await loadBlobOntoCanvas(canvas, pageRaster?.blob ?? null);
      if (!cancelled) {
        void syncPreviewCanvas();
      }
    };

    void loadRaster();

    return () => {
      cancelled = true;
    };
  }, [pageRaster?.blob, pageRaster?.width, pageRaster?.height]);

  const syncPreviewCanvas = async () => {
    const canvas = previewCanvasRef.current;
    const reference = ensurePreviewCanvasSize();
    if (!canvas || reference.width === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, reference.width, reference.height);

    if (
      !glyphPreview ||
      glyphPreview.pageNumber !== pageNumber ||
      !glyphPreview.spec
    ) {
      return;
    }

    const stamp = await buildGlyphStamp(glyphPreview.spec, reference.width);
    if (!stamp) return;
    drawGlyphStampAt(
      ctx,
      stamp,
      glyphPreview.x,
      glyphPreview.y,
      reference.width,
      reference.height,
    );
  };

  useEffect(() => {
    void syncPreviewCanvas();
  }, [glyphPreview, pageNumber, pageRaster?.width, pageRaster?.height]);

  useEffect(() => {
    if (!glyphDropRequest || glyphDropRequest.pageNumber !== pageNumber) return;

    let cancelled = false;

    const applyDrop = async () => {
      const reference = ensureRasterCanvasSize();
      const canvas = rasterCanvasRef.current;
      if (!canvas || reference.width === 0) return;

      const ctx = canvas.getContext('2d');
      await drawGlyphOnCanvas(
        ctx,
        glyphDropRequest.spec,
        glyphDropRequest.x,
        glyphDropRequest.y,
        reference.width,
        reference.height,
      );

      if (!cancelled) {
        await notifyRasterChange();
      }
    };

    void applyDrop();

    return () => {
      cancelled = true;
    };
  }, [glyphDropRequest?.id, pageNumber]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const target = menuPointerActive ? overlay : overlay.parentElement;
    if (!target) return undefined;

    const samplePressure = (event) => {
      if (event.pointerType === 'touch' || event.pointerType === 'mouse') return 1;
      return effectivePressure(event);
    };

    const isMenuToolActive = () =>
      isMenuOpenRef.current &&
      (annotationToolRef.current === 'pen' ||
        annotationToolRef.current === 'eraser');

    const isMenuToolPointer = (event) =>
      (event.pointerType === 'touch' || event.pointerType === 'mouse') &&
      isMenuToolActive();

    const appendPoints = (event) => {
      const active = activeStrokeRef.current;
      if (!overlay || !active) return;

      const samples = getCoalescedPointerEvents(event);
      for (const sample of samples) {
        const { x, y } = clientToNormalized(overlay, sample.clientX, sample.clientY);
        active.points.push([x, y, samplePressure(sample)]);
      }

      setDraftStroke({
        ...active,
        points: [...active.points],
      });
    };

    const finishStroke = async () => {
      const active = activeStrokeRef.current;
      activeStrokeRef.current = null;
      setDraftStroke(null);

      if (!active || active.points.length < 2) return;

      const reference = ensureRasterCanvasSize();
      const canvas = rasterCanvasRef.current;
      if (!canvas || reference.width === 0) return;

      const ctx = canvas.getContext('2d');
      drawStrokeOnCanvas(ctx, active, reference.width, reference.height);
      await notifyRasterChange();
    };

    const applyEraserSample = (event) => {
      if (!overlay) return;

      const display = getDisplaySize();
      if (display.width === 0 || display.height === 0) return;

      const reference = ensureRasterCanvasSize();
      const canvas = rasterCanvasRef.current;
      if (!canvas || reference.width === 0) return;

      const referenceScale = getReferenceScale();
      const samples = getCoalescedPointerEvents(event);
      for (const sample of samples) {
        const center = clientToNormalized(overlay, sample.clientX, sample.clientY);
        const radiusPx = eraserRadiusPx(
          samplePressure(sample),
          pxPerMmRef.current,
        );

        setEraserCursor({
          x: center.x * display.width,
          y: center.y * display.height,
          r: radiusPx,
        });

        eraseCircleOnCanvas(
          canvas.getContext('2d'),
          center.x * reference.width,
          center.y * reference.height,
          radiusPx * referenceScale,
        );
      }

      void notifyRasterChange();
    };

    const clearPenPending = (pending = penPendingRef.current) => {
      if (pending?.longPressTimer) {
        clearTimeout(pending.longPressTimer);
        pending.longPressTimer = null;
      }
      if (penPendingRef.current === pending) {
        penPendingRef.current = null;
      }
    };

    const beginPenStroke = (event, startX, startY) => {
      activeStrokeRef.current = {
        tool: 'pen',
        color: annotationColorRef.current,
        baseWidth: PEN_BASE_WIDTH,
        points: [],
        startX,
        startY,
        maxDeviation: Math.hypot(event.clientX - startX, event.clientY - startY),
      };

      const { x, y } = clientToNormalized(overlay, startX, startY);
      activeStrokeRef.current.points.push([x, y, samplePressure(event)]);
      appendPoints(event);
    };

    const canAnnotatePointer = (event) => {
      if (event.pointerType === 'pen') return true;
      if (isMenuToolActive()) {
        if (event.pointerType === 'touch') return true;
        if (event.pointerType === 'mouse') return true;
      }
      return false;
    };

    const onPointerDown = (event) => {
      if (!canAnnotatePointer(event)) return;
      if (isGlyphDragActiveRef.current) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();
      target.setPointerCapture(event.pointerId);

      const isPen = event.pointerType === 'pen';
      const isToolEraser =
        isMenuToolPointer(event) && annotationToolRef.current === 'eraser';

      if (
        isPen &&
        lastPenTapRef?.current &&
        matchesRecentPenTap(
          lastPenTapRef.current,
          event.clientX,
          event.clientY,
        )
      ) {
        clearPenPending();
        lastPenTapRef.current = null;
        eraserStrokeRef.current = true;
        applyEraserSample(event);
        return;
      }

      if (lastPenTapRef && isPen) {
        lastPenTapRef.current = null;
      }

      eraserStrokeRef.current = false;
      activeStrokeRef.current = null;
      setDraftStroke(null);

      if (isMenuToolPointer(event) && annotationToolRef.current === 'pen') {
        beginPenStroke(event, event.clientX, event.clientY);
        return;
      }

      const pending = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        longPressTriggered: false,
        touchEraser: isToolEraser,
      };

      if (isPen) {
        pending.longPressTimer = setTimeout(() => {
          pending.longPressTriggered = true;
          pending.longPressTimer = null;
          callbacksRef.current.onOpenMenu?.(pending.startX, pending.startY);
          activeStrokeRef.current = null;
          setDraftStroke(null);
        }, LONG_PRESS_MS);
      }

      penPendingRef.current = pending;
    };

    const onPointerMove = (event) => {
      if (!target.hasPointerCapture(event.pointerId)) return;

      event.preventDefault();
      event.stopPropagation();

      if (eraserStrokeRef.current) {
        applyEraserSample(event);
        return;
      }

      const pending = penPendingRef.current;
      if (
        pending &&
        pending.pointerId === event.pointerId &&
        !pending.longPressTriggered &&
        !activeStrokeRef.current &&
        !eraserStrokeRef.current
      ) {
        const moved = Math.hypot(
          event.clientX - pending.startX,
          event.clientY - pending.startY,
        );
        if (moved > TAP_MOVE_THRESHOLD) {
          const toolEraser = pending.touchEraser;
          clearPenPending(pending);
          if (toolEraser) {
            eraserStrokeRef.current = true;
            applyEraserSample(event);
          } else {
            beginPenStroke(event, pending.startX, pending.startY);
          }
        } else {
          return;
        }
      }

      if (!activeStrokeRef.current) return;
      const active = activeStrokeRef.current;
      active.maxDeviation = Math.max(
        active.maxDeviation,
        Math.hypot(event.clientX - active.startX, event.clientY - active.startY),
      );
      appendPoints(event);
    };

    const onPointerUp = (event) => {
      if (!target.hasPointerCapture(event.pointerId)) return;

      event.preventDefault();
      event.stopPropagation();
      target.releasePointerCapture(event.pointerId);

      if (eraserStrokeRef.current) {
        clearPenPending();
        applyEraserSample(event);
        setEraserCursor(null);
        eraserStrokeRef.current = false;
        return;
      }

      const pending = penPendingRef.current;
      if (pending && event.pointerId === pending.pointerId) {
        const wasLongPress = pending.longPressTriggered;
        const tapMovement = Math.hypot(
          event.clientX - pending.startX,
          event.clientY - pending.startY,
        );
        const isTouchDismissTap =
          event.pointerType === 'touch' &&
          !wasLongPress &&
          !activeStrokeRef.current &&
          !eraserStrokeRef.current &&
          tapMovement <= TAP_MOVE_THRESHOLD;

        clearPenPending(pending);

        if (wasLongPress) {
          return;
        }

        if (isTouchDismissTap) {
          callbacksRef.current.onDismissMenu?.(event.pointerId);
          return;
        }

        if (!activeStrokeRef.current) {
          if (lastPenTapRef && event.pointerType === 'pen') {
            lastPenTapRef.current = {
              time: performance.now(),
              x: event.clientX,
              y: event.clientY,
            };
          }
          return;
        }
      }

      if (!activeStrokeRef.current) return;

      const active = activeStrokeRef.current;
      appendPoints(event);

      active.maxDeviation = Math.max(
        active.maxDeviation,
        Math.hypot(event.clientX - active.startX, event.clientY - active.startY),
      );
      const isTap = active.maxDeviation <= TAP_MOVE_THRESHOLD;

      if (isTap) {
        if (lastPenTapRef && event.pointerType === 'pen') {
          lastPenTapRef.current = {
            time: performance.now(),
            x: event.clientX,
            y: event.clientY,
          };
        }

        activeStrokeRef.current = null;
        setDraftStroke(null);
        return;
      }

      void finishStroke();
    };

    const onPointerCancel = (event) => {
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }

      clearPenPending();
      activeStrokeRef.current = null;
      eraserStrokeRef.current = false;
      setDraftStroke(null);
      setEraserCursor(null);
    };

    const options = { capture: true, passive: false };
    target.addEventListener('pointerdown', onPointerDown, options);
    target.addEventListener('pointermove', onPointerMove, options);
    target.addEventListener('pointerup', onPointerUp, options);
    target.addEventListener('pointercancel', onPointerCancel, options);

    return () => {
      target.removeEventListener('pointerdown', onPointerDown, options);
      target.removeEventListener('pointermove', onPointerMove, options);
      target.removeEventListener('pointerup', onPointerUp, options);
      target.removeEventListener('pointercancel', onPointerCancel, options);
    };
  }, [pageNumber, lastPenTapRef, menuPointerActive]);

  useEffect(() => {
    if (pageRaster?.blob) return;
    const canvas = rasterCanvasRef.current;
    if (!canvas || canvas.width === 0) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }, [pageRaster?.blob]);

  const draftPath =
    draftStroke && displaySize.width > 0 && displaySize.height > 0
      ? strokeToPathData(draftStroke, displaySize.width, displaySize.height)
      : '';

  return (
    <div
      ref={overlayRef}
      className={`annotation-overlay${draftStroke ? ' is-drawing' : ''}${
        eraserCursor ? ' is-erasing' : ''
      }${menuPointerActive ? ' is-menu-active' : ''}${
        touchDrawActive ? ' is-touch-active' : ''
      }`}
      aria-hidden="true"
    >
      {displaySize.width > 0 && displaySize.height > 0 && (
        <>
          <canvas
            ref={rasterCanvasRef}
            className="annotation-raster-canvas"
          />
          <canvas
            ref={previewCanvasRef}
            className="annotation-preview-canvas"
          />
          {(draftPath || eraserCursor) && (
            <svg
              className="annotation-overlay-canvas"
              viewBox={`0 0 ${displaySize.width} ${displaySize.height}`}
              aria-hidden="true"
            >
              {draftPath && (
                <path
                  d={draftPath}
                  fill={draftStroke.color ?? annotationColorRef.current}
                  pointerEvents="none"
                />
              )}
              {eraserCursor && (
                <circle
                  className="annotation-eraser-cursor"
                  cx={eraserCursor.x}
                  cy={eraserCursor.y}
                  r={eraserCursor.r}
                  fill={ERASER_CIRCLE_FILL}
                  pointerEvents="none"
                />
              )}
            </svg>
          )}
        </>
      )}
    </div>
  );
}
