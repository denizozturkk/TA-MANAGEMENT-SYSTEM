import React, { useState, useEffect } from "react";
import CoordinatorLayout from "./CoordinatorLayout";

// Mock data for courses, TAs, proctors, and their workloads
const mockCourses = [
  {
    id: 1,
    title: "CS102",
    duties: [
      { type: "Lab", name: "Lab 1", tAs: ["Cankutay D.", "Anıl Y."] },
      { type: "Lab", name: "Lab 2", tAs: ["Emre U.", "Anıl Y."] },
      { type: "Exam", name: "Midterm", tAs: ["Cankutay D."] },
      { type: "Exam", name: "Final Exam", tAs: ["Anıl Y."] }
    ],
    proctorAssignments: [
      { name: "John Doe", workload: 3 },
      { name: "Jane Roe", workload: 1 },
      { name: "Mike Davis", workload: 2 }
    ],
    tAs: [
      { name: "Cankutay D.", workload: 4 },
      { name: "Anıl Y.", workload: 3 },
      { name: "Emre U.", workload: 2 }
    ]
  },
  {
    id: 2,
    title: "MATH101",
    duties: [
      { type: "Lab", name: "Lab 1", tAs: ["Deniz Öztürk", "Yüksel Baydar"] },
      { type: "Exam", name: "Final Exam", tAs: ["Deniz Öztürk"] }
    ],
    proctorAssignments: [
      { name: "Mark Smith", workload: 2 },
      { name: "Alice Johnson", workload: 0 }
    ],
    tAs: [
      { name: "Deniz Öztürk", workload: 1 },
      { name: "Yüksel Baydar", workload: 0 }
    ]
  },
  {
    id: 3,
    title: "PHYS112",
    duties: [
      { type: "Lab", name: "Lab 1", tAs: ["Mehmet K.", "Bora K."] },
      { type: "Lab", name: "Lab 2", tAs: ["Mehmet K."] },
      { type: "Exam", name: "Midterm", tAs: ["Mehmet K."] },
      { type: "Exam", name: "Final Exam", tAs: ["Bora K."] }
    ],
    proctorAssignments: [
      { name: "Sarah Brown", workload: 1 },
      { name: "John Doe", workload: 2 }
    ],
    tAs: [
      { name: "Mehmet K.", workload: 2 },
      { name: "Bora K.", workload: 3 }
    ]
  }
];

// Replace Types
const swapTypes = [
  "Replace TA in Course Offering",
  "Assign TA to Task",
  "View Previous Assignments",
  "Replace Exam Proctor"
];

