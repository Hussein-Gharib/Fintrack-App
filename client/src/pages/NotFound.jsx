import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="preview-badge">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or was moved.</p>

        <Link className="btn btn-primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;