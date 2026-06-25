function normalizeWhitespace(text) {
  return typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '';
}

export function looksLikeStreetAddress(text) {
  const value = normalizeWhitespace(text);
  if (!value) {
    return false;
  }

  if (/^\d+[\s-]/.test(value)) {
    return true;
  }

  if (/^\d+(?:st|nd|rd|th)\b/i.test(value)) {
    return true;
  }

  return /\b(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Way|Drive|Dr|Lane|Ln|Circle|Ct|Court|Place|Pl|Parkway|Pkwy)\b/i.test(
    value,
  );
}

function venueFromEventName(name) {
  const value = normalizeWhitespace(name);
  if (!value) {
    return '';
  }

  const atMatch = value.match(/\bat\s+(.+)$/i);
  if (atMatch) {
    return atMatch[1].trim();
  }

  const slashMatch = value.match(/@\s*(.+)$/);
  if (slashMatch) {
    return slashMatch[1].trim();
  }

  const patterns = [
    /Carnegie Hall/i,
    /Enlow Hall/i,
    /Kean University/i,
    /Arts High School/i,
    /William Paterson University/i,
    /American Dream(?: Stage)?/i,
    /Setauket Presbyterian Church/i,
    /ANT Bookstore(?: & Cafe)?/i,
    /Hunter College/i,
    /Holyrood(?: Episcopal Church)?/i,
    /Grace Church/i,
    /NJCU/i,
    /Merkin Hall/i,
    /Society for Ethical Culture/i,
    /Department of Education/i,
    /Shea Center for Performing Arts/i,
    /First Lutheran Church/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return '';
}

export function googleMapsSearchUrl(query) {
  const value = normalizeWhitespace(query);
  if (!value) {
    return '';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}

export function normalizeMapLink(mapLink) {
  const value = normalizeWhitespace(mapLink);
  if (!value) {
    return '';
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return googleMapsSearchUrl(value);
}

export function splitEventLocation(name, location) {
  const rawLocation = normalizeWhitespace(location);
  if (!rawLocation) {
    return { location: '', map_link: '' };
  }

  if (!looksLikeStreetAddress(rawLocation)) {
    return { location: rawLocation, map_link: '' };
  }

  return {
    location: venueFromEventName(name),
    map_link: rawLocation,
  };
}

export function eventTitle(event) {
  if (event.name && event.location) {
    return `${event.name} @ ${event.location}`;
  }
  return event.name || event.location || '';
}
