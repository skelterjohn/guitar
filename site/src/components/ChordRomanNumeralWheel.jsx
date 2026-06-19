import { useRef } from 'react';
import {
  CHORD_ROMAN_NUMERAL_OPTIONS,
  clampRomanNumeralIndex,
  romanNumeralIndexForValue,
} from '../data/chordGrid.js';

const WHEEL_DRAG_STEP_PX = 18;

export default function ChordRomanNumeralWheel({ value, onChange }) {
  const dragRef = useRef(null);
  const selectedIndex = romanNumeralIndexForValue(value);
  const selectedOption = CHORD_ROMAN_NUMERAL_OPTIONS[selectedIndex];

  const setSelectedIndex = (nextIndex) => {
    const clampedIndex = clampRomanNumeralIndex(nextIndex);
    const nextValue = CHORD_ROMAN_NUMERAL_OPTIONS[clampedIndex].value;
    if (nextValue !== value) {
      onChange(nextValue);
    }
  };

  const finishDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    dragRef.current = null;
    drag.captureTarget?.releasePointerCapture(event.pointerId);
  };

  const handlePointerDown = (event) => {
    event.stopPropagation();
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      accumulated: 0,
      captureTarget: event.currentTarget,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    event.preventDefault();

    const deltaX = event.clientX - drag.lastX;
    drag.lastX = event.clientX;
    drag.accumulated += deltaX;

    let nextIndex = romanNumeralIndexForValue(value);

    while (drag.accumulated <= -WHEEL_DRAG_STEP_PX) {
      drag.accumulated += WHEEL_DRAG_STEP_PX;
      nextIndex += 1;
    }

    while (drag.accumulated >= WHEEL_DRAG_STEP_PX) {
      drag.accumulated -= WHEEL_DRAG_STEP_PX;
      nextIndex -= 1;
    }

    setSelectedIndex(nextIndex);
  };

  return (
    <div
      className="annotation-menu-chord-numeral-wheel"
      role="slider"
      aria-label="Roman numeral"
      aria-valuemin={0}
      aria-valuemax={CHORD_ROMAN_NUMERAL_OPTIONS.length - 1}
      aria-valuenow={selectedIndex}
      aria-valuetext={selectedOption.label}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      {selectedOption.label}
    </div>
  );
}
