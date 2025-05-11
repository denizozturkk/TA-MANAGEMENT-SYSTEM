// src/people/Dean/RescheduleExamDean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const RescheduleExamDean = () => {
  const [exams, setExams] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [assignedRooms, setAssignedRooms] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState({
    examName: "",
    examType: "MIDTERM",
    duration: 2,
    department: "",
    classroomId: "",
    proctorCount: 1
  });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  // 1️⃣ Load all exams + all classrooms up front
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/exams", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch("http://localhost:8080/api/classrooms", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : Promise.reject())
    ])
      .then(([exList, roomList]) => {
        setExams(exList);
        setClassrooms(roomList);
      })
      .catch(() => alert("Could not load exams or classrooms"))
      .finally(() => setLoading(false));
  }, [token]);

  // 2️⃣ When opening an exam, fetch its ExamRoomDto list and merge with classrooms
  const openEdit = async exam => {
    setEditingExam(exam);
    setForm(f => ({
      ...f,
      examName: exam.examName,
      examType: exam.examType,
      duration: exam.duration,
      department: exam.department
    }));

    try {
      const erDtos = await fetch(
        `http://localhost:8080/api/exam-rooms/exam/${exam.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then(r => r.json());

      // build assignedRooms array with building+roomNumber
      const merged = erDtos.map(er => {
        const cls = classrooms.find(c => c.id === er.classroomId) || {};
        return {
          classroomId: er.classroomId.toString(),
          building: cls.building || "—",
          roomNumber: cls.roomNumber || "—",
          numProctors: er.numProctors
        };
      });

      setAssignedRooms(merged);

      if (merged.length > 0) {
        setForm(f => ({
          ...f,
          classroomId: merged[0].classroomId,
          proctorCount: merged[0].numProctors
        }));
      } else {
        setForm(f => ({
          ...f,
          classroomId: "",
          proctorCount: 1
        }));
      }
    } catch {
      alert("Could not load assigned rooms");
      setAssignedRooms([]);
    }
  };

  const closeEdit = () => setEditingExam(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]:
        name === "duration" || name === "proctorCount"
          ? parseFloat(value)
          : value
    }));
  };

  const adjustProctors = delta => {
    setForm(f => ({
      ...f,
      proctorCount: Math.max(0, f.proctorCount + delta)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // update exam core fields
      await fetch(`http://localhost:8080/api/exams/${editingExam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editingExam,
          examName: form.examName,
          examType: form.examType,
          duration: form.duration,
          department: form.department
        })
      });

      // update only the selected classroom’s numProctors
      await fetch(
        `http://localhost:8080/api/exam-rooms/${editingExam.id}/${form.classroomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            examId: editingExam.id,
            classroomId: Number(form.classroomId),
            numProctors: form.proctorCount
          })
        }
      );

      alert("Saved successfully");
      // refresh exams
      const refreshed = await fetch("http://localhost:8080/api/exams", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setExams(refreshed);
      closeEdit();
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete exam "${form.examName}"?`)) return;
    try {
      await fetch(`http://localhost:8080/api/exams/${editingExam.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(e => e.filter(x => x.id !== editingExam.id));
      closeEdit();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="flex-shrink-0" style={{ width: 300 }}>
        <LayoutDean />
      </div>

      <div className="container py-4 flex-grow-1">
        <h4 className="fw-bold mb-4">Edit Exams</h4>

        {loading ? (
          <div className="card">
            <div className="card-body">Loading…</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Dept</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(ex => (
                <tr key={ex.id}>
                  <td>{ex.examName}</td>
                  <td>{ex.examType}</td>
                  <td>{ex.duration} hr</td>
                  <td>{ex.department}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEdit(ex)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingExam && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1055
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: 600 }}
            >
              <form className="modal-content p-4" onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit "{form.examName}"</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeEdit}
                    disabled={saving}
                  />
                </div>

                <div className="modal-body row gx-3">
                  {/* Exam Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="examName"
                      value={form.examName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Type */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Type</label>
                    <select
                      name="examType"
                      value={form.examType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="MIDTERM">Midterm</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Duration (hr)</label>
                    <input
                      type="number"
                      name="duration"
                      min="0"
                      step="0.1"
                      value={form.duration}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  {/* Department */}
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Department</label>
                    <input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  {/* Assigned Classroom */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Classroom</label>
                    <select
                      name="classroomId"
                      value={form.classroomId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">— select room —</option>
                      {assignedRooms.map(r => (
                        <option key={r.classroomId} value={r.classroomId}>
                          {r.building} {r.roomNumber} (proctors: {r.numProctors})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proctor Controls */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label"># of Proctors</label>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => adjustProctors(-1)}
                        disabled={saving || form.proctorCount <= 0}
                      >
                        –
                      </button>
                      <input
                        type="number"
                        name="proctorCount"
                        className="form-control text-center"
                        value={form.proctorCount}
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => adjustProctors(1)}
                        disabled={saving}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-danger me-auto"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleExamDean;
