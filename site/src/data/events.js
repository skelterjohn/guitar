import yaml from 'js-yaml';
import source from './events.yaml?raw';
import { eventYearsFromData } from '../utils/eventYears.js';

const images = import.meta.glob('./events/*', {
  eager: true,
  import: 'default',
});

function resolveEventImage(filename) {
  if (typeof filename !== 'string' || !filename.trim()) {
    return undefined;
  }
  return images[`./events/${filename}`];
}

const data = yaml.load(source);

const eventYears = eventYearsFromData(data.events).map(({ year, events }) => ({
  year,
  events: events.map((event) => ({
    ...event,
    image: resolveEventImage(event.image),
  })),
}));

export default { eventYears };
