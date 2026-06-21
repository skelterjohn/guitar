import { useEffect, useMemo, useRef, useState } from 'react';
import { isNoteRestGlyph } from '../data/annotationGlyphs.js';
import {
  buildGlyphStamp,
  glyphDrawSpecFromDrop,
  layoutWidthPxForGlyphSize,
  MENU_GLYPH_COLOR,
} from '../utils/annotationRaster.js';

const GLYPH_BUTTON_PADDING_PX = 6;
const NOTE_REST_GLYPH_BUTTON_PADDING_PX = 1;

export default function MenuGlyphButton({
  glyph,
  glyphSizePx,
  onPointerDown,
}) {
  const canvasRef = useRef(null);
  const [stampSize, setStampSize] = useState(null);
  const layoutWidthPx = layoutWidthPxForGlyphSize(glyphSizePx);

  const spec = useMemo(
    () => glyphDrawSpecFromDrop({ glyphId: glyph.id, color: MENU_GLYPH_COLOR }),
    [glyph.id],
  );

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
      setStampSize({ width: stamp.width, height: stamp.height });
    });

    return () => {
      cancelled = true;
    };
  }, [spec, layoutWidthPx]);

  const contentWidth = stampSize?.width ?? glyphSizePx;
  const contentHeight = stampSize?.height ?? glyphSizePx;
  const compact = isNoteRestGlyph(glyph.id);
  const buttonPaddingPx = compact
    ? NOTE_REST_GLYPH_BUTTON_PADDING_PX
    : GLYPH_BUTTON_PADDING_PX;

  return (
    <button
      type="button"
      className={
        compact
          ? 'annotation-menu-glyph annotation-menu-glyph--compact'
          : 'annotation-menu-glyph'
      }
      style={{
        minWidth: `${contentWidth + buttonPaddingPx * 2}px`,
        minHeight: `${contentHeight + buttonPaddingPx * 2}px`,
        padding: `${buttonPaddingPx}px`,
      }}
      aria-label={`Drag ${glyph.label} onto score`}
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
