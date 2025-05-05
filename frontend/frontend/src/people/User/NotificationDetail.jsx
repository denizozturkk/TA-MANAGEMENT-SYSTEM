// src/people/User/NotificationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Layout imports
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout.jsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout.jsx";
import TALayout from "../Ta/Layout-TA.jsx";
import DeanLayout from "../Dean/Layout-Dean.jsx";
import AdminLayout from "../Admin/Layout-Admin.jsx";

// Simple JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// Role-based sidebar wrapper (unchanged)
const RoleBasedLayout = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const role =
    (payload.authorities && payload.authorities[0]) ||
    localStorage.getItem("userRole") ||
    "";

  let Sidebar = null;
  switch (role) {
    case "ROLE_FACULTY_MEMBER": Sidebar = FacultyMemberLayout; break;
    case "ROLE_COORDINATOR":    Sidebar = CoordinatorLayout;   break;
    case "ROLE_TA":             Sidebar = TALayout;             break;
    case "ROLE_DEAN":           Sidebar = DeanLayout;           break;
    case "ROLE_ADMIN":          Sidebar = AdminLayout;          break;
    default:                    Sidebar = null;
  }

  return (
    <div className="d-flex">
      {Sidebar && <div style={{ width: "300px" }}><Sidebar /></div>}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/notifications/myBox", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load notifications");
        return res.json();
      })
      .then(data => {
        // find the single one matching :id
        const found = data.find(n => String(n.id) === id);
        if (!found) {
          setError(`Notification #${id} not found`);
        } else {
          setNotif(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="container py-5">
          <p>Loading…</p>
        </div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="container py-5">
        {error ? (
          <>
            <h3 className="text-danger">{error}</h3>
            <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
              ← Back to Notifications
            </button>
          </>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <i className="icofont-bell fs-1 text-primary me-3"></i>
                <div>
                  <h5 className="mb-0">Notification #{notif.id}</h5>
                  <small className="text-muted">
                    {new Date(notif.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>

              <h6 className="fw-bold">Message</h6>
              <p>{notif.message}</p>

              <h6 className="fw-bold mt-4">Read Status</h6>
              <p>{notif.read ? "Read" : "Unread"}</p>

              <button className="btn btn-dark mt-4" onClick={() => navigate(-1)}>
                ← Back to Notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default NotificationDetail;
