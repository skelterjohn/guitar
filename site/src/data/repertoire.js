import yaml from 'js-yaml';
import bundledSource from './repertoire.yaml?raw';
import { createYamlLoader } from './yamlLoader.js';

function parse(source) {
  const data = yaml.load(source);
  return data?.sections ? data : { sections: [] };
}

const bundledRepertoire = parse(bundledSource);

/**
 * Network-first repertoire config from GCS (via /pdf/repertoire.yaml).
 * Falls back to Cache Storage, then the build-time bundled copy.
 */
export const loadRepertoire = createYamlLoader({
  label: 'repertoire',
  cacheName: 'guitar-repertoire-v1',
  path: 'repertoire.yaml',
  parse,
  fallback: bundledRepertoire,
});

/** Build-time copy for callers that need a sync fallback. */
export default bundledRepertoire;
