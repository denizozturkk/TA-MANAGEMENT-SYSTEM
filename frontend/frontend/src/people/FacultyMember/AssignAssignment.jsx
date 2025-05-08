// src/people/TA/AssignDutyPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

// Simple JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

const AssignDutyPage = () => {
  const [exams, setExams] = useState([]);
  const [tas, setTAs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedTA, setSelectedTA] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
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

  // 4) load all classrooms
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/classrooms`, { headers })
      .then(r => r.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
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
    setSelectedClassroom("");
  }, [selectedExamId, loadAssignments]);

  const handleExamChange = e => {
    setSelectedExamId(e.target.value);
  };

  // manual assignment now includes status: "ASSIGNED"
  const handleManualAssign = () => {
    if (!selectedExamId || !selectedTA || !selectedClassroom) {
      return alert("Please select exam, TA and classroom.");
    }
    fetch(`${BASE}/proctor-assignments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        examId: +selectedExamId,
        taId: +selectedTA,
        classroomId: +selectedClassroom,
        status: "ASSIGNED"
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(newA => {
        setAssignments(a => [newA, ...a]);
        alert("Assigned successfully");
      })
      .catch(() => alert("Failed to assign TA."));
  };

  const handleAutoAssign = async () => {
    if (!selectedExamId) return;
    const exam = exams.find(ex => String(ex.id) === selectedExamId);
    if (!exam) return;

    // compute ISO start/end
    const start = exam.dateTime.slice(0, 19);
    const dt = new Date(exam.dateTime);
    dt.setMinutes(dt.getMinutes() + exam.duration);
    const end = dt.toISOString().slice(0, 19);

    // filter TAs by department
    const candidates = tas.filter(t => t.department === exam.department);
    for (let ta of candidates) {
      const res = await fetch(
        `${BASE}/ta/${ta.id}/busy-hours/check-availability?start=${encodeURIComponent(
          start
        )}&end=${encodeURIComponent(end)}`,
        { headers }
      ).catch(() => null);
      if (!res || !res.ok) continue;
      const ok = await res.json();
      if (!ok) continue;

      const room = exam.examRooms?.[0];
      if (!room) return alert("No classrooms to assign");

      const assignRes = await fetch(`${BASE}/proctor-assignments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          examId: exam.id,
          taId: ta.id,
          classroomId: room.classroomId,
        }),
      });
      if (!assignRes.ok) throw new Error();
      const newA = await assignRes.json();
      setAssignments(a => [newA, ...a]);
      return alert(`Auto-assigned ${ta.firstName} ${ta.lastName}`);
    }

    alert("No available TA in exam department.");
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
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <label className="form-label">Classroom</label>
                  <select
                    className="form-select"
                    value={selectedClassroom}
                    onChange={e => setSelectedClassroom(e.target.value)}
                  >
                    <option value="">-- select classroom --</option>
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.building} {c.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
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
                Auto Assign Best TA
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
                      <th>Classroom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={a.id}>
                        <td>{selectedExam?.examName}</td>
                        <td>{getTaName(a.taId)}</td>
                        <td>
                          {classrooms.find(c => c.id === a.classroomId)
                            ?.building}{" "}
                          {
                            classrooms.find(c => c.id === a.classroomId)
                              ?.roomNumber
                          }
                        </td>
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
