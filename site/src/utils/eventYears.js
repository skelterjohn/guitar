export function eventYearFromDate(date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.getUTCFullYear();
}

export function flattenEvents(eventsData) {
  if (!eventsData) {
    return [];
  }
  if (Array.isArray(eventsData)) {
    return eventsData;
  }
  return Object.values(eventsData).flat();
}

export function groupEventsByYear(events) {
  const byYear = new Map();
  for (const event of events) {
    const year = eventYearFromDate(event.date);
    if (year == null) {
      continue;
    }
    if (!byYear.has(year)) {
      byYear.set(year, []);
    }
    byYear.get(year).push(event);
  }

  const grouped = {};
  for (const year of [...byYear.keys()].sort((a, b) => b - a)) {
    grouped[year] = byYear.get(year).sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }
  return grouped;
}

export function eventYearsFromData(eventsData) {
  if (!eventsData) {
    return [];
  }

  if (Array.isArray(eventsData)) {
    return Object.entries(groupEventsByYear(eventsData)).map(([year, yearEvents]) => ({
      year: Number(year),
      events: yearEvents,
    }));
  }

  return Object.entries(eventsData)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearEvents]) => ({
      year: Number(year),
      events: [...(yearEvents ?? [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      ),
    }));
}
