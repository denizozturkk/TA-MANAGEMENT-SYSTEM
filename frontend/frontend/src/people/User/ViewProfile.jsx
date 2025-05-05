// src/people/User/ClientProfile.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout.jsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout.jsx";
import TALayout from "../Ta/Layout-TA.jsx";
import DeanLayout from "../Dean/Layout-Dean.jsx";
import AdminLayout from "../Admin/Layout-Admin.jsx";

// Simple JWT parser to extract role
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// Wraps content in the correct sidebar based on user role
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const userRole =
    (payload.authorities && payload.authorities[0]) ||
    localStorage.getItem("userRole") ||
    "";

  let Sidebar = null;
  switch (userRole) {
    case "ROLE_FACULTY_MEMBER":
      Sidebar = FacultyMemberLayout;
      break;
    case "ROLE_COORDINATOR":
      Sidebar = CoordinatorLayout;
      break;
    case "ROLE_TA":
      Sidebar = TALayout;
      break;
    case "ROLE_DEAN":
      Sidebar = DeanLayout;
      break;
    case "ROLE_ADMIN":
      Sidebar = AdminLayout;
      break;
    default:
      Sidebar = null;
  }

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

const ClientProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
      });
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
  const roleDisplay = user.role.replace(/^ROLE_/, "").replace(/_/g, " ");

  return (
    <RoleBasedLayout>
      <div className="container py-4">
        <div
          className="card teacher-card mb-3 mx-auto shadow-sm"
          style={{ maxWidth: "600px" }}
        >
          <div className="card-body teacher-fulldeatil">
            {/* Avatar & Name */}
            <div className="text-center mb-4">
              <img
                src={user.photoURL || "/assets/images/lg/avatar3.jpg"}
                alt={fullName}
                className="avatar xl rounded-circle img-thumbnail shadow-sm"
              />
              <div className="mt-3">
                <h5 className="fw-bold mb-0">{fullName}</h5>
                <span className="text-muted small">{roleDisplay}</span>
              </div>
            </div>

            {/* Info Section */}
            <div className="teacher-info w-100 px-3">
              <div className="mb-2">
                <strong className="text-muted d-block">Phone</strong>
                <span>{user.phoneNumber}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted d-block">Email</strong>
                <span>{user.email}</span>
              </div>
              {/* Optional fields if your API provides them */}
              {user.birthDate && (
                <div className="mb-2">
                  <strong className="text-muted d-block">Birth Date</strong>
                  <span>{user.birthDate}</span>
                </div>
              )}
              {user.address && (
                <div className="mb-2">
                  <strong className="text-muted d-block">Address</strong>
                  <span>{user.address}</span>
                </div>
              )}

              {/* About */}
              {user.about && (
                <div className="mt-3">
                  <strong className="text-muted d-block">About</strong>
                  <p className="small mb-0">{user.about}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 d-flex flex-column flex-md-row justify-content-center gap-2">
                <button className="btn btn-outline-dark w-100 w-md-auto">
                  Change Contact Information
                </button>
                <button className="btn btn-outline-dark w-100 w-md-auto">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ClientProfile;
