// src/people/TA/ReportTotalWorkloadTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const ReportTotalWorkloadTA = () => {
  const taId = /* your TA’s ID, e.g. from context */ 123;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofDesc, setProofDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  // load your workload reports and their statuses
  useEffect(() => {
    fetch(`/api/workload-reports?taId=${taId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reports");
        return res.json();
      })
      .then((data) => setReports(data))
      .catch((err) => {
        console.error(err);
        alert("Error loading reports");
      })
      .finally(() => setLoading(false));
  }, [taId]);

  const openModal = (report) => {
    setSelectedReport(report);
    setProofFile(null);
    setProofDesc("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFileChange = (e) => setProofFile(e.target.files[0]);
  const handleDescChange = (e) => setProofDesc(e.target.value);

  const submitProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      return alert("Please select a PDF to upload");
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", proofFile);
    formData.append("description", proofDesc);

    try {
      const res = await fetch(
        `/api/workload-reports/${selectedReport.id}/proof`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to upload proof");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading workload reports…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Report Total Workload
          </h4>
          <table className="table table-striped w-100">
            <thead>
              <tr>
                <th>Date</th>
                <th>Work Type</th>
                <th>Hours</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No reports yet
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.workType}</td>
                    <td>{r.hours}</td>
                    <td>{r.notes}</td>
                    <td>
                      {r.status === "WAITING_RESPONSE" && (
                        <span className="badge bg-secondary">Waiting</span>
                      )}
                      {r.status === "ACCEPTED" && (
                        <span className="badge bg-success">Accepted</span>
                      )}
                      {r.status === "REJECTED" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                    </td>
                    <td>
                      {r.status === "WAITING_RESPONSE" ||
                      r.status === "REJECTED" ? (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(r)}
                        >
                          {r.status === "REJECTED"
                            ? "Resubmit Proof"
                            : "Upload Proof"}
                        </button>
                      ) : r.status === "ACCEPTED" && r.proofUrl ? (
                        <a
                          href={r.proofUrl}
                          className="btn btn-sm btn-primary"
                          download
                        >
                          Download Proof
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={submitProof}>
                <div className="modal-header">
                  <h5 className="modal-title">Upload Proof for Report #{selectedReport.id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">PDF File</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="form-control"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={proofDesc}
                      onChange={handleDescChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Send Proof"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LayoutTA>
  );
};

export default ReportTotalWorkloadTA;
