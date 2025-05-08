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

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1) get facultyId
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers })
      .then(r => r.json())
      .then(u => setFacultyId(u.id))
      .catch(console.error);
  }, [token]);

  // 2) load this faculty’s exams
  useEffect(() => {
    if (!facultyId) return;
    fetch(`${BASE}/faculty-members/${facultyId}/exams`, { headers })
      .then(r => r.json())
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [facultyId]);

  // 3) load all TAs
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/ta`, { headers })
      .then(r => r.json())
      .then(data => setTAs(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  // helper to load assignments for the selected exam
  const loadAssignments = useCallback(() => {
    if (!selectedExamId) {
      setAssignments([]);
      return;
    }
    fetch(
      `${BASE}/proctor-assignments/exam/${selectedExamId}`,
      { headers }
    )
      .then(r => r.json())
      .then(data => setAssignments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [selectedExamId]);

  // whenever exam changes, reload assignments & reset selects
  useEffect(() => {
    loadAssignments();
    setSelectedTA("");
  }, [selectedExamId, loadAssignments]);

  const handleExamChange = e => setSelectedExamId(e.target.value);

  // Manual Assignment
  const handleManualAssign = () => {
    if (!facultyId || !selectedExamId || !selectedTA) {
      return alert("Please select exam and TA.");
    }
    const url =
      `${BASE}/faculty-members/${facultyId}/exams/${selectedExamId}/proctor` +
      `?mode=MANUAL_ASSIGNMENT&taId=${selectedTA}`;

    fetch(url, { method: "POST", headers })
      .then(r => {
        if (!r.ok) throw new Error();
        alert("Assigned successfully");
        loadAssignments();
      })
      .catch(() => alert("Failed to assign TA."));
  };

  // Automatic Assignment
  const handleAutoAssign = () => {
    if (!facultyId || !selectedExamId) return;
    const url =
      `${BASE}/faculty-members/${facultyId}/exams/${selectedExamId}/proctor` +
      `?mode=AUTOMATIC_ASSIGNMENT`;

    fetch(url, { method: "POST", headers })
      .then(r => {
        if (!r.ok) throw new Error();
        alert("Auto-assignment complete");
        loadAssignments();
      })
      .catch(() => alert("No available TA or assignment failed."));
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
            {/* Manual Assignment */}
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

            {/* Automatic Assignment */}
            <div className="card mb-4 p-3">
              <h5 className="mb-3">Automatic Assignment</h5>
              <button
                className="btn btn-outline-primary"
                onClick={handleAutoAssign}
              >
                Assign a TA Automatically
              </button>
            </div>

            {/* Current Assignments */}
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
