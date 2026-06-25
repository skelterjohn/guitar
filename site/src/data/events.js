import yaml from 'js-yaml';
import source from './events.yaml?raw';

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

export default {
  events: (data.events ?? []).map((event) => ({
    ...event,
    image: resolveEventImage(event.image),
  })),
};
