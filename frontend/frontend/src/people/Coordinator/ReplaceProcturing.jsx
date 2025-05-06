import React, { useEffect, useState } from "react";

const ViewAssignedTAs = () => {
  const [exams, setExams] = useState([]);
  const [proctorAssignments, setProctorAssignments] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [replacementTaId, setReplacementTaId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // load all data
  useEffect(() => {
    fetch("http://localhost:8080/api/exams", { headers })
      .then(res => res.json())
      .then(data => setExams(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/proctor-assignments", { headers })
      .then(res => res.json())
      .then(data => setProctorAssignments(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/ta", { headers })
      .then(res => res.json())
      .then(data => setAllTAs(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/classrooms", { headers })
      .then(res => res.json())
      .then(data => setAllClassrooms(Array.isArray(data) ? data : []));
  }, []);

  const handleExamChange = e => {
    const id = e.target.value;
    setSelectedExamId(id);
    setSelectedExam(exams.find(ex => String(ex.id) === id) || null);
    setSelectedAssignment(null);
  };

  const filteredProctors = proctorAssignments.filter(
    pa => String(pa.examId) === selectedExamId
  );

  const getProctorName = taId => {
    const ta = allTAs.find(t => t.id === taId);
    return ta ? `${ta.firstName} ${ta.lastName}` : `TA #${taId}`;
  };

  const getRoomInfo = id => {
    const room = allClassrooms.find(c => c.id === id);
    return room ? `${room.building} ${room.roomNumber}` : `Room #${id}`;
  };

  const openModal = assignment => {
    setSelectedAssignment(assignment);
    setReplacementTaId("");
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!selectedAssignment || !replacementTaId) return;

    fetch(
      `http://localhost:8080/api/proctor-assignments/${selectedAssignment.id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...selectedAssignment, taId: parseInt(replacementTaId) }),
      }
    )
      .then(() => fetch("http://localhost:8080/api/proctor-assignments", { headers }))
      .then(res => res.json())
      .then(data => {
        setProctorAssignments(Array.isArray(data) ? data : []);
        setShowModal(false);
      });
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Exam Proctor Reassignment</h4>

      {/* Select Exam */}
      <div className="mb-3">
        <label className="form-label">Select Exam</label>
        <select
          className="form-select"
          value={selectedExamId}
          onChange={handleExamChange}
        >
          <option value="">-- Choose Exam --</option>
          {exams.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.examName}
            </option>
          ))}
        </select>
      </div>

      {/* List proctors for chosen exam */}
      {selectedExam && (
        <div className="card mt-3">
          <div className="card-body">
            <h5>{selectedExam.examName}</h5>
            <ul className="list-group">
              {filteredProctors.map(pa => (
                <li
                  key={pa.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {getProctorName(pa.taId)} – {getRoomInfo(pa.classroomId)}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openModal(pa)}
                  >
                    Reassign TA
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal: pick new TA */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 300,
            }}
          >
            <h5 className="mb-3">Reassign TA</h5>

            <label className="form-label">Select New TA</label>
            <select
              className="form-select mb-4"
              value={replacementTaId}
              onChange={e => setReplacementTaId(e.target.value)}
            >
              <option value="">-- choose TA --</option>
              {allTAs.map(ta => (
                <option key={ta.id} value={ta.id}>
                  {ta.firstName} {ta.lastName}
                </option>
              ))}
            </select>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!replacementTaId}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAssignedTAs;
