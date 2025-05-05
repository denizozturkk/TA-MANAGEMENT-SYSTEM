// src/people/User/RecoverPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImg from '../User/login-img.svg';
import forgotImg from '../User/forgot-password.svg';

import FacultyMemberLayout from '../FacultyMember/FacultyMemberLayout.jsx';
import CoordinatorLayout from '../Coordinator/CoordinatorLayout.jsx';
import TALayout from '../Ta/Layout-TA.jsx';
import DeanLayout from '../Dean/Layout-Dean.jsx';
import AdminLayout from '../Admin/Layout-Admin.jsx';

// Simple JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

// Wraps children in the correct sidebar based on role
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const payload = token ? parseJwt(token) : {};
  const userRole =
    (payload.authorities && payload.authorities[0]) ||
    localStorage.getItem('userRole') ||
    '';

  let Sidebar = null;
  switch (userRole) {
    case 'ROLE_FACULTY_MEMBER':
      Sidebar = FacultyMemberLayout;
      break;
    case 'ROLE_COORDINATOR':
      Sidebar = CoordinatorLayout;
      break;
    case 'ROLE_TA':
      Sidebar = TALayout;
      break;
    case 'ROLE_DEAN':
      Sidebar = DeanLayout;
      break;
    case 'ROLE_ADMIN':
      Sidebar = AdminLayout;
      break;
    default:
      Sidebar = null;
  }

  return (
    <div className="d-flex">
      {Sidebar && (
        <div style={{ width: '300px' }}>
          <Sidebar />
        </div>
      )}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const RecoverPasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log({ oldPassword, newPassword });
    // TODO: submit oldPassword and newPassword for update
  };

  return (
    <RoleBasedLayout>
      <div id="mytask-layout">
        <div className="main p-2 py-3 p-xl-5" data-mytask="theme-indigo">
          <div className="body d-flex p-0 p-xl-5">
            <div className="container-xxl">
              <div className="row g-0">
                {/* Left Info Panel */}
                <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                  <div style={{ maxWidth: '25rem' }}>
                    <div className="text-center mb-5">
                      <svg
                        width="4rem"
                        fill="currentColor"
                        className="bi bi-clipboard-check"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                        />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                      </svg>
                    </div>
                    <div className="mb-5">
                      <h2 className="color-900 text-center">
                        My-Task Let&apos;s Management Better
                      </h2>
                    </div>
                    <div className="text-center">
                      <img src={loginImg} alt="login visual" />
                    </div>
                  </div>
                </div>

                {/* Recover Password Form Panel */}
                <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                  <div
                    className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
                    style={{ maxWidth: '32rem' }}
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="row g-1 p-3 p-md-4"
                    >
                      <div className="col-12 text-center mb-4">
                        <img
                          src={forgotImg}
                          className="w240 mb-4"
                          alt="Change Password"
                        />
                        <h1>Change Password</h1>
                        <span>
                          Enter your current password and create a new one.
                        </span>
                      </div>
                      <div className="col-12">
                        <div className="mb-2">
                          <label className="form-label">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                          />
                          <div className="mt-1">
                            <a
                              href="/auth-password-reset.html"
                              className="text-secondary small"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-2">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-2">
                          <label className="form-label">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm password"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12 text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-lg btn-block btn-light lift text-uppercase"
                        >
                          UPDATE PASSWORD
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
    </RoleBasedLayout>
  );
};

export default RecoverPasswordPage;
