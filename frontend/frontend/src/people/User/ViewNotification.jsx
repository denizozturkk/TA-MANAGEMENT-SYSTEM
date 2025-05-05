// src/people/User/ViewNotificationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Layout imports
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout.jsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout.jsx";
import TALayout from "../Ta/Layout-TA.jsx";
import DeanLayout from "../Dean/Layout-Dean.jsx";
import AdminLayout from "../Admin/Layout-Admin.jsx";

// Basit JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// Role-based sidebar wrapper
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
      Sidebar = FacultyMemberLayout; break;
    case "ROLE_COORDINATOR":
      Sidebar = CoordinatorLayout; break;
    case "ROLE_TA":
      Sidebar = TALayout; break;
    case "ROLE_DEAN":
      Sidebar = DeanLayout; break;
    case "ROLE_ADMIN":
      Sidebar = AdminLayout; break;
    default:
      Sidebar = null;
  }

  return (
    <div className="d-flex">
      {Sidebar && <div style={{ width: "300px" }}><Sidebar /></div>}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const ViewNotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:8080/api/notifications/myBox", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load notifications");
        return res.json();
      })
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setNotifications([]);
      });
  }, []);

  const totalPages = Math.ceil(notifications.length / pageSize);
  const currentNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToDetail = id => navigate(`/notification/${id}`);

  return (
    <RoleBasedLayout>
      <div className="container-xxl py-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Notifications</h5>
          </div>
          <div className="card-body">
            {currentNotifications.length === 0 ? (
              <p className="text-center text-muted">No notifications to show.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {currentNotifications.map(notif => (
                  <li
                    key={notif.id}
                    onClick={() => goToDetail(notif.id)}
                    style={{ cursor: "pointer" }}
                    className="d-flex align-items-start mb-3 border-bottom pb-3"
                  >
                    <i className="icofont-bell me-3 fs-3 text-primary"></i>
                    <div className="w-100">
                      <p className="mb-1">{notif.message}</p>
                      <small className="text-muted">
                        {new Date(notif.timestamp).toLocaleString()}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ViewNotificationPage;
