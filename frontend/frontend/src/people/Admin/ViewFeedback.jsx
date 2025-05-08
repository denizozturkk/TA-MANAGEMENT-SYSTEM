// src/people/Admin/ViewFeedbackAdmin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const ViewFeedbackAdmin = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api/feedback";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(BASE, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        setFeedback(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load feedback:", err);
        alert("Unable to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [token]);

  const formatDate = (ts) => (ts ? new Date(ts).toLocaleString() : "—");

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sol Sidebar */}
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutAdmin />
      </div>

      {/* Sağ İçerik */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-4 text-primary">User Feedback</h4>

                {loading ? (
                  <p>Loading…</p>
                ) : feedback.length === 0 ? (
                  <p className="text-muted">No feedback submitted yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Sender Email</th>
                          <th>Message</th>
                          <th>Submitted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedback.map((fb) => (
                          <tr key={fb.id}>
                            <td>{fb.senderEmail}</td>
                            <td
                              style={{
                                maxWidth: 400,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                              }}
                            >
                              {fb.message}
                            </td>
                            <td>{formatDate(fb.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFeedbackAdmin;
