import React, { useEffect, useState } from "react";

const DutySwapTwo = () => {
  const [dutyLogs, setDutyLogs] = useState([]);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");

  const token = localStorage.getItem("authToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ————— LOAD DUTIES —————
  useEffect(() => {
    fetch("http://localhost:8080/api/duty-logs", { headers })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Fetched duty-logs:", data);
        setDutyLogs(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Duty-logs fetch error:", err));
  }, []);

  const handleSwap = () => {
    if (!selectedA || !selectedB) return;

    const logA = dutyLogs.find(d => String(d.id) === selectedA);
    const logB = dutyLogs.find(d => String(d.id) === selectedB);
    if (!logA || !logB) return;

    Promise.all([
      fetch(`http://localhost:8080/api/duty-logs/${logA.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...logA, taId: logB.taId }),
      }),
      fetch(`http://localhost:8080/api/duty-logs/${logB.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...logB, taId: logA.taId }),
      }),
    ])
      .then(() => fetch("http://localhost:8080/api/duty-logs", { headers }))
      .then(res => res.json())
      .then(data => {
        setDutyLogs(Array.isArray(data) ? data : []);
        setSelectedA("");
        setSelectedB("");
      })
      .catch(err => console.error("Swap or reload error:", err));
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Swap Two Duties’ TAs</h4>

      <div className="row g-3 align-items-end">
        <div className="col-md-5">
          <label className="form-label">Duty A</label>
          <select
            className="form-select"
            value={selectedA}
            onChange={e => {
              setSelectedA(e.target.value);
              if (e.target.value === selectedB) {
                setSelectedB("");
              }
            }}
          >
            <option value="">-- Select Duty A --</option>
            {dutyLogs.map(d => (
              <option key={d.id} value={d.id}>
                {d.taskType} @ {new Date(d.startTime).toLocaleString()} (TA #{d.taId})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-5">
          <label className="form-label">Duty B</label>
          <select
            className="form-select"
            value={selectedB}
            onChange={e => setSelectedB(e.target.value)}
            disabled={!selectedA}
          >
            <option value="">-- Select Duty B --</option>
            {dutyLogs
              .filter(d => String(d.id) !== selectedA)
              .map(d => (
                <option key={d.id} value={d.id}>
                  {d.taskType} @ {new Date(d.startTime).toLocaleString()} (TA #{d.taId})
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-secondary"
            onClick={handleSwap}
            disabled={!selectedA || !selectedB}
          >
            Swap TAs
          </button>
        </div>
      </div>
    </div>
  );
};

export default DutySwapTwo;
