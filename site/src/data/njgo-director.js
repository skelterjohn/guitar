import yaml from 'js-yaml';
import source from './njgo-director.yaml?raw';

const director = yaml.load(source);

export default director;
