// src/people/Admin/ReviewReportRequests-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5>{title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

const ReviewReportRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [modalReq, setModalReq] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api/admin";
  const hdrs = { "Authorization": `Bearer ${token}` };

  useEffect(() => {
    fetch(`${BASE}/report-requests`, {
      headers: { ...hdrs, "Accept": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(err => {
        console.error("Failed to fetch report requests:", err);
        alert("Unable to load report requests");
      });
  }, []);

  const openAcceptModal = req => {
    setModalReq(req);
    setPdfFile(null);
  };

  const closeModal = () => setModalReq(null);

  const handleUploadAndAccept = () => {
    if (!pdfFile) {
      return alert("Please select a PDF to upload");
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", pdfFile);

    fetch(`${BASE}/report-requests/${modalReq.id}/accept`, {
      method: "POST",
      headers: hdrs,
      body: form
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setRequests(reqs =>
          reqs.map(r =>
            r.id === modalReq.id ? { ...r, status: "ACCEPTED" } : r
          )
        );
        closeModal();
      })
      .catch(err => {
        console.error("Upload + accept failed:", err);
        alert("Could not accept request");
      })
      .finally(() => setUploading(false));
  };

  const handleReject = id => {
    fetch(`${BASE}/report-requests/${id}/reject`, {
      method: "POST",
      headers: hdrs
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        setRequests(reqs =>
          reqs.map(r =>
            r.id === id ? { ...r, status: "REJECTED" } : r
          )
        );
      })
      .catch(err => {
        console.error("Reject failed:", err);
        alert("Could not reject request");
      });
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sol Sidebar */}
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutAdmin />
      </div>

      {/* Sağ Ana İçerik */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-4 text-primary">Review Report Requests</h4>
                <table className="table table-hover align-middle w-100">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Report Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? (
                      requests.map(r => (
                        <tr key={r.id}>
                          <td>{r.requesterFirstName} {r.requesterLastName}</td>
                          <td>{r.reportType}</td>
                          <td>
                            <span className={
                              r.status === "PENDING"
                                ? "badge bg-warning text-dark"
                                : r.status === "ACCEPTED"
                                  ? "badge bg-success"
                                  : "badge bg-danger"
                            }>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            {r.status === "PENDING" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success me-2"
                                  onClick={() => openAcceptModal(r)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleReject(r.id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No report requests
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalReq && (
        <Modal
          title={`Send PDF to ${modalReq.requesterFirstName} ${modalReq.requesterLastName}`}
          onClose={closeModal}
        >
          <div className="mb-3">
            <label className="form-label">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={e => setPdfFile(e.target.files[0])}
            />
          </div>
          <div className="text-end">
            <button
              className="btn btn-primary"
              onClick={handleUploadAndAccept}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Send PDF & Accept"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReviewReportRequestsAdmin;
