// src/people/Admin/ReviewReportRequestsAdmin.jsx
import React, { useState, useEffect } from "react"
import LayoutAdmin from "../Admin/Layout-Admin"
import ConfirmModal from "../../components/ConfirmModal"

const ReviewReportRequestsAdmin = () => {
  const [requests, setRequests] = useState([])
  const [modalReq, setModalReq] = useState(null)

  const token = localStorage.getItem("authToken")
  const BASE  = "http://localhost:8080/api/admin"
  const hdrs  = { "Authorization": `Bearer ${token}` }

  // fetch on mount
  useEffect(() => {
    fetch(`${BASE}/report-requests`, {
      headers: { ...hdrs, Accept: "application/json" }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setRequests)
      .catch(err => {
        console.error("Failed to load requests:", err)
        alert("Unable to load report requests")
      })
  }, [])

  const openModal  = req => setModalReq(req)
  const closeModal = () => setModalReq(null)

  const handleApprove = () => {
    fetch(`${BASE}/report-requests/${modalReq.id}/accept`, {
      method: "POST", headers: hdrs
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText)
        // mark locally as accepted
        setRequests(rs =>
          rs.map(x =>
            x.id === modalReq.id
              ? { ...x, status: "ACCEPTED" }
              : x
          )
        )
        closeModal()
      })
      .catch(err => {
        console.error("Approve failed:", err)
        alert("Could not accept request")
      })
  }

  const fmt = ts =>
    ts ? new Date(ts).toLocaleString() : "–"

  return (
    <LayoutAdmin>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            Review Report Requests
          </h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>From</th>
                  <th>Type</th>
                  <th>Requested On</th>
                  <th>From Time</th>
                  <th>To Time</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No pending requests
                    </td>
                  </tr>
                )}
                {requests.map(r => (
                  <tr key={r.id}>
                    <td>
                      {r.requesterFirstName} {r.requesterLastName}
                    </td>
                    <td className="text-capitalize">
                      {r.reportType.toLowerCase()}
                    </td>
                    <td>{fmt(r.createdAt)}</td>
                    <td>{fmt(r.fromTime)}</td>
                    <td>{fmt(r.toTime)}</td>
                    <td>{r.details || "–"}</td>
                    <td>
                      {r.status === "PENDING" ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => openModal(r)}
                        >
                          Approve
                        </button>
                      ) : (
                        <span
                          className={`badge ${
                            r.status === "ACCEPTED"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {r.status.toLowerCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={!!modalReq}
        title={`Approve Request #${modalReq?.id}`}
        message={
          modalReq
            ? `Send the requested report to ${modalReq.requesterFirstName}
               ${modalReq.requesterLastName}?`
            : ""
        }
        confirmText="Approve"
        cancelText="Cancel"
        onConfirm={handleApprove}
        onCancel={closeModal}
      />
    </LayoutAdmin>
  )
}

export default ReviewReportRequestsAdmin




