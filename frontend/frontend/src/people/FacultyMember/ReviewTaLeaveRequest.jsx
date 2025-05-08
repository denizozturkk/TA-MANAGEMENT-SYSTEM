// src/people/TA/LeaveRequest.jsx
import React, { useEffect, useState } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const LeaveRequest = () => {
  const [facultyId, setFacultyId] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [tas, setTAs] = useState({});
  const [proctorAssignments, setProctorAssignments] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null); // "ACCEPTED" or "REJECTED"

  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1) fetch current user to get facultyId
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers })
      .then(res => res.json())
      .then(user => setFacultyId(user.id))
      .catch(err => console.error("Profile fetch error:", err));
  }, [token]);

  // 2) once we have facultyId, fetch only that member’s leave requests
  useEffect(() => {
    if (!facultyId) return;
    fetch(`${BASE}/faculty-members/${facultyId}/leave-requests`, { headers })
      .then(res => res.json())
      .then(setLeaveData)
      .catch(err => console.error("Leave-requests fetch error:", err));
  }, [facultyId]);

  // 3) load all TAs for name lookup
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/ta`, { headers })
      .then(res => res.json())
      .then(data => {
        const taMap = {};
        data.forEach(ta => {
          taMap[ta.id] = `${ta.firstName} ${ta.lastName}`;
        });
        setTAs(taMap);
      })
      .catch(err => console.error("TA fetch error:", err));
  }, [token]);

  // 4) load all proctor‐assignments for status lookup
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/proctor-assignments`, { headers })
      .then(res => res.json())
      .then(data => {
        const paMap = {};
        data.forEach(pa => {
          paMap[pa.id] = pa.status;
        });
        setProctorAssignments(paMap);
      })
      .catch(err => console.error("PA fetch error:", err));
  }, [token]);

  const handleStatusUpdate = (id, newStatus) => {
    const leave = leaveData.find(lr => lr.id === id);
    if (!leave) return;

    fetch(`${BASE}/leave-requests/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...leave, status: newStatus }),
    })
      .then(res => res.json())
      .then(updated => {
        setLeaveData(ld =>
          ld.map(lr => (lr.id === updated.id ? updated : lr))
        );
        setSelectedLeave(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <h3 className="fw-bold mb-4">Leave Requests</h3>
        <div className="card mb-3">
          <div className="card-body">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>TA</th>
                  <th>Proctor Assignment</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveData.map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{tas[item.taId] || item.taId}</td>
                    <td>
                      {proctorAssignments[item.proctorAssignmentId] ||
                        item.proctorAssignmentId}
                    </td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === "WAITING_RESPONSE"
                            ? "bg-warning"
                            : item.status === "ACCEPTED"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={item.status !== "WAITING_RESPONSE"}
                          onClick={() => {
                            setSelectedLeave(item);
                            setActionType("ACCEPTED");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={item.status !== "WAITING_RESPONSE"}
                          onClick={() => {
                            setSelectedLeave(item);
                            setActionType("REJECTED");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedLeave && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {actionType === "ACCEPTED"
                      ? "Approve Leave"
                      : "Reject Leave"}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedLeave(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to{" "}
                    <strong>
                      {actionType === "ACCEPTED" ? "approve" : "reject"}
                    </strong>{" "}
                    leave request <strong>#{selectedLeave.id}</strong> for TA{" "}
                    <strong>
                      {tas[selectedLeave.taId] || selectedLeave.taId}
                    </strong>
                    ?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedLeave(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn ${
                      actionType === "ACCEPTED"
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                    onClick={() =>
                      handleStatusUpdate(selectedLeave.id, actionType)
                    }
                  >
                    {actionType === "ACCEPTED" ? "Approve" : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
