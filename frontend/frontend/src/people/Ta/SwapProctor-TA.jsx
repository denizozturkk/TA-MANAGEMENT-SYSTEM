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

  const [assignments, setAssignments] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [eligible, setEligible] = useState([]);

  const [modal, setModal] = useState({ type: null, assignment: null });
  const [decisioningId, setDecisioningId] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const respA = await fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs });
        const allA = await respA.json();
        setAssignments(allA.filter(a => a.status === "ASSIGNED"));

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

  const openModal = async (type, assignment) => {
  setModal({ type, assignment });
  if (type === "swap") {
    try {
      const respE = await fetch(`${BASE}/swap-requests/eligible/${assignment.id}`, { headers: hdrs });
      const list = await respE.json();
      setEligible(Array.isArray(list) ? list : []); // 💡 güvenli tip kontrolü
    } catch (err) {
      console.error("Failed to load eligible TAs:", err);
      setEligible([]); // hata durumunda da boş array veriyoruz
    }
  }
};

  const closeModal = () => {
    setModal({ type: null, assignment: null });
    setSelectedTarget(null);
  };

  const sendSwap = async () => {
    try {
      const { assignment } = modal;
      const res = await fetch(
        `${BASE}/swap-requests/send?originalId=${assignment.id}&targetId=${selectedTarget.id}&taId=${taId}`,
        { method: "POST", headers: hdrs }
      );
      if (!res.ok) throw new Error(await res.text());
      closeModal();
      alert("Swap request sent");
    } catch (err) {
      alert("Failed to send swap: " + err.message);
    }
  };

  const respondSwap = async (id, status) => {
    setDecisioningId(id);
    try {
      const res = await fetch(
        `${BASE}/swap-requests/${id}/respond?status=${status}`,
        { method: "PUT", headers: hdrs }
      );
      if (!res.ok) throw new Error(await res.text());
      setIncoming(curr => curr.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to " + status + ": " + err.message);
    } finally {
      setDecisioningId(null);
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sidebar */}
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4 text-primary">Swap Proctor</h4>

        {/* My Assignments */}
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

        {/* Incoming Requests */}
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
                        disabled={decisioningId === r.id}
                        onClick={() => respondSwap(r.id, "ACCEPTED")}
                      >Accept</button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={decisioningId === r.id}
                        onClick={() => respondSwap(r.id, "REJECTED")}
                      >Reject</button>
                    </td>
                  </tr>
                ))}
                {incoming.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">No incoming requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Select Swap Target */}
        {modal.type === "swap" && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Swap Target</h5>
                  <button className="btn-close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  {eligible.length === 0 ? (
                    <p>No eligible proctors found for swapping.</p>
                  ) : (
                    <ul className="list-group">
                      {eligible.map(t => (
                        <li
                          key={t.id}
                          className={`list-group-item list-group-item-action ${selectedTarget?.id === t.id ? 'active' : ''}`}
                          onClick={() => setSelectedTarget(t)}
                          style={{ cursor: "pointer" }}
                        >
                          {`ID ${t.id} — Exam ${t.examId} @ Classroom ${t.classroomId}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={sendSwap} disabled={!selectedTarget}>
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapProctorTA;
