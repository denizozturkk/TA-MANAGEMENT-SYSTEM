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
        const logs = await respD.json();
        setDuties(Array.isArray(logs) ? logs : []);

        const allE = await respE.json();
        setExtReqs(Array.isArray(allE) ? allE : []);

        const allP = await respP.json();
        setProctors(Array.isArray(allP) ? allP.filter(p => p.status !== "COMPLETED" && p.status !== "CANCELLED") : []);

        const allL = await respL.json();
        setLeaves(Array.isArray(allL) ? allL : []);
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
  };
  const closeModal = () => setModalType(null);

  const submitExtension = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        dutyLogId: selected.id,
        taId,
        instructorId: selected.facultyId,
        excuseType: "MEDICAL_REPORT",
        requestedExtensionDays: extensionDays,
        reason
      };
      const res = await fetch(`${BASE}/extension-requests`, {
        method: "POST",
        headers: { ...hdrs, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const ext = await res.json();
      setExtReqs(er => [...er, ext]);
      closeModal();
    } catch (err) {
      alert("Extension request failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLeave = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        taId,
        proctorAssignmentId: selected.id,
        startDate: leaveDates.start,
        endDate: leaveDates.end,
        reason
      };
      const res = await fetch(`${BASE}/leave-requests?taId=${taId}&proctorAssignmentId=${selected.id}`, {
        method: "POST",
        headers: { ...hdrs, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const lv = await res.json();
      setLeaves(ls => [...ls, lv]);
      closeModal();
    } catch (err) {
      alert("Leave request failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      <div className="container-fluid py-4">
        <h3 className="fw-bold mb-4 text-primary">Pending Duties & Proctoring</h3>

        <div className="card mb-5 shadow-sm">
          <div className="card-body">
            <h5>Other Duties</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Type</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Extension</th>
                  <th>Proof</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {duties.map(d => {
                  const ext = extReqs.find(x => x.dutyLogId === d.id);
                  return (
                    <tr key={d.id}>
                      <td>{new Date(d.dateTime).toLocaleString()}</td>
                      <td>{d.taskType}</td>
                      <td>{d.workload}</td>
                      <td>{d.status}</td>
                      <td>
                        {ext ? (
                          <span className="badge bg-info">{ext.status}</span>
                        ) : (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openModal("extension", d)}>Request</button>
                        )}
                      </td>
                      <td>
                        {d.fileUrlTa ? (
                          <a href={d.fileUrlTa} className="btn btn-sm btn-primary" download>Download</a>
                        ) : "—"}
                      </td>
                      <td>
                        {d.status === "PENDING" && (
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openModal("proof-duty", d)}>Upload Proof</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Proctoring Assignments</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Status</th>
                  <th>Leave</th>
                  <th>Proof</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {proctors.map(p => {
                  const lv = leaves.find(l => l.proctorAssignmentId === p.id);
                  return (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.status}</td>
                      <td>
                        {lv ? (
                          <span className="badge bg-info">{lv.status}</span>
                        ) : (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openModal("leave", p)}>Request</button>
                        )}
                      </td>
                      <td>
                        {p.proofUrl ? (
                          <a href={p.proofUrl} className="btn btn-sm btn-primary" download>Download</a>
                        ) : "—"}
                      </td>
                      <td>
                        {p.status === "ASSIGNED" && (
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openModal("proof-proctor", p)}>Upload Proof</button>
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
              <input type="number" className="form-control" min="1" value={extensionDays} onChange={e => setExtensionDays(+e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
              <textarea className="form-control" rows="3" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* Modal: Leave */}
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
              <input type="date" className="form-control" value={leaveDates.start} onChange={e => setLeaveDates(ld => ({ ...ld, start: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control" value={leaveDates.end} onChange={e => setLeaveDates(ld => ({ ...ld, end: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
              <textarea className="form-control" rows="3" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Leave"}
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
