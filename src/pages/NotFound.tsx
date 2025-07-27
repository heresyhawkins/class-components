import { Link } from 'react-router-dom';
import './NotFound.scss';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 — Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <Link to="/" className="home-link">
        Go Home
      </Link>
    </div>
  );
}
