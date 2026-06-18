import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  effectivePressure,
  getCoalescedPointerEvents,
} from '../utils/stylusInput.js';
import { catalogPath } from '../seo.js';

export default function StylusDiagnostics() {
  const canvasRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    document.title = 'Stylus diagnostics';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const logEvent = (label, event) => {
      const coalesced = getCoalescedPointerEvents(event);
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label,
        pointerType: event.pointerType,
        pressure: event.pressure,
        effective: effectivePressure(event),
        tiltX: event.tiltX,
        tiltY: event.tiltY,
        coalescedCount: coalesced.length,
        clientX: Math.round(event.clientX),
        clientY: Math.round(event.clientY),
      };

      setEvents((current) => [entry, ...current].slice(0, 40));
    };

    const onPointerDown = (event) => {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      logEvent('down', event);
    };

    const onPointerMove = (event) => {
      if (!canvas.hasPointerCapture(event.pointerId)) return;
      event.preventDefault();
      logEvent('move', event);
    };

    const onPointerUp = (event) => {
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      logEvent('up', event);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <main className="stylus-diagnostics">
      <p>
        <Link to={catalogPath}>&larr; Back to catalog</Link>
      </p>
      <h1>Stylus diagnostics</h1>
      <p>
        Draw on the pad below with the Stylo 2, a finger, and (if available) a mouse.
        Confirm that the stylus reports <code>pointerType: pen</code> and varying pressure.
      </p>
      <div
        ref={canvasRef}
        className="stylus-diagnostics-pad"
        role="application"
        aria-label="Stylus test pad"
      />
      <div className="stylus-diagnostics-log" aria-live="polite">
        {events.length === 0 ? (
          <p className="stylus-diagnostics-empty">No pointer events yet.</p>
        ) : (
          <ul>
            {events.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.label}</strong> {entry.pointerType} pressure=
                {entry.pressure.toFixed(3)} effective={entry.effective.toFixed(3)} tilt=
                {entry.tiltX}/{entry.tiltY} coalesced={entry.coalescedCount} @
                {entry.clientX},{entry.clientY}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
