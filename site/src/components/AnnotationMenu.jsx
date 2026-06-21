import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ANNOTATION_ACCIDENTAL_GLYPHS,
  ANNOTATION_CIRCLED_NUMBER_GLYPHS,
  ANNOTATION_DYNAMIC_GLYPHS,
  ANNOTATION_FINGERING_GLYPHS,
  ANNOTATION_NOTE_GLYPHS,
  ANNOTATION_NUMBER_GLYPHS,
  ANNOTATION_REST_GLYPHS,
  annotationGlyphSizePx,
  TEXT_GLYPH_DEFAULT,
  TEXT_GLYPH_FONT,
  TEXT_GLYPH_ID,
} from '../data/annotationGlyphs.js';
import ChordGridEditor, { ChordGridIcon } from './ChordGridEditor.jsx';
import {
  CHORD_GLYPH_ID,
  serializeChordDiagram,
} from '../data/chordGrid.js';
import { pageDropFromClientPoint } from '../utils/annotationPages.js';
import { glyphDrawSpecFromDrop } from '../utils/annotationRaster.js';
import { ANNOTATION_COLORS } from '../utils/annotationColorPreference.js';
import {
  getChordEditorPreference,
  setChordEditorPreference,
} from '../utils/chordEditorPreference.js';
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

