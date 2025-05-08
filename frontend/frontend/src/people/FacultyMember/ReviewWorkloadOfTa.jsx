// src/people/TA/DutiesByDepartmentPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

// Simple JWT parser
function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

const Departments = ["CS", "EE", "IE", "ME"];

const DutiesByDepartmentPage = () => {
  const [tas, setTAs] = useState([]);
  const [exams, setExams] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [filteredTAs, setFilteredTAs] = useState([]);
  const [selectedTA, setSelectedTA] = useState("");
  const [dutyLogs, setDutyLogs] = useState([]);
  const [proctors, setProctors] = useState([]);

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Load all TAs, Exams, Classrooms on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/ta`, { headers })
      .then(r => r.json())
      .then(data => setTAs(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/exams`, { headers })
      .then(r => r.json())
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/classrooms`, { headers })
      .then(r => r.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  // Filter TAs when dept changes
  useEffect(() => {
    setSelectedTA("");
    setDutyLogs([]);
    setProctors([]);
    if (!selectedDept) {
      setFilteredTAs([]);
    } else {
      setFilteredTAs(tas.filter(t => t.department === selectedDept));
    }
  }, [selectedDept, tas]);

  // Fetch duty-logs and proctor-assignments when TA changes
  useEffect(() => {
    if (!selectedTA) {
      setDutyLogs([]);
      setProctors([]);
      return;
    }

    // Duty logs
    fetch(`${BASE}/duty-logs/ta/${selectedTA}`, { headers })
      .then(r => r.json())
      .then(data => setDutyLogs(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Proctor assignments
    fetch(`${BASE}/proctor-assignments/ta/${selectedTA}`, { headers })
      .then(r => r.json())
      .then(data => setProctors(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [selectedTA]);

  // look up names / labels
  const getTaName = id => {
    const t = tas.find(x => x.id === id);
    return t ? `${t.firstName} ${t.lastName}` : `TA #${id}`;
  };
  const getExamName = id => {
    const e = exams.find(x => x.id === id);
    return e ? e.examName : `Exam #${id}`;
  };
  const getRoomName = id => {
    const c = classrooms.find(x => x.id === id);
    return c ? `${c.building} ${c.roomNumber}` : `Room #${id}`;
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">View TA Duty-Logs & Proctors</h3>

        {/* Department */}
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            <option value="">-- choose department --</option>
            {Departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* TA */}
        {selectedDept && (
          <div className="mb-3">
            <label className="form-label">TA</label>
            <select
              className="form-select"
              value={selectedTA}
              onChange={e => setSelectedTA(e.target.value)}
            >
              <option value="">-- choose TA --</option>
              {filteredTAs.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Duty Logs */}
        {selectedTA && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Duty Logs</h5>
              {dutyLogs.length === 0 ? (
                <p className="text-muted">No duty-logs found.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Task Type</th>
                      <th>Workload</th>
                      <th>Start Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dutyLogs.map(dl => (
                      <tr key={dl.id}>
                        <td>{dl.id}</td>
                        <td>{dl.taskType}</td>
                        <td>{dl.workload}</td>
                        <td>{new Date(dl.startTime).toLocaleString()}</td>
                        <td>{dl.duration} mins</td>
                        <td>{dl.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Proctor Assignments */}
        {selectedTA && (
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Proctor Assignments</h5>
              {proctors.length === 0 ? (
                <p className="text-muted">No proctor-assignments found.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Classroom</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proctors.map(pa => (
                      <tr key={pa.id}>
                        <td>{getExamName(pa.examId)}</td>
                        <td>{getRoomName(pa.classroomId)}</td>
                        <td>{pa.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DutiesByDepartmentPage;
