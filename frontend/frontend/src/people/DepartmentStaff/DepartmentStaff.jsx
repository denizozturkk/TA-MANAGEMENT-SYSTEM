import React, { useState, useEffect } from "react";
import DepartmentStaffLayout from "./DepartmentStaffLayout";

const TutorGraderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const token = localStorage.getItem("authToken");

  // 1) Fetch all applications
  useEffect(() => {
    fetch("http://localhost:8080/api/applications", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(data => {
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("❌ applications fetch error:", err);
        setApplications([]);
      });
  }, [token]);

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <DepartmentStaffLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <h3 className="fw-bold mb-4">Tutor/Grader Applications</h3>

        <table className="table table-hover align-middle mb-5">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Dept</th>
              <th>Year</th>
              <th>CGPA</th>
              <th>Email</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.studentId}</td>
                <td>{app.fullName}</td>
                <td>{app.dept}</td>
                <td>{app.classYear}</td>
                <td>{app.cgpa.toFixed(2)}</td>
                <td>{app.email}</td>
                <td>{new Date(app.submittedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelectedApp(app)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Detail panel */}
        {selectedApp && (
          <div className="border rounded p-4 bg-white shadow-sm">
            <h4 className="mb-3">Application Details</h4>
            <p><strong>Student ID:</strong> {selectedApp.studentId}</p>
            <p><strong>Full Name:</strong> {selectedApp.fullName}</p>
            <p><strong>Department:</strong> {selectedApp.dept}</p>
            <p><strong>Class Year:</strong> {selectedApp.classYear}</p>
            <p><strong>CGPA:</strong> {selectedApp.cgpa.toFixed(2)}</p>
            <p><strong>Email:</strong> {selectedApp.email}</p>
            <p><strong>Mobile:</strong> {selectedApp.mobilePhone}</p>
            <p><strong>Turkish Citizen:</strong> {selectedApp.turkishCitizen ? "Yes" : "No"}</p>
            <p><strong>Completed ≥1 Year:</strong> {selectedApp.completedOneYear ? "Yes" : "No"}</p>
            <p><strong>CGPA ≥2.0:</strong> {selectedApp.cgpaAbove2 ? "Yes" : "No"}</p>
            <p><strong>No Disciplinary:</strong> {selectedApp.noDisciplinary ? "Yes" : "No"}</p>
            <p><strong>Not on Leave:</strong> {selectedApp.notOnLeave ? "Yes" : "No"}</p>
            <p><strong>Lab Courses:</strong> {selectedApp.labCourses.join(", ")}</p>
            <p><strong>Gradership Courses:</strong> {selectedApp.gradershipCourses.join(", ")}</p>
            <p><strong>Preferred Sections:</strong></p>
            <ul>
              {Object.entries(selectedApp.preferredSectionsByCourse).map(([course, sec]) => (
                <li key={course}>{course} → {sec}</li>
              ))}
            </ul>
            <p><strong>Letter Grades:</strong></p>
            <ul>
              {Object.entries(selectedApp.letterGradesByCourse).map(([course, grade]) => (
                <li key={course}>{course} → {grade}</li>
              ))}
            </ul>
            <p><strong>Prior Experience:</strong> {selectedApp.priorExperience}</p>
            <p><strong>Additional Notes:</strong> {selectedApp.additionalNotes}</p>
            <p>
              <strong>Transcript:</strong>{" "}
              <a href={`http://localhost:8080/uploads/${selectedApp.transcriptPath.split("/").pop()}`} target="_blank" rel="noreferrer">
                View PDF
              </a>
            </p>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setSelectedApp(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorGraderApplications;
