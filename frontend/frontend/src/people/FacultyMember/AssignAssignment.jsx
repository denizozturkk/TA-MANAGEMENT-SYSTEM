// src/people/TA/AssignDutyPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

// Parses JWT to extract payload
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

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const payload = token ? parseJwt(token) : {};
  const facultyId = payload.id;

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // load initial data
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/exams`, { headers })
      .then(res => res.json())
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/ta`, { headers })
      .then(res => res.json())
      .then(data => setTAs(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/classrooms`, { headers })
      .then(res => res.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  // fetch assignments whenever selectedExamId changes
  useEffect(() => {
    if (!selectedExamId) return;
    fetch(`${BASE}/proctor-assignments?examId=${selectedExamId}`, { headers })
      .then(res => res.json())
      .then(data => setAssignments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [selectedExamId]);

  const handleExamChange = e => {
    setSelectedExamId(e.target.value);
    setSelectedTA("");
    setSelectedClassroom("");
  };

  const handleManualAssign = () => {
    if (!selectedExamId || !selectedTA || !selectedClassroom) {
      alert("Please select exam, TA and classroom.");
      return;
    }
    fetch(`${BASE}/proctor-assignments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        examId: parseInt(selectedExamId, 10),
        taId: parseInt(selectedTA, 10),
        classroomId: parseInt(selectedClassroom, 10)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(newAssgn => {
        setAssignments(a => [newAssgn, ...a]);
        alert("Assigned successfully");
      })
      .catch(() => alert("Failed to assign TA."));
  };

  const handleAutoAssign = () => {
    if (!selectedExamId) return;
    const exam = exams.find(ex => String(ex.id) === selectedExamId);
    if (!exam) return;
    const start = encodeURIComponent(exam.dateTime);
    const dur = exam.duration;
    fetch(`${BASE}/ta/available?startTime=${start}&duration=${dur}`, { headers })
      .then(res => res.json())
      .then(cands => {
        if (!Array.isArray(cands) || cands.length === 0) {
          alert("No available TA");
          return;
        }
        const ta = cands[0];
        const room = exam.examRooms && exam.examRooms[0];
        if (!room) {
          alert("No classrooms to assign");
          return;
        }
        fetch(`${BASE}/proctor-assignments`, {
          method: "POST",
          headers,
          body: JSON.stringify({ examId: exam.id, taId: ta.id, classroomId: room.classroomId })
        })
          .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
          })
          .then(newAssgn => {
            setAssignments(a => [newAssgn, ...a]);
            alert(`Auto-assigned ${ta.firstName} ${ta.lastName}`);
          })
          .catch(() => alert("Auto-assign failed."));
      })
      .catch(console.error);
  };

  const handleApprove = id => {
    const assgn = assignments.find(a => a.id === id);
    if (!assgn) return;
    fetch(`${BASE}/proctor-assignments/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...assgn, status: "APPROVED" })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(updated => {
        setAssignments(a => a.map(x => (x.id === id ? updated : x)));
      })
      .catch(() => alert("Approve failed."));
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}><FacultyMemberLayout/></div>
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">Assign Proctors</h3>

        <div className="mb-3">
          <label className="form-label">Select Exam</label>
          <select className="form-select" value={selectedExamId} onChange={handleExamChange}>
            <option value="">-- choose exam --</option>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.examName}</option>
            ))}
          </select>
        </div>

        {selectedExamId && (
          <>
            <div className="card mb-4 p-3">
              <h5 className="mb-3">Manual Assignment</h5>
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">TA</label>
                  <select className="form-select" value={selectedTA} onChange={e => setSelectedTA(e.target.value)}>
                    <option value="">-- select TA --</option>
                    {tas.map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Classroom</label>
                  <select className="form-select" value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)}>
                    <option value="">-- select classroom --</option>
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>{c.building} {c.roomNumber}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-primary w-100" onClick={handleManualAssign}>Assign Manually</button>
                </div>
              </div>
            </div>

            <div className="card mb-4 p-3">
              <h5 className="mb-3">Automatic Assignment</h5>
              <button className="btn btn-outline-primary" onClick={handleAutoAssign}>Auto Assign Best TA</button>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Current Assignments</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th>TA</th>
                      <th>Classroom</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map(a => (
                      <tr key={a.id}>
                        <td>{a.assignedTA?.firstName} {a.assignedTA?.lastName}</td>
                        <td>{classrooms.find(c => c.id === a.classroom?.id)?.building} {classrooms.find(c => c.id === a.classroom?.id)?.roomNumber}</td>
                        <td>{a.status}</td>
                        <td>
                          {a.status === "PENDING" && (
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove(a.id)}>
                              Approve
                            </button>
                          )}
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
