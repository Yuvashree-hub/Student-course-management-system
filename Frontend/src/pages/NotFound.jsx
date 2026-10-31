import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container page center">
      <h1>404 - Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <p><Link to="/" className="btn btn-primary">Back to Home</Link></p>
    </section>
  );
}
