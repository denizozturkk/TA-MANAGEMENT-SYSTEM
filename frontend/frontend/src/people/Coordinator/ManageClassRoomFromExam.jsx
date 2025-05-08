import React, { useState } from "react";
import CoordinatorLayout from "./CoordinatorLayout"; // adjust path if needed

const exams = [
  { id: "EX-001", name: "Midterm Exam" },
  { id: "EX-002", name: "Final Exam" },
  { id: "EX-003", name: "Makeup Exam" }
];

const allClassrooms = [
  { id: "CLS-001", name: "Physics Lab" },
  { id: "CLS-002", name: "Lecture Hall 101" },
  { id: "CLS-003", name: "Computer Science Lab" },
  { id: "CLS-004", name: "Seminar Room" }
];

const ManageExamClassrooms = () => {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [examClassroomMap, setExamClassroomMap] = useState({});

  const handleAddClassroom = () => {
    if (!selectedExamId || !selectedClassroomId) return;
    const current = examClassroomMap[selectedExamId] || [];
    const cls = allClassrooms.find(c => c.id === selectedClassroomId);
    if (!current.some(c => c.id === cls.id)) {
      setExamClassroomMap({
        ...examClassroomMap,
        [selectedExamId]: [...current, cls]
      });
      setSelectedClassroomId("");
    }
  };

  const handleRemoveClassroom = id => {
    const current = examClassroomMap[selectedExamId] || [];
    setExamClassroomMap({
      ...examClassroomMap,
      [selectedExamId]: current.filter(c => c.id !== id)
    });
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="w-100 w-md-auto" style={{ maxWidth: "300px" }}>
        <CoordinatorLayout />
      </div>

      {/* Main Content */}
      <div className="container px-3 px-md-5 py-4 flex-grow-1">
        <h2 className="mb-4 text-center text-md-start">Manage Exam Classrooms</h2>

        {/* Exam Selection */}
        <div className="mb-4">
          <label className="form-label">Select Exam</label>
          <select
            className="form-select"
            value={selectedExamId}
            onChange={e => {
              setSelectedExamId(e.target.value);
              setSelectedClassroomId("");
            }}
          >
            <option value="">-- Choose an Exam --</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.name} ({exam.id})
              </option>
            ))}
          </select>
        </div>

        {selectedExamId && (
          <>
            {/* Classroom Assignment Card */}
            <div className="card p-4 mb-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label">Select Classroom</label>
                  <select
                    className="form-select"
                    value={selectedClassroomId}
                    onChange={e => setSelectedClassroomId(e.target.value)}
                  >
                    <option value="">-- Choose Classroom --</option>
                    {allClassrooms.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <button
                    className="btn btn-success mt-2 mt-md-4 w-100"
                    onClick={handleAddClassroom}
                    disabled={!selectedClassroomId}
                  >
                    Add to Exam
                  </button>
                </div>
              </div>
            </div>

            {/* Assigned Classrooms Table */}
            <div className="card p-3">
              <h5 className="mb-3">Classrooms Assigned to Exam</h5>
              {(examClassroomMap[selectedExamId] || []).length === 0 ? (
                <p className="text-muted">No classrooms assigned yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examClassroomMap[selectedExamId].map(cls => (
                        <tr key={cls.id}>
                          <td>{cls.id}</td>
                          <td>{cls.name}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveClassroom(cls.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageExamClassrooms;
