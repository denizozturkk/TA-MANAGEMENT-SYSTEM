// src/people/User/UserHeader.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "../User/avatar3.jpg";
import logo from "./logobilkent.png";  // Bilkent logo in same folder

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

  fetch("http://localhost:8080/api/notifications/myBox", {
    headers: { Authorization: `Bearer ${token}` },
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
    <nav
      className="navbar border-bottom border-secondary py-3 px-4 px-md-5"
      style={{ backgroundColor: "#e9ecef" }}
    >
      <div
        className="container-xxl d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between"
        style={{ position: 'relative' }}
      >
        {/* Logo */}
        <div className="navbar-brand p-0">
          <img src={logo} alt="Bilkent Logo" height="80" />
        </div>

        {/* Desktop centered title */}
        <span
          className="d-none d-md-block"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#2D2A62',
            fontWeight: 'bold',
            fontSize: '1.75rem',
          }}
        >
          Bilkent TA Management System
        </span>

        {/* Controls (notifications + user) */}
        <div className="d-flex align-items-center">
          {/* Notification */}
          {/* Notification Icon */}
<Link to="/notification" className="text-dark position-relative me-3" style={{ fontSize: "1.5rem" }}>
  <i
    className={`icofont-alarm`}
    style={{
      color: notifications.some((n) => !n.read) ? "#2a2d62" : "#6c757d", // aktifse lacivert, değilse gri
      fontSize: "1.4rem"
    }}
  ></i>
  {notifications.filter((n) => !n.read).length > 0 && (
    <span
      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
      style={{
        backgroundColor: "#2a2d62",
        fontSize: "0.65rem",
        padding: "0.25em 0.4em"
      }}
    >
      {notifications.filter((n) => !n.read).length}
    </span>
  )}
</Link>



          {/* User dropdown + profile info always shown */}
          <div className="dropdown d-flex align-items-center">
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
                width="36"
                height="36"
                className="rounded-circle me-2"
              />
              <div className="text-start">
                <div className="fw-bold fs-6">{fullName}</div>
                <small className="text-muted">{displayRole}</small>
              </div>
            </a>
            <ul
              className="dropdown-menu shadow"
              aria-labelledby="userMenu"
              style={{ left: '50%', transform: 'translateX(-50%)', right: 'auto' }}
            >
              <li>
                <Link className="dropdown-item text-dark" to="/viewprofile">
                  <i className="icofont-user me-2"></i>View Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-dark" to="/changepassword">
                  <i className="icofont-lock me-2"></i>Change Password
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-dark" to="/changecontactinformation">
                  <i className="icofont-address-book me-2"></i>Update Contact
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-dark" to="/notification">
                  <i className="icofont-alarm me-2"></i>Notifications
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-dark" to="/givefeedback">
                  <i className="icofont-comment me-2"></i>Give Feedback
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-dark" onClick={handleLogout}>
                  <i className="icofont-logout me-2"></i>Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserHeader;
