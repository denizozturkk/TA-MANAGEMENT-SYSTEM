import React, { useEffect, useState } from "react";
import CoordinatorLayout from "./CoordinatorLayout"; // adjust path if needed

const ViewAssignedTAs = () => {
  const [exams, setExams] = useState([]);
  const [proctorAssignments, setProctorAssignments] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const [selectedProctor, setSelectedProctor] = useState(null);
  const [replacementExamId, setReplacementExamId] = useState("");
  const [replacementProctorId, setReplacementProctorId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    fetch("http://localhost:8080/api/exams", { headers })
      .then((res) => res.json())
      .then((data) => setExams(Array.isArray(data) ? data : []));
    fetch("http://localhost:8080/api/proctor-assignments", { headers })
      .then((res) => res.json())
      .then((data) => setProctorAssignments(Array.isArray(data) ? data : []));
    fetch("http://localhost:8080/api/ta", { headers })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setAllTAs(data) : setAllTAs([]));
    fetch("http://localhost:8080/api/classrooms", { headers })
      .then((res) => res.json())
      .then((data) => setAllClassrooms(Array.isArray(data) ? data : []));
  }, []);

  const handleExamChange = (e) => {
    const id = e.target.value;
    setSelectedExamId(id);
    const exam = exams.find((ex) => String(ex.id) === id);
    setSelectedExam(exam || null);
  };

  const filteredProctors = proctorAssignments.filter(
    (pa) => String(pa.examId) === selectedExamId
  );

  const getProctorName = (taId) => {
    const ta = allTAs.find((t) => t.id === taId);
    return ta ? `${ta.firstName} ${ta.lastName}` : `TA #${taId}`;
  };

  const getRoomInfo = (id) => {
    const room = allClassrooms.find((c) => c.id === id);
    return room ? `${room.building} ${room.roomNumber}` : `Room #${id}`;
  };

  const openModal = (proctor) => {
    setSelectedProctor(proctor);
    setReplacementExamId("");
    setReplacementProctorId("");
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedProctor || !replacementProctorId) return;
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const replacementProctor = proctorAssignments.find(
      (p) => String(p.id) === replacementProctorId
    );
    Promise.all([
      fetch(`http://localhost:8080/api/proctor-assignments/${selectedProctor.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...selectedProctor,
          taId: replacementProctor.taId,
        }),
      }),
      fetch(`http://localhost:8080/api/proctor-assignments/${replacementProctor.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...replacementProctor,
          taId: selectedProctor.taId,
        }),
      }),
    ])
      .then(() =>
        fetch("http://localhost:8080/api/proctor-assignments", { headers })
      )
      .then((res) => res.json())
      .then((data) => {
        setProctorAssignments(data);
        setShowModal(false);
      });
  };

  const getReplacementOptions = () => {
    return proctorAssignments
      .filter((p) => String(p.examId) === replacementExamId)
      .map((p) => (
        <option key={p.id} value={p.id}>
          {getProctorName(p.taId)} – {getRoomInfo(p.classroomId)}
        </option>
      ));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="w-100 w-md-auto" style={{ maxWidth: "300px" }}>
        <CoordinatorLayout />
      </div>

      {/* Main Content */}
      <div className="container mt-4 px-3 px-md-5 flex-grow-1">
        <h4 className="mb-4 text-center text-md-start">Exam Proctor View & Cross Swap</h4>

        <div className="mb-3">
          <label className="form-label">Select Exam</label>
          <select
            className="form-select"
            value={selectedExamId}
            onChange={handleExamChange}
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.examName}
              </option>
            ))}
          </select>
        </div>

        {selectedExam && (
          <div className="card mt-3">
            <div className="card-body">
              <h5>{selectedExam.examName}</h5>
              <p><strong>Date:</strong> {new Date(selectedExam.dateTime).toLocaleString()}</p>
              <p><strong>Proctors:</strong></p>
              <ul className="list-group">
                {filteredProctors.map((proctor) => (
                  <li
                    key={proctor.id}
                    className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center"
                  >
                    <div>
                      {getProctorName(proctor.taId)} – {getRoomInfo(proctor.classroomId)}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary mt-2 mt-sm-0"
                      onClick={() => openModal(proctor)}
                    >
                      Swap
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1050,
            }}
          >
            <div
              className="bg-white p-4 rounded"
              style={{
                width: "90%",
                maxWidth: "360px",
              }}
            >
              <h5>Swap With Proctor From Another Exam</h5>

              <label className="form-label">Select Exam</label>
              <select
                className="form-select mb-2"
                value={replacementExamId}
                onChange={(e) => setReplacementExamId(e.target.value)}
              >
                <option value="">-- Select Exam --</option>
                {exams
                  .filter((ex) => String(ex.id) !== String(selectedExam.id))
                  .map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.examName}
                    </option>
                  ))}
              </select>

              {replacementExamId && (
                <>
                  <label className="form-label">Select Proctor</label>
                  <select
                    className="form-select mb-3"
                    value={replacementProctorId}
                    onChange={(e) => setReplacementProctorId(e.target.value)}
                  >
                    <option value="">-- Select Proctor --</option>
                    {getReplacementOptions()}
                  </select>
                </>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  disabled={!replacementProctorId}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAssignedTAs;
