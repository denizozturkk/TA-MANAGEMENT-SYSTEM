// src/people/TA/PendingDutiesTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const PendingDutiesTA = () => {
  const taId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const hdrs = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [duties, setDuties] = useState([]);
  const [proctors, setProctors] = useState([]);
  const [extReqs, setExtReqs] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [modalType, setModalType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [extensionDays, setExtensionDays] = useState(1);
  const [leaveDates, setLeaveDates] = useState({ start: "", end: "" });
  const [fileForSubmit, setFileForSubmit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [respD, respE, respP, respL] = await Promise.all([
          fetch(`${BASE}/duty-logs/ta/${taId}`, { headers: hdrs }),
          fetch(`${BASE}/extension-requests/ta/${taId}`, { headers: hdrs }),
          fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs }),
          fetch(`${BASE}/leave-requests/ta/${taId}`, { headers: hdrs }),
        ]);

        if (!respD.ok) throw new Error("Duty logs fetch failed");
        setDuties(await respD.json());

        setExtReqs(await respE.json());
        setProctors(
          (await respP.json()).filter(
            (p) => p.status !== "COMPLETED" && p.status !== "CANCELLED"
          )
        );
        setLeaves(await respL.json());
      } catch (err) {
        console.error(err);
        alert("Failed to load pending duties");
      }
    };
    load();
  }, [taId]);

  const openModal = (type, item) => {
    setModalType(type);
    setSelected(item);
    setReason("");
    setExtensionDays(1);
    setLeaveDates({ start: "", end: "" });
    setFileForSubmit(null);
  };
  const closeModal = () => setModalType(null);

  const submitExtension = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        dutyLogId: selected.id,
        taId,
        instructorId: selected.facultyId,
        excuseType: "MEDICAL_REPORT",
        requestedExtensionDays: extensionDays,
        reason,
      };
      const res = await fetch(`${BASE}/extension-requests`, {
        method: "POST",
        headers: { ...hdrs, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const newExt = await res.json();
      setExtReqs((er) => [...er, newExt]);
      closeModal();
    } catch (err) {
      alert("Extension request failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        taId,
        proctorAssignmentId: selected.id,
        startDate: leaveDates.start,
        endDate: leaveDates.end,
        reason,
      };
      const res = await fetch(
        `${BASE}/leave-requests?taId=${taId}&proctorAssignmentId=${selected.id}`,
        {
          method: "POST",
          headers: { ...hdrs, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const newLeave = await res.json();
      setLeaves((ls) => [...ls, newLeave]);
      closeModal();
    } catch (err) {
      alert("Leave request failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDutyForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("taId", taId);
      formData.append("file", fileForSubmit);

      const res = await fetch(
        `${BASE}/duty-logs/${selected.id}/submit?taId=${taId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setDuties((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
      closeModal();
    } catch (err) {
      alert("Failed to submit duty: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit proctor assignment and increment TA workload
  const submitProctor = async (proctorId) => {
    try {
      const pa = proctors.find((p) => p.id === proctorId);
      if (!pa) throw new Error("Assignment not found");

      // 1) fetch exam duration
      const examRes = await fetch(`${BASE}/exams/${pa.examId}`, { headers: hdrs });
      if (!examRes.ok) throw new Error("Failed to fetch exam details");
      const exam = await examRes.json();
      const duration = exam.duration;

      // 2) complete assignment
      const updatedDto = { ...pa, status: "COMPLETED" };
      const res = await fetch(`${BASE}/proctor-assignments/${proctorId}`, {
        method: "PUT",
        headers: { ...hdrs, "Content-Type": "application/json" },
        body: JSON.stringify(updatedDto),
      });
      if (!res.ok) throw new Error("Assignment update failed");
      const returned = await res.json();

      const workloadRes = await fetch(
        `${BASE}/ta/${taId}/workload?increment=${duration}`,
        {
          method: "POST",
          headers: hdrs,
        }
      );
      if (!workloadRes.ok) throw new Error("Failed to update workload");

      // 4) update local proctors
      setProctors((prev) =>
        prev
          .map((p) => (p.id === proctorId ? returned : p))
          .filter((p) => p.status === "ASSIGNED")
      );
    } catch (err) {
      alert("Failed to submit proctoring: " + err.message);
    }
  };

  const downloadTa = async (dutyId, fileName) => {
    try {
      const res = await fetch(
        `${BASE}/duty-logs/${dutyId}/downloadTa?taId=${taId}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "duty-proof.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  return (
<div className="d-flex flex-column flex-md-row">      
  <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      <div className="container-fluid py-4">
        <h3 className="fw-bold mb-4 text-primary">
          Pending Duties & Proctoring
        </h3>

        <div className="card mb-5 shadow-sm">
        <div className="card-body">
            <h5>Other Duties</h5>
         <div className="table-responsive">
            <table className="table">
            <thead>
                <tr>
                <th>Deadline</th>
                <th>Type</th>
                <th>Workload</th>
                <th>Status</th>
                <th>Proof</th>
                <th>Extension</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {duties.map((d) => {
                const ext = extReqs.find((x) => x.dutyLogId === d.id);
                return (
                    <tr key={d.id}>
                    <td>{new Date(d.endTime).toLocaleString()}</td>
                    <td>{d.taskType}</td>
                    <td>{d.workload}</td>
                    <td>{d.status}</td>
                    <td>
                        {d.fileNameTa ? (
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => downloadTa(d.id, d.fileNameTa)}
                        >
                            Download
                        </button>
                        ) : (
                        <span className="text-muted">No file</span>
                        )}
                    </td>
                    <td>
                        {ext ? (
                        <span
                            className={`badge ${
                            ext.status === "REJECTED" ? "bg-danger" : "bg-info"
                            }`}
                        >
                            {ext.status}
                        </span>
                        ) : d.status === "PENDING" ? (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openModal("extension", d)}
                        >
                            Request
                        </button>
                        ) : (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                        >
                            Request
                        </button>
                        )}
                    </td>
                    <td>
                        {d.status === "PENDING" && (
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => openModal("submitDuty", d)}
                        >
                            Submit
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

        {/* Proctoring Assignments */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Proctoring Assignments</h5>
            <div className="table-responsive">
            <table className="table">
              
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Status</th>
                  <th>Leave</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {proctors
                  .filter((p) => p.status === "ASSIGNED")
                  .map((p) => {
                    const lv = leaves.find((l) => l.proctorAssignmentId === p.id);
                    return (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.status}</td>
                        <td>
                          {lv ? (
                            <span className="badge bg-info">{lv.status}</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openModal("leave", p)}
                            >
                              Request
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            disabled={!!lv}
                            onClick={() => submitProctor(p.id)}
                          >
                            Submit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Modal */}
      {modalType === "extension" && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Extension</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={submitExtension}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Days to Extend</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={extensionDays}
                      onChange={(e) => setExtensionDays(+e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {modalType === "leave" && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Leave</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={submitLeave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveDates.start}
                      onChange={(e) => setLeaveDates((ld) => ({ ...ld, start: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveDates.end}
                      onChange={(e) => setLeaveDates((ld) => ({ ...ld, end: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Leave"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Submit Duty Modal */}
      {modalType === "submitDuty" && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Duty Work</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={handleSubmitDutyForm}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Attach PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="form-control"
                      onChange={(e) => setFileForSubmit(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Duty"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDutiesTA;