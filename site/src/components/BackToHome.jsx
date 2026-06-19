import { Link } from 'react-router-dom';
import ChevronIcon from './ChevronIcon.jsx';

export default function BackToHome() {
  return (
    <Link className="page-back" to="/" aria-label="Home">
      <ChevronIcon direction="left" />
    </Link>
  );
}
