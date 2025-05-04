import React, { useState } from "react";

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

  // Her sınav için atanmış sınıfları tutan state
  const [examClassroomMap, setExamClassroomMap] = useState({});

  const handleAddClassroom = () => {
    if (!selectedExamId || !selectedClassroomId) return;

    const currentClassrooms = examClassroomMap[selectedExamId] || [];
    const selectedClassroom = allClassrooms.find(c => c.id === selectedClassroomId);

    if (!currentClassrooms.some(c => c.id === selectedClassroomId)) {
      const updatedMap = {
        ...examClassroomMap,
        [selectedExamId]: [...currentClassrooms, selectedClassroom]
      };
      setExamClassroomMap(updatedMap);
      setSelectedClassroomId(""); // Seçimi sıfırla
    }
  };

  const handleRemoveClassroom = (classroomId) => {
    const currentClassrooms = examClassroomMap[selectedExamId] || [];
    const updatedClassrooms = currentClassrooms.filter(c => c.id !== classroomId);
    setExamClassroomMap({
      ...examClassroomMap,
      [selectedExamId]: updatedClassrooms
    });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Manage Exam Classrooms</h2>

      {/* Exam Selection */}
      <div className="mb-4">
        <label className="form-label">Select Exam</label>
        <select
          className="form-select"
          value={selectedExamId}
          onChange={(e) => {
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

      {/* Classroom Assignment */}
      {selectedExamId && (
        <>
          <div className="card p-4 mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Select Classroom</label>
                <select
                  className="form-select"
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                >
                  <option value="">-- Choose Classroom --</option>
                  {allClassrooms.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-success mt-4"
                  onClick={handleAddClassroom}
                  disabled={!selectedClassroomId}
                >
                  Add to Exam
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Classrooms */}
          <div className="card p-3">
            <h5 className="mb-3">Classrooms Assigned to Exam</h5>
            {(examClassroomMap[selectedExamId] || []).length === 0 ? (
              <p className="text-muted">No classrooms assigned yet.</p>
            ) : (
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageExamClassrooms;
