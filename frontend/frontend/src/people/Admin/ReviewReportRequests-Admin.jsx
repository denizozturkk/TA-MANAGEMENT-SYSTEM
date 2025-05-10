import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const ReviewReportRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api/admin";
  const hdrs = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${BASE}/report-requests`, {
      headers: { ...hdrs, Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(err => {
        console.error("Failed to fetch report requests:", err);
        alert("Unable to load report requests");
      });
  }, []);

  const handleApprove = id => {
    fetch(`${BASE}/report-requests/${id}/accept`, {
      method: "POST",
      headers: hdrs,
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setRequests(reqs =>
          reqs.map(r =>
            r.id === id ? { ...r, status: "APPROVED" } : r
          )
        );
      })
      .catch(err => {
        console.error("Approve failed:", err);
        alert("Could not approve request");
      });
  };

  const handleReject = id => {
    fetch(`${BASE}/report-requests/${id}/reject`, {
      method: "POST",
      headers: hdrs,
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setRequests(reqs =>
          reqs.map(r =>
            r.id === id ? { ...r, status: "REJECTED" } : r
          )
        );
      })
      .catch(err => {
        console.error("Reject failed:", err);
        alert("Could not reject request");
      });
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sidebar */}
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutAdmin />
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
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
                    {requests.length > 0 ? (
                      requests.map(r => (
                        <tr key={r.id}>
                          <td>{r.requesterFirstName} {r.requesterLastName}</td>
                          <td>{r.reportType}</td>
                          <td>
                            <span className={
                              r.status === "PENDING"
                                ? "badge bg-warning text-dark"
                                : r.status === "APPROVED"
                                  ? "badge bg-success"
                                  : "badge bg-danger"
                            }>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            {r.status === "PENDING" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success me-2"
                                  onClick={() => handleApprove(r.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleReject(r.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReportRequestsAdmin;
