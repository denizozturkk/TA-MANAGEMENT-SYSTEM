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
  const [classrooms, setClassrooms] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Medical Leave",
    reason: "",
  });
  const [currentAssignId, setCurrentAssignId] = useState(null);
  const [saving, setSaving] = useState(false);

    useEffect(() => {
    const load = async () => {
        setLoading(true);
        try {
        const [asgnRes, leaveRes, examRes, classRes] = await Promise.all([
            fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs }),
            fetch(`${BASE}/leave-requests/ta/${taId}`, { headers: hdrs }),
            fetch(`${BASE}/exams`, { headers: hdrs }),
            fetch(`${BASE}/classrooms`, { headers: hdrs }),
        ]);

        const allAsgn = await asgnRes.json();
        const allLeaves = await leaveRes.json();
        const allExams = await examRes.json();
        const allClassrooms = await classRes.json();

        setAssignments(Array.isArray(allAsgn) ? allAsgn : []);
        setLeaves(Array.isArray(allLeaves) ? allLeaves : []);
        setExams(Array.isArray(allExams) ? allExams : []);
        setClassrooms(Array.isArray(allClassrooms) ? allClassrooms : []);
        } catch (err) {
        console.error(err);
        alert("Error loading assignments, leaves, exams, or classrooms");
        } finally {
        setLoading(false);
        }
    };
    load();
    }, [taId]);


  const leaveMap = Object.fromEntries(
    leaves.map((l) => [l.proctorAssignmentId, l])
  );

  const openModal = (assignId) => {
    setCurrentAssignId(assignId);
    setForm({ type: "Medical Leave", reason: "" });
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
<div className="d-flex flex-column flex-md-row">      
  <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">
              Proctoring Assignments & Leave Requests
            </h4>
        <div className="table-responsive">

            <table className="table table-hover align-middle w-100">
            <thead>
            <tr>
                <th>Exam</th>
                <th>Date & Time</th>
                <th>Classroom</th>
                <th>Leave Request Status</th>
                <th>Action</th>
            </tr>
            </thead>
                <tbody>
                {assignments.length === 0 && (
                    <tr>
                    <td colSpan="5" className="text-center">No assignments</td>
                    </tr>
                )}
                {assignments.map((pa) => {
                    const leave = leaveMap[pa.id];
                    const exam = exams.find((e) => e.id === pa.examId) || {};
                    const room = classrooms.find((r) => r.id === pa.classroomId) || {};

                    const date = exam.dateTime
                    ? new Date(exam.dateTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        })
                    : "—";

                    const roomInfo = room.building && room.roomNumber
                    ? `${room.building}, Room ${room.roomNumber}`
                    : "—";

                    return (
                    <tr key={pa.id}>
                        <td>{exam.examName || "—"}</td>
                        <td>{date}</td>
                        <td>{roomInfo}</td>
                        <td>
                        {leave ? (
                            <span
                            className={`badge text-uppercase px-2 py-1 fw-semibold text-wrap ${
                                leave.status === "ACCEPTED"
                                ? "bg-success text-white"
                                : leave.status === "REJECTED"
                                ? "bg-danger text-white"
                                : "bg-light text-dark border"
                            }`}
                            style={{ fontSize: "0.75rem" }}
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

        </div>

        {modalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Submit Leave Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                  />
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
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
