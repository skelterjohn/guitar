export const PEN_COLOR = '#dc2626';
export const PEN_BASE_WIDTH = 2;

export const ERASER_MIN_DIAMETER_MM = 1;
export const ERASER_MAX_DIAMETER_MM = 20;
export const ERASER_CIRCLE_FILL = 'rgb(236 72 153 / 45%)';

const CSS_PX_PER_MM = 96 / 25.4;

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

export function measureCssPxPerMm() {
  if (typeof document === 'undefined') return CSS_PX_PER_MM;

  const probe = document.createElement('div');
  probe.style.width = '1mm';
  probe.style.height = '1mm';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);
  const pxPerMm = probe.getBoundingClientRect().width || CSS_PX_PER_MM;
  document.body.removeChild(probe);
  return pxPerMm;
}

export function eraserRadiusPx(pressure, pxPerMm = CSS_PX_PER_MM) {
  const normalizedPressure = typeof pressure === 'number' ? pressure : 0.5;
  const minDiameter = ERASER_MIN_DIAMETER_MM * pxPerMm;
  const maxDiameter = ERASER_MAX_DIAMETER_MM * pxPerMm;
  const diameter = minDiameter + normalizedPressure * (maxDiameter - minDiameter);
  return diameter / 2;
}

function pointInsideCircle(x, y, layoutWidth, layoutHeight, cx, cy, radiusPx, padding = 0) {
  const px = x * layoutWidth;
  const py = y * layoutHeight;
  const radius = radiusPx + padding;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function segmentIntersectsCircle(
  p0,
  p1,
  layoutWidth,
  layoutHeight,
  cx,
  cy,
  radiusPx,
  padding = 0,
) {
  const x0 = p0[0] * layoutWidth;
  const y0 = p0[1] * layoutHeight;
  const x1 = p1[0] * layoutWidth;
  const y1 = p1[1] * layoutHeight;
  const radius = radiusPx + padding;

  const dx = x1 - x0;
  const dy = y1 - y0;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    const distX = x0 - cx;
    const distY = y0 - cy;
    return distX * distX + distY * distY <= radius * radius;
  }

  const t = Math.max(
    0,
    Math.min(1, ((cx - x0) * dx + (cy - y0) * dy) / lengthSquared),
  );
  const closestX = x0 + t * dx;
  const closestY = y0 + t * dy;
  const distX = closestX - cx;
  const distY = closestY - cy;
  return distX * distX + distY * distY <= radius * radius;
}

function circleIntersectsRect(cx, cy, radius, minX, minY, maxX, maxY) {
  const closestX = Math.max(minX, Math.min(cx, maxX));
  const closestY = Math.max(minY, Math.min(cy, maxY));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

function splitStrokeByEraser(stroke, layoutWidth, layoutHeight, centerNorm, radiusPx) {
  const points = stroke.points;
  if (!points.length) return [];

  const cx = centerNorm.x * layoutWidth;
  const cy = centerNorm.y * layoutHeight;
  const padding = (stroke.baseWidth ?? PEN_BASE_WIDTH) / 2;
  const hitRadius = radiusPx + padding;

  const box = strokeBoundingBox(points);
  const minX = box.minX * layoutWidth - padding;
  const minY = box.minY * layoutHeight - padding;
  const maxX = box.maxX * layoutWidth + padding;
  const maxY = box.maxY * layoutHeight + padding;

  if (!circleIntersectsRect(cx, cy, hitRadius, minX, minY, maxX, maxY)) {
    return [points];
  }

  const segments = [];
  let current = [];

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (
      pointInsideCircle(
        point[0],
        point[1],
        layoutWidth,
        layoutHeight,
        cx,
        cy,
        radiusPx,
        padding,
      )
    ) {
      if (current.length >= 2) {
        segments.push(current);
      }
      current = [];
      continue;
    }

    if (current.length > 0) {
      const previous = current[current.length - 1];
      if (
        segmentIntersectsCircle(
          previous,
          point,
          layoutWidth,
          layoutHeight,
          cx,
          cy,
          radiusPx,
          padding,
        )
      ) {
        if (current.length >= 2) {
          segments.push(current);
        }
        current = [point];
        continue;
      }
    }

    current.push(point);
  }

  if (current.length >= 2) {
    segments.push(current);
  }

  return segments;
}

export function applyPartialEraser(
  strokes,
  layoutWidth,
  layoutHeight,
  centerNorm,
  radiusPx,
  createId,
) {
  const next = [];
  let changed = false;

  for (const stroke of strokes) {
    const segments = splitStrokeByEraser(
      stroke,
      layoutWidth,
      layoutHeight,
      centerNorm,
      radiusPx,
    );

    if (segments.length === 0) {
      changed = true;
      continue;
    }

    if (segments.length === 1 && segments[0].length === stroke.points.length) {
      next.push(stroke);
      continue;
    }

    changed = true;
    for (const points of segments) {
      next.push({
        id: createId(),
        tool: stroke.tool,
        color: stroke.color,
        baseWidth: stroke.baseWidth,
        points,
      });
    }
  }

  return { strokes: next, changed };
}

export const DOUBLE_TAP_MS = 400;
export const DOUBLE_TAP_DISTANCE_PX = 24;

export function matchesRecentPenTap(lastTap, clientX, clientY, now = performance.now()) {
  if (!lastTap) return false;

  return (
    now - lastTap.time <= DOUBLE_TAP_MS &&
    Math.hypot(clientX - lastTap.x, clientY - lastTap.y) <= DOUBLE_TAP_DISTANCE_PX
  );
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
