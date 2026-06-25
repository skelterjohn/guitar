export const MAP_ICON_VIEWBOX = '0 0 12 12';

export const MAP_ICON_PATH = 'M6 1.25a3.25 3.25 0 0 1 3.25 3.25c0 2.44-3.25 6.25-3.25 6.25S2.75 6.94 2.75 4.5A3.25 3.25 0 0 1 6 1.25z';

export function mapIconHtml() {
  return `<svg class="map-icon" aria-hidden="true" viewBox="${MAP_ICON_VIEWBOX}" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="${MAP_ICON_PATH}"></path><circle cx="6" cy="4.5" r="1"></circle></svg>`;
}
