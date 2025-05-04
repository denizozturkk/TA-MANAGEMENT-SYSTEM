import React, { useState } from "react";
import FacultyMemberLayout from "./FacultyMemberLayout";

// Mock Data for Assigning TAs to Courses and Departments
const mockAssignments = [
  {
    id: 1,
    course: "CS102",
    departments: ["CS", "EEE"]
  },
  {
    id: 2,
    course: "MATH101",
    departments: ["MATH"]
  },
  {
    id: 3,
    course: "PHYS112",
    departments: ["PHYS", "EEE"]
  }
];

const allDepartments = ["CS", "MATH", "PHYS", "EEE", "BIO"];

const AssignTAtoLesson = () => {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    course: "",
    departments: []
  });

  const [editing, setEditing] = useState(false); // Flag to check if it's an edit operation

  const handleDepartmentsChange = (e) => {
    const value = e.target.value;
    setSelectedDepartments((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleCreate = () => {
    if (selectedCourse && selectedDepartments.length > 0) {
      const newAssignment = {
        id: assignments.length + 1,
        course: selectedCourse,
        departments: selectedDepartments
      };
      setAssignments([...assignments, newAssignment]);
      setSelectedCourse("");
      setSelectedDepartments([]);
    } else {
      alert("Please select a course and departments.");
    }
  };

  const handleEdit = (id) => {
    const assignmentToEdit = assignments.find((a) => a.id === id);
    setNewAssignment(assignmentToEdit);
    setSelectedCourse(assignmentToEdit.course);
    setSelectedDepartments(assignmentToEdit.departments);
    setEditing(true); // Set editing to true to indicate that we're editing
  };

  const handleUpdate = () => {
    if (newAssignment.course && newAssignment.departments.length > 0) {
      const updatedAssignments = assignments.map((assignment) =>
        assignment.id === newAssignment.id ? newAssignment : assignment
      );
      setAssignments(updatedAssignments);
      setNewAssignment({ course: "", departments: [] });
      setEditing(false); // Reset editing state after update
    } else {
      alert("Please select a course and departments.");
    }
  };

  const handleCancel = () => {
    setNewAssignment({ course: "", departments: [] });
    setEditing(false); // Cancel editing
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="row align-items-center mb-4">
          <h3 className="fw-bold mb-0">Assign Ta to Another Lesson</h3>
          <button
            type="button"
            className="btn btn-outline-success btn-sm me-1"
            data-bs-toggle="modal"
            data-bs-target="#createAssignmentModal"
            onClick={() => {
              setEditing(false); // Reset editing when clicking create button
              setNewAssignment({ course: "", departments: [] });
            }}
          >
            <i className="icofont-plus-circle me-2 fs-6"></i>Create Assignment
          </button>
        </div>

        <div className="row g-3">
          <div className="col-sm-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Departments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => (
                      <tr key={index}>
                        <td>{assignment.course}</td>
                        <td>{assignment.departments.join(", ")}</td>
                        <td>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#createAssignmentModal"
                            onClick={() => handleEdit(assignment.id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Create Assignment */}
        <div className="modal fade" id="createAssignmentModal" tabIndex="-1" aria-labelledby="createAssignmentModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createAssignmentModalLabel">
                  {editing ? `Edit Assignment for ${newAssignment.course}` : "Create Assignment for Course"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="course" className="form-label">Course</label>
                  <select
                    className="form-select"
                    id="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">-- Select Course --</option>
                    {["CS102", "MATH101", "PHYS112"].map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Departments</label>
                  <div>
                    {allDepartments.map((dept, index) => (
                      <div key={index} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={dept}
                          checked={selectedDepartments.includes(dept)}
                          onChange={handleDepartmentsChange}
                        />
                        <label className="form-check-label">{dept}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button
                  className="btn btn-success mt-4"
                  onClick={editing ? handleUpdate : handleCreate}
                >
                  {editing ? "Update Assignment" : "Create Assignment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTAtoLesson;
