// src/people/Admin/ReviewReportRequests-Admin.jsx
import React, { useState } from "react";
import LayoutAdmin from "./Layout-Admin";

const ReviewReportRequestsAdmin = () => {
  const [requests, setRequests] = useState([
    { id: 1, from: "Dean Smith", type: "Login Reports", status: "Pending" },
    { id: 2, from: "Dean Lee",   type: "Swap Reports",  status: "Pending" }
  ]);

  const handleDecision = (id, decision) => {
    setRequests(reqs =>
      reqs.map(r =>
        r.id === id ? { ...r, status: decision } : r
      )
    );
  };

  return (
    <LayoutAdmin>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Review Report Requests</h4>
          <table className="table table-hover align-middle w-100">
            <thead>
              <tr>
                <th>From</th>
                <th>Report Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.from}</td>
                  <td>{r.type}</td>
                  <td>
                    <span
                      className={
                        r.status === "Pending"
                          ? "badge bg-warning text-dark"
                          : r.status === "Accepted"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleDecision(r.id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDecision(r.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No report requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default ReviewReportRequestsAdmin;
