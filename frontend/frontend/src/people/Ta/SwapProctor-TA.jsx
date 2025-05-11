import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SwapProctorTA = () => {
  const taId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";
  const hdrs = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [assignments, setAssignments] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [eligible, setEligible] = useState([]);
  const [allSwapRequests, setAllSwapRequests] = useState([]);

  const [modal, setModal] = useState({ type: null, assignment: null });
  const [decisioningId, setDecisioningId] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

    useEffect(() => {
    const loadData = async () => {
        try {
        const respA = await fetch(`${BASE}/proctor-assignments/ta/${taId}`, { headers: hdrs });
        const allA = await respA.json();
        const assigned = allA.filter((a) => a.status === "ASSIGNED");
        const assignmentIds = assigned.map((a) => a.id);
        const enrichedAssignments = await Promise.all(
        assigned.map(async (a) => {
            try {
            const [examRes, classRes] = await Promise.all([
                fetch(`${BASE}/exams/${a.examId}`, { headers: hdrs }),
                fetch(`${BASE}/classrooms/${a.classroomId}`, { headers: hdrs }),
            ]);
            const exam = await examRes.json();
            const room = await classRes.json();

            return {
                ...a,
                examName: exam.examName,
                examDateTime: exam.dateTime,
                classroom: `${room.building}, Room ${room.roomNumber}`,
            };
            } catch (err) {
            console.error("Failed to enrich assignment", a, err);
            return a;
            }
        })
        );

        setAssignments(enrichedAssignments);

        const respR = await fetch(`${BASE}/swap-requests`, { headers: hdrs });
        const allR = await respR.json();
        setAllSwapRequests(allR);

        // Filter only swap requests targeting the TA's current assignments
        const myIncoming = allR.filter((r) =>
            assignmentIds.includes(r.targetProctorAssignmentId)
        );

        // Enrich each request with fromTA, giving exam, taking exam
        const enrichedIncoming = await Promise.all(
        myIncoming.map(async (r) => {
            try {
            const [taRes, origPARes, targetPARes] = await Promise.all([
                fetch(`${BASE}/ta/${r.taId}`, { headers: hdrs }),
                fetch(`${BASE}/proctor-assignments/${r.proctorAssignmentId}`, { headers: hdrs }),
                fetch(`${BASE}/proctor-assignments/${r.targetProctorAssignmentId}`, { headers: hdrs }),
            ]);

            const taData = await taRes.json();
            const origPA = await origPARes.json();
            const targetPA = await targetPARes.json();

            const [exam1Res, exam2Res] = await Promise.all([
                fetch(`${BASE}/exams/${origPA.examId}`, { headers: hdrs }),
                fetch(`${BASE}/exams/${targetPA.examId}`, { headers: hdrs }),
            ]);

            const exam1 = await exam1Res.json();
            const exam2 = await exam2Res.json();

            return {
                ...r,
                fromTaName: taData.fullName || taData.name,
                givingExamName: exam1.examName,
                givingExamDate: exam1.dateTime,
                takingExamName: exam2.examName,
                takingExamDate: exam2.dateTime,
            };
            } catch (err) {
            console.error("Failed to enrich swap request", r, err);
            return r;
            }
        })
        );

        const pendingOnly = enrichedIncoming.filter((r) => r.status === "PENDING");
        setIncoming(pendingOnly);
        } catch (err) {
        console.error(err);
        alert("Failed to load swap data");
        }
    };

    loadData();
    }, [taId]);


  const openModal = async (type, assignment) => {
    setModal({ type, assignment });

    if (type === "swap") {
      try {
        const res = await fetch(
          `${BASE}/ta/${taId}/swappable-assignments?assignmentId=${assignment.id}`,
          { headers: hdrs }
        );
        const rawList = await res.json();

        const enriched = await Promise.all(
          rawList.map(async (a) => {
            try {
              const [taRes, examRes, roomRes] = await Promise.all([
                fetch(`${BASE}/ta/${a.taId}`, { headers: hdrs }),
                fetch(`${BASE}/exams/${a.examId}`, { headers: hdrs }),
                fetch(`${BASE}/classrooms/${a.classroomId}`, { headers: hdrs }),
              ]);

              const ta = await taRes.json();
              const exam = await examRes.json();
              const room = await roomRes.json();

              return {
                ...a,
                taName: ta.fullName || ta.name,
                examDateTime: exam.dateTime,
                examName: exam.examName || `${exam.courseCode || "Course"} ${exam.examType || ""}`,
                classroomName: room.roomNumber,
              };
            } catch (err) {
              console.error("Failed to enrich assignment:", a, err);
              return a;
            }
          })
        );

        const filteredEligible = enriched.filter(
        (assignment) =>
            !allSwapRequests.some(
            (r) =>
                r.proctorAssignmentId === assignment.id ||
                r.targetProctorAssignmentId === assignment.id
            )
        );

        setEligible(filteredEligible);
      } catch (err) {
        console.error("Failed to load swappable assignments:", err);
        setEligible([]);
      }
    }
  };

  const closeModal = () => {
    setModal({ type: null, assignment: null });
    setSelectedTarget(null);
  };

  const sendSwap = async () => {
    try {
      const { assignment } = modal;

      const isDuplicate = allSwapRequests.some(
        (r) =>
          r.proctorAssignmentId === assignment.id &&
          r.targetProctorAssignmentId === selectedTarget.id &&
          r.taId === parseInt(taId)
      );
      if (isDuplicate) {
        alert("You've already sent a swap request for this assignment.");
        return;
      }

      const res = await fetch(
        `${BASE}/swap-requests/send?originalId=${assignment.id}&targetId=${selectedTarget.id}&taId=${taId}`,
        { method: "POST", headers: hdrs }
      );

      if (!res.ok) throw new Error(await res.text());

      closeModal();
      alert("Swap request sent");
    } catch (err) {
      alert("Failed to send swap: " + err.message);
    }
  };

  const respondSwap = async (id, status) => {
    setDecisioningId(id);
    try {
      const res = await fetch(`${BASE}/swap-requests/${id}/respond?status=${status}`, {
        method: "PUT",
        headers: hdrs,
      });
      if (!res.ok) throw new Error(await res.text());
      setIncoming((curr) => curr.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to " + status + ": " + err.message);
    } finally {
      setDecisioningId(null);
    }
  };

  const isAssignmentInAnySwap = (assignmentId) => {
    return allSwapRequests.some(
      (r) =>
        r.proctorAssignmentId === assignmentId || r.targetProctorAssignmentId === assignmentId
    );
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4 text-primary">Swap Proctor</h4>

        <div className="card mb-4">
          <div className="card-body">
            <h5>My Proctor Assignments</h5>
            <table className="table">
            <thead>
            <tr>
                <th>Exam</th>
                <th>Date & Time</th>
                <th>Classroom</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {assignments.map((a) => (
                <tr key={a.id}>
                <td>{a.examName || `Exam #${a.examId}`}</td>
                <td>
                    {a.examDateTime
                    ? new Date(a.examDateTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        })
                    : "Unknown"}
                </td>
                <td>{a.classroom || `Room #${a.classroomId}`}</td>
                <td>
                    <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={isAssignmentInAnySwap(a.id)}
                    onClick={() => openModal("swap", a)}
                    >
                    {isAssignmentInAnySwap(a.id) ? "Swap Requested" : "Request Swap"}
                    </button>
                </td>
                </tr>
            ))}
            </tbody>

            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5>Incoming Swap Requests</h5>
            <table className="table">
              <thead>
                <tr>
                <th>From TA</th>
                <th>Taking</th>
                <th>Giving</th>
                <th>Decision</th>
                </tr>
              </thead>
                <tbody>
                {incoming.map((r) => (
                    <tr key={r.id}>
                    <td>{r.fromTaName}</td>
                    <td>
                        {r.givingExamName} <br />
                        {r.givingExamDate
                        ? new Date(r.givingExamDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                        : "Unknown"}
                    </td>
                    <td>
                        {r.takingExamName} <br />
                        {r.takingExamDate
                        ? new Date(r.takingExamDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                        : "Unknown"}
                    </td>
                    <td>
                        <button
                        className="btn btn-sm btn-success me-2"
                        disabled={decisioningId === r.id}
                        onClick={() => respondSwap(r.id, "APPROVED")}
                        >
                        Accept
                        </button>
                        <button
                        className="btn btn-sm btn-danger"
                        disabled={decisioningId === r.id}
                        onClick={() => respondSwap(r.id, "REJECTED")}
                        >
                        Reject
                        </button>
                    </td>
                    </tr>
                ))}
                {incoming.length === 0 && (
                    <tr>
                    <td colSpan="4" className="text-center">
                        No incoming requests
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </div>

        {modal.type === "swap" && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Swap Target</h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  {eligible.length === 0 ? (
                    <p>No eligible proctors found for swapping.</p>
                  ) : (
                    <ul className="list-group">
                      {eligible.map((a) => (
                        <li
                          key={a.id}
                          className={`list-group-item list-group-item-action ${
                            selectedTarget?.id === a.id ? "active" : ""
                          }`}
                          onClick={() => setSelectedTarget(a)}
                          style={{ cursor: "pointer" }}
                        >
                          <strong>
                            {a.examName || "Unknown Exam"} on{" "}
                            {a.examDateTime
                              ? new Date(a.examDateTime).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "unknown time"}{" "}
                            — Room: {a.classroomName || `#${a.classroomId}`} — TA:{" "}
                            {a.taName || "Unknown"}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={sendSwap}
                    disabled={!selectedTarget}
                  >
                    Send Request
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

export default SwapProctorTA;
