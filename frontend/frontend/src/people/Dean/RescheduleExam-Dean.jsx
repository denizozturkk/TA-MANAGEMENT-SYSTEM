import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const RescheduleExamDean = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState({
    examName: "",
    examType: "MIDTERM",
    dateTime: "",
    duration: 120,
    department: "",
    numProctors: 1,
    rooms: ""
  });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("http://localhost:8080/api/exams", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setExams)
      .catch(() => alert("Could not load exams"))
      .finally(() => setLoading(false));
  }, [token]);

  const openEdit = (exam) => {
    setEditingExam(exam);
    setForm({
      examName: exam.examName || "",
      examType: exam.examType || "MIDTERM",
      dateTime: (exam.dateTime || "").slice(0, 16),
      duration: exam.duration || 120,
      department: exam.department || "",
      numProctors: exam.numProctors || 1,
      rooms: (exam.examRooms || []).map(er => er.classroomId).join(",")
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
      await fetch(`http://localhost:8080/api/dean/${deanId}/reschedule?examId=${editingExam.id}&newDateTime=${form.dateTime}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetch(`http://localhost:8080/api/dean/${deanId}/update-proctor-count?examId=${editingExam.id}&newProctorCount=${form.numProctors}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

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
          department: form.department,
          duration: Number(form.duration)
        })
      });

      for (const er of editingExam.examRooms) {
        await fetch(`http://localhost:8080/api/dean/${deanId}/exam-classrooms/remove?examId=${editingExam.id}&classroomId=${er.classroomId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      for (const roomId of form.rooms.split(",").map(r => r.trim()).filter(Boolean)) {
        await fetch(`http://localhost:8080/api/dean/${deanId}/exam-classrooms/add?examId=${editingExam.id}&classroomId=${roomId}&proctorCount=${form.numProctors}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert("Exam updated successfully");
      const refreshed = await fetch("http://localhost:8080/api/exams", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setExams(refreshed);
      closeEdit();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete exam #${editingExam.id}?`)) return;
    try {
      await fetch(`http://localhost:8080/api/exams/${editingExam.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(prev => prev.filter(e => e.id !== editingExam.id));
      closeEdit();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: "300px" }}>
        <LayoutDean />
      </div>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
        <h4 className="fw-bold mb-4">Reschedule & Edit Exams</h4>
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
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(ex)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No exams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {editingExam && (
          <div className="modal fade show d-block" tabIndex="-1" style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1055
          }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px" }}>
              <form className="modal-content p-4" onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Exam #{editingExam.id}</h5>
                  <button type="button" className="btn-close" onClick={closeEdit} disabled={saving} />
                </div>
                <div className="modal-body row gx-3">
                  {/* Fields */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Exam Name</label>
                    <input name="examName" value={form.examName} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Exam Type</label>
                    <select name="examType" value={form.examType} onChange={handleChange} className="form-select">
                      <option value="MIDTERM">Midterm</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date & Time</label>
                    <input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Duration</label>
                    <input type="number" name="duration" min="1" value={form.duration} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Proctors</label>
                    <input type="number" name="numProctors" min="1" value={form.numProctors} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <input name="department" value={form.department} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Room IDs (e.g. 1,2)</label>
                    <input name="rooms" value={form.rooms} onChange={handleChange} className="form-control" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-danger me-auto" onClick={handleDelete} disabled={saving}>
                    Delete
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
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
