import yaml from 'js-yaml';
import bundledSource from './njgo-roster.yaml?raw';
import { createYamlLoader } from './yamlLoader.js';

function parse(source) {
  return yaml.load(source) ?? { members: [] };
}

const bundledRoster = parse(bundledSource);

/**
 * Network-first NJGO roster from GCS (via /pdf/njgo-roster.yaml).
 * Falls back to Cache Storage, then the build-time bundled copy.
 */
export const loadNjgoRoster = createYamlLoader({
  label: 'njgo-roster',
  cacheName: 'guitar-njgo-roster-v1',
  path: 'njgo-roster.yaml',
  parse,
  fallback: bundledRoster,
});

/** Build-time copy for callers that need a sync fallback. */
export default bundledRoster;
