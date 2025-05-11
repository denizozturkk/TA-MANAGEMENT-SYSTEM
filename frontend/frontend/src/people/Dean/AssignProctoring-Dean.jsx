import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const AssignProctoringDean = () => {
  const [offerings, setOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState("");
  const [exams, setExams] = useState([]);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [assigningExamId, setAssigningExamId] = useState(null);

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  // Load offerings & courses on mount
  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    Promise.all([
      fetch(`${BASE}/offerings`, { headers }).then((r) => r.json()),
      fetch(`${BASE}/courses`,   { headers }).then((r) => r.json()),
    ])
      .then(([offData, courseData]) => {
        setOfferings(Array.isArray(offData) ? offData : []);
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch(console.error)
      .finally(() => setLoadingOfferings(false));
  }, [token]);

  // When offering changes, load exams with insufficient proctors
  useEffect(() => {
    if (!selectedOffering) {
      setExams([]);
      return;
    }
    setLoadingExams(true);
    const headers = { Authorization: `Bearer ${token}` };
    fetch(
      `${BASE}/exams/offering/${selectedOffering}/insufficient-proctors`,
      { headers }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setExams(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoadingExams(false));
  }, [selectedOffering, token]);

  const handleOfferingChange = (e) => {
    setSelectedOffering(e.target.value);
  };

  const handleAssign = (examId) => {
    setAssigningExamId(examId);
    const headers = { Authorization: `Bearer ${token}` };
    fetch(
      `${BASE}/dean/${deanId}/assign-proctors?examId=${examId}`,
      {
        method: "POST",
        headers,
      }
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => {
        alert(`Proctors assigned for exam ${examId}`);
        // remove from list
        setExams((prev) => prev.filter((e) => e.id !== examId));
      })
      .catch(() => alert("Failed to assign proctors"))
      .finally(() => setAssigningExamId(null));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: 300 }}>
        <LayoutDean />
      </div>

      {/* Main */}
      <div className="container py-4 flex-grow-1">
        <h4 className="fw-bold mb-4">Assign Proctoring Duties</h4>

        {/* Offering select */}
        <div className="mb-4">
          <label className="form-label">Select Offering</label>
          {loadingOfferings ? (
            <p>Loading offerings…</p>
          ) : (
            <select
              className="form-select"
              value={selectedOffering}
              onChange={handleOfferingChange}
            >
              <option value="">-- choose offering --</option>
              {offerings.map((o) => {
                const course = courses.find((c) => c.id === o.courseId);
                return (
                  <option key={o.id} value={o.id}>
                    {o.semester} {o.year} – {course?.courseCode || "Unknown"}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Exams table */}
        {selectedOffering && (
          <div className="card shadow-sm">
            <div className="card-body">
              {loadingExams ? (
                <p>Loading exams…</p>
              ) : exams.length === 0 ? (
                <p className="text-muted">
                  No exams with insufficient proctors.
                </p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Exam ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Date & Time</th>
                      <th>Required Proctors</th>
                      <th>Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((ex) => (
                      <tr key={ex.id}>
                        <td>{ex.id}</td>
                        <td>{ex.examName}</td>
                        <td>{ex.department}</td>
                        <td>
                          {new Date(ex.dateTime).toLocaleString()}
                        </td>
                        <td>{ex.numProctors}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={assigningExamId === ex.id}
                            onClick={() => handleAssign(ex.id)}
                          >
                            {assigningExamId === ex.id
                              ? "Assigning…"
                              : "Assign Proctors"}
                          </button>
                        </td>
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

export default AssignProctoringDean;
