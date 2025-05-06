// src/people/TA/SubmitLeaveRequest-TA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SubmitLeaveRequestTA = () => {
  const taId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const hdrs = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  };

  const [assignments, setAssignments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Medical Leave",
    from: "",
    to: "",
    reason: ""
  });
  const [currentAssignId, setCurrentAssignId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [asgnRes, leaveRes] = await Promise.all([
          fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs }),
          fetch(`${BASE}/leave-requests/ta/${taId}`, { headers: hdrs })
        ]);
        const allAsgn = await asgnRes.json();
        const allLeaves = await leaveRes.json();

        setAssignments(Array.isArray(allAsgn) ? allAsgn : []);
        setLeaves(Array.isArray(allLeaves) ? allLeaves : []);
      } catch (err) {
        console.error(err);
        alert("Error loading assignments or leaves");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [taId]);

  const leaveMap = Object.fromEntries(
    leaves.map(l => [l.proctorAssignmentId, l])
  );

  const openModal = assignId => {
    setCurrentAssignId(assignId);
    setForm({ type: "Medical Leave", from: "", to: "", reason: "" });
    setModalOpen(true);
  };

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${BASE}/leave-requests?taId=${taId}&proctorAssignmentId=${currentAssignId}`,
        {
          method: "POST",
          headers: { ...hdrs, "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setLeaves(prev => [created, ...prev]);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit leave request");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading proctoring assignments…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Proctoring Assignments & Leave Requests
          </h4>

          <table className="table table-hover align-middle w-100">
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Course</th>
                <th>Date</th>
                <th>Leave Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 && (
                <tr><td colSpan="5" className="text-center">No assignments</td></tr>
              )}
              {assignments.map(pa => {
                const leave = leaveMap[pa.id];
                return (
                  <tr key={pa.id}>
                    <td>{pa.id}</td>
                    <td>{pa.courseCode}</td>
                    <td>{new Date(pa.date).toLocaleDateString()}</td>
                    <td>
                      {leave
                        ? (
                          <span className={`badge bg-${leave.status === 'ACCEPTED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'secondary'}`}>{leave.status}</span>
                        )
                        : '—'
                      }
                    </td>
                    <td>
                      {leave ? '—' : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(pa.id)}
                        >Request Leave</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Modal */}
      {modalOpen && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Leave Request</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Leave Type</label>
                    <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                      <option>Medical Leave</option>
                      <option>Casual Leave</option>
                    </select>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <label className="form-label">From</label>
                      <input name="from" type="date" className="form-control" value={form.from} onChange={handleChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">To</label>
                      <input name="to" type="date" className="form-control" value={form.to} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <input name="reason" type="text" className="form-control" value={form.reason} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit Leave'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LayoutTA>
  );
};

export default SubmitLeaveRequestTA;
