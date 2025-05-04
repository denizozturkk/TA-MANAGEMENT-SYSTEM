import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <>
      

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
                    alt="User"
                    className="avatar rounded-circle me-3"
                    width="50"
                  />
                  <div className="w-100">
                    <p className="mb-1">
                      <strong>{notif.name}</strong> {notif.message}
                    </p>
                    <small className="text-muted">{notif.time}</small>
                    <br />
                    <button style={{color: "black"}} className="btn btn-sm btn-dark mt-2" onClick={() => goToDetail(notif.id)}>
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
    </>
  );
};

export default ViewNotificationPage;
