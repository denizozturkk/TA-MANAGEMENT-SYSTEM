// src/people/User/RecoverPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forgotImg from '../User/forgot-password.svg';

import FacultyMemberLayout from '../FacultyMember/FacultyMemberLayout.jsx';
import CoordinatorLayout from '../Coordinator/CoordinatorLayout.jsx';
import TALayout from '../Ta/Layout-TA.jsx';
import DeanLayout from '../Dean/Layout-Dean.jsx';
import AdminLayout from '../Admin/Layout-Admin.jsx';

// Simple JWT parser to extract role
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

// Role-based sidebar wrapper
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
      {Sidebar && <div style={{ width: '300px' }}><Sidebar /></div>}
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
    // TODO: call API to update password
  };

  return (
    <RoleBasedLayout>
      <div className="container-xxl py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <img
                    src={forgotImg}
                    className="w-50 mb-3"
                    alt="Change Password"
                  />
                  <h3>Change Password</h3>
                  <p>Enter your current password and create a new one.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default RecoverPasswordPage;
