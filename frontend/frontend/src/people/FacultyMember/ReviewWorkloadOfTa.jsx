// src/people/TA/DutiesByDepartmentPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Departments = ["CS", "EE", "IE", "ME"];

const DutiesByDepartmentPage = () => {
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ————————————————————————————
  // State
  // ————————————————————————————
  const [facultyId, setFacultyId] = useState(null);
  const [tas, setTAs] = useState([]);
  const [exams, setExams] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [filteredTAs, setFilteredTAs] = useState([]);
  const [selectedTA, setSelectedTA] = useState("");

  const [dutyLogs, setDutyLogs] = useState([]);
  const [proctors, setProctors] = useState([]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  // ————————————————————————————
  // Fetch current user's facultyId
  // ————————————————————————————
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((user) => setFacultyId(user.id))
      .catch((err) => console.error("Profile fetch error:", err));
  }, [token]);

  // ————————————————————————————
  // Load TAs, Exams, Classrooms once we know we're authenticated
  // ————————————————————————————
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/ta`, { headers })
      .then((r) => r.json())
      .then((data) => setTAs(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/exams`, { headers })
      .then((r) => r.json())
      .then((data) => setExams(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/classrooms`, { headers })
      .then((r) => r.json())
      .then((data) => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  // ————————————————————————————
  // Filter TAs when department changes
  // ————————————————————————————
  useEffect(() => {
    setSelectedTA("");
    setDutyLogs([]);
    setProctors([]);
    if (!selectedDept) {
      setFilteredTAs([]);
    } else {
      setFilteredTAs(tas.filter((t) => t.department === selectedDept));
    }
  }, [selectedDept, tas]);

  // ————————————————————————————
  // Load duty logs & proctors when a TA is selected
  // ————————————————————————————
  useEffect(() => {
    if (!selectedTA) {
      setDutyLogs([]);
      setProctors([]);
      return;
    }

    fetch(`${BASE}/duty-logs/ta/${selectedTA}`, { headers })
      .then((r) => r.json())
      .then((data) => setDutyLogs(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${BASE}/proctor-assignments/ta/${selectedTA}`, { headers })
      .then((r) => r.json())
      .then((data) => setProctors(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [selectedTA]);

  // ————————————————————————————
  // Helpers to look up names
  // ————————————————————————————
  const getExamName = (id) => {
    const e = exams.find((x) => x.id === id);
    return e ? e.examName : `Exam #${id}`;
  };
  const getRoomName = (id) => {
    const c = classrooms.find((x) => x.id === id);
    return c ? `${c.building} ${c.roomNumber}` : `Room #${id}`;
  };

  // ————————————————————————————
  // Approve a duty log
  // ————————————————————————————
  const handleAcceptDuty = async (id) => {
    if (!facultyId) return;
    try {
      await fetch(
        `${BASE}/faculty-members/${facultyId}/tas/${selectedTA}/duty-logs/${id}/review?status=APPROVED`,
        { method: "POST", headers }
      );
      setDutyLogs((dl) =>
        dl.map((item) =>
          item.id === id ? { ...item, status: "APPROVED" } : item
        )
      );
    } catch (err) {
      console.error("Approve duty failed:", err);
    }
  };

  // ————————————————————————————
  // Open reject modal
  // ————————————————————————————
  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // ————————————————————————————
  // Reject a duty log
  // ————————————————————————————
  const handleRejectDuty = async () => {
    if (!facultyId) return;
    try {
      await fetch(
        `${BASE}/faculty-members/${facultyId}/tas/${selectedTA}/duty-logs/${rejectingId}/review?status=REJECTED&reason=${encodeURIComponent(
          rejectReason
        )}`,
        { method: "POST", headers }
      );
      setDutyLogs((dl) =>
        dl.map((item) =>
          item.id === rejectingId ? { ...item, status: "REJECTED" } : item
        )
      );
      setShowRejectModal(false);
    } catch (err) {
      console.error("Reject duty failed:", err);
    }
  };

  // ————————————————————————————
  // Don't render until we know facultyId
  // ————————————————————————————
  if (facultyId === null) {
    return <div>Loading your profile…</div>;
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <h3 className="fw-bold mb-4 text-center text-lg-start">
              View TA Duty Logs & Proctors
            </h3>

            {/* Department selector */}
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">-- choose department --</option>
                {Departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* TA selector */}
            {selectedDept && (
              <div className="mb-3">
                <label className="form-label">Teaching Assistant</label>
                <select
                  className="form-select"
                  value={selectedTA}
                  onChange={(e) => setSelectedTA(e.target.value)}
                >
                  <option value="">-- choose TA --</option>
                  {filteredTAs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Duty Logs */}
            {selectedTA && (
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="mb-3 border-bottom pb-2">Duty Logs</h5>
                  {dutyLogs.length === 0 ? (
                    <p className="text-muted">No duty logs found.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover text-nowrap align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Task Type</th>
                            <th>Workload</th>
                            <th>Start Time</th>
                            <th>Status</th>
                            <th>Proof</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                            {dutyLogs.map((dl) => (
                              <tr key={dl.id}>
                                <td>{dl.id}</td>
                                <td>{dl.taskType}</td>
                                <td>{dl.workload}</td>
                                <td>{new Date(dl.startTime).toLocaleString()}</td>
                                <td>{dl.status}</td>
                                <td>
                                  {dl.proofUrl ? (
                                    <a
                                      href={dl.proofUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      Download
                                    </a>
                                  ) : (
                                    <span className="text-muted">No file</span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-success me-2"
                                    disabled={dl.status !== "SUBMITTED"}
                                    onClick={() => handleAcceptDuty(dl.id)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    disabled={dl.status !== "SUBMITTED"}
                                    onClick={() => openRejectModal(dl.id)}
                                  >
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Proctor Assignments (unchanged) */}
            {selectedTA && (
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 border-bottom pb-2">
                    Proctor Assignments
                  </h5>
                  {proctors.length === 0 ? (
                    <p className="text-muted">
                      No proctor assignments found.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover text-nowrap align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Exam</th>
                            <th>Classroom</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proctors.map((pa) => (
                            <tr key={pa.id}>
                              <td>{getExamName(pa.examId)}</td>
                              <td>{getRoomName(pa.classroomId)}</td>
                              <td>{pa.status}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-success me-2"
                                  disabled={pa.status !== "SUBMITTED"}
                                  onClick={() => {
                                    /* TODO: wire up proctor review */
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  disabled={pa.status !== "SUBMITTED"}
                                  onClick={() => {
                                    /* TODO: wire up proctor review */
                                  }}
                                >
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Duty Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="form-label">Reason</label>
          <textarea
            className="form-control"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Enter reason for rejection"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectDuty}>
            Submit Rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DutiesByDepartmentPage;