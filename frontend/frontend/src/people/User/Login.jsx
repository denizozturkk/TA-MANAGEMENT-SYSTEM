// src/people/User/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loginimg from "../User/login-img.svg";

const Login = () => {
  const [email,    setEmail   ] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError   ] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Login failed");
      }

      const { token, role } = await res.json();
      // store them under these exact keys:
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole",  role);

      // Redirect
      let target = "/";
      switch (role) {
        case "ROLE_ADMIN":           target = "/make-reports";        break;
        case "ROLE_TA":              target = "/leave";               break;
        case "ROLE_COORDINATOR":     target = "/manageexamclassroom"; break;
        case "ROLE_FACULTY_MEMBER":  target = "/classroomlist";       break;
        case "ROLE_DEAN":            target = "/make-report";         break;
        case "ROLE_DEPARTMENT_STAFF":target = "/tutorgraderformview";break;
      }
      navigate(target, { replace: true });
    } catch (err) {
      console.error("Login error", err);
      setError(err.message);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        {/* … your left‐side graphic … */}
        <img src={Loginimg} className="img-fluid" alt="login graphic"/>
      </div>
      <div className="col-md-6">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
