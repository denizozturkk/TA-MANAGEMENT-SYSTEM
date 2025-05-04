import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Aynı dummy veri kaynağını burada da kullanıyoruz (gerçek kullanımda API'den çekebilirsin)
const notifications = [
  { id: 1, name: "John Doe", message: "sent you a task update", time: "5 minutes ago", img: "https://i.pravatar.cc/150?img=16", content: "You have a new task assigned by John Doe." },
  { id: 2, name: "Lucas Baker", message: "commented on your project", time: "1 hour ago", img: "https://i.pravatar.cc/150?img=17", content: "Lucas Baker left a comment: 'Looks great!'" },
  { id: 3, name: "Una Coleman", message: "shared a document", time: "2 hours ago", img: "https://i.pravatar.cc/150?img=18", content: "Una Coleman shared 'report.pdf' with you." },
  { id: 4, name: "Rachel Carr", message: "approved your request", time: "3 hours ago", img: "https://i.pravatar.cc/150?img=19", content: "Your time-off request has been approved." },
  { id: 5, name: "Emre Uçar", message: "updated profile information", time: "Today", img: "https://i.pravatar.cc/150?img=20", content: "Emre Uçar has updated their contact info." },
  { id: 6, name: "Barkın Baydar", message: "replied to your comment", time: "Yesterday", img: "https://i.pravatar.cc/150?img=21", content: "Barkın replied: 'Thanks for the clarification.'" },
  { id: 7, name: "Deniz Öztürk", message: "added you to a group", time: "2 days ago", img: "https://i.pravatar.cc/150?img=22", content: "You have been added to the CS315 project group." },
  { id: 8, name: "Cankutay Dündar", message: "removed a task", time: "Last week", img: "https://i.pravatar.cc/150?img=23", content: "Task 'Lecture Slides Update' was removed." },
];

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const notification = notifications.find((n) => n.id === parseInt(id));

  if (!notification) {
    return (
      <div className="container py-5">
        <h3 className="text-danger">Bildirim bulunamadı</h3>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <img
              src={notification.img}
              alt={notification.name}
              className="avatar xl rounded-circle me-3"
              width="60"
            />
            <div>
              <h5 className="mb-0">{notification.name}</h5>
              <small className="text-muted">{notification.time}</small>
            </div>
          </div>
          <h6 className="fw-bold">Mesaj</h6>
          <p>{notification.message}</p>

          <h6 className="fw-bold mt-4">Detay İçerik</h6>
          <p>{notification.content}</p>

          <button className="btn btn-dark mt-4" onClick={() => navigate(-1)}>← Bildirim Listesine Dön</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
