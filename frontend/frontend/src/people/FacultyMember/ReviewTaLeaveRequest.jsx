import React, { useEffect, useState } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [tas, setTAs] = useState({});
  const [proctorAssignments, setProctorAssignments] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null); // "ACCEPTED" or "REJECTED"

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://localhost:8080/api/leave-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(setLeaveData)
      .catch(err => console.error("Leave requests fetch error:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/ta", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const taMap = {};
        data.forEach(ta => (taMap[ta.id] = ta.fullName));
        setTAs(taMap);
      });

    fetch("http://localhost:8080/api/proctor-assignments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const paMap = {};
        data.forEach(pa => (paMap[pa.id] = pa.status));
        setProctorAssignments(paMap);
      });
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const leave = leaveData.find(lr => lr.id === id);
    if (!leave) return;

    const updatedLeave = {
      ...leave,
      status: newStatus
    };

    fetch(`http://localhost:8080/api/leave-requests/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedLeave)
    })
      .then(res => res.json())
      .then(updated => {
        setLeaveData(prev =>
          prev.map(lr => (lr.id === updated.id ? updated : lr))
        );
        setSelectedLeave(null); // modal kapansın
      })
      .catch(err => console.error("Update error:", err));
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout />
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
                {leaveData.map((item, index) => (
                  <tr key={index}>
                    <td>#{item.id}</td>
                    <td>{tas[item.taId] || item.taId}</td>
                    <td>{proctorAssignments[item.proctorAssignmentId] || item.proctorAssignmentId}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span className={`badge ${
                        item.status === "WAITING_RESPONSE" ? "bg-warning" :
                        item.status === "ACCEPTED" ? "bg-success" : "bg-danger"
                      }`}>
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
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {actionType === "ACCEPTED" ? "Approve Leave" : "Reject Leave"}
                  </h5>
                  <button className="btn-close" onClick={() => setSelectedLeave(null)}></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to{" "}
                    <strong>{actionType === "ACCEPTED" ? "approve" : "reject"}</strong>{" "}
                    leave request <strong>#{selectedLeave.id}</strong> for TA:{" "}
                    <strong>{tas[selectedLeave.taId] || selectedLeave.taId}</strong>?
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedLeave(null)}>
                    Cancel
                  </button>
                  <button
                    className={`btn ${actionType === "ACCEPTED" ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleStatusUpdate(selectedLeave.id, actionType)}
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
