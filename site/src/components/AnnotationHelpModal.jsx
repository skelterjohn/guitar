import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AnnotationHelpModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="annotation-help-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="annotation-help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="annotation-help-title"
      >
        <div className="annotation-help-header">
          <h2 id="annotation-help-title">Annotations</h2>
          <button
            type="button"
            className="annotation-help-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="annotation-help-body">
          <section>
            <h3>Saving and sharing</h3>
            <ul>
              <li>
                Annotations are private and are not shared.
              </li>
              <li>
                They are saved locally as site data in this browser window or
                app.
              </li>
            </ul>
          </section>
          <section>
            <h3>Draw and erase</h3>
            <ul>
              <li>
                Stylus pen draws directly on the score.
              </li>
              <li>
                Pressure and speed control line thickness.
              </li>
              <li>
                Double-tap with the pen to begin an eraser stroke.
              </li>
            </ul>
          </section>
          <section>
            <h3>Open the glyph menu</h3>
            <ul>
              <li>Touch: long-press on the score.</li>
              <li>Mouse: right-click on the score.</li>
              <li>
                With the menu open, select the pencil or eraser at the bottom
                left, then draw or erase with your finger or mouse.
              </li>
			  <li>Drag the glyph menu around to move it out of the way.</li>
              <li>
                Choose a color with the swatches at the bottom right of the
                menu.
              </li>
              <li>
                <strong>clear</strong> removes all annotations on the current
                page.
              </li>
            </ul>
          </section>
          <section>
            <h3>Glyphs and text</h3>
            <ul>
              <li>Drag a symbol from the menu onto the score.</li>
              <li>
                Edit the text field, then drag it onto the score to place
                custom text.
              </li>
            </ul>
          </section>
          <section>
            <h3>Chord editor</h3>
            <ul>
              <li>
                Select the grid button at the bottom left of the menu to open
                the chord editor.
              </li>
              <li>
                Tap grid intersections to place marks. Only one mark is kept per
                row.
              </li>
              <li>
                On the left column, each tap cycles through filled, outline, and
                none. Other columns toggle a filled mark on or off.
              </li>
              <li>
                Drag the roman numeral selector left or right to choose a
                numeral, or set it to <strong>off</strong>.
              </li>
              <li>
                Drag the chord preview in the bottom right corner onto the
                score, using the selected annotation color.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
