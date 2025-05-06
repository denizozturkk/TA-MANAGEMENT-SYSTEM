// src/people/Dean/UpdateProctorCount-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const UpdateProctorCountDean = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newCount, setNewCount] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then(setExams)
      .catch(() => alert("Error"))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (ex) => {
    setSelected(ex);
    setNewCount(ex.numProctors || 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const params = new URLSearchParams({ examId: selected.id, newProctorCount: newCount });
      const res = await fetch(`/api/dean/1/update-proctor-count?${params}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error();
      alert("Updated!");
    } catch {
      alert("Failed!");
    } finally {
      setSaving(false);
      setSelected(null);
    }
  };

  if (loading) return <LayoutDean><p>Loading…</p></LayoutDean>;

  return (
    <LayoutDean>
      <h4>Update Proctor Count</h4>
      <table className="table">
        <thead><tr><th>ID</th><th>Course</th><th>Current</th><th>Action</th></tr></thead>
        <tbody>
          {exams.map((ex) => (
            <tr key={ex.id}>
              <td>{ex.id}</td>
              <td>{ex.courseCode}</td>
              <td>{ex.numProctors}</td>
              <td><button className="btn btn-sm btn-outline-secondary" onClick={() => openModal(ex)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={submit}>
              <div className="modal-header">
                <h5 className="modal-title">Exam {selected.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <label>New Proctor Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={newCount}
                  onChange={(e) => setNewCount(+e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutDean>
  );
};

export default UpdateProctorCountDean;
