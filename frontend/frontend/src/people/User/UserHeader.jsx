// src/people/User/UserHeader.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "../User/avatar3.jpg";

// Basit JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

const UserHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const fullName = payload.fullName || payload.username || payload.sub || "User";
  const rawRole =
    (payload.authorities && payload.authorities[0]) || localStorage.getItem("userRole") || "";
  const displayRole = rawRole.replace(/^ROLE_/, "").replace(/_/g, " ");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  return (
    <div className="header bg-light">
      <nav className="navbar py-3">
        <div className="container-xxl d-flex justify-content-between align-items-center">

          {/* Solda logo/ana sayfa */}
          <Link to="/" className="navbar-brand text-dark">
            Bilkent TA Management System
          </Link>

          {/* Sağ: bildirim + kullanıcı */}
          <div className="d-flex align-items-center">

            {/* Ana bildirim butonu (bell) */}
            <div className="me-3 position-relative">
              <Link to="/notification" className="text-dark">
                <i className="icofont-bell fs-5 text-dark"></i>
              </Link>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Kullanıcı menüsü */}
            <div className="dropdown">
              <a
                className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
                href="#!"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={payload.avatarUrl || avatarPlaceholder}
                  alt="avatar"
                  width="32"
                  height="32"
                  className="rounded-circle me-2"
                />
                <div className="text-end">
                  <div className="fw-bold">{fullName}</div>
                  <small>{displayRole}</small>
                </div>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="userMenu"
              >
                <li>
                  <Link className="dropdown-item text-dark" to="/viewprofile">
                    <i className="icofont-user me-2 text-dark"></i>View Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item text-dark" to="/changepassword">
                    <i className="icofont-lock me-2 text-dark"></i>Change Password
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item text-dark" to="/changecontactinformation">
                    <i className="icofont-address-book me-2 text-dark"></i>Update Contact
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item text-dark" to="/notification">
                    <i className="icofont-bell me-2 text-dark"></i>Notifications
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item text-dark" to="/givefeedback">
                    <i className="icofont-comment me-2 text-dark"></i>Give Feedback
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-dark" onClick={handleLogout}>
                    <i className="icofont-logout me-2 text-dark"></i>Sign Out
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserHeader;
