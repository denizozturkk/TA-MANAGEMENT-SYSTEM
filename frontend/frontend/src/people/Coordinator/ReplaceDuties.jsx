
import React, { useEffect, useState } from "react";

const ViewDutySwap = () => {
  const [dutyLogs, setDutyLogs] = useState([]);
  const [allTAs, setAllTAs]   = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [replacementTaId, setReplacementTaId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // load duty logs and all TAs
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

  // open modal for a specific dutyLog
  const openModal = (log) => {
    setSelectedLog(log);
    setReplacementTaId("");
    setShowModal(true);
  };

  // do the reassign
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
    <div className="container mt-4">
      <h4 className="mb-3">Duty Log Reassignment</h4>

      {dutyLogs.map((dl) => (
        <div key={dl.id} className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <strong>{dl.taskType}</strong> @ {new Date(dl.startTime).toLocaleString()}<br/>
              <small>Current TA: {getTAName(dl.taId)}</small>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={() => openModal(dl)}
            >
              Assign to Another TA
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: 320 }}
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
                className="btn btn-secondary"
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
  );
};

export default ViewDutySwap;
