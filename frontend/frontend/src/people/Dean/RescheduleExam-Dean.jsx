// src/people/Dean/RescheduleExam-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const RescheduleExamDean = () => {
  const [exams, setExams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm]               = useState({
    examName:    "",
    examType:    "MIDTERM",
    dateTime:    "",
    duration:    120,
    department:  "",
    numProctors: 1,
    rooms:       ""   // comma-separated classroomIds
  });
  const [saving, setSaving] = useState(false);

  const token  = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  // load exams on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/exams", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(data => setExams(data))
      .catch(() => alert("Could not load exams"))
      .finally(() => setLoading(false));
  }, [token]);

  // open modal prefilled
  const openEdit = exam => {
    setEditingExam(exam);
    setForm({
      examName:    exam.examName || "",
      examType:    exam.examType || "MIDTERM",
      dateTime:    (exam.dateTime || "").slice(0,16),
      duration:    exam.duration || 120,
      department:  exam.department || "",
      numProctors: exam.numProctors || 1,
      rooms:       (exam.examRooms||[]).map(er=>er.classroomId).join(",")
    });
  };

  const closeEdit = () => {
    setEditingExam(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1) Reschedule date/time
      const dtParams = new URLSearchParams({
        examId: editingExam.id,
        newDateTime: form.dateTime
      });
      let res = await fetch(
        `http://localhost:8080/api/dean/${deanId}/reschedule?${dtParams}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Reschedule failed");

      // 2) Update proctor count
      const pcParams = new URLSearchParams({
        examId: editingExam.id,
        newProctorCount: form.numProctors
      });
      res = await fetch(
        `http://localhost:8080/api/dean/${deanId}/update-proctor-count?${pcParams}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Proctor count update failed");

      // 3) Update exam details (name, type, department, duration)
      res = await fetch(
        `http://localhost:8080/api/exams/${editingExam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${token}`
          },
          body: JSON.stringify({
            ...editingExam,
            examName:   form.examName,
            examType:   form.examType,
            department: form.department,
            duration:   Number(form.duration)
          })
        }
      );
      if (!res.ok) throw new Error("Exam details update failed");

      // 4) Update rooms: remove existing, then add new
      for (const er of editingExam.examRooms) {
        await fetch(
          `http://localhost:8080/api/dean/${deanId}/exam-classrooms/remove` +
          `?examId=${editingExam.id}&classroomId=${er.classroomId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
      }
      for (const roomId of form.rooms.split(",").map(r=>r.trim()).filter(r=>r)) {
        const addParams = new URLSearchParams({
          examId:       editingExam.id,
          classroomId:  roomId,
          proctorCount: form.numProctors
        });
        await fetch(
          `http://localhost:8080/api/dean/${deanId}/exam-classrooms/add?${addParams}`,
          { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Exam updated successfully");
      // reload table
      const fresh = await fetch("http://localhost:8080/api/exams", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setExams(fresh);
      closeEdit();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ** New delete handler **
  const handleDelete = async () => {
    if (!window.confirm(`Delete exam #${editingExam.id}?`)) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/exams/${editingExam.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Delete failed");
      // refresh list
      setExams(prev => prev.filter(e => e.id !== editingExam.id));
      closeEdit();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <LayoutDean>
      <h4 className="mb-4">Reschedule & Edit Exams</h4>
      {loading ? (
        <div className="card"><div className="card-body">Loading exams…</div></div>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Type</th><th>Date & Time</th>
              <th>Duration</th><th>Proctors</th><th>Rooms</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(ex => (
              <tr key={ex.id}>
                <td>{ex.id}</td>
                <td>{ex.examName}</td>
                <td>{ex.examType}</td>
                <td>{new Date(ex.dateTime).toLocaleString()}</td>
                <td>{ex.duration} min</td>
                <td>{ex.numProctors}</td>
                <td>{ex.examRooms.map(er => er.roomName).join(", ")}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openEdit(ex)}
                  >Edit</button>
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingExam && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1050 }}
        >
          <div className="modal-dialog" style={{ maxWidth: "600px", width: "100%" }}>
            <form
              className="modal-content p-4"
              onSubmit={handleSubmit}
              style={{ backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "8px" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Edit Exam #{editingExam.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEdit}
                  disabled={saving}
                />
              </div>
              <div className="modal-body">
                <div className="row gx-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Exam Name</label>
                    <input
                      name="examName"
                      value={form.examName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Exam Type</label>
                    <select
                      name="examType"
                      value={form.examType}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="MIDTERM">Midterm</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      value={form.dateTime}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="form-control"
                      min={1}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Proctors</label>
                    <input
                      type="number"
                      name="numProctors"
                      value={form.numProctors}
                      onChange={handleChange}
                      className="form-control"
                      min={1}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Classroom IDs</label>
                    <input
                      name="rooms"
                      value={form.rooms}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 2,3,5"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {/* New Delete Button */}
                <button
                  type="button"
                  className="btn btn-outline-danger me-auto"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Delete Exam
                </button>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
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
    </LayoutDean>
  );
};

export default RescheduleExamDean;
