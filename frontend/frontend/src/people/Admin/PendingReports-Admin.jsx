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
        const res = await fetch("/api/admin/report-requests");
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
      await fetch(`/api/admin/report-requests/${report.id}/accept`, {
        method: "POST",
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
          <h4 className="fw-bold mb-4 text-primary">
            Pending Report Requests
          </h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Requester</th>
                <th>Requested On</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td className="text-capitalize">{r.type}</td>
                  <td>{r.requester}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
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
