import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import getStroke from 'perfect-freehand';
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
import { getGlyphById, annotationGlyphSizePx, glyphDisplayText, isChordGlyph, isDynamicGlyph, isTextGlyph } from '../data/annotationGlyphs.js';
import ChordDiagram from './ChordDiagram.jsx';
import { CHORD_ROMAN_NUMERAL_OFF, chordGlyphRenderHeightPx, chordGlyphRenderWidthPx } from '../data/chordGrid.js';

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
    thinning: PEN_THINNING,
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
  onDismissMenu,
  isGlyphDragActive = false,
  annotationColor = PEN_COLOR,
  annotationTool = null,
  isAnnotationMenuOpen = false,
  menuPointerActive = false,
  touchDrawActive = false,
}) {
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const activeStrokeRef = useRef(null);
  const eraserStrokeRef = useRef(false);
  const penPendingRef = useRef(null);
  const isGlyphDragActiveRef = useRef(isGlyphDragActive);
  const annotationColorRef = useRef(annotationColor);
  const annotationToolRef = useRef(annotationTool);
  const isMenuOpenRef = useRef(isAnnotationMenuOpen);
  const pxPerMmRef = useRef(measureCssPxPerMm());
  const callbacksRef = useRef({
    onStrokeComplete,
    onEraseAt,
    onOpenMenu,
    onDismissMenu,
  });
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const [draftStroke, setDraftStroke] = useState(null);
  const [eraserCursor, setEraserCursor] = useState(null);

  callbacksRef.current = {
    onStrokeComplete,
    onEraseAt,
    onOpenMenu,
    onDismissMenu,
  };
  isGlyphDragActiveRef.current = isGlyphDragActive;
  annotationColorRef.current = annotationColor;
  annotationToolRef.current = annotationTool;
  isMenuOpenRef.current = isAnnotationMenuOpen;

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
          samplePressure(sample),
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
      if (pending && pending.pointerId === event.pointerId) {
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

      finishStroke();
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

  const visibleStrokes = draftStroke ? [...strokes, draftStroke] : strokes;
  const glyphSizePx = annotationGlyphSizePx();

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
                fill={stroke.color ?? annotationColorRef.current}
                pointerEvents="none"
              />
            );
          })}
          {glyphs.map((glyph) => {
            const x = glyph.x * layoutSize.width;
            const y = glyph.y * layoutSize.height;

            if (isTextGlyph(glyph)) {
              const label = glyphDisplayText(glyph);
              return (
                <g
                  key={glyph.id}
                  className="annotation-glyph-group"
                  transform={`translate(${x}, ${y})`}
                >
                  <text
                    className="annotation-glyph annotation-glyph--text"
                    fontSize={glyphSizePx}
                    fontFamily="system-ui, sans-serif"
                    fontWeight={600}
                    fill={glyph.color ?? annotationColorRef.current}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {label}
                  </text>
                </g>
              );
            }

            if (isChordGlyph(glyph)) {
              const diagramWidthPx = chordGlyphRenderWidthPx(glyphSizePx);
              const showNumeral =
                glyph.chord?.romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
              const diagramHeightPx = chordGlyphRenderHeightPx(
                glyphSizePx,
                showNumeral,
              );
              return (
                <g
                  key={glyph.id}
                  className="annotation-glyph-group"
                  transform={`translate(${x - diagramWidthPx / 2}, ${y - diagramHeightPx / 2})`}
                >
                  <ChordDiagram
                    marks={glyph.chord?.marks ?? []}
                    romanNumeral={glyph.chord?.romanNumeral ?? CHORD_ROMAN_NUMERAL_OFF}
                    widthPx={diagramWidthPx}
                    color={glyph.color ?? annotationColorRef.current}
                    forGlyph
                    numeralSizePx={glyphSizePx}
                    lineClassName="annotation-chord-diagram-lines"
                    numeralClassName="annotation-chord-diagram-numeral"
                  />
                </g>
              );
            }

            const glyphDef = getGlyphById(glyph.type);
            const symbol = glyphDef?.symbol;
            if (!symbol) return null;

            return (
              <g
                key={glyph.id}
                className="annotation-glyph-group"
                transform={`translate(${x}, ${y})`}
              >
                <text
                  className={`annotation-glyph${
                    glyphDef.fontFamily && !isDynamicGlyph(glyphDef)
                      ? ' annotation-glyph--number'
                      : ''
                  }${isDynamicGlyph(glyphDef) ? ' annotation-glyph--dynamic' : ''}`}
                  fontSize={glyphSizePx}
                  fontFamily={glyphDef.fontFamily}
                  fontStyle={glyphDef.fontStyle}
                  fontWeight={glyphDef.fontWeight}
                  fill={glyph.color ?? annotationColorRef.current}
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
