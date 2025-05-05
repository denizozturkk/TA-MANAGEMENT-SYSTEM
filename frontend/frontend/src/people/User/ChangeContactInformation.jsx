// src/people/User/ChangeContactInfoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import verifyImg from '../User/forgot-password.svg';

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

// Wraps content in the correct sidebar based on role
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem('authToken');
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
    default:                    Sidebar = null;
  }

  return (
    <div className="d-flex">
      {Sidebar && <div style={{ width: '300px' }}><Sidebar /></div>}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const ChangeContactInfoPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phoneNumber, setPhone]   = useState('');
  const [email, setEmail]         = useState('');
  const [errorMsg, setErrorMsg]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    fetch('http://localhost:8080/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Cannot fetch profile');
        return res.json();
      })
      .then(data => {
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setPhone(data.phoneNumber || '');
        setEmail(data.email || '');
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMsg('Not authenticated');
      return;
    }

    fetch('http://localhost:8080/api/users/me/contact', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, phoneNumber, email }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        setSuccessMsg('Contact information updated successfully.');
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(err.message);
      });
  };

  return (
    <RoleBasedLayout>
      <div className="container-xxl py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 text-center">
                <img
                  src={verifyImg}
                  alt="Verify Code"
                  className="mb-4"
                  style={{ width: '100px' }}
                />
                <h3 className="mb-2">Update Contact Information</h3>
                <p className="text-muted mb-4">
                  Modify your name, phone number, or email below.
                </p>

                {errorMsg && (
                  <div className="alert alert-danger">{errorMsg}</div>
                )}
                {successMsg && (
                  <div className="alert alert-success">{successMsg}</div>
                )}

                <form onSubmit={handleSubmit} className="text-start">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phoneNumber}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Update Contact Info
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

export default ChangeContactInfoPage;
