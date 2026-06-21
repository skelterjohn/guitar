import {
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  CHORD_ROMAN_NUMERAL_OFF,
  CHORD_ROMAN_NUMERAL_FONT,
  chordDiagramLayout,
  chordGlyphBoundsPx,
  chordGlyphNumeralLayoutPx,
  chordGridLeftBarLayout,
  chordGridLineGeometry,
  chordGridOnlyRenderLayout,
  chordRomanNumeralLabel,
} from '../data/chordGrid.js';
import {
  ChordGridLines,
  ChordGridLinesLayer,
  ChordGridMarkCircles,
} from './chordGridRender.jsx';

function ChordNumeralText({
  label,
  layout,
  numeralClassName,
}) {
  return (
    <text
      x={layout.x}
      y={layout.y}
      className={numeralClassName}
      fontSize={layout.fontSize}
      fontFamily={CHORD_ROMAN_NUMERAL_FONT}
      textAnchor="start"
      dominantBaseline={layout.baseline}
      fill="currentColor"
    >
      {label}
    </text>
  );
}

function ChordGridSvg({
  marks,
  forGlyph,
  lineClassName,
  leftBarX,
  className,
  color,
  gridLayout,
}) {
  return (
    <svg
      viewBox={gridLayout.viewBox}
      width={gridLayout.widthPx}
      height={gridLayout.heightPx}
      className={className}
      style={{ color }}
      aria-hidden="true"
    >
      <ChordGridLinesLayer
        className={lineClassName}
        marks={marks}
        compact={forGlyph}
        leftBarX={leftBarX}
      />
      <ChordGridMarkCircles marks={marks} forGlyph={forGlyph} />
    </svg>
  );
}

export default function ChordDiagram({
  marks,
  romanNumeral,
  widthPx,
  color = '#f8fafc',
  forGlyph = false,
  numeralSizePx,
  rotate = false,
  className = 'annotation-chord-diagram',
  lineClassName = 'annotation-chord-diagram-lines',
  numeralClassName = 'annotation-chord-diagram-numeral',
}) {
  const numeralLabel = chordRomanNumeralLabel(romanNumeral);
  const showNumeral = !forGlyph || romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
  const lineGeometry = chordGridLineGeometry(marks, { compact: forGlyph });
  const leftBarLayout =
    forGlyph && !showNumeral
      ? chordGridLeftBarLayout(widthPx, lineGeometry.viewWidth)
      : null;
  const layout = chordDiagramLayout(widthPx, {
    numeralSizePx: forGlyph ? numeralSizePx : undefined,
    showNumeral: forGlyph ? showNumeral : true,
    viewWidth: forGlyph
      ? (leftBarLayout?.viewWidth ?? lineGeometry.viewWidth)
      : undefined,
    viewBoxMinX: leftBarLayout?.viewBoxMinX ?? 0,
    numeralLabel: showNumeral ? numeralLabel : '',
  });
  const renderWidthPx = layout.renderWidthPx ?? widthPx;
  const heightPx = (renderWidthPx * layout.viewHeight) / layout.viewWidth;

  if (rotate && forGlyph && showNumeral) {
    const bounds = chordGlyphBoundsPx(numeralSizePx, {
      showNumeral: true,
      marks,
      rotate: true,
      romanNumeral,
    });
    const gridLayout = bounds.gridLayout;
    const numeralLayout = chordGlyphNumeralLayoutPx(
      numeralSizePx,
      marks,
      romanNumeral,
    );
    const numeralBandHeightPx = bounds.numeralBandHeightPx;

    return (
      <svg
        width={bounds.widthPx}
        height={bounds.heightPx}
        className={className}
        style={{ color }}
        aria-hidden="true"
      >
        <ChordNumeralText
          label={numeralLabel}
          layout={numeralLayout}
          numeralClassName={numeralClassName}
        />
        <g
          transform={`translate(0 ${numeralBandHeightPx}) translate(${gridLayout.heightPx / 2} ${widthPx / 2}) rotate(90) translate(${-widthPx / 2} ${-gridLayout.heightPx / 2})`}
        >
          <ChordGridSvg
            marks={marks}
            forGlyph={forGlyph}
            lineClassName={lineClassName}
            leftBarX={null}
            className={className}
            color={color}
            gridLayout={gridLayout}
          />
        </g>
      </svg>
    );
  }

  if (rotate && forGlyph && !showNumeral) {
    const gridLayout = chordGridOnlyRenderLayout(widthPx, marks, { useLeftBar: true });

    return (
      <svg
        width={gridLayout.heightPx}
        height={gridLayout.widthPx}
        className={className}
        style={{ color }}
        aria-hidden="true"
      >
        <g
          transform={`translate(${gridLayout.heightPx / 2} ${gridLayout.widthPx / 2}) rotate(90) translate(${-gridLayout.widthPx / 2} ${-gridLayout.heightPx / 2})`}
        >
          <ChordGridSvg
            marks={marks}
            forGlyph={forGlyph}
            lineClassName={lineClassName}
            leftBarX={gridLayout.leftBarX}
            className={className}
            color={color}
            gridLayout={gridLayout}
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox={layout.viewBox}
      width={renderWidthPx}
      height={heightPx}
      className={className}
      style={{ color }}
      aria-hidden="true"
    >
      {showNumeral && (
        <text
          x={0}
          y={layout.numeralY}
          className={numeralClassName}
          fontSize={layout.numeralFontSize}
          fontFamily={CHORD_ROMAN_NUMERAL_FONT}
          textAnchor="start"
          dominantBaseline={layout.numeralBaseline}
          fill="currentColor"
        >
          {numeralLabel}
        </text>
      )}
      <ChordGridLinesLayer
        className={lineClassName}
        marks={marks}
        compact={forGlyph}
        leftBarX={leftBarLayout?.leftBarX ?? null}
      />
      <ChordGridMarkCircles marks={marks} forGlyph={forGlyph} />
    </svg>
  );
}

export function ChordGridIcon({ sizePx }) {
  return (
    <svg
      viewBox={`0 0 ${CHORD_GRID_VIEW_WIDTH} ${CHORD_GRID_VIEW_HEIGHT}`}
      width={sizePx}
      height={(sizePx * CHORD_GRID_VIEW_HEIGHT) / CHORD_GRID_VIEW_WIDTH}
      className="annotation-menu-chord-grid-icon"
      aria-hidden="true"
    >
      <ChordGridLines className="annotation-menu-chord-grid-icon-lines" />
    </svg>
  );
}
