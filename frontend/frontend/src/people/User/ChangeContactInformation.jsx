import React, { useState } from 'react';
import loginImg from '../User/login-img.svg';
import verifyImg  from '../User/forgot-password.svg'; // replace with appropriate image

const ChangeContactInfoPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: validate code and submit updated info
    console.log({ name, phone, email, code });
  };

  return (
    <div id="mytask-layout">
      <div className="main p-2 py-3 p-xl-5" data-mytask="theme-indigo">
        <div className="body d-flex p-0 p-xl-5">
          <div className="container-xxl">
            <div className="row g-0">
              {/* Left Info Panel */}
              <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{ maxWidth: '25rem' }}>
                  <div className="text-center mb-5">
                    <svg width="4rem" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      <path fillRule="evenodd" d="M13 6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">Update Contact Information</h2>
                  </div>
                  <div className="text-center">
                    <img src={loginImg} alt="update contact" />
                  </div>
                </div>
              </div>

              {/* Change Contact Form Panel */}
              <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: '32rem' }}>
                  <form onSubmit={handleSubmit} className="row g-1 p-3 p-md-4">
                    <div className="col-12 text-center mb-4">
                      <img src={verifyImg} className="w240 mb-4" alt="Verify Code" />
                      <h1>Verify Your Email</h1>
                      <span>Enter the code sent to your email to update your contact info.</span>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Verification Code</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={code}
                          onChange={e => setCode(e.target.value)}
                          placeholder="Enter code"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="New full name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="New phone number"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="New email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 text-center mt-4">
                      <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">
                        UPDATE CONTACT INFO
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

export default ChangeContactInfoPage;
