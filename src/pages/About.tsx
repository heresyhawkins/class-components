import './About.scss';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      <h1>About</h1>
      <p>
        Author: <a href="https://github.com/heresyhawkins">heresyhawkins</a>
      </p>
      <p>
        <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
          RS School React Course
        </a>
      </p>
      <Link to="/" className="about-back-link">
        ← Back to App
      </Link>
    </div>
  );
}
