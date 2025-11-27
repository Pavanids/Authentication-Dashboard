import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setUser } from '../features/authSlice' // adjust path if needed
import "./Login.css";


export default function LoginComponent({type=''}) {
const USERS_KEY = "users";
const dispatch = useDispatch();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [remember, setRemember] = useState(true);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");





const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);
  try {
    await new Promise((res) => setTimeout(res, 700));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const storedUser = users.find((u) => u.email === email);
    if (!storedUser) {
      setError("Account not found. Please create an account first.");
      setLoading(false);
      return;
    }
    if (storedUser.password !== password) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }
    const fakeToken = `fake-token.${btoa(email)}.${Date.now()}`;
    const user = { email , joined: storedUser.joined };
    dispatch(setAccessToken(fakeToken));
    dispatch(setUser(user));
    if (remember) {
      localStorage.setItem("remember_me", "true");
      localStorage.setItem("access_token", fakeToken);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("remember_me");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setError("Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};



return (
<div className="login-root">
<div className="login-card">
<div className="login-illustration">
<div className="illus-overlay">
<h2>Welcome</h2>
<p>Access your dashboard and manage your account.</p>
<div className="signup-link">New? <a href="/register">Create account</a></div>
</div>
</div>


<div className="login-form-wrap">
<div className="login-header">
<div>
<h3>Sign In</h3>
{/* <p className="sub">Enter your credentials to continue</p> */}
</div>

</div>


<form className="login-form" onSubmit={handleSubmit}>
{error && <div className="error">{error}</div>}


<label className="field">
<span className="label">Email</span>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="you@company.com"
className="input"
/>
</label>


<label className="field">
<span className="label">Password</span>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Your password"
className="input"
/>

<i></i>

</label>


<div className="row between">
 <label className="remember"> 
{/* <input
type="checkbox"
checked={remember}
onChange={() => setRemember((s) => !s)}
/>
<span>Remember me</span> */}
</label> 


<a className="forgot" href="/forgot">Forgot password?</a>
</div>


<button className="btn-primary" type="submit" disabled={loading}>
{loading ? "Signing in..." : "Sign in"}
</button>


{/* <div className="divider"><span>Or continue with</span></div>


<div className="socials">
<button type="button" className="btn-outline">Google</button>
<button type="button" className="btn-outline">GitHub</button>
</div> */}


<p className="tiny">By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
</form>
</div>
</div>


</div>
);
}