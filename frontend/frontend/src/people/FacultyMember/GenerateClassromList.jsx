import React, { useState } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const GenerateClassroomList = () => {
  const [classroomName, setClassroomName] = useState("");
  const [file, setFile] = useState(null);

  const handleGenerate = () => {
    if (!classroomName.trim() || !file) {
      alert("Please provide a classroom name and select a file.");
      return;
    }
    alert(`Classroom "${classroomName}" generated with uploaded student list.`);
    // File processing logic can be added here
  };

  return (
    <div className="d-flex">
      <div style={{ width: '300px' }}>
        <FacultymemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Generate Classroom List</h4>

            <div className="mb-3">
              <label htmlFor="classroomName" className="form-label fw-semibold">Classroom Name</label>
              <input
                type="text"
                id="classroomName"
                className="form-control"
                placeholder="e.g. CS101 - Section A"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fileUpload" className="form-label fw-semibold">Upload Student List (Excel)</label>
              <input
                type="file"
                id="fileUpload"
                className="form-control"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button className="btn btn-lg btn-block btn-light lift text-uppercase" onClick={handleGenerate}>
                Generate Classroom
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateClassroomList;
