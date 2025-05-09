// src/people/User/RecoverPasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forgotImg from '../User/forgot-password.svg';

import FacultyMemberLayout from '../FacultyMember/FacultyMemberLayout.jsx';
import CoordinatorLayout   from '../Coordinator/CoordinatorLayout.jsx';
import TALayout            from '../Ta/Layout-TA.jsx';
import DeanLayout          from '../Dean/Layout-Dean.jsx';
import AdminLayout         from '../Admin/Layout-Admin.jsx';
import DepartmentLayout    from "../DepartmentStaff/DepartmentStaffLayout.jsx";

// Basit JWT parse fonksiyonu
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

// Rol tabanlı sidebar sarmalayıcı
const RoleBasedLayout = ({ children }) => {
  const token   = localStorage.getItem('authToken');
  const payload = token ? parseJwt(token) : {};
  const userRole =
    (payload.authorities && payload.authorities[0]) ||
    localStorage.getItem('userRole') ||
    '';

  let Sidebar = null;
  switch (userRole) {
    case 'ROLE_FACULTY_MEMBER': Sidebar = FacultyMemberLayout; break;
    case 'ROLE_COORDINATOR':    Sidebar = CoordinatorLayout;   break;
    case 'ROLE_TA':             Sidebar = TALayout;             break;
    case 'ROLE_DEAN':           Sidebar = DeanLayout;           break;
    case 'ROLE_ADMIN':          Sidebar = AdminLayout;          break;
    case 'ROLE_DEPARTMENT_STAFF':          Sidebar = DepartmentLayout;          break;

    default:                    Sidebar = null;
  }

  return (
    <div className="d-flex">
      {Sidebar && <div style={{ width: '300px' }}><Sidebar /></div>}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const RecoverPasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPass,     setConfirmPass]     = useState('');
  const [errorMsg,        setErrorMsg]        = useState('');
  const [successMsg,      setSuccessMsg]      = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPass) {
      setErrorMsg('New pass and confirmation as not aligned.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMsg('You must be logged in.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/me/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Couldn\'t change password.');
      }

      setSuccessMsg('Changed pass successfully.');
      // istersen yönlendirme:
      // navigate('/viewprofile');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
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
                  <p>Enter your password and make a new password.</p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger">{errorMsg}</div>
                )}
                {successMsg && (
                  <div className="alert alert-success">{successMsg}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
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
