import React, { useEffect, useState } from "react";
import CoordinatorLayout from "./CoordinatorLayout";

const ManageExamClassrooms = () => {
  const [exams, setExams] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [freeClassrooms, setFreeClassrooms] = useState([]);
  const [assignedRooms, setAssignedRooms] = useState([]);

  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [numProctors, setNumProctors] = useState(1);

  const token = localStorage.getItem("authToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Initial fetch: exams and all classrooms
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/classrooms", { headers })
      .then((res) => res.json())
      .then((data) => setAllClassrooms(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/exams", { headers })
      .then((res) => res.json())
      .then((data) => setExams(Array.isArray(data) ? data : []));
  }, [token]);

  // When user selects an exam
  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExamId(examId);
    setSelectedExam(exams.find((ex) => String(ex.id) === examId) || null);
    setSelectedClassroomId("");
    setNumProctors(1);

    if (!examId) {
      setFreeClassrooms([]);
      setAssignedRooms([]);
      return;
    }

    // Fetch free (unassigned) classrooms
    fetch(
      `http://localhost:8080/api/exam-rooms/exam/${examId}/unassigned-classrooms`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => setFreeClassrooms(Array.isArray(data) ? data : []));

    // Fetch exam details to get assigned rooms
    fetch(`http://localhost:8080/api/exams/${examId}`, { headers })
      .then((res) => res.json())
      .then((examDto) => {
        const rooms = Array.isArray(examDto.examRooms)
          ? examDto.examRooms
          : [];
        const mapped = rooms.map((er) => {
          const cls =
            allClassrooms.find((c) => String(c.id) === String(er.classroomId)) ||
            { id: er.classroomId };
          return { classroom: cls, numProctors: er.numProctors };
        });
        setAssignedRooms(mapped);
      });
  };

  // Add classroom to exam via POST
  const handleAddClassroom = () => {
    if (!selectedExamId || !selectedClassroomId || numProctors < 1) return;

    fetch("http://localhost:8080/api/exam-rooms", {
      method: "POST",
      headers,
      body: JSON.stringify({
        examId: Number(selectedExamId),
        classroomId: Number(selectedClassroomId),
        numProctors: Number(numProctors),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((erDto) => {
        const cls = allClassrooms.find(
          (c) => String(c.id) === String(erDto.classroomId)
        );
        if (!cls) return;

        setAssignedRooms((prev) => [
          ...prev,
          { classroom: cls, numProctors: erDto.numProctors },
        ]);
        setFreeClassrooms((prev) =>
          prev.filter((c) => String(c.id) !== String(cls.id))
        );
        setSelectedClassroomId("");
        setNumProctors(1);
      })
      .catch((err) => console.error("Add failed:", err));
  };

  // Remove classroom from exam
  const handleRemoveClassroom = (classroomId) => {
    fetch(
      `http://localhost:8080/api/exam-rooms/${selectedExamId}/${classroomId}`,
      { method: "DELETE", headers }
    )
      .then(() => {
        setAssignedRooms((prev) =>
          prev.filter((a) => String(a.classroom.id) !== String(classroomId))
        );
        const cls = allClassrooms.find(
          (c) => String(c.id) === String(classroomId)
        );
        if (cls) setFreeClassrooms((prev) => [...prev, cls]);
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="w-100 w-md-auto" style={{ maxWidth: "300px" }}>
        <CoordinatorLayout />
      </div>
      <div className="container px-3 px-md-5 py-4 flex-grow-1">
        <h2 className="mb-4">Manage Exam Classrooms</h2>

        {/* Exam selector */}
        <div className="mb-4">
          <label className="form-label">Select Exam</label>
          <select
            className="form-select"
            value={selectedExamId}
            onChange={handleExamChange}
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((ex) => (
              <option key={ex.id} value={String(ex.id)}>
                {ex.examName}
              </option>
            ))}
          </select>
        </div>

        {selectedExam && (
          <>
            {/* Assign new classroom + proctors */}
            <div className="card p-4 mb-4">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label">Select Classroom</label>
                  <select
                    className="form-select"
                    value={selectedClassroomId}
                    onChange={(e) => setSelectedClassroomId(e.target.value)}
                  >
                    <option value="">-- Choose Classroom --</option>
                    {freeClassrooms.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.building} {c.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label"># Proctors</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={numProctors}
                    onChange={(e) => setNumProctors(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-success w-100"
                    disabled={!selectedClassroomId || numProctors < 1}
                    onClick={handleAddClassroom}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned list */}
            <div className="card p-3">
              <h5>Assigned Classrooms for {selectedExam.examName}</h5>
              {assignedRooms.length === 0 ? (
                <p className="text-muted">No classrooms assigned yet.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Building</th>
                      <th>Room</th>
                      <th># Proctors</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedRooms.map((a) => (
                      <tr key={a.classroom.id}>
                        <td>{a.classroom.building}</td>
                        <td>{a.classroom.roomNumber}</td>
                        <td>{a.numProctors}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveClassroom(a.classroom.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageExamClassrooms;
