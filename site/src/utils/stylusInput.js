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

function pointInsideCircle(x, y, layoutWidth, layoutHeight, cx, cy, radiusPx) {
  const px = x * layoutWidth;
  const py = y * layoutHeight;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radiusPx * radiusPx;
}

function lerpStrokePoint(p0, p1, t) {
  const pressure0 = p0[2] ?? 0.5;
  const pressure1 = p1[2] ?? 0.5;
  return [
    p0[0] + t * (p1[0] - p0[0]),
    p0[1] + t * (p1[1] - p0[1]),
    pressure0 + t * (pressure1 - pressure0),
  ];
}

function pointsNear(a, b, epsilon = 1e-6) {
  return (
    Math.abs(a[0] - b[0]) <= epsilon &&
    Math.abs(a[1] - b[1]) <= epsilon
  );
}

function segmentCircleCrossingTs(p0, p1, layoutWidth, layoutHeight, cx, cy, radiusPx) {
  const x0 = p0[0] * layoutWidth;
  const y0 = p0[1] * layoutHeight;
  const x1 = p1[0] * layoutWidth;
  const y1 = p1[1] * layoutHeight;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const fx = x0 - cx;
  const fy = y0 - cy;
  const a = dx * dx + dy * dy;

  if (a < 1e-10) return [];

  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radiusPx * radiusPx;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return [];

  if (discriminant < 1e-10) {
    const t = -b / (2 * a);
    return t > 0 && t < 1 ? [t] : [];
  }

  const sqrtDisc = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);

  return [t1, t2]
    .filter((t) => t > 0 && t < 1)
    .sort((left, right) => left - right);
}

function clipEdgeOutsideCircle(p0, p1, layoutWidth, layoutHeight, cx, cy, radiusPx) {
  const insideAt = (t) => {
    const point = lerpStrokePoint(p0, p1, t);
    return pointInsideCircle(
      point[0],
      point[1],
      layoutWidth,
      layoutHeight,
      cx,
      cy,
      radiusPx,
    );
  };

  const crossingTs = segmentCircleCrossingTs(
    p0,
    p1,
    layoutWidth,
    layoutHeight,
    cx,
    cy,
    radiusPx,
  );
  const breaks = [0, ...crossingTs, 1];
  const runs = [];

  for (let index = 0; index < breaks.length - 1; index += 1) {
    const startT = breaks[index];
    const endT = breaks[index + 1];
    if (endT - startT < 1e-8) continue;

    const midT = (startT + endT) / 2;
    if (insideAt(midT)) continue;

    runs.push([
      lerpStrokePoint(p0, p1, startT),
      lerpStrokePoint(p0, p1, endT),
    ]);
  }

  return runs;
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
  if (points.length < 2) return points.length ? [points] : [];

  const cx = centerNorm.x * layoutWidth;
  const cy = centerNorm.y * layoutHeight;

  const box = strokeBoundingBox(points);
  if (
    !circleIntersectsRect(
      cx,
      cy,
      radiusPx,
      box.minX * layoutWidth,
      box.minY * layoutHeight,
      box.maxX * layoutWidth,
      box.maxY * layoutHeight,
    )
  ) {
    return [points];
  }

  const segments = [];
  let current = [];

  const flush = () => {
    if (current.length >= 2) {
      segments.push(current);
    }
    current = [];
  };

  const appendPoint = (point) => {
    const last = current[current.length - 1];
    if (last && pointsNear(last, point)) return;
    current.push(point);
  };

  for (let index = 1; index < points.length; index += 1) {
    const p0 = points[index - 1];
    const p1 = points[index];
    const runs = clipEdgeOutsideCircle(
      p0,
      p1,
      layoutWidth,
      layoutHeight,
      cx,
      cy,
      radiusPx,
    );

    if (runs.length === 0) {
      flush();
      continue;
    }

    for (let runIndex = 0; runIndex < runs.length; runIndex += 1) {
      if (runIndex > 0) {
        flush();
      }

      const [runStart, runEnd] = runs[runIndex];

      if (current.length > 0 && pointsNear(current[current.length - 1], runStart)) {
        appendPoint(runEnd);
      } else {
        flush();
        appendPoint(runStart);
        appendPoint(runEnd);
      }
    }
  }

  flush();
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
