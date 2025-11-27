import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Please enter your email");
    if (!email.includes("@")) return setError("Invalid email format");

    // Fake sending reset link
    setTimeout(() => {
      setSent(true);
    }, 600);
  };

  return (
    <div className="fp-root">
      <div className="fp-card">
        {!sent ? (
          <>
            <h2>Forgot password?</h2>
            <p>Enter your email & we’ll send you a reset link.</p>

            {error && <div className="fp-error">{error}</div>}

            <form className="fp-form" onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit" className="fp-btn">
                Send reset link
              </button>
            </form>

            <p className="fp-back">
              Remember now? <Link to="/">Sign in</Link>
            </p>
          </>
        ) : (
          <div className="fp-sent">
            <h2>Check your inbox 📩</h2>
            <p>
              We sent a reset link to <strong>{email}</strong>
            </p>

            <Link className="fp-btn" to="/">
              Return to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
