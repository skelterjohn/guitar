import yaml from 'js-yaml';
import source from './catalog.yaml?raw';

export default yaml.load(source);
