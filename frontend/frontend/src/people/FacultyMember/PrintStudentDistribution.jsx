import React, { useState } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const mockStudentData = {
  CS101: ["Ali Yılmaz", "Ayşe Demir", "Canan Arslan", "Berk Yüce", "Deniz Erdem"],
  MATH202: ["Merve Aksoy", "Tuna Koç", "Zeynep Alkan", "Oğuz Güneş", "Ela Şahin"],
  PHYS303: ["Selin Kurt", "Baran Çelik", "Gökhan Tunç", "İrem Soylu", "Kerem Aydın"]
};

const PrintStudentDistribution = () => {
  const [course, setCourse] = useState("");
  const [distributionType, setDistributionType] = useState("random");
  const [students, setStudents] = useState([]);
  const [classA, setClassA] = useState([]);
  const [classB, setClassB] = useState([]);

  const handleCourseSelect = (selectedCourse) => {
    setCourse(selectedCourse);
    setStudents(mockStudentData[selectedCourse] || []);
    setClassA([]);
    setClassB([]);
  };

  const handleGenerate = () => {
    if (!course.trim()) {
      alert("Please select a course.");
      return;
    }

    let sortedStudents = [...students];
    if (distributionType === "random") {
      sortedStudents.sort(() => Math.random() - 0.5);
    } else {
      sortedStudents.sort((a, b) => a.localeCompare(b));
    }

    const half = Math.ceil(sortedStudents.length / 2);
    setClassA(sortedStudents.slice(0, half));
    setClassB(sortedStudents.slice(half));
  };

  return (
    <div className="d-flex">
      <div style={{ width: '300px' }}>
        <FacultymemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Print Student Distribution</h4>

            <div className="mb-3">
              <label htmlFor="courseName" className="form-label fw-semibold">Select Course</label>
              <select
                id="courseName"
                className="form-select"
                value={course}
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                <option value="">-- Choose a Course --</option>
                {Object.keys(mockStudentData).map((courseKey) => (
                  <option key={courseKey} value={courseKey}>{courseKey}</option>
                ))}
              </select>
            </div>

            {students.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Distribution Type</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="distribution"
                    id="random"
                    value="random"
                    checked={distributionType === "random"}
                    onChange={(e) => setDistributionType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="random">
                    Assign Randomly
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="distribution"
                    id="alphabetical"
                    value="alphabetical"
                    checked={distributionType === "alphabetical"}
                    onChange={(e) => setDistributionType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="alphabetical">
                    Assign Alphabetically
                  </label>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-lg btn-block btn-light lift text-uppercase" onClick={handleGenerate} disabled={!students.length}>
                Print Distribution
              </button>
            </div>

            {(classA.length > 0 || classB.length > 0) && (
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5 className="fw-semibold">Class A:</h5>
                  <ul className="list-group">
                    {classA.map((student, idx) => (
                      <li key={idx} className="list-group-item">
                        {student}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="fw-semibold">Class B:</h5>
                  <ul className="list-group">
                    {classB.map((student, idx) => (
                      <li key={idx} className="list-group-item">
                        {student}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintStudentDistribution;