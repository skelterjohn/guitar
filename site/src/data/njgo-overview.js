import yaml from 'js-yaml';
import source from './njgo-overview.yaml?raw';

const overview = yaml.load(source);

export default overview;
