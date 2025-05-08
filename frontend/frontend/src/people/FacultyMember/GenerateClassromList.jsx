// src/people/FacultyMember/GenerateClassroomList.jsx
import React, { useState } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const GenerateClassroomList = () => {
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [file, setFile] = useState(null);

  const semesters = ["Spring", "Summer", "Fall", "Winter"];
  const years = [2023, 2024, 2025, 2026];
  const courses = [
    "CS101 - Intro to Programming",
    "CS102 - Data Structures",
    "CS103 - Algorithms",
  ];

  const handleGenerate = () => {
    if (!semester || !year || !course) {
      alert("Please select semester, year and course.");
      return;
    }
    if (!file) {
      alert("Please select a student list file.");
      return;
    }
    alert(`Generating list for ${course} (${semester} ${year}).`);
    // TODO: send data to backend
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: '300px' }}>
        <FacultymemberLayout />
      </div>

      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-4 text-primary text-center text-lg-start">
                  Generate Classroom List
                </h4>

                {/* Semester */}
                <div className="mb-3">
                  <label htmlFor="semester" className="form-label fw-semibold">
                    Semester
                  </label>
                  <select
                    id="semester"
                    className="form-select"
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                  >
                    <option value="">Select semester…</option>
                    {semesters.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="mb-3">
                  <label htmlFor="year" className="form-label fw-semibold">
                    Year
                  </label>
                  <select
                    id="year"
                    className="form-select"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                  >
                    <option value="">Select year…</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div className="mb-3">
                  <label htmlFor="course" className="form-label fw-semibold">
                    Course
                  </label>
                  <select
                    id="course"
                    className="form-select"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                  >
                    <option value="">Select course…</option>
                    {courses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label htmlFor="fileUpload" className="form-label fw-semibold">
                    Upload Student List (Excel)
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    className="form-control"
                    accept=".xlsx,.xls"
                    onChange={e => setFile(e.target.files[0])}
                  />
                </div>

                {/* Generate Button */}
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-lg btn-primary text-uppercase px-4"
                    onClick={handleGenerate}
                  >
                    Generate Classroom
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default GenerateClassroomList;
