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
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: "300px" }}>
        <DepartmentStaffLayout />
      </div>

      {/* Main content */}
      <div className="container py-4 flex-grow-1">
        <h3 className="fw-bold mb-4">Tutor/Grader Applications</h3>

        {/* Mobile cards */}
        <div className="d-block d-md-none">
          {applications.length === 0 && (
            <p className="text-center text-muted">No applications found.</p>
          )}
          {applications.map(app => (
            <div key={app.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <p><strong>{app.fullName}</strong> (ID: {app.studentId})</p>
                <p className="mb-1">{app.dept}, Year {app.classYear}</p>
                <p className="mb-1">CGPA: {app.cgpa.toFixed(2)}</p>
                <p className="mb-1">{new Date(app.submittedAt).toLocaleDateString()}</p>
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() => setSelectedApp(app)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="table-responsive d-none d-md-block">
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
        </div>

        {/* Detail panel */}
        {selectedApp && (
          <div className="border rounded p-4 bg-white shadow-sm mb-4">
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
              <a
                href={`http://localhost:8080/uploads/${selectedApp.transcriptPath.split("/").pop()}`}
                target="_blank"
                rel="noreferrer"
              >
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
