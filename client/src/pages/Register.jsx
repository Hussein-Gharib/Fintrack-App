import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import LogoIcon from "../components/LogoIcon";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <LogoIcon />

          <div>
            <h2>FinTrack</h2>
            <p>Create your account</p>
          </div>
        </div>

        <div className="auth-heading">
          <span className="preview-badge">Register</span>
          <h1>Start tracking your money</h1>
          <p>Create your personal finance workspace in less than a minute.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="money-card big">
          <span>Personal finance workspace</span>
          <h2>Track smarter</h2>
          <p>Add your own income, expenses, categories, and monthly insights.</p>
        </div>

        <div className="mini-cards">
          <div className="money-card">
            <span>Categories</span>
            <h3>Custom</h3>
          </div>

          <div className="money-card">
            <span>Reports</span>
            <h3>Monthly</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;