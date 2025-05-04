import React, { useState } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

// Mock data for duty extension requests
const extensionData = [
  {
    id: "EMP-00001",
    name: "Joan Dyer",
    avatar: "assets/images/xs/avatar1.jpg",
    duty: "Lab 1 - CS102",
    from: "12/03/2024",
    to: "14/03/2024",
    reason: "Need more time for lab preparation",
    status: "PENDING"
  },
  {
    id: "EMP-00038",
    name: "Ryan Randall",
    avatar: "assets/images/xs/avatar2.jpg",
    duty: "Final Exam - MATH101",
    from: "11/04/2024",
    to: "12/04/2024",
    reason: "Health issues, need additional time",
    status: "PENDING"
  },
  {
    id: "EMP-00007",
    name: "Phil Glover",
    avatar: "assets/images/xs/avatar3.jpg",
    duty: "Midterm - PHYS112",
    from: "11/04/2024",
    to: "12/04/2024",
    reason: "Travel delays",
    status: "PENDING"
  }
];

const DutyExtensionRequest = () => {
  const [extensionRequests, setExtensionRequests] = useState(extensionData);
  const [workloadError, setWorkloadError] = useState("");

  const handleApprove = (id) => {
    const updatedRequests = extensionRequests.map((item) =>
      item.id === id ? { ...item, status: "ACCEPTED" } : item
    );
    setExtensionRequests(updatedRequests);
  };

  const handleReject = (id, reason) => {
    const updatedRequests = extensionRequests.map((item) =>
      item.id === id ? { ...item, status: "REJECTED", rejectionReason: reason } : item
    );
    setExtensionRequests(updatedRequests);
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="row align-items-center">
          <div className="border-0 mb-4">
            <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
              <h3 className="fw-bold mb-0">Duty Extension Requests</h3>
            </div>
          </div>
        </div>

        <div className="row clearfix g-3">
          <div className="col-sm-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table table-hover align-middle mb-0" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>TA ID</th>
                      <th>TA Name</th>
                      <th>Duty</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extensionRequests.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <a href="#" className="fw-bold text-secondary">
                            #{item.id}
                          </a>
                        </td>
                        <td>
                          <img className="avatar rounded-circle" src={item.avatar} alt="" />
                          <span className="fw-bold ms-1">{item.name}</span>
                        </td>
                        <td>{item.duty}</td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>
                        <td>{item.reason}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "PENDING"
                                ? "bg-warning"
                                : item.status === "ACCEPTED"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {item.status === "PENDING"
                              ? "Pending"
                              : item.status === "ACCEPTED"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() => handleApprove(item.id)}
                              disabled={item.status !== "PENDING"}
                            >
                              <i className="icofont-check-circled"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#rejectModal"
                              disabled={item.status !== "PENDING"}
                            >
                              <i className="icofont-close-circled"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="rejectModalLabel">
                  Reject Extension Request
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this extension request?</p>
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    Please provide a reason:
                  </label>
                  <textarea
                    className="form-control"
                    id="rejectionReason"
                    rows="3"
                    placeholder="e.g. Overlapping duty, insufficient reason, etc."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const reason = document.getElementById("rejectionReason").value;
                    handleReject(extensionRequests[0].id, reason);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyExtensionRequest;
