import { MAP_ICON_PATH, MAP_ICON_VIEWBOX } from './mapIcon.js';

export { mapIconHtml } from './mapIcon.js';

export default function MapIcon() {
  return (
    <svg
      className="map-icon"
      aria-hidden="true"
      viewBox={MAP_ICON_VIEWBOX}
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={MAP_ICON_PATH} />
      <circle cx="6" cy="4.5" r="1" />
    </svg>
  );
}
