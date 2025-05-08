// src/people/TA/SubmitLeaveRequestTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SubmitLeaveRequestTA = () => {
  const taId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const hdrs = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [assignments, setAssignments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Medical Leave",
    from: "",
    to: "",
    reason: "",
  });
  const [currentAssignId, setCurrentAssignId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 1) fetch this TA's proctor assignments
        const [asgnRes, leaveRes] = await Promise.all([
          fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs }),
          fetch(`${BASE}/leave-requests/ta/${taId}`, { headers: hdrs }),
        ]);

        const allAsgn = await asgnRes.json();
        const allLeaves = await leaveRes.json();
        setAssignments(Array.isArray(allAsgn) ? allAsgn : []);
        setLeaves(Array.isArray(allLeaves) ? allLeaves : []);

        // 2) fetch *all* exams once, so we can look up examName & date
        const examRes = await fetch(`${BASE}/exams`, { headers: hdrs });
        const allExams = await examRes.json();
        setExams(Array.isArray(allExams) ? allExams : []);
      } catch (err) {
        console.error(err);
        alert("Error loading assignments, leaves or exams");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [taId]);

  // map of proctorAssignmentId → its leave (if any)
  const leaveMap = Object.fromEntries(
    leaves.map((l) => [l.proctorAssignmentId, l])
  );

  const openModal = (assignId) => {
    setCurrentAssignId(assignId);
    setForm({ type: "Medical Leave", from: "", to: "", reason: "" });
    setModalOpen(true);
  };
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${BASE}/leave-requests?taId=${taId}&proctorAssignmentId=${currentAssignId}`,
        {
          method: "POST",
          headers: { ...hdrs, "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setLeaves((prev) => [created, ...prev]);
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
  <div className="d-flex flex-column flex-lg-row">
    {/* Sidebar (Sol) */}
    <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
      <LayoutTA />
    </div>

    {/* İçerik Alanı (Sağ) */}
    <div className="container-fluid py-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Proctoring Assignments & Leave Requests
          </h4>

          <table className="table table-hover align-middle w-100">
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Exam</th>
                <th>Date</th>
                <th>Leave Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No assignments
                  </td>
                </tr>
              )}
              {assignments.map((pa) => {
                const leave = leaveMap[pa.id];
                const exam = exams.find((e) => e.id === pa.examId) || {};
                const date = exam.dateTime
                  ? new Date(exam.dateTime).toLocaleDateString()
                  : "—";
                return (
                  <tr key={pa.id}>
                    <td>{pa.id}</td>
                    <td>{exam.examName || "—"}</td>
                    <td>{date}</td>
                    <td>
                      {leave ? (
                        <span
                          className={`badge bg-${
                            leave.status === "ACCEPTED"
                              ? "success"
                              : leave.status === "REJECTED"
                              ? "danger"
                              : "secondary"
                          }`}
                        >
                          {leave.status}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {leave ? (
                        "—"
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(pa.id)}
                        >
                          Request Leave
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal alanı buraya gelecek */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Leave Request</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Leave Type</label>
                    <select
                      name="type"
                      className="form-select"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option>Medical Leave</option>
                      <option>Casual Leave</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">From</label>
                      <input
                        name="from"
                        type="date"
                        className="form-control"
                        value={form.from}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">To</label>
                      <input
                        name="to"
                        type="date"
                        className="form-control"
                        value={form.to}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      name="reason"
                      rows="3"
                      className="form-control"
                      value={form.reason}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Submitting…" : "Submit Leave"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default SubmitLeaveRequestTA;
