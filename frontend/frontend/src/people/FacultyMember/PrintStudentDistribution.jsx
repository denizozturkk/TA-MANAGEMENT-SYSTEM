// src/people/TA/PrintStudentDistribution.jsx
import React, { useState, useEffect } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const PrintStudentDistribution = () => {
  const facultyId = Number(localStorage.getItem("userId"));
  const token     = localStorage.getItem("authToken");
  const BASE      = "http://localhost:8080/api";
  const hdrs      = {
    "Accept":        "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // all exams
  const [exams,  setExams]  = useState([]);
  const [examId, setExamId] = useState("");

  // distribution params
  const [distributionType, setDistributionType] = useState("random");

  // preview lists
  const [classA, setClassA] = useState([]);
  const [classB, setClassB] = useState([]);

  // fetch all exams on mount
  useEffect(() => {
    fetch(`${BASE}/faculty-members/${facultyId}/exams`, { headers: hdrs })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setExams(data))
      .catch(err => {
        console.error("Could not load exams:", err);
        alert("Failed to load your exams");
      });
  }, [facultyId]);

  const handleGenerate = () => {
    if (!examId) return alert("Please select an exam");
    fetch(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution?random=${distributionType === "random"}`,
      { headers: hdrs }
    )
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(dto => {
        console.log("distribution DTO:", dto);
        // dto.distributions is array of { roomId, students: [ { firstName, lastName } ] }
        const allNames = dto.distributions
          .flatMap(d => d.students.map(s => `${s.firstName} ${s.lastName}`));

        // sort if alphabetical, else randomize
        if (distributionType === "alphabetical") {
          allNames.sort((a,b) => a.localeCompare(b));
        } else {
          allNames.sort(() => Math.random() - 0.5);
        }

        // split evenly
        const half = Math.ceil(allNames.length / 2);
        setClassA(allNames.slice(0, half));
        setClassB(allNames.slice(half));
      })
      .catch(err => {
        console.error("Preview fetch failed:", err);
        alert("Failed to load distribution preview");
      });
  };

  const handleDownloadPdf = () => {
    if (!examId) return alert("Select an exam first");
    const random = distributionType === "random";
    window.open(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution/pdf?random=${random}`,
      "_blank"
    );
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Print Student Distribution</h4>

            {/* Exam Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Exam</label>
              <select
                className="form-select"
                value={examId}
                onChange={e => {
                  setExamId(e.target.value);
                  setClassA([]);
                  setClassB([]);
                }}
              >
                <option value="">-- Choose an Exam --</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.courseCode} – {ex.examName}
                  </option>
                ))}
              </select>
            </div>

            {/* Distribution Type */}
            {examId && (
              <div className="mb-4">
                <label className="form-label fw-semibold">Distribution Type</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="random"
                    checked={distributionType === "random"}
                    onChange={() => setDistributionType("random")}
                  />
                  <label className="form-check-label" htmlFor="random">
                    Random
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="alphabetical"
                    checked={distributionType === "alphabetical"}
                    onChange={() => setDistributionType("alphabetical")}
                  />
                  <label className="form-check-label" htmlFor="alphabetical">
                    Alphabetical
                  </label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex justify-content-end mb-4">
              <button
                className="btn btn-outline-primary me-2"
                onClick={handleGenerate}
                disabled={!examId}
              >
                Preview
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDownloadPdf}
                disabled={!examId}
              >
                Download PDF
              </button>
            </div>

            {/* Preview */}
            {(classA.length + classB.length) > 0 && (
              <div className="row">
                <div className="col-md-6">
                  <h5>Class A</h5>
                  <ul className="list-group">
                    {classA.map((name,i) => (
                      <li key={i} className="list-group-item">{name}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Class B</h5>
                  <ul className="list-group">
                    {classB.map((name,i) => (
                      <li key={i} className="list-group-item">{name}</li>
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
