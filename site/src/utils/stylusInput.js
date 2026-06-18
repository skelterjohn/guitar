export const PEN_COLOR = '#dc2626';
export const PEN_BASE_WIDTH = 2;
export const ERASER_BASE_WIDTH = 24;

export function effectivePressure(event) {
  if (event.pointerType !== 'pen') return 0.5;
  if (event.pressure > 0 && event.pressure < 1) return event.pressure;
  if (event.pressure === 1) return 1;
  return 0.5;
}

export function isPenPointer(event) {
  if (event.pointerType === 'pen') return true;
  if (event.pointerType === 'mouse' && event.button === 0) return true;
  return false;
}

/** @deprecated Use isPenPointer */
export function isDrawingPointer(event) {
  return isPenPointer(event);
}

export function getCoalescedPointerEvents(event) {
  if (typeof event.getCoalescedEvents === 'function') {
    const coalesced = event.getCoalescedEvents();
    if (coalesced.length > 0) return coalesced;
  }
  return [event];
}

export function clientToNormalized(element, clientX, clientY) {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: (clientX - rect.left) / rect.width,
    y: (clientY - rect.top) / rect.height,
  };
}

export function normalizedToSvgPoint(point, width, height) {
  return [point[0] * width, point[1] * height];
}

export function strokeBoundingBox(points) {
  if (!points.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = points[0][0];
  let minY = points[0][1];
  let maxX = points[0][0];
  let maxY = points[0][1];

  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { minX, minY, maxX, maxY };
}

export function boxesIntersect(a, b, padding = 0) {
  return !(
    a.maxX + padding < b.minX - padding ||
    a.minX - padding > b.maxX + padding ||
    a.maxY + padding < b.minY - padding ||
    a.minY - padding > b.maxY + padding
  );
}

export function eraserRemovesStroke(eraserPoints, strokePoints, padding = 0.02) {
  if (!eraserPoints.length || !strokePoints.length) return false;

  const eraserBox = strokeBoundingBox(eraserPoints);
  const strokeBox = strokeBoundingBox(strokePoints);
  return boxesIntersect(eraserBox, strokeBox, padding);
}
