// src/people/User/ViewNotificationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Layout imports (dosya adlarına göre)
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

// RoleBasedLayout bileşeni
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

const notifications = [
  { id: 1, name: "John Doe", message: "sent you a task update", time: "5 minutes ago", img: "https://i.pravatar.cc/150?img=16" },
  { id: 2, name: "Lucas Baker", message: "commented on your project", time: "1 hour ago", img: "https://i.pravatar.cc/150?img=17" },
  { id: 3, name: "Una Coleman", message: "shared a document", time: "2 hours ago", img: "https://i.pravatar.cc/150?img=18" },
  { id: 4, name: "Rachel Carr", message: "approved your request", time: "3 hours ago", img: "https://i.pravatar.cc/150?img=19" },
  { id: 5, name: "Emre Uçar", message: "updated profile information", time: "Today", img: "https://i.pravatar.cc/150?img=20" },
  { id: 6, name: "Barkın Baydar", message: "replied to your comment", time: "Yesterday", img: "https://i.pravatar.cc/150?img=21" },
  { id: 7, name: "Deniz Öztürk", message: "added you to a group", time: "2 days ago", img: "https://i.pravatar.cc/150?img=22" },
  { id: 8, name: "Cankutay Dündar", message: "removed a task", time: "Last week", img: "https://i.pravatar.cc/150?img=23" }
];

const ViewNotificationPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(notifications.length / pageSize);
  const currentNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToDetail = (id) => {
    navigate(`/notification/${id}`);
  };

  return (
    <RoleBasedLayout>
      <div className="container-xxl py-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Notifications</h5>
          </div>
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              {currentNotifications.map((notif) => (
                <li key={notif.id} className="d-flex align-items-start mb-3 border-bottom pb-3">
                  <img
                    src={notif.img}
                    alt={notif.name}
                    className="avatar rounded-circle me-3"
                    width="50"
                  />
                  <div className="w-100">
                    <p className="mb-1">
                      <strong>{notif.name}</strong> {notif.message}
                    </p>
                    <small className="text-muted">{notif.time}</small>
                    <br />
                    <button
                      className="btn btn-sm btn-dark mt-2"
                      onClick={() => goToDetail(notif.id)}
                    >
                      Detaylara Bak
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Önceki
              </button>
              <span>Sayfa {currentPage} / {totalPages}</span>
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default ViewNotificationPage;
