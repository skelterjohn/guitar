import { PEN_COLOR } from './stylusInput.js';

const STORAGE_KEY = 'guitar-annotation-color';

export const ANNOTATION_LAYER_COLORS = [
  '#000000',
  '#16a34a',
  '#2563eb',
  PEN_COLOR,
];

/** Swatch order in the menu (top / selected first). */
export const ANNOTATION_COLORS = [...ANNOTATION_LAYER_COLORS].reverse();

export function isValidAnnotationColor(color) {
  return ANNOTATION_COLORS.includes(color);
}

export function getAnnotationColorPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidAnnotationColor(stored)) return stored;
  } catch {
    // Best-effort only.
  }
  return null;
}

export function setAnnotationColorPreference(color) {
  if (!isValidAnnotationColor(color)) return;

  try {
    localStorage.setItem(STORAGE_KEY, color);
  } catch {
    // Best-effort only.
  }
}

export function resolveAnnotationColor(recordColor) {
  if (isValidAnnotationColor(recordColor)) return recordColor;
  return getAnnotationColorPreference() ?? PEN_COLOR;
}
