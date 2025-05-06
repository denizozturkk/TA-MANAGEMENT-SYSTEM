// src/people/Admin/PendingReports-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const PendingReportsAdmin = () => {
  const [pending,  setPending]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [actionId, setActionId] = useState(null);
  const token = localStorage.getItem("authToken");

  // 1. Fetch pending on mount
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/admin/report-requests",
          {
            headers: {
              "Accept":        "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || res.status);
        }
        const data = await res.json();
        setPending(data);
      } catch (err) {
        console.error("Error loading pending reports:", err);
        alert("Error loading pending reports");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [token]);

  // 2. Accept a report
  const acceptReport = async (reportId) => {
    setActionId(reportId);
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/report-requests/${reportId}/accept`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || res.status);
      }
      // Remove it from the list
      setPending((p) => p.filter((r) => r.id !== reportId));
      alert(`✅ Report #${reportId} accepted.`);
    } catch (err) {
      console.error(`Failed to accept report #${reportId}:`, err);
      alert("❌ Failed to accept report.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <LayoutAdmin>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Pending Report Requests
          </h4>

          {loading ? (
            <p>Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-muted">No pending reports.</p>
          ) : (
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
                    <td>
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td>{r.details}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        disabled={actionId === r.id}
                        onClick={() => acceptReport(r.id)}
                      >
                        {actionId === r.id ? "Accepting…" : "Accept"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default PendingReportsAdmin;
