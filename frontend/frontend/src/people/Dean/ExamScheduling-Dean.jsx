import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ExamSchedulingDean = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [exams, setExams] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allOfferings, setAllOfferings] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedExam, setSelectedExam] = useState(null);

  const [formData, setFormData] = useState({
    examName: "",
    department: "",
    examType: "Written",
    dateTime: "",
    duration: "",
    numProctors: "",
    offeringId: "",
    facultyId: "",
    classrooms: [],
  });

  const [formErrors, setFormErrors] = useState({});

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    fetch(`${BASE}/users/me`, { headers })
      .then((res) => res.json())
      .then((user) => {
        setCurrentUserId(user.id);
        return fetch(`${BASE}/exams`, { headers });
      })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setExams(arr);
      })
      .catch(() => setExams([]));

    fetch(`${BASE}/proctor-assignments`, { headers })
      .then((res) => res.json())
      .then((data) => setAllAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAllAssignments([]));

    fetch(`${BASE}/ta`, { headers })
      .then((res) => res.json())
      .then((data) => setAllTAs(Array.isArray(data) ? data : []))
      .catch(() => setAllTAs([]));

    fetch(`${BASE}/classrooms`, { headers })
      .then((res) => res.json())
      .then((data) => setAllClassrooms(Array.isArray(data) ? data : []))
      .catch(() => setAllClassrooms([]));

    fetch(`${BASE}/offerings`, { headers })
      .then((res) => res.json())
      .then((data) => setAllOfferings(Array.isArray(data) ? data : []))
      .catch(() => setAllOfferings([]));

    fetch(`${BASE}/courses`, { headers })
      .then((res) => res.json())
      .then((data) => setAllCourses(Array.isArray(data) ? data : []))
      .catch(() => setAllCourses([]));

    fetch(`${BASE}/faculty-members`, { headers })
      .then((res) => res.json())
      .then((data) => setAllFaculty(Array.isArray(data) ? data : []))
      .catch(() => setAllFaculty([]));
  }, [token]);

  const deanId = allFaculty.find((f) => f.userId === currentUserId)?.id;

  const openModal = (type, exam = null) => {
    setModalType(type);
    setSelectedExam(exam);

    setFormErrors({});

    if (exam) {
      setFormData({
        examName: exam.examName || "",
        department: exam.department || "",
        examType: exam.examType || "Written",
        dateTime: exam.dateTime?.slice(0, 16) || "",
        duration: exam.duration?.toString() || "",
        numProctors: exam.numProctors?.toString() || "",
        offeringId: exam.offeringId?.toString() || "",
        facultyId: exam.facultyId?.toString() || "",
        classrooms: Array.isArray(exam.examRooms)
          ? exam.examRooms.map((r) => r.classroomId.toString())
          : [],
      });
    } else {
      setFormData({
        examName: "",
        department: "",
        examType: "Written",
        dateTime: "",
        duration: "",
        numProctors: "",
        offeringId: "",
        facultyId: "",
        classrooms: [],
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setFormErrors({});
    setFormData({
      examName: "",
      department: "",
      examType: "Written",
      dateTime: "",
      duration: "",
      numProctors: "",
      offeringId: "",
      facultyId: "",
      classrooms: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "classrooms") {
      setFormData((f) => {
        const set = new Set(f.classrooms);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...f, classrooms: Array.from(set) };
      });
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.examName.trim()) errors.examName = "Exam name is required.";
    if (formData.duration < 0) errors.duration = "Duration cannot be negative.";
    if (formData.numProctors < 0) errors.numProctors = "Number of proctors cannot be negative.";
    if (!formData.dateTime) errors.dateTime = "Date and time is required.";
    if (!formData.department) errors.department = "Please select a department.";
    if (!formData.offeringId) errors.offeringId = "Offering is required.";
    if (formData.classrooms.length === 0) errors.classrooms = "At least one classroom must be selected.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const payload = {
      examName: formData.examName,
      department: formData.department,
      examType: formData.examType,
      dateTime: formData.dateTime,
      duration: Math.max(0, parseFloat(formData.duration)),
      numProctors: Math.max(0, parseInt(formData.numProctors, 10)),
      offeringId: parseInt(formData.offeringId),
      facultyId: modalType === "create" ? deanId : parseInt(formData.facultyId),
      examRooms: formData.classrooms.map((id) => ({
        classroomId: parseInt(id, 10),
        numProctors: Math.max(0, parseInt(formData.numProctors, 10)),
      })),
    };

    const url =
      modalType === "create"
        ? `${BASE}/exams`
        : `${BASE}/exams/${selectedExam.id}`;

    fetch(url, {
      method: modalType === "create" ? "POST" : "PUT",
      headers,
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setExams((exams) =>
          modalType === "create"
            ? [data, ...exams]
            : exams.map((ex) => (ex.id === data.id ? data : ex))
        );
        closeModal();
      })
      .catch(() => alert("Error saving exam"));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Exam Scheduling</h3>
        <button className="btn btn-success" onClick={() => openModal("create")}>
          + Create Exam
        </button>
      </div>

      <div className="row">
        {exams.map((ex) => (
          <div key={ex.id} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{ex.examName}</h5>
                <p><strong>Type:</strong> {ex.examType}</p>
                <p><strong>Date:</strong> {new Date(ex.dateTime).toLocaleString()}</p>
                <p><strong>Proctors:</strong> {ex.numProctors}</p>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openModal("edit", ex)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">{modalType === "create" ? "Create Exam" : "Edit Exam"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Exam Name</label>
                    <input
                      type="text"
                      name="examName"
                      value={formData.examName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                    {formErrors.examName && <div className="text-danger">{formErrors.examName}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">-- select department --</option>
                      <option value="CS">CS</option>
                      <option value="EE">EE</option>
                      <option value="IE">IE</option>
                      <option value="ME">ME</option>
                    </select>
                    {formErrors.department && <div className="text-danger">{formErrors.department}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Exam Type</label>
                    <select
                      name="examType"
                      className="form-select"
                      value={formData.examType}
                      onChange={handleChange}
                    >
                      <option value="Midterm">Midterm</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      className="form-control"
                      value={formData.dateTime}
                      onChange={handleChange}
                    />
                    {formErrors.dateTime && <div className="text-danger">{formErrors.dateTime}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      min="0"
                      className="form-control"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                    {formErrors.duration && <div className="text-danger">{formErrors.duration}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Number of Proctors</label>
                    <input
                      type="number"
                      name="numProctors"
                      min="0"
                      className="form-control"
                      value={formData.numProctors}
                      onChange={handleChange}
                    />
                    {formErrors.numProctors && <div className="text-danger">{formErrors.numProctors}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Offering</label>
                    <select
                      name="offeringId"
                      className="form-select"
                      value={formData.offeringId}
                      onChange={handleChange}
                    >
                      <option value="">-- select offering --</option>
                      {allOfferings.map((o) => {
                        const course = allCourses.find((c) => c.id === o.courseId);
                        return (
                          <option key={o.id} value={o.id}>
                            ({o.semester} {o.year}) – {course ? course.courseCode : "Unknown"}
                          </option>
                        );
                      })}
                    </select>
                    {formErrors.offeringId && <div className="text-danger">{formErrors.offeringId}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Classrooms</label>
                    <div className="d-flex flex-wrap gap-2">
                      {allClassrooms.map((cls, i) => (
                        <div className="form-check me-3" key={i}>
                          <input
                            type="checkbox"
                            name="classrooms"
                            value={cls.id}
                            checked={formData.classrooms.includes(cls.id.toString())}
                            onChange={handleChange}
                            className="form-check-input"
                            id={`cls-${i}`}
                          />
                          <label className="form-check-label" htmlFor={`cls-${i}`}>
                            {cls.building} {cls.roomNumber}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formErrors.classrooms && <div className="text-danger mt-1">{formErrors.classrooms}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Exam</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSchedulingDean;
