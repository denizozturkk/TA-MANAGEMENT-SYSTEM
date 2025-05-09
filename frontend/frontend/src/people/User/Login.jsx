
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loginimg from "../User/login-img.svg";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || "Login failed");
      }
      const { token, role, userId } = await res.json();
      // persist
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId);

      let target = "/";
      switch (role) {
        case "ROLE_ADMIN":             target = "/authorize-actors";        break;
        case "ROLE_TA":                target = "/leave";                   break;
        case "ROLE_COORDINATOR":       target = "/manageexamclassroom";     break;
        case "ROLE_FACULTY_MEMBER":    target = "/defineexam";           break;
        case "ROLE_DEAN":              target = "/make-report";             break;
        case "ROLE_DEPARTMENT_STAFF":  target = "/tutorgraderformview";     break;
        default:                       target = "/";
      }
      navigate(target, { replace: true });
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
    }
  };

  return (
    <div id="mytask-layout">
      <div className="main p-2 py-3 p-xl-5" data-mytask="theme-indigo">
        <div className="body d-flex p-0 p-xl-5">
          <div className="container-xxl">
            <div className="row g-0">

              {/* Left Panel */}
              <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{ maxWidth: "25rem" }}>
                  <div className="text-center mb-5">
                    <svg width="4rem" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                      {/* SVG paths omitted for brevity */}
                    </svg>
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">My-Task Let's Management Better</h2>
                  </div>
                  <img src={Loginimg} alt="login-img" className="img-fluid" />
                </div>
              </div>

              {/* Sign In Form Panel */}
              <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: "32rem" }}>
                  <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                    {error && (
                      <div className="col-12">
                        <p className="text-center text-danger">{error}</p>
                      </div>
                    )}
                    <div className="col-12 text-center mb-4">
                      <h1>Sign in</h1>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="***************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 text-center mt-4">
                      <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">
                        SIGN IN
                      </button>
                    </div>
                    {/* New public button below */}
                    <div className="col-12 text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate("/tutorgraderform")}
                      >
                        Tutor/Grader Application Form
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
