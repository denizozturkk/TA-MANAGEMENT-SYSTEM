// src/people/TA/PendingDutiesTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const PendingDutiesTA = () => {
  const taId   = localStorage.getItem("userId");
  const token  = localStorage.getItem("authToken");
  const BASE   = "http://localhost:8080/api";
  const hdrs   = { 
    "Accept":        "application/json", 
    "Authorization": `Bearer ${token}` 
  };

  // data
  const [duties,   setDuties]   = useState([]);
  const [proctors, setProctors] = useState([]);
  const [extReqs,  setExtReqs]  = useState([]);
  const [leaves,   setLeaves]   = useState([]);

  // modal state
  const [modalType,      setModalType]      = useState(null);
  const [selected,       setSelected]       = useState(null);
  const [file,           setFile]           = useState(null);
  const [reason,         setReason]         = useState("");
  const [extensionDays,  setExtensionDays]  = useState(1);
  const [leaveDates,     setLeaveDates]     = useState({start:"", end:""});
  const [submitting,     setSubmitting]     = useState(false);

  // load everything
  useEffect(() => {
    const load = async () => {
      try {
        // 1) duty-logs
        const respD = await fetch(`${BASE}/duty-logs?taId=${taId}`, { headers: hdrs });
        const allD  = await respD.json();
        setDuties(allD.filter(d => d.status !== "APPROVED"));

        // 2) extension-requests (by TA)
        const respE = await fetch(`${BASE}/extension-requests/ta/${taId}`, { headers: hdrs });
        setExtReqs(await respE.json());

        // 3) proctor assignments
        const respP = await fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs });
        setProctors((await respP.json()).filter(p => 
          p.status !== "COMPLETED" && p.status !== "CANCELLED"
        ));

        // 4) leave requests
        const respL = await fetch(`${BASE}/leave-requests/ta/${taId}`, { headers: hdrs });
        setLeaves(await respL.json());
      } catch (err) {
        console.error(err);
        alert("Failed to load pending duties");
      }
    };
    load();
  }, [taId]);

  // common handlers
  const openModal = (type, item) => {
    setModalType(type);
    setSelected(item);
    setFile(null);
    setReason("");
    setExtensionDays(1);
    setLeaveDates({ start: "", end: "" });
  };
  const closeModal = () => setModalType(null);

  // submiters
  const submitDutyProof = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(
        `${BASE}/duty-logs/${selected.id}/submit?taId=${taId}`, 
        { method: "POST", headers: { "Authorization": `Bearer ${token}` }, body: form }
      );
      if (!res.ok) throw new Error(await res.text());
      const upd = await res.json();
      setDuties(d => d.map(x => x.id===upd.id ? upd : x));
      closeModal();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitExtension = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        dutyLogId: selected.id,
        taId,
        instructorId: selected.facultyId,  // from DTO
        excuseType: "MEDICAL_REPORT",      // or let TA pick
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

  const submitProctorProof = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: your proctor-submit endpoint & form field names
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(
        `${BASE}/proctor-assignments/${selected.id}/submit?taId=${taId}`, 
        { method: "POST", headers: { "Authorization": `Bearer ${token}` }, body: form }
      );
      if (!res.ok) throw new Error(await res.text());
      const upd = await res.json();
      setProctors(p => p.map(x => x.id===upd.id ? upd : x));
      closeModal();
    } catch (err) {
      alert("Upload failed: " + err.message);
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
        endDate:   leaveDates.end,
        reason
      };
      const res = await fetch(
        `${BASE}/leave-requests?taId=${taId}&proctorAssignmentId=${selected.id}`, 
        {
          method: "POST",
          headers: { ...hdrs, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
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
    <LayoutTA>
      <h3 className="mb-4">Pending Duties & Proctoring</h3>

      {/* ———————— Other Duties ———————— */}
      <div className="card mb-5">
        <div className="card-body">
          <h5>Other Duties</h5>
          <table className="table">
            <thead>
              <tr>
                <th>When</th><th>Type</th><th>Hours</th><th>Status</th><th>Extension</th><th>Proof</th><th>Action</th>
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
                      {ext
                        ? ext.status
                        : <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={()=>openModal("extension", d)}
                          >Request</button>
                      }
                    </td>
                    <td>
                      {d.fileUrlTa 
                        ? <a href={d.fileUrlTa} className="btn btn-sm btn-primary" download>
                            Download
                          </a>
                        : "—"
                      }
                    </td>
                    <td>
                      {d.status === "PENDING" && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={()=>openModal("proof-duty", d)}
                        >Upload Proof</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ———————— Proctoring ———————— */}
      <div className="card">
        <div className="card-body">
          <h5>Proctoring Assignments</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Assignment ID</th><th>Status</th><th>Leave</th><th>Proof</th><th>Action</th>
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
                      {lv
                        ? lv.status
                        : <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={()=>openModal("leave", p)}
                          >Request</button>
                      }
                    </td>
                    <td>
                      {p.proofUrl 
                        ? <a href={p.proofUrl} className="btn btn-sm btn-primary" download>
                            Download
                          </a> 
                        : "—"
                      }
                    </td>
                    <td>
                      {p.status === "ASSIGNED" && (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={()=>openModal("proof-proctor", p)}
                        >Upload Proof</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ———————— Modals ———————— */}
      {modalType === "proof-duty" && (
        <Modal title={`Upload Proof (#${selected.id})`} onClose={closeModal}>
          <form onSubmit={submitDutyProof}>
            <input type="file" accept="application/pdf" 
                   onChange={e=>setFile(e.target.files[0])} required />
            <button type="submit" disabled={submitting}>
              {submitting ? "Uploading…" : "Submit"}
            </button>
          </form>
        </Modal>
      )}

      {modalType === "extension" && (
        <Modal title={`Request Extension (#${selected.id})`} onClose={closeModal}>
          <form onSubmit={submitExtension}>
            <div>
              <label>Days:</label>
              <input type="number" 
                     min="1" 
                     value={extensionDays} 
                     onChange={e=>setExtensionDays(+e.target.value)} />
            </div>
            <div>
              <label>Reason:</label>
              <textarea 
                value={reason} 
                onChange={e=>setReason(e.target.value)} 
                required
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Request"}
            </button>
          </form>
        </Modal>
      )}

      {modalType === "proof-proctor" && (
        <Modal title={`Upload Proctor Proof (#${selected.id})`} onClose={closeModal}>
          <form onSubmit={submitProctorProof}>
            <input type="file" accept="application/pdf" 
                   onChange={e=>setFile(e.target.files[0])} required />
            <button type="submit" disabled={submitting}>
              {submitting ? "Uploading…" : "Submit"}
            </button>
          </form>
        </Modal>
      )}

      {modalType === "leave" && (
        <Modal title={`Request Leave (#${selected.id})`} onClose={closeModal}>
          <form onSubmit={submitLeave}>
            <div>
              <label>From:</label>
              <input 
                type="date" 
                value={leaveDates.start}
                onChange={e=>setLeaveDates(ld=>({...ld, start: e.target.value}))}
                required
              />
            </div>
            <div>
              <label>To:</label>
              <input 
                type="date" 
                value={leaveDates.end}
                onChange={e=>setLeaveDates(ld=>({...ld, end: e.target.value}))}
                required
              />
            </div>
            <div>
              <label>Reason:</label>
              <textarea 
                value={reason} 
                onChange={e=>setReason(e.target.value)} 
                required
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Request"}
            </button>
          </form>
        </Modal>
      )}
    </LayoutTA>
  );
};

export default PendingDutiesTA;

// ------------------------------
// Simple reusable Modal component
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5>{title}</h5>
            <button onClick={onClose} className="btn-close" />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
