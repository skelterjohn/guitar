import { Link } from 'react-router-dom';

export default function BackToHome() {
  return (
    <Link className="page-back" to="/" aria-label="Home">
      &larr;
    </Link>
  );
}
