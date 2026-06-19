import { PEN_COLOR } from './stylusInput.js';

const STORAGE_KEY = 'guitar-annotation-color';

export const ANNOTATION_COLORS = [
  PEN_COLOR,
  '#2563eb',
  '#16a34a',
  '#000000',
];

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
