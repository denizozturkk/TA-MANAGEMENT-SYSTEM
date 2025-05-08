// src/people/User/ViewProfile.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout.jsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout.jsx";
import TALayout from "../Ta/Layout-TA.jsx";
import DeanLayout from "../Dean/Layout-Dean.jsx";
import AdminLayout from "../Admin/Layout-Admin.jsx";
import avatarPlaceholder from "../User/avatar3.jpg"; // same as header

// Simple JWT parser
function parseJwt(token) {
  try { return JSON.parse(window.atob(token.split(".")[1])); }
  catch { return {}; }
}

// Responsive layout with role-based sidebar
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const role = (payload.authorities && payload.authorities[0]) || localStorage.getItem("userRole");

  let SidebarComponent = null;
  if (role === "ROLE_FACULTY_MEMBER") SidebarComponent = FacultyMemberLayout;
  else if (role === "ROLE_COORDINATOR") SidebarComponent = CoordinatorLayout;
  else if (role === "ROLE_TA") SidebarComponent = TALayout;
  else if (role === "ROLE_DEAN") SidebarComponent = DeanLayout;
  else if (role === "ROLE_ADMIN") SidebarComponent = AdminLayout;

  return (
    <>
      {/* Mobile: offcanvas toggle */}
      {SidebarComponent && (
        <button
          className="btn btn-link d-md-none position-fixed"
          style={{ top: "1rem", left: "1rem", zIndex: 1050 }}
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
        >
          <i className="icofont-navigation-menu fs-3 text-dark"></i>
        </button>
      )}
      {/* Mobile: offcanvas sidebar */}
      {SidebarComponent && (
        <div className="offcanvas offcanvas-start d-md-none text-light" style={{ backgroundColor: '#2D2A62', width: '300px' }} style={{ width: '240px', backgroundColor: '#2D2A62' }}
          tabIndex="-1"
          id="sidebarOffcanvas"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
          </div>
          <div className="offcanvas-body p-0">
            <SidebarComponent />
          </div>
        </div>
      )}

      <div className="d-flex">
        {/* Desktop sidebar */}
        {SidebarComponent && (
          <div className="d-none d-md-block" style={{ width: "300px" }}>
            <SidebarComponent />
          </div>
        )}
        {/* Main content */}
        <div className="flex-grow-1">
          {children}
        </div>
      </div>
    </>
  );
};

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(avatarPlaceholder);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then(data => {
        setUser(data);
        if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        else {
          const rand = Math.floor(Math.random() * 70) + 1;
          setAvatarUrl(data.avatarUrl);
        }
      })
      .catch(console.error);
  }, []);

  if (!user) {
    return (
      <RoleBasedLayout>
        <div className="container py-4 text-center">
          <p>Loading profile…</p>
        </div>
      </RoleBasedLayout>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const displayRole = user.role.replace(/^ROLE_/, "").replace(/_/g, " ");

  return (
    <RoleBasedLayout>
      <div className="container py-4">
        <h3 className="fw-bold mb-4 text-center text-md-start">My Profile</h3>
        <div className="card mx-auto w-100 w-sm-75 w-md-50" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center align-items-md-start mb-4">
              <img
                src={avatarPlaceholder}
                alt="avatar"
                className="rounded-circle mb-3"
                style={{ width: "40px", height: "40px" }}
              />
              <h5 className="fw-bold mb-1">{fullName}</h5>
              <small className="text-muted">{displayRole}</small>
            </div>
            <dl className="row">
              <dt className="col-4 col-md-3">Email</dt>
              <dd className="col-8 col-md-9">{user.email}</dd>
              <dt className="col-4 col-md-3">Phone</dt>
              <dd className="col-8 col-md-9">{user.phoneNumber}</dd>
            </dl>
            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-2 mt-4">
              <Link to="/changecontactinformation" className="btn btn-outline-primary flex-grow-1 flex-sm-grow-0">
                Edit Contact Info
              </Link>
              <Link to="/changepassword" className="btn btn-outline-primary flex-grow-1 flex-sm-grow-0">
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ViewProfile;
