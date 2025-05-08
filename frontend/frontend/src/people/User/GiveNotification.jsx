// src/people/User/SubmitFeedback.jsx
import React, { useState } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout.jsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout.jsx";
import TALayout from "../Ta/Layout-TA.jsx";
import DeanLayout from "../Dean/Layout-Dean.jsx";
import AdminLayout from "../Admin/Layout-Admin.jsx";


// Simple JWT parser to extract user role
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// Wraps children in the correct sidebar layout based on role
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
      {Sidebar && <div style={{ width: "300px" }}><Sidebar /></div>}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const SubmitFeedback = () => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", text: "" });
  const token = localStorage.getItem("authToken");
  const BASE  = "http://localhost:8080/api/feedback";

  const handleSubmit = async e => {
    e.preventDefault();
    if (!message.trim()) {
      setToast({ show: true, type: "danger", text: "Feedback cannot be empty." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (res.status === 201) {
        setToast({ show: true, type: "success", text: "Thank you for your feedback!" });
        setMessage("");
      } else if (res.status === 403) {
        setToast({ show: true, type: "warning", text: "You must be logged in to send feedback." });
      } else {
        throw new Error(`Server responded ${res.status}`);
      }
    } catch (err) {
      console.error("Feedback error:", err);
      setToast({ show: true, type: "danger", text: "Failed to submit feedback." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
    }
  };

  return (
    <RoleBasedLayout>
      <div className="container py-5">
        {toast.show && (
          <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3`}>
            {toast.text}
            <button type="button" className="btn-close float-end"
              onClick={() => setToast(t => ({ ...t, show: false }))} />
          </div>
        )}
        <div className="card mx-auto" style={{ maxWidth: 600 }}>
          <div className="card-body">
            <h4 className="card-title mb-4">Submit Feedback</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="feedbackMessage" className="form-label">
                  Your Feedback
                </label>
                <textarea
                  id="feedbackMessage"
                  className="form-control"
                  rows="5"
                  maxLength={2000}
                  placeholder="Let us know what you think…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  disabled={submitting}
                />
                <div className="form-text">
                  {message.length} / 2000 characters
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >
                {submitting
                  ? <span className="spinner-border spinner-border-sm me-2" />
                  : <i className="bi bi-envelope-fill me-2" />}
                Send Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default SubmitFeedback;
