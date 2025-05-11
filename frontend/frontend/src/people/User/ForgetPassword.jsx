import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forgotImg from '../User/forgot-password.svg';
import Loginimg from "../User/login-img.svg";

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:8080/api/auth/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong');
      }

      setMessage('If that email is registered, you’ll receive reset instructions shortly.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div id="mytask-layout">
      <div className="main p-2 py-3 p-xl-5" data-mytask="theme-indigo">
        <div className="body d-flex p-0 p-xl-5">
          <div className="container-xxl">
            <div className="row g-0">

              {/* Left Image Panel */}
              <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{ maxWidth: '25rem' }}>
                  <div className="text-center mb-5">
                    <svg width="4rem" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                      {/* …SVG paths… */}
                    </svg>
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">My-Task Let&apos;s Management Better</h2>
                  </div>
                  {/* reverted to original */}
                  <div>
                    <img src={Loginimg} alt="login-img" />
                  </div>
                </div>
              </div>

              {/* Password Reset Form Panel */}
              <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div
                  className="w-100 p-3 p-md-5 card border-0 text-light"
                  style={{ maxWidth: '32rem', backgroundColor: '#2a2d62' }}
                >
                  <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                    <div className="col-12 text-center mb-1 mb-lg-5">
                      {/* reverted to original className */}
                      <img src={forgotImg} className="w240 mb-4" alt="Forgot Password" />
                      <h1>Forgot password?</h1>
                      <span className="text-light">
                        Enter the email address you used when you joined and we&apos;ll send you
                        instructions to reset your password.
                      </span>
                    </div>

                    {error && (
                      <div className="col-12">
                        <p className="text-center text-danger">{error}</p>
                      </div>
                    )}
                    {message && (
                      <div className="col-12">
                        <p className="text-center text-success">{message}</p>
                      </div>
                    )}

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

                    <div className="col-12 text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-lg btn-block btn-light lift text-uppercase"
                      >
                        Submit
                      </button>
                    </div>

                    <div className="col-12 text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-link text-light"
                        onClick={() => navigate('/signin')}
                      >
                        Back to Sign in
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

export default PasswordResetPage;
