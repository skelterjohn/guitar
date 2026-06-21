import yaml from 'js-yaml';
import source from './njgo-roster.yaml?raw';

const roster = yaml.load(source);

export default roster;
