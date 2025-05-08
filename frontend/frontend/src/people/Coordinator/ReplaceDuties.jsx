import React, { useEffect, useState } from "react";
import CoordinatorLayout from "./CoordinatorLayout"; // adjust path as needed

const ViewDutySwap = () => {
  const [dutyLogs, setDutyLogs] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [replacementTaId, setReplacementTaId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/duty-logs", { headers })
      .then(res => res.json())
      .then(data => setDutyLogs(Array.isArray(data) ? data : []));
    fetch("http://localhost:8080/api/ta", { headers })
      .then(res => res.json())
      .then(data => setAllTAs(Array.isArray(data) ? data : []));
  }, []);

  const getTAName = (id) => {
    const ta = allTAs.find(t => t.id === id);
    return ta ? `${ta.firstName} ${ta.lastName}` : `TA #${id}`;
  };

  const openModal = (log) => {
    setSelectedLog(log);
    setReplacementTaId("");
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!replacementTaId) return;
    fetch(`http://localhost:8080/api/duty-logs/${selectedLog.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...selectedLog, taId: parseInt(replacementTaId) }),
    })
      .then(() => fetch("http://localhost:8080/api/duty-logs", { headers }))
      .then(res => res.json())
      .then(data => {
        setDutyLogs(Array.isArray(data) ? data : []);
        setShowModal(false);
      });
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="w-100 w-md-auto" style={{ maxWidth: "300px" }}>
        <CoordinatorLayout />
      </div>

      {/* Main Content */}
      <div className="container py-4 px-3 px-md-5 flex-grow-1">
        <h4 className="mb-4 text-center text-md-start">Duty Log Reassignment</h4>

        <div className="d-flex flex-column gap-3">
          {dutyLogs.map(dl => (
            <div key={dl.id} className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="mb-2 mb-md-0">
                  <strong>{dl.taskType}</strong> @ {new Date(dl.startTime).toLocaleString()}
                  <br />
                  <small className="text-muted">Current TA: {getTAName(dl.taId)}</small>
                </div>
                <button
                  className="btn btn-outline-primary mt-2 mt-md-0"
                  onClick={() => openModal(dl)}
                >
                  Assign to Another TA
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedLog && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050
            }}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{
                width: "90%",
                maxWidth: "400px",
                boxSizing: "border-box"
              }}
            >
              <h5 className="mb-3">Reassign TA</h5>
              <p>
                <strong>
                  {selectedLog.taskType} @ {new Date(selectedLog.startTime).toLocaleString()}
                </strong>
              </p>

              <label className="form-label">Select New TA</label>
              <select
                className="form-select mb-4"
                value={replacementTaId}
                onChange={e => setReplacementTaId(e.target.value)}
              >
                <option value="">-- choose TA --</option>
                {allTAs.map(ta => (
                  <option key={ta.id} value={ta.id}>
                    {ta.firstName} {ta.lastName}
                  </option>
                ))}
              </select>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!replacementTaId}
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDutySwap;
