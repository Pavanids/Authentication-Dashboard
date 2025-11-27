import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const USERS_KEY = "users";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (!email) return setError("Email is required");
  if (!password) return setError("Password is required");
  if (password.length < 6)
    return setError("Password must be at least 6 characters");
  if (password !== confirm)
    return setError("Passwords do not match");

  setLoading(true);
  try {
    await new Promise((res) => setTimeout(res, 700)); //delay

    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    const already = existing.find((u) => u.email === email);
    if (already) {
      setError("Account already exists. Please sign in.");
      setLoading(false);
      return;
    }

    const updatedUsers = [...existing, { email, password,joined: new Date().toISOString() }];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    navigate("/")
  } catch (e) {
    setError("Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-root">
      <div className="register-card">
        <div className="header">
          <h2>Create your account</h2>
          <p>Join us to access the dashboard</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={handleRegister}>
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              id="toggle-password"
              type="password"
              placeholder="6+ characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <i class="fa fa-eye toggle-password" id="toggle-password"></i>
          <label>
            <span>Confirm Password</span>
            <input
              type="password"
              placeholder="Re-type password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          {/* <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((s) => !s)}
            />
            Remember me
          </label> */}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
