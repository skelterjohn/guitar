import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import getStroke from 'perfect-freehand';
import {
  clientToNormalized,
  effectivePressure,
  getCoalescedPointerEvents,
  PEN_BASE_WIDTH,
  PEN_COLOR,
} from '../utils/stylusInput.js';

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
  onStrokeComplete,
}) {
  const overlayRef = useRef(null);
  const activeStrokeRef = useRef(null);
  const callbacksRef = useRef({
    onStrokeComplete,
  });
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const [draftStroke, setDraftStroke] = useState(null);

  callbacksRef.current = {
    onStrokeComplete,
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
  }, [strokes.length]);

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

    const onPointerDown = (event) => {
      if (event.pointerType !== 'pen') return;

      event.preventDefault();
      event.stopPropagation();
      frame.setPointerCapture(event.pointerId);

      activeStrokeRef.current = {
        tool: 'pen',
        color: PEN_COLOR,
        baseWidth: PEN_BASE_WIDTH,
        points: [],
      };

      appendPoints(event);
    };

    const onPointerMove = (event) => {
      if (!activeStrokeRef.current || !frame.hasPointerCapture(event.pointerId)) return;
      if (event.pointerType !== 'pen') return;

      event.preventDefault();
      event.stopPropagation();
      appendPoints(event);
    };

    const onPointerUp = (event) => {
      if (!activeStrokeRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      if (frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }

      appendPoints(event);
      finishStroke();
    };

    const onPointerCancel = (event) => {
      if (!activeStrokeRef.current) return;

      if (frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }

      activeStrokeRef.current = null;
      setDraftStroke(null);
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
  }, [pageNumber]);

  const visibleStrokes = draftStroke ? [...strokes, draftStroke] : strokes;

  return (
    <div
      ref={overlayRef}
      className={`annotation-overlay${draftStroke ? ' is-drawing' : ''}`}
      aria-hidden="true"
    >
      {layoutSize.width > 0 && layoutSize.height > 0 && (
        <svg
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
        </svg>
      )}
    </div>
  );
}
