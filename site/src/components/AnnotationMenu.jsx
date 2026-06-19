import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ANNOTATION_ACCIDENTAL_GLYPHS,
  ANNOTATION_CIRCLED_NUMBER_GLYPHS,
  ANNOTATION_DYNAMIC_GLYPHS,
  ANNOTATION_FINGERING_GLYPHS,
  ANNOTATION_NUMBER_GLYPHS,
  annotationGlyphSizePx,
  getGlyphById,
} from '../data/annotationGlyphs.js';
import { pageDropFromClientPoint } from '../utils/annotationPages.js';
import { glyphDragClientPosition } from '../utils/stylusInput.js';

const VIEWPORT_MARGIN = 12;

function getViewportBounds() {
  const viewport = window.visualViewport;
  if (viewport) {
    return {
      left: viewport.offsetLeft,
      top: viewport.offsetTop,
      width: viewport.width,
      height: viewport.height,
    };
  }

  return {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getMenuDimensions(menuEl) {
  if (!menuEl) {
    return { width: 0, height: 0 };
  }

  const rect = menuEl.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function clampMenuPosition(left, top, menuWidth, menuHeight) {
  if (menuWidth <= 0 || menuHeight <= 0) {
    return { left, top };
  }

  const viewport = getViewportBounds();
  const minLeft = viewport.left + VIEWPORT_MARGIN;
  const minTop = viewport.top + VIEWPORT_MARGIN;
  const maxLeft = viewport.left + viewport.width - menuWidth - VIEWPORT_MARGIN;
  const maxTop = viewport.top + viewport.height - menuHeight - VIEWPORT_MARGIN;

  return {
    left: Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft)),
    top: Math.min(Math.max(top, minTop), Math.max(minTop, maxTop)),
  };
}

function menuPositionCenteredOnPoint(clientX, clientY, menuWidth, menuHeight) {
  return clampMenuPosition(
    clientX - menuWidth / 2,
    clientY - menuHeight / 2,
    menuWidth,
    menuHeight,
  );
}

export default function AnnotationMenu({ anchor, pdfZoom = 1, onClose, onGlyphDrop }) {
  const menuRef = useRef(null);
  const dragRef = useRef(null);
  const menuPositionRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);

  const setClampedMenuPosition = (left, top) => {
    const menu = menuRef.current;
    const { width, height } = getMenuDimensions(menu);
    const next = clampMenuPosition(left, top, width, height);
    menuPositionRef.current = next;
    setMenuPosition(next);
    return next;
  };

  useLayoutEffect(() => {
    if (!anchor) {
      menuPositionRef.current = null;
      setMenuPosition(null);
      return;
    }

    const menu = menuRef.current;
    if (!menu) return;

    const { width, height } = getMenuDimensions(menu);
    if (width <= 0 || height <= 0) return;

    const next = menuPositionCenteredOnPoint(
      anchor.clientX,
      anchor.clientY,
      width,
      height,
    );
    menuPositionRef.current = next;
    setMenuPosition(next);
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return undefined;

    const reclampMenu = () => {
      const current = menuPositionRef.current;
      if (!current || dragRef.current?.type === 'menu') return;
      setClampedMenuPosition(current.left, current.top);
    };

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', reclampMenu);
    viewport?.addEventListener('scroll', reclampMenu);
    window.addEventListener('resize', reclampMenu);

    return () => {
      viewport?.removeEventListener('resize', reclampMenu);
      viewport?.removeEventListener('scroll', reclampMenu);
      window.removeEventListener('resize', reclampMenu);
    };
  }, [anchor]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const onPointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      event.preventDefault();

      if (drag.type === 'menu') {
        setClampedMenuPosition(
          event.clientX - drag.offsetX,
          event.clientY - drag.offsetY,
        );
        return;
      }

      setDragPreview({
        glyphId: drag.glyphId,
        symbol: drag.symbol,
        ...glyphDragClientPosition(drag.pointerType, event.clientX, event.clientY),
      });
    };

    const finishDrag = (event) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      dragRef.current = null;

      if (drag.type === 'menu') {
        setClampedMenuPosition(
          event.clientX - drag.offsetX,
          event.clientY - drag.offsetY,
        );
        return;
      }

      setDragPreview(null);

      const dropPoint = glyphDragClientPosition(
        drag.pointerType,
        event.clientX,
        event.clientY,
      );
      const drop = pageDropFromClientPoint(dropPoint.clientX, dropPoint.clientY);
      if (!drop) return;

      onGlyphDrop({
        pageNumber: drop.pageNumber,
        glyphId: drag.glyphId,
        x: drop.x,
        y: drop.y,
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [onGlyphDrop]);

  const startMenuDrag = (event) => {
    if (event.pointerType === 'pen') return;

    const menu = menuRef.current;
    if (!menu || !menuPositionRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = menu.getBoundingClientRect();
    dragRef.current = {
      type: 'menu',
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    menu.setPointerCapture(event.pointerId);
  };

  const startGlyphDrag = (event, glyph) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      type: 'glyph',
      glyphId: glyph.id,
      symbol: glyph.symbol,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragPreview({
      glyphId: glyph.id,
      symbol: glyph.symbol,
      ...glyphDragClientPosition(
        event.pointerType,
        event.clientX,
        event.clientY,
      ),
    });
  };

  if (!anchor) return null;

  const glyphSizePx = annotationGlyphSizePx(pdfZoom);
  const glyphButtonPaddingPx = 12;
  const glyphButtonStyle = {
    minWidth: `${glyphSizePx + glyphButtonPaddingPx * 2}px`,
    minHeight: `${glyphSizePx + glyphButtonPaddingPx * 2}px`,
  };
  const symbolStyle = { fontSize: `${glyphSizePx}px` };
  const previewGlyph = dragPreview ? getGlyphById(dragPreview.glyphId) : null;
  const isReady = menuPosition != null;

  const renderMenuGlyph = (glyph, symbolClassName = 'annotation-menu-glyph-symbol') => (
    <button
      key={glyph.id}
      type="button"
      className="annotation-menu-glyph"
      style={glyphButtonStyle}
      aria-label={`Drag ${glyph.label} onto score`}
      onPointerDown={(event) => startGlyphDrag(event, glyph)}
    >
      <span className={symbolClassName} style={symbolStyle} aria-hidden="true">
        {glyph.symbol}
      </span>
    </button>
  );

  return createPortal(
    <>
      <button
        type="button"
        className={`annotation-menu-backdrop${dragPreview ? ' is-glyph-dragging' : ''}`}
        aria-label="Close annotation menu"
        onPointerUp={(event) => {
          if (event.pointerType !== 'touch') return;
          onClose();
        }}
      />
      <div
        ref={menuRef}
        className="annotation-menu"
        style={{
          left: isReady ? `${menuPosition.left}px` : '0px',
          top: isReady ? `${menuPosition.top}px` : '0px',
          visibility: isReady ? 'visible' : 'hidden',
          pointerEvents: isReady ? 'auto' : 'none',
        }}
        role="dialog"
        aria-label="Annotation symbols"
      >
        <div
          className="annotation-menu-header"
          onPointerDown={startMenuDrag}
        >
          <p className="annotation-menu-title">Symbols</p>
        </div>
        <div className="annotation-menu-glyph-rows">
          <div className="annotation-menu-glyphs">
            {ANNOTATION_ACCIDENTAL_GLYPHS.map((glyph) => renderMenuGlyph(glyph))}
          </div>
          <div className="annotation-menu-glyphs">
            {ANNOTATION_NUMBER_GLYPHS.map((glyph) =>
              renderMenuGlyph(glyph, 'annotation-menu-glyph-symbol annotation-menu-glyph-symbol--number'),
            )}
          </div>
          <div className="annotation-menu-glyphs">
            {ANNOTATION_CIRCLED_NUMBER_GLYPHS.map((glyph) =>
              renderMenuGlyph(glyph, 'annotation-menu-glyph-symbol annotation-menu-glyph-symbol--number'),
            )}
          </div>
          <div className="annotation-menu-glyphs">
            {ANNOTATION_FINGERING_GLYPHS.map((glyph) =>
              renderMenuGlyph(glyph, 'annotation-menu-glyph-symbol annotation-menu-glyph-symbol--number'),
            )}
          </div>
          <div className="annotation-menu-glyphs">
            {ANNOTATION_DYNAMIC_GLYPHS.map((glyph) =>
              renderMenuGlyph(glyph, 'annotation-menu-glyph-symbol annotation-menu-glyph-symbol--dynamic'),
            )}
          </div>
        </div>
      </div>
      {dragPreview && (
        <div
          className="annotation-glyph-drag-preview"
          style={{
            left: `${dragPreview.clientX}px`,
            top: `${dragPreview.clientY}px`,
            fontSize: `${glyphSizePx}px`,
            ...(previewGlyph?.fontFamily
              ? { fontFamily: previewGlyph.fontFamily }
              : {}),
            ...(previewGlyph?.fontStyle ? { fontStyle: previewGlyph.fontStyle } : {}),
            ...(previewGlyph?.fontWeight ? { fontWeight: previewGlyph.fontWeight } : {}),
          }}
          aria-hidden="true"
        >
          {dragPreview.symbol}
        </div>
      )}
    </>,
    document.body,
  );
}
