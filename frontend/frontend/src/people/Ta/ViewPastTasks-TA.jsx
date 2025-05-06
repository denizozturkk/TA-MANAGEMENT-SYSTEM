// src/people/TA/SwapProctor-TA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

// JWT parser to extract payload
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

const SwapProctorTA = () => {
  const [pending, setPending] = useState([]);
  const [past, setPast] = useState([]);
  const [loginTAId, setLoginTAId] = useState(null);

  useEffect(() => {
    // Determine logged-in TA's ID
    const token = localStorage.getItem("authToken");
    const payload = token ? parseJwt(token) : {};
    const taId = payload.id || parseInt(localStorage.getItem("userId"));
    setLoginTAId(taId);

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Fetch all duties for this TA, then filter pending
    fetch(`http://localhost:8080/api/duty-logs/ta/${taId}`, { headers })
      .then(res => res.json())
      .then(list => {
        const pend = Array.isArray(list) ? list.filter(dl => dl.status === "PENDING") : [];
        setPending(pend);
      })
      .catch(console.error);

    // Fetch past duties (only APPROVED)
    fetch(`http://localhost:8080/api/duty-logs/ta/${taId}`, { headers })
      .then(res => res.json())
      .then(list => {
        const approvedOnly = Array.isArray(list) ? list.filter(dl => dl.status === "APPROVED") : [];
        setPast(approvedOnly);
      })
      .catch(console.error);
  }, []);

  return (
    <LayoutTA>
      {/* Pending Duties */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-primary">Pending Duties</h4>
          <table className="table table-hover align-middle mb-0 w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Start Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No pending duties</td>
                </tr>
              ) : (
                pending.map(dl => (
                  <tr key={dl.id}>
                    <td>{dl.id}</td>
                    <td>{dl.taskType}</td>
                    <td>{new Date(dl.startTime).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-warning text-dark">{dl.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Duties (APPROVED only) */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-secondary">Past Duties (Approved)</h4>
          <table className="table table-striped align-middle mb-0 w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Start Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {past.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No approved duties</td>
                </tr>
              ) : (
                past.map(dl => (
                  <tr key={dl.id}>
                    <td>{dl.id}</td>
                    <td>{dl.taskType}</td>
                    <td>{new Date(dl.startTime).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-success">{dl.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutTA>
  );
};

export default SwapProctorTA;
