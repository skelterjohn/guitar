import {
  CHORD_GRID_MARK_FILLED,
  CHORD_GRID_MARK_OUTLINE,
  CHORD_ROMAN_NUMERAL_OFF,
  CHORD_ROMAN_NUMERAL_OPTIONS,
  chordGridIntersectionKey,
  chordGridIntersections,
  serializeChordDiagram,
} from '../data/chordGrid.js';

const COOKIE_NAME = 'guitar-chord-editor';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const VALID_INTERSECTIONS = new Set(
  chordGridIntersections().map(({ x, y }) => chordGridIntersectionKey(x, y)),
);

const VALID_ROMAN_NUMERALS = new Set(
  CHORD_ROMAN_NUMERAL_OPTIONS.map((option) => option.value),
);

function readCookie() {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeCookie(state) {
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

function parseRomanNumeral(value) {
  return VALID_ROMAN_NUMERALS.has(value) ? value : CHORD_ROMAN_NUMERAL_OFF;
}

function parseMarks(rawMarks) {
  if (!Array.isArray(rawMarks)) {
    return new Map();
  }

  const marks = new Map();
  for (const entry of rawMarks) {
    if (!entry || typeof entry !== 'object') continue;

    const { x, y, mark } = entry;
    const key = chordGridIntersectionKey(x, y);
    if (!VALID_INTERSECTIONS.has(key)) continue;
    if (mark !== CHORD_GRID_MARK_FILLED && mark !== CHORD_GRID_MARK_OUTLINE) continue;

    marks.set(key, mark);
  }

  return marks;
}

export function getChordEditorPreference() {
  const stored = readCookie();
  if (!stored) {
    return {
      marks: new Map(),
      romanNumeral: CHORD_ROMAN_NUMERAL_OFF,
    };
  }

  return {
    marks: parseMarks(stored.marks),
    romanNumeral: parseRomanNumeral(stored.romanNumeral),
  };
}

export function setChordEditorPreference(marks, romanNumeral) {
  const next = serializeChordDiagram(marks, parseRomanNumeral(romanNumeral));
  const current = readCookie();
  if (current && JSON.stringify(current) === JSON.stringify(next)) {
    return;
  }

  writeCookie(next);
}
