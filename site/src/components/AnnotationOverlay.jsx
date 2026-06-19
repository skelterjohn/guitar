import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import getStroke from 'perfect-freehand';
import {
  clientToNormalized,
  effectivePressure,
  ERASER_CIRCLE_FILL,
  eraserRadiusPx,
  getCoalescedPointerEvents,
  glyphDragClientPosition,
  matchesRecentPenTap,
  measureCssPxPerMm,
  PEN_BASE_WIDTH,
  PEN_COLOR,
} from '../utils/stylusInput.js';
import { getGlyphById, GLYPH_HIT_RADIUS_RATIO, GLYPH_SIZE_MM } from '../data/annotationGlyphs.js';

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

function denormalizePoints(points, width, height) {
  return points.map(([x, y, pressure = 0.5]) => [
    x * width,
    y * height,
    pressure,
  ]);
}

function strokeToPathData(stroke, width, height) {
  if (!stroke.points?.length || width === 0 || height === 0) return '';

  const inputPoints = denormalizePoints(stroke.points, width, height);
  const baseWidth = stroke.baseWidth ?? PEN_BASE_WIDTH;
  const outline = getStroke(inputPoints, {
    size: baseWidth,
    thinning: 0.6,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
  });

  return getSvgPathFromStroke(outline);
}

