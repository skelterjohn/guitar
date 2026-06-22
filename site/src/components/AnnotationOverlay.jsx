import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import getStroke from 'perfect-freehand';
import {
  ANNOTATION_LAYER_COLORS,
  annotationRasterReferenceSize,
} from '../utils/annotationPages.js';
import {
  buildGlyphStamp,
  canvasToPageBlob,
  drawGlyphOnCanvas,
  drawGlyphStampAt,
  drawStrokeOnCanvas,
  eraseCircleOnCanvas,
  GLYPH_DROP_SIZE_SCALE,
  loadBlobOntoCanvas,
  setCanvasPixelSize,
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
  pageLayers = null,
  pageMediaSize = null,
  glyphPreview = null,
  glyphDropRequest = null,
  layerClearRequest = null,
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
  const layerCanvasRefs = useRef({});
  const previewCanvasRef = useRef(null);
  const referenceSizeRef = useRef({ width: 0, height: 0 });
  const skipNextBlobLoadRef = useRef({});
  const loadedLayerBlobRef = useRef({});
  const activeStrokeRef = useRef(null);
  const eraserStrokeRef = useRef(false);
  const penPendingRef = useRef(null);
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

  const getActiveLayerCanvas = () =>
    layerCanvasRefs.current[annotationColorRef.current];

  const getFixedReferenceSize = () => {
    if (pageLayers?.width > 0 && pageLayers?.height > 0) {
      return {
        width: pageLayers.width,
        height: pageLayers.height,
      };
    }

    return (
      annotationRasterReferenceSize(pageMediaSize?.width, pageMediaSize?.height) ?? {
        width: 0,
        height: 0,
      }
    );
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

  const getReferenceScale = () => {
    const reference = referenceSizeRef.current;
    const display = getDisplaySize();
    if (reference.width === 0 || display.width === 0) return 1;
    return reference.width / display.width;
  };

  const initializeReferenceSize = () => {
    const reference = getFixedReferenceSize();
    if (reference.width === 0 || reference.height === 0) {
      return reference;
    }

    referenceSizeRef.current = reference;
    return reference;
  };

  const ensureLayerCanvasSizes = () => {
    const reference = initializeReferenceSize();
    if (reference.width === 0 || reference.height === 0) return reference;

    for (const color of ANNOTATION_LAYER_COLORS) {
      const canvas = layerCanvasRefs.current[color];
      if (canvas) {
        setCanvasPixelSize(canvas, reference.width, reference.height);
      }
    }

    return reference;
  };

  const ensureActiveLayerCanvasSize = () => {
    const reference = ensureLayerCanvasSizes();
    const canvas = getActiveLayerCanvas();
    if (canvas && reference.width > 0) {
      setCanvasPixelSize(canvas, reference.width, reference.height);
    }
    return reference;
  };

  const ensurePreviewCanvasSize = () => {
    const canvas = previewCanvasRef.current;
    const reference = ensureLayerCanvasSizes();
    if (canvas && reference.width > 0) {
      setCanvasPixelSize(canvas, reference.width, reference.height);
    }
    return reference;
  };

  const notifyLayerChange = async (color, blobOverride) => {
    const canvas = layerCanvasRefs.current[color];
    const reference = referenceSizeRef.current;
    if (!canvas || reference.width === 0) return;

    const blob =
      blobOverride === undefined ? await canvasToPageBlob(canvas) : blobOverride;

    skipNextBlobLoadRef.current[color] = true;
    callbacksRef.current.onRasterChange?.(
      pageNumber,
      color,
      blob,
      reference.width,
      reference.height,
    );
  };

  useLayoutEffect(() => {
    syncDisplaySize();
    initializeReferenceSize();
    ensureLayerCanvasSizes();
    ensurePreviewCanvasSize();
  }, [
    pdfZoom,
    pageLayers?.width,
    pageLayers?.height,
    pageMediaSize?.width,
    pageMediaSize?.height,
    glyphDropRequest?.id,
  ]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const observer = new ResizeObserver(() => {
      syncDisplaySize();
    });
    observer.observe(overlay);

    return () => observer.disconnect();
  }, [pageNumber]);

  useEffect(() => {
    let cancelled = false;

    const loadLayers = async () => {
      const reference = ensureLayerCanvasSizes();
      if (reference.width === 0) return;

      if (!pageLayers) {
        for (const color of ANNOTATION_LAYER_COLORS) {
          const canvas = layerCanvasRefs.current[color];
          if (canvas && canvas.width > 0) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          }
          loadedLayerBlobRef.current[color] = null;
        }
        return;
      }

      const fixedReference = getFixedReferenceSize();
      if (fixedReference.width > 0 && fixedReference.height > 0) {
        referenceSizeRef.current = fixedReference;
      }

      for (const color of ANNOTATION_LAYER_COLORS) {
        if (skipNextBlobLoadRef.current[color]) {
          skipNextBlobLoadRef.current[color] = false;
          loadedLayerBlobRef.current[color] = pageLayers.layers?.[color]?.blob ?? null;
          continue;
        }

        const canvas = layerCanvasRefs.current[color];
        if (!canvas) continue;

        setCanvasPixelSize(canvas, reference.width, reference.height);
        const layerBlob = pageLayers.layers?.[color]?.blob ?? null;
        if (loadedLayerBlobRef.current[color] === layerBlob) {
          continue;
        }

        loadedLayerBlobRef.current[color] = layerBlob;
        await loadBlobOntoCanvas(canvas, layerBlob);
      }

      if (!cancelled) {
        void syncPreviewCanvas();
      }
    };

    void loadLayers();

    return () => {
      cancelled = true;
    };
  }, [pageLayers, pageMediaSize?.width, pageMediaSize?.height]);

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

    const displayWidth = getDisplaySize().width;
    const stamp = await buildGlyphStamp(glyphPreview.spec, reference.width, {
      sizeScale: GLYPH_DROP_SIZE_SCALE,
      displayWidth,
    });
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
  }, [glyphPreview, pageNumber, pageLayers?.width, pageLayers?.height, displaySize.width]);

  useEffect(() => {
    if (!glyphDropRequest || glyphDropRequest.pageNumber !== pageNumber) return;

    let cancelled = false;

    const applyDrop = async () => {
      const reference = ensureActiveLayerCanvasSize();
      const canvas = getActiveLayerCanvas();
      if (!canvas || reference.width === 0) return;

      const ctx = canvas.getContext('2d');
      const displayWidth = getDisplaySize().width;
      await drawGlyphOnCanvas(
        ctx,
        glyphDropRequest.spec,
        glyphDropRequest.x,
        glyphDropRequest.y,
        reference.width,
        reference.height,
        { sizeScale: GLYPH_DROP_SIZE_SCALE, displayWidth },
      );

      if (!cancelled) {
        await notifyLayerChange(glyphDropRequest.spec.color);
      }
    };

    void applyDrop();

    return () => {
      cancelled = true;
    };
  }, [glyphDropRequest?.id, pageNumber]);

  useEffect(() => {
    if (!layerClearRequest || layerClearRequest.pageNumber !== pageNumber) return;

    const { color } = layerClearRequest;
    const canvas = layerCanvasRefs.current[color];
    const reference = ensureLayerCanvasSizes();
    if (!canvas || reference.width === 0) return;

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    loadedLayerBlobRef.current[color] = null;
    void notifyLayerChange(color, null);
  }, [layerClearRequest?.id, pageNumber]);

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

      const reference = ensureActiveLayerCanvasSize();
      const canvas = getActiveLayerCanvas();
      if (!canvas || reference.width === 0) return;

      const ctx = canvas.getContext('2d');
      drawStrokeOnCanvas(ctx, active, reference.width, reference.height);
      await notifyLayerChange(annotationColorRef.current);
    };

    const applyEraserSample = (event) => {
      if (!overlay) return;

      const display = getDisplaySize();
      if (display.width === 0 || display.height === 0) return;

      const reference = ensureActiveLayerCanvasSize();
      const canvas = getActiveLayerCanvas();
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

      void notifyLayerChange(annotationColorRef.current);
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
          {ANNOTATION_LAYER_COLORS.map((color) => (
            <canvas
              key={color}
              ref={(element) => {
                if (element) {
                  layerCanvasRefs.current[color] = element;
                } else {
                  delete layerCanvasRefs.current[color];
                }
              }}
              className="annotation-raster-canvas"
              data-annotation-layer={color}
            />
          ))}
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
