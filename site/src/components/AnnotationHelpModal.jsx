import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import IssueIcon from './IssueIcon.jsx';

const GITHUB_ISSUES_URL = 'https://github.com/skelterjohn/guitar/issues';

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
          <h2 id="annotation-help-title">Annotations Help</h2>
          <div className="annotation-help-header-actions">
            <a
              href={GITHUB_ISSUES_URL}
              className="annotation-help-issue-link"
              aria-label="Report an issue on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IssueIcon />
            </a>
            <button
              type="button"
              className="annotation-help-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div className="annotation-help-body">
          <section>
			<h3>Use as a performance score</h3>
			<ul>
				<li>
					The intent is for this to be usable as a performance score... ONE DAY.
				</li>
				<li>
					When that day arrives, it will say so here.
				</li>
				<li>
					Tap the left or right half of the page to go previous or next.
					Tap the top ~10% for the first page, or the bottom ~10% for the
					last page.
				</li>
			</ul>
          </section>
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
                Stylus pen draws directly on the score, including short marks and
                dots.
              </li>
              <li>
                Pressure and speed control line thickness.
              </li>
              <li>
                Double-tap quickly with the pen to begin an eraser stroke.
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
            </ul>
          </section>
          <section>
            <h3>Layers</h3>
            <ul>
              <li>
                Annotations are stored in four color layers: black, green, blue,
                and red.
              </li>
              <li>
                Choose the active layer with the color swatches labeled{' '}
                <strong>layers</strong> at the bottom right of the glyph menu.
              </li>
              <li>
                Pen, eraser, and glyph strokes are drawn on the active layer
                only.
              </li>
              <li>
                <strong>Clear layer</strong> removes annotations on the current
                page for the active layer.
              </li>
              <li>
                <strong>Clear page</strong> removes all layers on the current
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
          <section>
            <h3>Printing and downloading</h3>
            <ul>
              <li>
				Use the download button to save the score without any of
				your annotations.
			  </li>
              <li>
				Use the print button to print or save the score with all of
				your annotations.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
