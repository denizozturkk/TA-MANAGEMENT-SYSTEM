// src/people/User/ChangeContactInfoPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import verifyImg from '../User/forgot-password.svg'; // or another appropriate image

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

// Wraps children in the role-specific sidebar layout
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

const ChangeContactInfoPage = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ code, name, phone, email });
    // TODO: validate code and submit updated info
  };

  return (
    <RoleBasedLayout>
      <div className="container-xxl py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 text-center">
                <img src={verifyImg} alt="Verify Code" className="mb-4" style={{ width: '100px' }} />
                <h3 className="mb-2">Verify Your Email</h3>
                <p className="text-muted mb-4">
                  Enter the code sent to your email to update your contact information.
                </p>
                <form onSubmit={handleSubmit} className="text-start">
                  <div className="mb-3">
                    <label className="form-label">Verification Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
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
                    <button type="submit" className="btn btn-primary">
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
