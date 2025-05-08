import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const ReviewDutyExtension = () => {
  const [requests, setRequests] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid or missing JWT token:", token);
      return;
    }

    fetch("http://localhost:8080/api/extension-requests", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 403) throw new Error("Forbidden");
        return res.json();
      })
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching extension requests:", err);
        setRequests([]);
      });

    fetch("http://localhost:8080/api/ta", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 403) throw new Error("Forbidden");
        return res.json();
      })
      .then(data => setAllTAs(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching TAs:", err);
        setAllTAs([]);
      });
  }, [token]);

  const openModal = (req) => {
    setSelectedReq(req);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReq(null);
  };

  const respond = (status) => {
    if (!selectedReq) return;
    fetch(
      `http://localhost:8080/api/extension-requests/${selectedReq.id}/respond?status=${status}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )
      .then(res => {
        if (res.status === 403) throw new Error("Forbidden");
        return res.json();
      })
      .then(updated => {
        setRequests(prev =>
          prev.map(r =>
            r.id === updated.id
              ? { ...r, status: updated.status }
              : r
          )
        );
        closeModal();
      })
      .catch(err => {
        console.error("Error responding to request:", err);
        closeModal();
      });
  };

  const getTAName = (taId) => {
    const ta = allTAs.find(t => t.id === taId);
    return ta ? ta.fullName || ta.name : `#${taId}`;
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <FacultyMemberLayout />
      </div>
      <div className="container-fluid py-4">
        <h3 className="fw-bold mb-4 text-center text-lg-start">Duty Extension Requests</h3>

        <div className="card">
          <div className="card-body table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>TA</th>
                  <th>Requested Days</th>
                  <th>Requested At</th>
                  <th>Excuse Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-center">Respond</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{getTAName(r.taId)}</td>
                    <td>{r.requestedExtensionDays}</td>
                    <td>{new Date(r.requestedAt).toLocaleString()}</td>
                    <td>{r.excuseType}</td>
                    <td>{r.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === "PENDING"
                            ? "bg-warning"
                            : r.status === "ACCEPTED"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => openModal(r)}
                        disabled={r.status !== "PENDING"}
                      >
                        View & Respond
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No extension requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && selectedReq && (
          <>
            <div className="modal-backdrop fade show" />
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Respond to Request #{selectedReq.id}</h5>
                    <button type="button" className="btn-close" onClick={closeModal} />
                  </div>
                  <div className="modal-body">
                    <p><strong>TA:</strong> {getTAName(selectedReq.taId)}</p>
                    <p><strong>Requested Days:</strong> {selectedReq.requestedExtensionDays}</p>
                    <p><strong>Requested At:</strong> {new Date(selectedReq.requestedAt).toLocaleString()}</p>
                    <p><strong>Excuse Type:</strong> {selectedReq.excuseType}</p>
                    <p><strong>Reason:</strong> {selectedReq.reason}</p>
                  </div>
                  <div className="modal-footer d-flex flex-column flex-md-row justify-content-end gap-2">
                    <button className="btn btn-success" onClick={() => respond("ACCEPTED")}>Approve</button>
                    <button className="btn btn-danger" onClick={() => respond("REJECTED")}>Reject</button>
                    <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDutyExtension;