function isClientPointOverMenu(clientX, clientY, menuEl) {
  if (!menuEl) return false;

  const rect = menuEl.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
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

export default function AnnotationMenu({
  anchor,
  pdfZoom = 1,
  annotationColor,
  onAnnotationColorChange,
  annotationTool,
  onAnnotationToolChange,
  onClose,
  onClearPage,
  onClearLayer,
  onGlyphDrop,
  onGlyphDragPreview,
  onGlyphDragChange,
}) {
  const menuRef = useRef(null);
  const dragRef = useRef(null);
  const menuPositionRef = useRef(null);
  const dismissSuppressUntilRef = useRef(0);
  const textInputRef = useRef(null);
  const menuTextRef = useRef(TEXT_GLYPH_DEFAULT);
  const textDragPendingRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [isGlyphDragging, setIsGlyphDragging] = useState(false);
  const [menuText, setMenuText] = useState(TEXT_GLYPH_DEFAULT);
  const [chordMarks, setChordMarks] = useState(() => getChordEditorPreference().marks);
  const [chordRomanNumeral, setChordRomanNumeral] = useState(
    () => getChordEditorPreference().romanNumeral,
  );
  const [chordRotate, setChordRotate] = useState(() => getChordEditorPreference().rotate);
  const chordMarksRef = useRef(chordMarks);
  const chordRomanNumeralRef = useRef(chordRomanNumeral);
  const chordRotateRef = useRef(chordRotate);

  menuTextRef.current = menuText;
  chordMarksRef.current = chordMarks;
  chordRomanNumeralRef.current = chordRomanNumeral;
  chordRotateRef.current = chordRotate;

  const updateGlyphDragPreview = (drag, clientX, clientY) => {
    const dragPoint = glyphDragClientPosition(drag.pointerType, clientX, clientY);

    if (isClientPointOverMenu(dragPoint.clientX, dragPoint.clientY, menuRef.current)) {
      onGlyphDragPreview?.(null);
      return;
    }

    const drop = pageDropFromClientPoint(dragPoint.clientX, dragPoint.clientY);

    if (!drop) {
      onGlyphDragPreview?.(null);
      return;
    }

    onGlyphDragPreview?.({
      pageNumber: drop.pageNumber,
      x: drop.x,
      y: drop.y,
      spec: glyphDrawSpecFromDrop({
        glyphId: drag.glyphId,
        text: drag.text,
        chord: drag.chord,
        color: annotationColor,
      }),
    });
  };

  useEffect(() => {
    setChordEditorPreference(chordMarks, chordRomanNumeral, chordRotate);
  }, [chordMarks, chordRomanNumeral, chordRotate]);

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
    dismissSuppressUntilRef.current = performance.now() + 400;
    setMenuText(TEXT_GLYPH_DEFAULT);
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return undefined;

    const TAP_MOVE_THRESHOLD = 10;
    let dismissPending = null;

    const isOutsideMenu = (event) => {
      const menu = menuRef.current;
      if (!menu) return false;
      if (event.target && menu.contains(event.target)) return false;

      const rect = menu.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    const onDismissPointerDown = (event) => {
      if (performance.now() < dismissSuppressUntilRef.current) return;
      if (dragRef.current) return;
      if (!isOutsideMenu(event)) return;

      dismissPending = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onDismissPointerUp = (event) => {
      const pending = dismissPending;
      dismissPending = null;

      if (!pending || event.pointerId !== pending.pointerId) return;
      if (performance.now() < dismissSuppressUntilRef.current) return;
      if (dragRef.current) return;
      if (!isOutsideMenu(event)) return;

      const dx = Math.abs(event.clientX - pending.x);
      const dy = Math.abs(event.clientY - pending.y);
      if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) return;

      onClose(event.pointerId);
    };

    const onDismissPointerCancel = (event) => {
      if (dismissPending?.pointerId === event.pointerId) {
        dismissPending = null;
      }
    };

    const capture = { capture: true };
    window.addEventListener('pointerdown', onDismissPointerDown, capture);
    window.addEventListener('pointerup', onDismissPointerUp, capture);
    window.addEventListener('pointercancel', onDismissPointerCancel, capture);

    return () => {
      window.removeEventListener('pointerdown', onDismissPointerDown, capture);
      window.removeEventListener('pointerup', onDismissPointerUp, capture);
      window.removeEventListener('pointercancel', onDismissPointerCancel, capture);
    };
  }, [anchor, onClose]);

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
    onGlyphDragChange?.(isGlyphDragging);
  }, [isGlyphDragging, onGlyphDragChange]);

  useEffect(() => {
    if (!anchor) {
      onGlyphDragChange?.(false);
    }
  }, [anchor, onGlyphDragChange]);

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
    const TAP_MOVE_THRESHOLD = 10;

    const onPointerMove = (event) => {
      const textPending = textDragPendingRef.current;
      if (
        textPending &&
        event.pointerId === textPending.pointerId &&
        !dragRef.current
      ) {
        const moved = Math.hypot(
          event.clientX - textPending.startX,
          event.clientY - textPending.startY,
        );
        if (moved > TAP_MOVE_THRESHOLD) {
          textInputRef.current?.blur();
          const text = menuTextRef.current.trim() || TEXT_GLYPH_DEFAULT;
          textDragPendingRef.current = null;
          dragRef.current = {
            type: 'glyph',
            glyphId: TEXT_GLYPH_ID,
            symbol: text,
            text,
            pointerId: event.pointerId,
            pointerType: textPending.pointerType,
          };
          setIsGlyphDragging(true);
          updateGlyphDragPreview(dragRef.current, event.clientX, event.clientY);
          event.preventDefault();
        }
        return;
      }

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

      updateGlyphDragPreview(drag, event.clientX, event.clientY);
    };

    const finishDrag = (event) => {
      const textPending = textDragPendingRef.current;
      if (textPending && event.pointerId === textPending.pointerId) {
        textDragPendingRef.current = null;
        textPending.captureTarget?.releasePointerCapture(event.pointerId);

        if (!dragRef.current) {
          textInputRef.current?.focus();
          textInputRef.current?.select();
          return;
        }
      }

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

      setIsGlyphDragging(false);
      onGlyphDragPreview?.(null);

      const dropPoint = glyphDragClientPosition(
        drag.pointerType,
        event.clientX,
        event.clientY,
      );
      if (isClientPointOverMenu(dropPoint.clientX, dropPoint.clientY, menuRef.current)) {
        return;
      }

      const drop = pageDropFromClientPoint(dropPoint.clientX, dropPoint.clientY);
      if (!drop) return;

      onGlyphDrop({
        pageNumber: drop.pageNumber,
        glyphId: drag.glyphId,
        x: drop.x,
        y: drop.y,
        text: drag.text,
        chord: drag.chord,
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

  const startTextInteraction = (event) => {
    if (event.pointerType === 'pen') return;

    textDragPendingRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      pointerType: event.pointerType,
      captureTarget: event.currentTarget,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
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
    setIsGlyphDragging(true);
    updateGlyphDragPreview(dragRef.current, event.clientX, event.clientY);
  };

  const startChordGlyphDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const chord = serializeChordDiagram(
      chordMarksRef.current,
      chordRomanNumeralRef.current,
      chordRotateRef.current,
    );
    dragRef.current = {
      type: 'glyph',
      glyphId: CHORD_GLYPH_ID,
      chord,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsGlyphDragging(true);
    updateGlyphDragPreview(dragRef.current, event.clientX, event.clientY);
  };

  if (!anchor) return null;

  const glyphSizePx = annotationGlyphSizePx(pdfZoom);
  const glyphButtonPaddingPx = 6;
  const glyphButtonStyle = {
    minWidth: `${glyphSizePx + glyphButtonPaddingPx * 2}px`,
    minHeight: `${glyphSizePx + glyphButtonPaddingPx * 2}px`,
  };
  const symbolStyle = { fontSize: `${glyphSizePx}px` };
  const isReady = menuPosition != null;
  const chordModeActive = annotationTool === 'chord';

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

  const renderColorSwatches = () => (
    <div className="annotation-menu-layers">
      <span className="annotation-menu-layers-label">layers</span>
      <div
        className="annotation-menu-colors"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
      >
        {ANNOTATION_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={
              color === annotationColor
                ? 'annotation-menu-color-swatch annotation-menu-color-swatch--selected'
                : 'annotation-menu-color-swatch'
            }
            style={{ backgroundColor: color }}
            onPointerUp={(event) => {
              event.stopPropagation();
              onAnnotationColorChange(color);
            }}
            aria-label={`${color} layer`}
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );

  const renderToolToggle = (tool, label, content) => (
    <button
      type="button"
      className={
        annotationTool === tool
          ? 'annotation-menu-tool-btn annotation-menu-tool-btn--selected'
          : 'annotation-menu-tool-btn'
      }
      onPointerUp={(event) => {
        event.stopPropagation();
        onAnnotationToolChange(annotationTool === tool ? null : tool);
      }}
      aria-label={label}
    >
      {content}
    </button>
  );

  return createPortal(
    <>
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
        aria-label={chordModeActive ? 'Chord editor' : 'Annotation glyphs'}
      >
        <div className="annotation-menu-header">
          <div
            className="annotation-menu-header-drag"
            onPointerDown={startMenuDrag}
          >
            <p className="annotation-menu-title">
              {chordModeActive ? 'chord editor' : 'Glyphs'}
            </p>
          </div>
          <div className="annotation-menu-header-actions">
            <button
              type="button"
              className="annotation-menu-clear"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => {
                event.stopPropagation();
                onClearLayer?.();
              }}
            >
              Clear layer
            </button>
            <button
              type="button"
              className="annotation-menu-clear"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => {
                event.stopPropagation();
                onClearPage?.();
              }}
            >
              Clear page
            </button>
          </div>
        </div>
        <div className="annotation-menu-body">
          <div
            className={
              chordModeActive
                ? 'annotation-menu-glyph-rows annotation-menu-body-panel--hidden'
                : 'annotation-menu-glyph-rows'
            }
            aria-hidden={chordModeActive}
          >
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
            <div className="annotation-menu-glyphs">
              {ANNOTATION_NOTE_GLYPHS.map((glyph) => renderMenuGlyph(glyph))}
            </div>
            <div className="annotation-menu-glyphs">
              {ANNOTATION_REST_GLYPHS.map((glyph) => renderMenuGlyph(glyph))}
            </div>
            <div
              className="annotation-menu-text-row"
              onPointerDown={startTextInteraction}
            >
              <input
                ref={textInputRef}
                type="text"
                className="annotation-menu-text-input"
                style={{ fontFamily: TEXT_GLYPH_FONT }}
                value={menuText}
                onChange={(event) => setMenuText(event.target.value)}
                aria-label="Annotation text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                tabIndex={chordModeActive ? -1 : 0}
              />
            </div>
          </div>
          <div
            className={
              chordModeActive
                ? 'annotation-menu-chord-body'
                : 'annotation-menu-chord-body annotation-menu-body-panel--hidden'
            }
            aria-hidden={!chordModeActive}
          >
            <ChordGridEditor
              marks={chordMarks}
              onMarksChange={setChordMarks}
              romanNumeral={chordRomanNumeral}
              onRomanNumeralChange={setChordRomanNumeral}
              rotate={chordRotate}
              onRotateChange={setChordRotate}
              glyphSizePx={glyphSizePx}
              annotationColor={annotationColor}
              onChordGlyphPointerDown={startChordGlyphDrag}
            />
          </div>
        </div>
        <div className="annotation-menu-footer">
          <div
            className="annotation-menu-tool-toggle"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            {renderToolToggle(
              'pen',
              'Pen',
              <span className="annotation-menu-tool-symbol" aria-hidden="true">
                ✏
              </span>,
            )}
            {renderToolToggle(
              'eraser',
              'Eraser',
              <svg viewBox="0 0 16 16" aria-hidden="true" className="annotation-menu-tool-eraser">
                <path d="M3.5 6.5 8.5 4.5 13.5 7.5 8.5 9.5Z" fill="#fbcfe8" />
                <path d="M3.5 6.5 8.5 9.5 8.5 13.5 3.5 10.5Z" fill="#f472b6" />
                <path d="M8.5 9.5 13.5 7.5 13.5 11.5 8.5 13.5Z" fill="#ec4899" />
                <path
                  d="M3.5 6.5 8.5 4.5 13.5 7.5 8.5 9.5 8.5 13.5 3.5 10.5Z"
                  fill="none"
                  stroke="rgb(236 72 153)"
                  strokeWidth="0.75"
                  strokeLinejoin="round"
                />
              </svg>,
            )}
            {renderToolToggle(
              'chord',
              'Chord',
              <ChordGridIcon sizePx={14} />,
            )}
          </div>
          <div
            className="annotation-menu-footer-drag"
            onPointerDown={startMenuDrag}
            aria-hidden="true"
          />
          {renderColorSwatches()}
        </div>
      </div>
    </>,
    document.body,
  );
}
