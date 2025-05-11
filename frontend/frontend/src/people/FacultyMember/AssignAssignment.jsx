// src/people/TA/AssignDutyPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const AssignDutyPage = () => {
  const [exams, setExams] = useState([]);
  const [tas, setTAs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedTA, setSelectedTA] = useState("");
  const [facultyId, setFacultyId] = useState(null);
  const [toast, setToast] = useState(null);

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers })
      .then(r => r.json())
      .then(u => setFacultyId(u.id))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!facultyId) return;
    fetch(`${BASE}/faculty-members/${facultyId}/exams`, { headers })
      .then(r => r.json())
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [facultyId]);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/ta`, { headers })
      .then(r => r.json())
      .then(data => setTAs(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  const loadAssignments = useCallback(() => {
    if (!selectedExamId) {
      setAssignments([]);
      return;
    }
    fetch(`${BASE}/proctor-assignments/exam/${selectedExamId}`, { headers })
      .then(r => r.json())
      .then(data => setAssignments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [selectedExamId]);

  useEffect(() => {
    loadAssignments();
    setSelectedTA("");
  }, [selectedExamId, loadAssignments]);

  const handleExamChange = e => setSelectedExamId(e.target.value);

  const handleManualAssign = () => {
    if (!facultyId || !selectedExamId || !selectedTA) {
      return showToast("Please select exam and TA.");
    }
    const url = `${BASE}/faculty-members/${facultyId}/exams/${selectedExamId}/proctor?mode=MANUAL_ASSIGNMENT&taId=${selectedTA}`;

    fetch(url, { method: "POST", headers })
      .then(async r => {
        if (!r.ok) {
          const text = await r.text();
          let msg = "Failed to assign TA.";
          if (text.includes("No such TA")) msg = "The selected TA does not exist.";
          else if (text.includes("not in department")) msg = "The selected TA is from a different department.";
          else if (text.includes("scheduling conflict")) msg = "TA has a scheduling conflict during the exam time.";
          else if (text.includes("proctor slots are already filled")) msg = "All proctor slots for this exam are already filled.";
          throw new Error(msg);
        }
        showToast("Assigned successfully", "success");
        loadAssignments();
      })
      .catch(err => showToast(err.message || "Failed to assign TA."));
  };

  const handleAutoAssign = () => {
    if (!facultyId || !selectedExamId) return;
    const url = `${BASE}/faculty-members/${facultyId}/exams/${selectedExamId}/proctor?mode=AUTOMATIC_ASSIGNMENT`;

    fetch(url, { method: "POST", headers })
      .then(async r => {
        if (!r.ok) {
          const text = await r.text();
          let msg = "No available TA or assignment failed.";
          if (text.includes("proctor slots are already filled")) msg = "All proctor slots for this exam are already filled.";
          throw new Error(msg);
        }
        showToast("Auto-assignment complete", "success");
        loadAssignments();
      })
      .catch(err => showToast(err.message || "Auto-assignment failed."));
  };

  const getTaName = taId => {
    const ta = tas.find(t => t.id === taId);
    return ta ? `${ta.firstName} ${ta.lastName}` : `TA #${taId}`;
  };

  const selectedExam = exams.find(ex => String(ex.id) === selectedExamId);

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">Assign Proctors</h3>

        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "12px 20px",
              backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
              color: "white",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              zIndex: 9999,
              maxWidth: "300px",
            }}
          >
            {toast.message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Select Exam</label>
          <select
            className="form-select"
            value={selectedExamId}
            onChange={handleExamChange}
          >
            <option value="">-- choose exam --</option>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.examName} ({ex.department})
              </option>
            ))}
          </select>
        </div>

        {selectedExamId && (
          <>
            <div className="card mb-4 p-3">
              <h5 className="mb-3">Manual Assignment</h5>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">TA</label>
                  <select
                    className="form-select"
                    value={selectedTA}
                    onChange={e => setSelectedTA(e.target.value)}
                  >
                    <option value="">-- select TA --</option>
                    {tas
                      .filter(t => t.department === selectedExam.department)
                      .map(t => (
                        <option key={t.id} value={t.id}>
                          {t.firstName} {t.lastName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleManualAssign}
                  >
                    Assign Manually
                  </button>
                </div>
              </div>
            </div>

            <div className="card mb-4 p-3">
              <h5 className="mb-3">Automatic Assignment</h5>
              <button
                className="btn btn-outline-primary"
                onClick={handleAutoAssign}
              >
                Assign a TA Automatically
              </button>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Current Assignments</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>TA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={a.id}>
                        <td>{selectedExam?.examName}</td>
                        <td>{getTaName(a.taId)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignDutyPage;