import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import LogoIcon from "../components/LogoIcon";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
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
            <p>Welcome back</p>
          </div>
        </div>

        <div className="auth-heading">
          <span className="preview-badge">Login</span>
          <h1>Sign in to your account</h1>
          <p>
            Track your spending, income, and balance from one clean dashboard.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="hussein@test.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="money-card big">
          <span>Your dashboard</span>
          <h2>Welcome back</h2>
          <p>Login to manage your real transactions and financial overview.</p>
        </div>

        <div className="mini-cards">
          <div className="money-card">
            <span>Transactions</span>
            <h3>Private</h3>
          </div>

          <div className="money-card">
            <span>Insights</span>
            <h3>Live</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;