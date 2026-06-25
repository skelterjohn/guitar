import yaml from 'js-yaml';
import source from './events.yaml?raw';

const events = yaml.load(source);

export default events;
