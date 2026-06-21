import { Link } from 'react-router-dom';
import ChevronIcon from './ChevronIcon.jsx';
import { njgoPath } from '../seo.js';
import { isNjgoDomain } from '../utils/siteDomain.js';

export default function BackFromRep() {
  const to = isNjgoDomain() ? '/' : njgoPath;

  return (
    <Link className="page-back" to={to} aria-label="Back to NJGO">
      <ChevronIcon direction="left" />
    </Link>
  );
}
