// src/people/TA/SwapProctor-TA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SwapProctorTA = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisioningId, setDecisioningId] = useState(null);

  useEffect(() => {
    // Replace with however you get the current TA’s ID
    const taId = /* e.g. from context or props */ 123;

    fetch("/api/swap-requests")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch swap requests");
        return res.json();
      })
      .then((all) => {
        // Show only the ones addressed to this TA
        const mine = all.filter((r) => r.toTa?.id === taId);
        setRequests(mine);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading swap requests");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = async (id, decision) => {
    setDecisioningId(id);
    try {
      // decision is "accept" or "reject"
      await fetch(`/api/swap-requests/${id}/${decision}`, {
        method: "POST",
      });
      // remove from list
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(`Failed to ${decision} request`);
    } finally {
      setDecisioningId(null);
    }
  };

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading swap requests…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Manage Swap Proctor Requests
          </h4>
          <table className="table table-hover align-middle mb-0 w-100">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Task ID</th>
                <th>From TA</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No pending swap requests
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.taskId}</td>
                    <td>{r.fromTa?.name}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.reason}</td>
                    <td>
                      {r.decision ? (
                        <span
                          className={`badge bg-${
                            r.decision === "accept" ? "success" : "danger"
                          }`}
                        >
                          {r.decision}
                        </span>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            disabled={decisioningId === r.id}
                            onClick={() => handleDecision(r.id, "accept")}
                          >
                            {decisioningId === r.id ? "..." : "Accept"}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            disabled={decisioningId === r.id}
                            onClick={() => handleDecision(r.id, "reject")}
                          >
                            {decisioningId === r.id ? "..." : "Reject"}
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
