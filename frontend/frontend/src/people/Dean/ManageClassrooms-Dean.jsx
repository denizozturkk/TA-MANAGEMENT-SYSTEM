// src/people/Dean/ManageExamClassrooms-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ManageExamClassroomsDean = () => {
  const [exams, setExams] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [proctorCount, setProctorCount] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/exams").then((r) => r.json()),
      fetch("/api/classrooms").then((r) => r.json()),
    ])
      .then(([e, c]) => {
        setExams(e);
        setClassrooms(c);
      })
      .catch(() => alert("Error loading"))
      .finally(() => setLoading(false));
  }, []);

  const open = (ex) => {
    setSelectedExam(ex);
    setSelectedClass("");
    setProctorCount(1);
  };

  const add = async () => {
    const params = new URLSearchParams({ examId: selectedExam.id, classroomId: selectedClass, proctorCount });
    const res = await fetch(`/api/dean/1/exam-classrooms/add?${params}`, { method: "PUT" });
    if (res.ok) {
      alert("Added");
      setSelectedExam(null);
    } else {
      alert("Failed");
    }
  };

  const remove = async (examId, classId) => {
    const params = new URLSearchParams({ examId, classroomId: classId });
    const res = await fetch(`/api/dean/1/exam-classrooms/remove?${params}`, { method: "DELETE" });
    if (res.ok) {
      alert("Removed");
    } else {
      alert("Failed");
    }
  };

  if (loading) return <LayoutDean><p>Loading…</p></LayoutDean>;

  return (
    <LayoutDean>
      <h4>Exam Classrooms</h4>
      <table className="table">
        <thead><tr><th>Exam</th><th>Classroom</th><th>Proctors</th><th>Action</th></tr></thead>
        <tbody>
          {exams.flatMap((ex) =>
            (ex.examRooms || []).map((er) => (
              <tr key={`${ex.id}-${er.classroom.id}`}>
                <td>{ex.id}</td>
                <td>{er.classroom.roomNumber}</td>
                <td>{er.numProctors}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(ex.id, er.classroom.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="btn btn-primary mb-4" onClick={() => open({})}>Add Classroom</button>

      {selectedExam !== null && (
        <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Add Classroom to Exam</h5>
              <select className="form-select mb-2" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">— choose —</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.building} {c.roomNumber}</option>
                ))}
              </select>
              <input
                type="number"
                className="form-control mb-2"
                value={proctorCount}
                onChange={(e) => setProctorCount(+e.target.value)}
                min="1"
              />
              <button className="btn btn-primary me-2" onClick={add}>Add</button>
              <button className="btn btn-secondary" onClick={() => setSelectedExam(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </LayoutDean>
  );
};

export default ManageExamClassroomsDean;
