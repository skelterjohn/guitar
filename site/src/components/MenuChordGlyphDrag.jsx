import { useEffect, useMemo, useRef } from 'react';
import {
  CHORD_GLYPH_ID,
  chordGlyphMaxDragBoundsPx,
  chordMenuGlyphSizePx,
  serializeChordDiagram,
} from '../data/chordGrid.js';
import {
  buildGlyphStamp,
  glyphDrawSpecFromDrop,
  layoutWidthPxForGlyphSize,
  MENU_GLYPH_COLOR,
} from '../utils/annotationRaster.js';

const GLYPH_BUTTON_PADDING_PX = 6;

export default function MenuChordGlyphDrag({
  marks,
  romanNumeral,
  rotate,
  glyphSizePx,
  onPointerDown,
}) {
  const canvasRef = useRef(null);
  const layoutWidthPx = layoutWidthPxForGlyphSize(glyphSizePx);
  const { widthPx: dragBoxWidthPx, heightPx: dragBoxHeightPx } =
    chordGlyphMaxDragBoundsPx(chordMenuGlyphSizePx(glyphSizePx));

  const spec = useMemo(() => {
    const chord = serializeChordDiagram(marks, romanNumeral, rotate);
    return glyphDrawSpecFromDrop({
      glyphId: CHORD_GLYPH_ID,
      chord,
      color: MENU_GLYPH_COLOR,
    });
  }, [marks, romanNumeral, rotate]);

  useEffect(() => {
    let cancelled = false;

    buildGlyphStamp(spec, layoutWidthPx).then((stamp) => {
      if (cancelled || !stamp) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = stamp.width;
      canvas.height = stamp.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, stamp.width, stamp.height);
      ctx.drawImage(stamp.canvas, 0, 0);
    });

    return () => {
      cancelled = true;
    };
  }, [spec, layoutWidthPx]);

  return (
    <button
      type="button"
      className="annotation-menu-glyph annotation-menu-chord-glyph-drag"
      style={{
        minWidth: `${dragBoxWidthPx + GLYPH_BUTTON_PADDING_PX * 2}px`,
        minHeight: `${dragBoxHeightPx + GLYPH_BUTTON_PADDING_PX * 2}px`,
        padding: `${GLYPH_BUTTON_PADDING_PX}px`,
      }}
      aria-label="Drag chord onto score"
      onPointerDown={onPointerDown}
    >
      <canvas
        ref={canvasRef}
        className="annotation-menu-glyph-raster"
        aria-hidden="true"
      />
    </button>
  );
}
