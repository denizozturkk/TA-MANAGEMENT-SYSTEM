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
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// Pick the right sidebar
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const role =
    (payload.authorities && payload.authorities[0]) ||
    localStorage.getItem("userRole");

  let Sidebar = null;
  if (role === "ROLE_FACULTY_MEMBER") Sidebar = FacultyMemberLayout;
  else if (role === "ROLE_COORDINATOR") Sidebar = CoordinatorLayout;
  else if (role === "ROLE_TA") Sidebar = TALayout;
  else if (role === "ROLE_DEAN") Sidebar = DeanLayout;
  else if (role === "ROLE_ADMIN") Sidebar = AdminLayout;

  return (
    <div className="d-flex">
      {Sidebar && (
        <div style={{ width: "300px" }}>
          <Sidebar />
        </div>
      )}
      <div className="flex-grow-1">{children}</div>
    </div>
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
      .then((res) => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then((data) => {
        setUser(data);

        // avatar logic: user.photoURL → random pravatar → placeholder
        if (data.photoURL) {
          setAvatarUrl(data.photoURL);
        } else {
          const rand = Math.floor(Math.random() * 70) + 1;
          setAvatarUrl(`https://i.pravatar.cc/150?img=${rand}`);
        }
      })
      .catch(console.error);
  }, []);

  if (!user) {
    return (
      <RoleBasedLayout>
        <div className="container py-4">
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
        <h3 className="fw-bold mb-4">My Profile</h3>
        <div className="card mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <div className="text-center mb-4">
              <img
                                src={user.avatarUrl || avatarPlaceholder}
                                alt="avatar"
                                width="32"
                                height="32"
                                className="rounded-circle me-2"
                              />
              <h5 className="mt-3">{fullName}</h5>
              <small className="text-muted">{displayRole}</small>
            </div>
            <dl className="row">
              <dt className="col-sm-4">Email</dt>
              <dd className="col-sm-8">{user.email}</dd>
              <dt className="col-sm-4">Phone</dt>
              <dd className="col-sm-8">{user.phoneNumber}</dd>
            </dl>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/changecontactinformation" className="btn btn-outline-primary">
                Edit Contact Info
              </Link>
              <Link to="/changepassword" className="btn btn-outline-primary">
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