export default function AnnotationOverlay({
  pageNumber,
  strokes = [],
  glyphs = [],
  lastPenTapRef,
  onStrokeComplete,
  onEraseAt,
  onOpenMenu,
  onGlyphMove,
}) {
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const activeStrokeRef = useRef(null);
  const eraserStrokeRef = useRef(false);
  const penPendingRef = useRef(null);
  const glyphDragRef = useRef(null);
  const pxPerMmRef = useRef(measureCssPxPerMm());
  const callbacksRef = useRef({
    onStrokeComplete,
    onEraseAt,
    onOpenMenu,
    onGlyphMove,
  });
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const [draftStroke, setDraftStroke] = useState(null);
  const [eraserCursor, setEraserCursor] = useState(null);
  const [glyphDragPos, setGlyphDragPos] = useState(null);

  callbacksRef.current = {
    onStrokeComplete,
    onEraseAt,
    onOpenMenu,
    onGlyphMove,
  };

  const syncLayoutSize = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    setLayoutSize({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });
  };

  useLayoutEffect(() => {
    syncLayoutSize();
  }, [strokes.length, glyphs.length]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;

    const observer = new ResizeObserver(syncLayoutSize);
    observer.observe(overlay);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const frame = overlay?.parentElement;
    if (!frame) return undefined;

    const appendPoints = (event) => {
      const active = activeStrokeRef.current;
      if (!overlay || !active) return;

      const samples = getCoalescedPointerEvents(event);
      for (const sample of samples) {
        const { x, y } = clientToNormalized(overlay, sample.clientX, sample.clientY);
        active.points.push([x, y, effectivePressure(sample)]);
      }

      setDraftStroke({
        ...active,
        points: [...active.points],
      });
    };

    const finishStroke = () => {
      const active = activeStrokeRef.current;
      activeStrokeRef.current = null;
      setDraftStroke(null);

      if (!active || active.points.length < 2) return;

      callbacksRef.current.onStrokeComplete?.(pageNumber, active);
    };

    const applyEraserSample = (event) => {
      if (!overlay) return;

      const rect = overlay.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      const samples = getCoalescedPointerEvents(event);
      for (const sample of samples) {
        const center = clientToNormalized(overlay, sample.clientX, sample.clientY);
        const radiusPx = eraserRadiusPx(
          effectivePressure(sample),
          pxPerMmRef.current,
        );

        setEraserCursor({
          x: center.x * width,
          y: center.y * height,
          r: radiusPx,
        });

        callbacksRef.current.onEraseAt?.(
          pageNumber,
          center,
          radiusPx,
          width,
          height,
        );
      }
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
        color: PEN_COLOR,
        baseWidth: PEN_BASE_WIDTH,
        points: [],
        startX,
        startY,
        maxDeviation: Math.hypot(event.clientX - startX, event.clientY - startY),
      };

      const { x, y } = clientToNormalized(overlay, startX, startY);
      activeStrokeRef.current.points.push([x, y, effectivePressure(event)]);
      appendPoints(event);
    };

    const onPointerDown = (event) => {
      if (event.pointerType !== 'pen') return;

      event.preventDefault();
      event.stopPropagation();
      frame.setPointerCapture(event.pointerId);

      if (
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

      if (lastPenTapRef) {
        lastPenTapRef.current = null;
      }

      eraserStrokeRef.current = false;
      activeStrokeRef.current = null;
      setDraftStroke(null);

      const pending = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        longPressTriggered: false,
      };
      pending.longPressTimer = setTimeout(() => {
        pending.longPressTriggered = true;
        pending.longPressTimer = null;
        callbacksRef.current.onOpenMenu?.(pending.startX, pending.startY);
        activeStrokeRef.current = null;
        setDraftStroke(null);
      }, LONG_PRESS_MS);
      penPendingRef.current = pending;
    };

    const onPointerMove = (event) => {
      if (!frame.hasPointerCapture(event.pointerId)) return;
      if (event.pointerType !== 'pen') return;

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
        !activeStrokeRef.current
      ) {
        const moved = Math.hypot(
          event.clientX - pending.startX,
          event.clientY - pending.startY,
        );
        if (moved > TAP_MOVE_THRESHOLD) {
          clearPenPending(pending);
          beginPenStroke(event, pending.startX, pending.startY);
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
      if (event.pointerType !== 'pen') return;
      if (!frame.hasPointerCapture(event.pointerId)) return;

      event.preventDefault();
      event.stopPropagation();
      frame.releasePointerCapture(event.pointerId);

      if (eraserStrokeRef.current) {
        clearPenPending();
        applyEraserSample(event);
        setEraserCursor(null);
        eraserStrokeRef.current = false;
        return;
      }

      const pending = penPendingRef.current;
      if (pending && pending.pointerId === event.pointerId) {
        const wasLongPress = pending.longPressTriggered;
        clearPenPending(pending);

        if (wasLongPress) {
          return;
        }

        if (!activeStrokeRef.current) {
          if (lastPenTapRef) {
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
        if (lastPenTapRef) {
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

      finishStroke();
    };

    const onPointerCancel = (event) => {
      if (frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }

      clearPenPending();
      activeStrokeRef.current = null;
      eraserStrokeRef.current = false;
      setDraftStroke(null);
      setEraserCursor(null);
    };

    const options = { capture: true, passive: false };
    frame.addEventListener('pointerdown', onPointerDown, options);
    frame.addEventListener('pointermove', onPointerMove, options);
    frame.addEventListener('pointerup', onPointerUp, options);
    frame.addEventListener('pointercancel', onPointerCancel, options);

    return () => {
      frame.removeEventListener('pointerdown', onPointerDown, options);
      frame.removeEventListener('pointermove', onPointerMove, options);
      frame.removeEventListener('pointerup', onPointerUp, options);
      frame.removeEventListener('pointercancel', onPointerCancel, options);
    };
  }, [pageNumber, lastPenTapRef]);

  useEffect(() => {
    const svg = svgRef.current;
    const overlay = overlayRef.current;
    if (!svg || !overlay) return undefined;

    const updateDragPosition = (event) => {
      const drag = glyphDragRef.current;
      if (!drag) return;

      const dropPoint = glyphDragClientPosition(
        drag.pointerType,
        event.clientX,
        event.clientY,
      );
      const { x, y } = clientToNormalized(overlay, dropPoint.clientX, dropPoint.clientY);
      setGlyphDragPos({ id: drag.id, x, y });
    };

    const finishGlyphDrag = (event) => {
      const drag = glyphDragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      svg.releasePointerCapture(event.pointerId);
      glyphDragRef.current = null;

      const dropPoint = glyphDragClientPosition(
        drag.pointerType,
        event.clientX,
        event.clientY,
      );
      const { x, y } = clientToNormalized(overlay, dropPoint.clientX, dropPoint.clientY);
      callbacksRef.current.onGlyphMove?.(pageNumber, drag.id, x, y);
      setGlyphDragPos(null);
    };

    const onGlyphPointerDown = (event) => {
      if (event.pointerType === 'pen') return;

      const group = event.target.closest('.annotation-glyph-group');
      if (!group) return;

      const glyphId = group.dataset.glyphId;
      const glyph = glyphs.find((entry) => entry.id === glyphId);
      if (!glyph) return;

      event.preventDefault();
      event.stopPropagation();
      svg.setPointerCapture(event.pointerId);
      glyphDragRef.current = {
        id: glyphId,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
      };
      setGlyphDragPos({ id: glyphId, x: glyph.x, y: glyph.y });
    };

    const onGlyphPointerMove = (event) => {
      const drag = glyphDragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      event.preventDefault();
      event.stopPropagation();
      updateDragPosition(event);
    };

    const onGlyphPointerUp = (event) => {
      if (!glyphDragRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      finishGlyphDrag(event);
    };

    const onGlyphPointerCancel = (event) => {
      if (!glyphDragRef.current) return;
      if (svg.hasPointerCapture(event.pointerId)) {
        svg.releasePointerCapture(event.pointerId);
      }
      glyphDragRef.current = null;
      setGlyphDragPos(null);
    };

    const options = { capture: false, passive: false };
    svg.addEventListener('pointerdown', onGlyphPointerDown, options);
    svg.addEventListener('pointermove', onGlyphPointerMove, options);
    svg.addEventListener('pointerup', onGlyphPointerUp, options);
    svg.addEventListener('pointercancel', onGlyphPointerCancel, options);

    return () => {
      svg.removeEventListener('pointerdown', onGlyphPointerDown, options);
      svg.removeEventListener('pointermove', onGlyphPointerMove, options);
      svg.removeEventListener('pointerup', onGlyphPointerUp, options);
      svg.removeEventListener('pointercancel', onGlyphPointerCancel, options);
    };
  }, [pageNumber, glyphs]);

  const visibleStrokes = draftStroke ? [...strokes, draftStroke] : strokes;
  const glyphSizePx = measureCssPxPerMm() * GLYPH_SIZE_MM;

  return (
    <div
      ref={overlayRef}
      className={`annotation-overlay${draftStroke ? ' is-drawing' : ''}${
        eraserCursor ? ' is-erasing' : ''
      }`}
      aria-hidden="true"
    >
      {layoutSize.width > 0 && layoutSize.height > 0 && (
        <svg
          ref={svgRef}
          className="annotation-overlay-canvas"
          viewBox={`0 0 ${layoutSize.width} ${layoutSize.height}`}
          aria-hidden="true"
        >
          {visibleStrokes.map((stroke, index) => {
            const path = strokeToPathData(stroke, layoutSize.width, layoutSize.height);
            if (!path) return null;

            return (
              <path
                key={stroke.id ?? `draft-${index}`}
                d={path}
                fill={stroke.color ?? PEN_COLOR}
                pointerEvents="none"
              />
            );
          })}
          {glyphs.map((glyph) => {
            const glyphDef = getGlyphById(glyph.type);
            const symbol = glyphDef?.symbol;
            if (!symbol) return null;

            const position =
              glyphDragPos?.id === glyph.id ? glyphDragPos : glyph;
            const x = position.x * layoutSize.width;
            const y = position.y * layoutSize.height;
            const isDragging = glyphDragPos?.id === glyph.id;

            return (
              <g
                key={glyph.id}
                className={`annotation-glyph-group${isDragging ? ' is-dragging' : ''}`}
                data-glyph-id={glyph.id}
                transform={`translate(${x}, ${y})`}
              >
                <circle
                  className="annotation-glyph-hit"
                  r={glyphSizePx * GLYPH_HIT_RADIUS_RATIO}
                  fill="transparent"
                />
                <text
                  className={`annotation-glyph${
                    glyphDef.fontFamily ? ' annotation-glyph--number' : ''
                  }`}
                  fontSize={glyphSizePx}
                  fontFamily={glyphDef.fontFamily}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  pointerEvents="none"
                >
                  {symbol}
                </text>
              </g>
            );
          })}
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
    </div>
  );
}
