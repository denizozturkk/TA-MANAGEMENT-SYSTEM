import React, { useState, useEffect } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";
import { useParams } from "react-router-dom";

const mockCourses = [
  { id: "CS101", name: "Computer Science 101" },
  { id: "MATH202", name: "Mathematics 202" },
  { id: "PHYS303", name: "Physics 303" }
];

const mockTasks = {
  CS101: ["Grading", "Lab Supervision", "Office Hours"],
  MATH202: ["Proctoring", "Homework Support", "Tutorials"],
  PHYS303: ["Experiment Prep", "Lab Help", "Project Mentoring"]
};

const mockTAs = [
  { id: "TA-1", name: "John Doe", availableTimes: ["Monday 10:00", "Wednesday 14:00"] },
  { id: "TA-2", name: "Jane Smith", availableTimes: ["Tuesday 12:00", "Thursday 10:00"] },
  { id: "TA-3", name: "Emily Johnson", availableTimes: ["Monday 14:00", "Friday 09:00"] }
];

const AssignTAToTask = () => {
  const { facultyId } = useParams(); // Get facultyId from URL params
  const [courses, setCourses] = useState(mockCourses); // Using mock data for courses
  const [tasks, setTasks] = useState([]);
  const [tasAvailable, setTasAvailable] = useState(mockTAs); // Using mock data for TAs
  const [course, setCourse] = useState("");
  const [selectedTA, setSelectedTA] = useState("");
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (course) {
      // Use mock data for tasks based on course
      setTasks(mockTasks[course] || []);
    }
  }, [course]);

  const handleCourseSelect = (selectedCourse) => {
    setCourse(selectedCourse);
    setTasks([]); // Reset tasks when a new course is selected
    setAssignments({}); // Reset assignments when a new course is selected
  };

  const handleManualAssign = (task) => {
    if (!selectedTA) {
      alert("Please select a TA first.");
      return;
    }
    setAssignments((prev) => ({ ...prev, [task]: selectedTA }));
  };

  const handleSaveAssignments = () => {
    const assignmentsToSave = Object.entries(assignments).map(([task, ta]) => ({
      task,
      ta
    }));

    // Simulate sending the assignments to the backend
    console.log("Assignments to save:", assignmentsToSave);
    alert("Assignments saved successfully");
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Manual TA Assignment to Tasks</h4>

            <div className="mb-3">
              <label htmlFor="courseName" className="form-label fw-semibold">Select Course</label>
              <select
                id="courseName"
                className="form-select"
                value={course}
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                <option value="">-- Choose a Course --</option>
                {courses.map((courseItem) => (
                  <option key={courseItem.id} value={courseItem.id}>
                    {courseItem.name}
                  </option>
                ))}
              </select>
            </div>

            {tasks.length > 0 && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select TA</label>
                  <select
                    className="form-select"
                    value={selectedTA}
                    onChange={(e) => setSelectedTA(e.target.value)}
                  >
                    <option value="">-- Choose TA --</option>
                    {tasAvailable.map((ta) => (
                      <option key={ta.id} value={ta.id}>
                        {ta.name}
                      </option>
                    ))}
                  </select>
                  {selectedTA && (
                    <ul className="list-group mt-2">
                      <li className="list-group-item fw-bold">{selectedTA} Available Times:</li>
                      {tasAvailable
                        .find((ta) => ta.id === selectedTA)?.availableTimes?.map((time, idx) => (
                          <li key={idx} className="list-group-item">{time}</li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4">
                  <h5 className="fw-semibold">Tasks:</h5>
                  <ul className="list-group">
                    {tasks.map((task, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{task}</span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleManualAssign(task)}
                        >
                          Assign {selectedTA || "..." }
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {Object.keys(assignments).length > 0 && (
              <div className="mt-4">
                <h5 className="fw-semibold">Final TA Assignments:</h5>
                <ul className="list-group">
                  {Object.entries(assignments).map(([task, ta], idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{task}</span>
                      <span className="badge bg-secondary">{ta}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary mt-3" onClick={handleSaveAssignments}>
                  Save Assignments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTAToTask;
