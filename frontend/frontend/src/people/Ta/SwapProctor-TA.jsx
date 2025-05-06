// src/people/TA/SwapProctorTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SwapProctorTA = () => {
  const taId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const hdrs = {
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`
  };

  // Data
  const [assignments, setAssignments] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [eligible, setEligible] = useState([]);

  // Modal state
  const [modal, setModal] = useState({ type: null, assignment: null });
  const [decisioningId, setDecisioningId] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

  // Load assignments and incoming requests
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Proctor assignments (assigned roles)
        const respA = await fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs });
        const allA = await respA.json();
        setAssignments(allA.filter(a => a.status === "ASSIGNED"));

        // 2) Incoming swap-requests
        const respR = await fetch(`${BASE}/swap-requests`, { headers: hdrs });
        const allR = await respR.json();
        const mine = allR.filter(r => r.targetTa?.id === parseInt(taId));
        setIncoming(mine);
      } catch (err) {
        console.error(err);
        alert("Failed to load swap data");
      }
    };
    loadData();
  }, [taId]);

  // Open modal for eligible targets or for decision
  const openModal = async (type, assignment) => {
    setModal({ type, assignment });
    if (type === "swap") {
      // fetch eligible targets
      const respE = await fetch(`${BASE}/swap-requests/eligible/${assignment.id}`, { headers: hdrs });
      const list = await respE.json();
      setEligible(list);
    }
  };
  const closeModal = () => setModal({ type: null, assignment: null });

  // Handle sending swap request
  const sendSwap = async () => {
    try {
      const { assignment } = modal;
      const res = await fetch(
        `${BASE}/swap-requests/send?originalId=${assignment.id}&targetId=${selectedTarget.id}&taId=${taId}`,
        { method: "POST", headers: hdrs }
      );
      if (!res.ok) throw new Error(await res.text());
      // remove assignment from eligible or modal
      closeModal();
      alert("Swap request sent");
    } catch (err) {
      alert("Failed to send swap: " + err.message);
    }
  };

  // Handle incoming decision
  const respondSwap = async (id, status) => {
    setDecisioningId(id);
    try {
      const res = await fetch(
        `${BASE}/swap-requests/${id}/respond?status=${status}`,
        { method: "PUT", headers: hdrs }
      );
      if (!res.ok) throw new Error(await res.text());
      // update incoming list
      setIncoming(curr => curr.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to " + status + ": " + err.message);
    } finally {
      setDecisioningId(null);
    }
  };

  return (
    <LayoutTA>
      <h4 className="fw-bold mb-4 text-primary">Swap Proctor</h4>

      {/* Section: My Assignments (send requests) */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>My Proctor Assignments</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Exam ID</th>
                <th>Classroom</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.examId}</td>
                  <td>{a.classroomId}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openModal("swap", a)}
                    >
                      Request Swap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Incoming Requests */}
      <div className="card">
        <div className="card-body">
          <h5>Incoming Swap Requests</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>From TA</th>
                <th>Original Task</th>
                <th>Date</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.fromTa?.name}</td>
                  <td>{r.originalId}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      disabled={decisioningId===r.id}
                      onClick={()=>respondSwap(r.id,"ACCEPTED")}
                    >Accept</button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={decisioningId===r.id}
                      onClick={()=>respondSwap(r.id,"REJECTED")}
                    >Reject</button>
                  </td>
                </tr>
              ))}
              {incoming.length===0 && (
                <tr><td colSpan="5" className="text-center">No incoming requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Swap Modal */}
      {modal.type==="swap" && (
        <div className="modal fade show d-block bg-secondary bg-opacity-25">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Swap Target</h5>
                <button className="btn-close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {eligible.map(t => (
                    <li key={t.id}
                      className={`list-group-item ${selectedTarget?.id===t.id? 'active':''}`}
                      onClick={()=>setSelectedTarget(t)}
                    >
                      {`ID ${t.id} — Exam ${t.examId} @ Classroom ${t.classroomId}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeModal}
                >Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={sendSwap}
                  disabled={!selectedTarget}
                >Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutTA>
  );
};

export default SwapProctorTA;