const ReplaceTA = () => {
  const [courses] = useState(mockCourses);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSwapType, setSelectedSwapType] = useState("");
  const [selectedDuty, setSelectedDuty] = useState("");
  const [selectedProctor, setSelectedProctor] = useState("");
  const [selectedNewProctor, setSelectedNewProctor] = useState("");
  const [selectedTAs, setSelectedTAs] = useState([]);
  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [workloadError, setWorkloadError] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  const selectedCourse = courses.find((c) => c.id.toString() === selectedCourseId);

  const getAllUniqueTAs = (courses) => {
    const allTAs = courses.flatMap((c) => c.tAs);
    return [...new Set(allTAs.map((ta) => ta.name))];
  };

  const allTAs = getAllUniqueTAs(courses);

  // Check if workloads are exceeding the limit
  const checkWorkload = (taName) => {
    const ta = selectedCourse.tAs.find((ta) => ta.name === taName);
    return ta && ta.workload >= 5; // Max workload is 5
  };

  const checkProctorWorkload = (proctorName) => {
    const proctor = selectedCourse.proctorAssignments.find(
      (proctor) => proctor.name === proctorName
    );
    return proctor && proctor.workload >= 5; // Max workload is 5
  };

  const handleReplace = () => {
    if (!selectedCourseId || !selectedDuty || !selectedSwapType) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate workloads
    if (selectedTAs.some(ta => checkWorkload(ta))) {
      setWorkloadError("One or more TAs have exceeded their maximum workload.");
      return;
    }

    if (selectedSwapType === "Replace Exam Proctor" && !selectedNewProctor) {
      alert("Please select a new proctor.");
      return;
    }

    if (selectedSwapType === "Replace Exam Proctor" && checkProctorWorkload(selectedNewProctor)) {
      alert("The new proctor has exceeded their maximum workload.");
      return;
    }

    setWorkloadError(""); // Clear error if valid

    if (selectedSwapType === "Replace TA in Course Offering") {
      alert(`Replaced TAs ${selectedTAs.join(", ")} in course "${selectedCourse.title}" for duty "${selectedDuty}"`);
      setPreviousAssignments([
        ...previousAssignments,
        { from: selectedTAs.join(", "), to: "New TA(s)", course: selectedCourse.title, duty: selectedDuty, type: "Replacement" }
      ]);
    } else if (selectedSwapType === "Assign TA to Task") {
      alert(`Assigned TAs ${selectedTAs.join(", ")} directly to a task in course "${selectedCourse.title}" for duty "${selectedDuty}"`);
      setPreviousAssignments([
        ...previousAssignments,
        { from: "", to: selectedTAs.join(", "), course: selectedCourse.title, duty: selectedDuty, type: "Direct Assignment" }
      ]);
    } else if (selectedSwapType === "Replace Exam Proctor") {
      alert(`Replaced proctor in course "${selectedCourse.title}" for duty "${selectedDuty}" with "${selectedNewProctor}"`);
      setPreviousAssignments([
        ...previousAssignments,
        { from: selectedProctor, to: selectedNewProctor, course: selectedCourse.title, duty: selectedDuty, type: "Proctor Replacement" }
      ]);
    }
  };

  const handleTACheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedTAs((prevSelectedTAs) =>
      prevSelectedTAs.includes(value)
        ? prevSelectedTAs.filter((ta) => ta !== value)
        : [...prevSelectedTAs, value]
    );
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <CoordinatorLayout />
      </div>

      <div className="container py-5 flex-grow-1">
        <h3 className="fw-bold mb-4">Replace or Assign TA</h3>

        <div className="mb-3">
          <label className="form-label">Search Course</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Type course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedSwapType(""); // Reset swap type
              setSelectedProctor(""); // Reset proctor selection
              setSelectedTAs([]); // Reset selected TAs
              setSelectedDuty(""); // Reset selected duty
            }}
          >
            <option value="">-- Select Course --</option>
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Swap Type</label>
          <select
            className="form-select"
            value={selectedSwapType}
            onChange={(e) => setSelectedSwapType(e.target.value)}
          >
            <option value="">-- Select Swap Type --</option>
            {swapTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && selectedSwapType !== "View Previous Assignments" && (
          <>
            <div className="mb-3">
              <label className="form-label">Select Duty (Lab/Exam)</label>
              <select
                className="form-select"
                value={selectedDuty}
                onChange={(e) => setSelectedDuty(e.target.value)}
              >
                <option value="">-- Select Duty --</option>
                {selectedCourse.duties.map((duty, idx) => (
                  <option key={idx} value={duty.name}>
                    {duty.type}: {duty.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedDuty && (
              <>
                <div className="mb-3">
                  <label className="form-label">Select TAs to Replace</label>
                  <div>
                    {selectedCourse.duties
                      .find((duty) => duty.name === selectedDuty)
                      .tAs.map((ta, idx) => (
                        <div key={idx} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`ta-${idx}`}
                            value={ta}
                            checked={selectedTAs.includes(ta)}
                            onChange={handleTACheckboxChange}
                          />
                          <label className="form-check-label" htmlFor={`ta-${idx}`}>
                            {ta}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select New TA(s) to Assign</label>
                  <div>
                    {allTAs
                      .filter((ta) => !selectedCourse.duties.find((duty) => duty.tAs.includes(ta)))
                      .map((ta, idx) => (
                        <div key={idx} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`new-ta-${idx}`}
                            value={ta}
                            checked={selectedTAs.includes(ta)}
                            onChange={handleTACheckboxChange}
                          />
                          <label className="form-check-label" htmlFor={`new-ta-${idx}`}>
                            {ta}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-outline-success btn-sm" onClick={handleReplace}>
                    {selectedSwapType === "Replace Exam Proctor"
                      ? "Replace Proctor"
                      : "Replace/Assign TA"}
                  </button>
                </div>
              </>
            )}

            {workloadError && <p className="text-danger mt-2">{workloadError}</p>}
          </>
        )}

        {selectedSwapType === "View Previous Assignments" && (
          <div>
            <h5>Previous Assignments</h5>
            {previousAssignments.length === 0 ? (
              <p>No previous assignments to show.</p>
            ) : (
              previousAssignments.map((assignment, idx) => (
                <div key={idx} className="mb-3">
                  <p>
                    {assignment.type}: {assignment.from} replaced with {assignment.to} in course{" "}
                    {assignment.course} for duty {assignment.duty}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplaceTA;
