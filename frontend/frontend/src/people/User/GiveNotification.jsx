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
      {Sidebar && (
        <div style={{ width: "300px" }}>
          <Sidebar />
        </div>
      )}
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

const SubmitFeedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, rating }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Feedback submitted!");
        setMessage("");
        setRating(0);
      });
  };

  return (
    <RoleBasedLayout>
      <div className="container mt-5">
        <h4 className="fw-bold mb-4">Submit Feedback</h4>
        <form onSubmit={handleSubmit}>
          {/* Rating input */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Rate your experience (1-5):
            </label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              <option value="">-- Select Rating --</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback textarea */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Your Feedback</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Write your feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg btn-block btn-light lift text-uppercase"
          >
            Send
          </button>
        </form>
      </div>
    </RoleBasedLayout>
  );
};

export default SubmitFeedback;
