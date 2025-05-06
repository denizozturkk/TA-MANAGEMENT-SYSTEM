// src/people/Admin/PendingReports-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const PendingReportsAdmin = () => {
  const [pending, setPending] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Load pending report requests
  useEffect(() => {
    const loadPending = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8080/api/admin/report-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch pending");
        const data = await res.json();
        setPending(data);
      } catch (err) {
        console.error(err);
        alert("Error loading pending reports");
      }
    };
    loadPending();
  }, []);

  const acceptAndSend = async (report) => {
    setLoadingId(report.id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/admin/report-requests/${report.id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPending((prev) => prev.filter((r) => r.id !== report.id));
      alert(`✅ Report #${report.id} accepted.`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to accept report.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <LayoutAdmin>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Pending Report Requests</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Requester</th>
                <th>Requested On</th>
                <th>Details</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td className="text-capitalize">{r.reportType}</td>
                  <td>{r.requesterId}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.details}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      disabled={loadingId === r.id}
                      onClick={() => acceptAndSend(r)}
                    >
                      {loadingId === r.id ? "..." : "Accept"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pending.length === 0 && (
            <p className="text-muted">No pending reports.</p>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default PendingReportsAdmin;
