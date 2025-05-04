// src/people/TA/SwapProctor-TA.jsx
import React, { useState } from "react";
import LayoutTA from "./Layout-TA";

const SwapProctorTA = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      taskId: "Exam1",
      fromTA: "Bob",
      toTA: "You",
      date: "2025-04-20",
      reason: "Illness"
    }
  ]);

  const handleDecision = (id, decision) => {
    setRequests(
      requests.map(r =>
        r.id === id ? { ...r, decision } : r
      )
    );
  };

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Manage Swap Proctor Requests</h4>
          <table className="table table-hover align-middle mb-0 w-100">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Task ID</th>
                <th>From TA</th>
                <th>To TA</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No pending swap requests</td>
                </tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.taskId}</td>
                    <td>{r.fromTA}</td>
                    <td>{r.toTA}</td>
                    <td>{r.date}</td>
                    <td>{r.reason}</td>
                    <td>
                      {r.decision ? (
                        <span className={`badge bg-${r.decision === "accept" ? "success" : "danger"}`}>
                          {r.decision}
                        </span>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleDecision(r.id, "accept")}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDecision(r.id, "reject")}
                          >
                            Reject
                          </button>
                        </>
                      )}
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
