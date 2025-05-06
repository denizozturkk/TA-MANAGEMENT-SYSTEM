// src/people/Dean/RescheduleExam-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const RescheduleExamDean = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then(setExams)
      .catch(() => alert("Could not load exams"))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (exam) => {
    setSelectedExam(exam);
    setNewDateTime(exam.dateTime?.slice(0,16) || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const params = new URLSearchParams({
        examId: selectedExam.id,
        newDateTime,
      });
      const res = await fetch(`/api/dean/${/* your deanId */1}/reschedule?${params}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error();
      alert("Rescheduled successfully");
    } catch {
      alert("Failed to reschedule");
    } finally {
      setSaving(false);
      setSelectedExam(null);
    }
  };

  if (loading) return <LayoutDean><p>Loading…</p></LayoutDean>;

  return (
    <LayoutDean>
      <h4>Reschedule Exams</h4>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Course</th><th>DateTime</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.id}</td>
              <td>{ex.courseCode}</td>
              <td>{ex.dateTime}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpen(ex)}>
                  Reschedule
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedExam && (
        <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Exam {selectedExam.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedExam(null)} />
              </div>
              <div className="modal-body">
                <label>New Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedExam(null)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
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
