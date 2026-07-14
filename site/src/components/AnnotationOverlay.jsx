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
  paintEraserMaskCircle,
  paintEraserMaskSegment,
  applyEraserMaskToCanvas,
  tintEraserMaskForDisplay,
  GLYPH_DROP_SIZE_SCALE,
  loadBlobOntoCanvas,
  normalizeStrokePoints,
  setCanvasPixelSize,
} from '../utils/annotationRaster.js';
import {
  clientToNormalized,
  effectivePressure,
  ERASER_CIRCLE_FILL,
  ERASER_CIRCLE_STROKE,
  ERASER_MASK_FILL,
  eraserRadiusPx,
  getCoalescedPointerEvents,
  matchesRecentPenTap,
  measureCssPxPerMm,
  PEN_BASE_WIDTH,
  PEN_COLOR,
  penStrokeOutlineOptions,
} from '../utils/stylusInput.js';

const TAP_MOVE_THRESHOLD = 10;
/** Quick lift with little movement = gestural tap (double-tap eraser candidate). */
const TAP_MAX_DURATION_MS = 200;

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
  const points = normalizeStrokePoints(stroke?.points);
  if (!points.length || width === 0 || height === 0) return '';

  const inputPoints = points.map(([x, y, pressure = 0.5]) => [
    x * width,
    y * height,
    pressure,
  ]);
  const baseWidth = stroke.baseWidth ?? PEN_BASE_WIDTH;
  const outline = getStroke(inputPoints, {
    ...penStrokeOutlineOptions(stroke.pointerType),
    size: baseWidth,
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
  const eraserMaskCanvasRef = useRef(null);
  const eraserMaskDisplayCanvasRef = useRef(null);
  const lastEraserPointRef = useRef(null);
  const penPendingRef = useRef(null);
  const isGlyphDragActiveRef = useRef(isGlyphDragActive);
  const annotationColorRef = useRef(annotationColor);
  const annotationToolRef = useRef(annotationTool);
  const isMenuOpenRef = useRef(isAnnotationMenuOpen);
  const pageLayersRef = useRef(pageLayers);
  const pageMediaSizeRef = useRef(pageMediaSize);
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
  pageLayersRef.current = pageLayers;
  pageMediaSizeRef.current = pageMediaSize;

  const getActiveLayerCanvas = () =>
    layerCanvasRefs.current[annotationColorRef.current];

  const getFixedReferenceSize = () => {
    const layers = pageLayersRef.current;
    if (layers?.width > 0 && layers?.height > 0) {
      return {
        width: layers.width,
        height: layers.height,
      };
    }

    const media = pageMediaSizeRef.current;
    return (
      annotationRasterReferenceSize(media?.width, media?.height) ?? {
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

  const ensureEraserMaskSize = (reference) => {
    if (!eraserMaskCanvasRef.current) {
      eraserMaskCanvasRef.current = document.createElement('canvas');
    }

    const maskCanvas = eraserMaskCanvasRef.current;
    const displayCanvas = eraserMaskDisplayCanvasRef.current;
    setCanvasPixelSize(maskCanvas, reference.width, reference.height);
    if (displayCanvas) {
      setCanvasPixelSize(displayCanvas, reference.width, reference.height);
    }
    return maskCanvas;
  };

  const clearEraserMask = () => {
    const maskCanvas = eraserMaskCanvasRef.current;
    if (maskCanvas?.width > 0) {
      maskCanvas
        .getContext('2d')
        .clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    const displayCanvas = eraserMaskDisplayCanvasRef.current;
    if (displayCanvas?.width > 0) {
      displayCanvas
        .getContext('2d')
        .clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    }

    lastEraserPointRef.current = null;
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
    const reference = referenceSizeRef.current;
    if (reference.width > 0) {
      ensureEraserMaskSize(reference);
    }
  }, [
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

    const finishStroke = async (strokeOverride = null) => {
      const active = strokeOverride ?? activeStrokeRef.current;
      if (!strokeOverride) {
        activeStrokeRef.current = null;
      }

      const points = normalizeStrokePoints(active?.points);
      if (!active || points.length < 2) {
        setDraftStroke(null);
        return;
      }

      const reference = ensureActiveLayerCanvasSize();
      const canvas = getActiveLayerCanvas();
      const resolvedReference =
        reference.width > 0 ? reference : referenceSizeRef.current;
      if (!canvas || resolvedReference.width === 0) {
        setDraftStroke(null);
        return;
      }

      const display = getDisplaySize();
      const ctx = canvas.getContext('2d');
      drawStrokeOnCanvas(
        ctx,
        { ...active, points },
        resolvedReference.width,
        resolvedReference.height,
        { displayWidth: display.width },
      );
      setDraftStroke(null);
      await notifyLayerChange(annotationColorRef.current);
    };

    const recordPenTap = (clientX, clientY) => {
      if (!lastPenTapRef) return;
      lastPenTapRef.current = {
        time: performance.now(),
        x: clientX,
        y: clientY,
      };
    };

    const strokeFromClientPoint = (event, clientX, clientY) => {
      const { x, y } = clientToNormalized(overlay, clientX, clientY);
      return {
        tool: 'pen',
        pointerType: event.pointerType,
        color: annotationColorRef.current,
        baseWidth: PEN_BASE_WIDTH,
        points: [[x, y, samplePressure(event)]],
      };
    };

    const applyEraserSample = (event) => {
      if (!overlay) return;

      const display = getDisplaySize();
      if (display.width === 0 || display.height === 0) return;

      const reference = ensureActiveLayerCanvasSize();
      const maskCanvas = ensureEraserMaskSize(reference);
      const displayCanvas = eraserMaskDisplayCanvasRef.current;
      if (!maskCanvas || reference.width === 0 || !displayCanvas) return;

      const maskCtx = maskCanvas.getContext('2d');
      const displayCtx = displayCanvas.getContext('2d');
      const referenceScale = getReferenceScale();
      const samples = getCoalescedPointerEvents(event);
      for (const sample of samples) {
        const center = clientToNormalized(overlay, sample.clientX, sample.clientY);
        const radiusPx = eraserRadiusPx(
          samplePressure(sample),
          pxPerMmRef.current,
        );
        const xPx = center.x * reference.width;
        const yPx = center.y * reference.height;
        const radiusRefPx = radiusPx * referenceScale;

        setEraserCursor({
          x: center.x * display.width,
          y: center.y * display.height,
          r: radiusPx,
        });

        const last = lastEraserPointRef.current;
        if (last) {
          paintEraserMaskSegment(
            maskCtx,
            last.x,
            last.y,
            last.r,
            xPx,
            yPx,
            radiusRefPx,
            '#fff',
          );
        } else {
          paintEraserMaskCircle(maskCtx, xPx, yPx, radiusRefPx, '#fff');
        }

        lastEraserPointRef.current = { x: xPx, y: yPx, r: radiusRefPx };
      }

      tintEraserMaskForDisplay(displayCtx, maskCanvas, ERASER_MASK_FILL);
    };

    const beginEraserStroke = (event) => {
      eraserStrokeRef.current = true;
      const reference = ensureActiveLayerCanvasSize();
      ensureEraserMaskSize(reference);
      clearEraserMask();
      applyEraserSample(event);
    };

    const finishEraserStroke = async (event) => {
      if (event) {
        applyEraserSample(event);
      }

      const reference = ensureActiveLayerCanvasSize();
      const canvas = getActiveLayerCanvas();
      const maskCanvas = eraserMaskCanvasRef.current;
      const resolvedReference =
        reference.width > 0 ? reference : referenceSizeRef.current;

      if (
        canvas &&
        maskCanvas?.width > 0 &&
        resolvedReference.width > 0
      ) {
        applyEraserMaskToCanvas(canvas.getContext('2d'), maskCanvas);
        await notifyLayerChange(annotationColorRef.current);
      }

      clearEraserMask();
      setEraserCursor(null);
      eraserStrokeRef.current = false;
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
        pointerType: event.pointerType,
        color: annotationColorRef.current,
        baseWidth: PEN_BASE_WIDTH,
        points: [],
        startX,
        startY,
        startTime: performance.now(),
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
        beginEraserStroke(event);
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
        startTime: performance.now(),
        longPressTriggered: false,
        touchEraser: isToolEraser,
      };

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
            beginEraserStroke(event);
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
        void finishEraserStroke(event);
        return;
      }

      const pending = penPendingRef.current;
      if (pending && event.pointerId === pending.pointerId) {
        const wasLongPress = pending.longPressTriggered;
        const tapMovement = Math.hypot(
          event.clientX - pending.startX,
          event.clientY - pending.startY,
        );
        const tapDuration = performance.now() - (pending.startTime ?? performance.now());
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
          if (event.pointerType === 'pen') {
            const gesturalTap =
              tapMovement <= TAP_MOVE_THRESHOLD &&
              tapDuration <= TAP_MAX_DURATION_MS;
            const stroke = strokeFromClientPoint(
              event,
              pending.startX,
              pending.startY,
            );
            void finishStroke(stroke);
            if (gesturalTap) {
              recordPenTap(pending.startX, pending.startY);
            }
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
      const duration = performance.now() - (active.startTime ?? performance.now());
      const isGesturalTap =
        event.pointerType === 'pen' &&
        active.maxDeviation <= TAP_MOVE_THRESHOLD &&
        duration <= TAP_MAX_DURATION_MS;

      if (isGesturalTap) {
        recordPenTap(active.startX, active.startY);
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
      clearEraserMask();
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
      <canvas
        ref={eraserMaskDisplayCanvasRef}
        className="annotation-eraser-mask-canvas"
      />
      {displaySize.width > 0 && displaySize.height > 0 && (draftPath || eraserCursor) && (
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
              stroke={ERASER_CIRCLE_STROKE}
              pointerEvents="none"
            />
          )}
        </svg>
      )}
    </div>
  );
}
