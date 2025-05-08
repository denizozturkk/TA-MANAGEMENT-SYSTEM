// src/people/Dean/ManageExamClassrooms-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ManageExamClassroomsDean = () => {
  const deanId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  // Use full backend URL to avoid dev-server proxy issues
  const api = "http://localhost:8080/api";
  const headers = { Authorization: `Bearer ${token}` };

  const [exams, setExams] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [proctorCount, setProctorCount] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch exams and classrooms from backend
  useEffect(() => {
    const fetchJson = async (url) => {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    };

    Promise.all([
      fetchJson(`${api}/exams`),
      fetchJson(`${api}/classrooms`)
    ])
      .then(([examsData, classData]) => {
        setExams(examsData);
        setClassrooms(classData);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("Failed to load exams or classrooms");
      })
      .finally(() => setLoading(false));
  }, [api, token]);

  // Utility to refresh exams list
  const refreshExams = async () => {
    try {
      const data = await fetch(`${api}/exams`, { headers }).then(r => r.json());
      setExams(data);
    } catch (err) {
      console.error("Error refreshing exams:", err);
    }
  };

  const selectedExam = exams.find(e => e.id.toString() === selectedExamId) || null;

  const handleAdd = async () => {
    if (!selectedExamId || !selectedClassId) {
      return alert("Select exam and classroom");
    }
    setActionLoading(true);
  
    // 1) Build the updated ExamDto
    const existingRooms = (selectedExam.examRooms || []).map(er => ({
      classroomId: er.classroom.id,
      numProctors: er.numProctors
    }));
  
    const updatedExamDto = {
      id: selectedExam.id,
      dateTime: selectedExam.dateTime,
      course: selectedExam.course,          // adjust if your DTO needs fewer fields
      numProctors: selectedExam.numProctors,
      examRooms: [
        ...existingRooms,
        {
          classroomId: Number(selectedClassId),
          numProctors: proctorCount      // use proctorCount here instead of undefined
        }
      ]
    };
  
    try {
      // 2) Send it to the generic update endpoint
      const res = await fetch(
        `http://localhost:8080/api/exams/${selectedExamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedExamDto)
        }
      );
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
  
      alert("Classroom added via exam update");
  
      // 3) Refresh your local list
      await refreshExams();
      setSelectedClassId("");
      setProctorCount(1);
  
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add classroom");
    } finally {
      setActionLoading(false);
    }
  };
  

  const handleRemove = async (classroomId) => {
    setActionLoading(true);
    const params = new URLSearchParams({ examId: selectedExamId, classroomId });
    try {
      const res = await fetch(
        `${api}/dean/${deanId}/exam-classrooms/remove?${params}`,
        { method: "DELETE", headers }
      );
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      alert("Classroom removed");
      await refreshExams();
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Failed to remove classroom");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LayoutDean><p>Loading…</p></LayoutDean>;
  if (error)   return <LayoutDean><p className="text-danger">{error}</p></LayoutDean>;

  return (
    <LayoutDean>
      <h4>Manage Exam Classrooms</h4>

      <div className="mb-3">
        <label htmlFor="examSelect" className="form-label">Select Exam</label>
        <select
          id="examSelect"
          className="form-select"
          value={selectedExamId}
          onChange={e => setSelectedExamId(e.target.value)}
        >
          <option value="">— choose exam —</option>
          {exams.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.course?.code || ex.id} — {new Date(ex.dateTime).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <>
          <table className="table mb-4">
            <thead>
              <tr><th>Classroom</th><th>Proctors</th><th>Action</th></tr>
            </thead>
            <tbody>
              {(selectedExam.examRooms || []).map(er => (
                <tr key={er.classroom?.id ?? er.classroomId}>
                  <td>
                    {er.classroom
                      ? `${er.classroom.building} ${er.classroom.roomNumber}`
                      : `ID ${er.classroomId}`}
                  </td>
                  <td>{er.numProctors}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(er.classroom?.id ?? er.classroomId)}
                      disabled={actionLoading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border p-3">
            <h5>Add Classroom</h5>
            <div className="row g-2 align-items-end">
              <div className="col-auto">
                <label className="form-label">Classroom</label>
                <select
                  className="form-select"
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                >
                  <option value="">— choose —</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.building} {c.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-auto">
                <label className="form-label">Proctors</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={proctorCount}
                  onChange={e => setProctorCount(Number(e.target.value))}
                />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  disabled={actionLoading || !selectedClassId}
                >
                  {actionLoading ? "Saving…" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </LayoutDean>
  );
};

export default ManageExamClassroomsDean;