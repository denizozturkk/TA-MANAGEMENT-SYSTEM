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
      classrooms: []
    });
  
    const BASE = "http://localhost:8080/api";
  
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };
  
      // 1) fetch your profile
      fetch(`${BASE}/users/me`, { headers })
        .then(res => res.json())
        .then(user => {
          setCurrentUserId(user.id);
          // 2) fetch only your exams
          return fetch(`${BASE}/exams`, { headers });
        })
        .then(res => res.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : [];
          setExams(arr.filter(ex => ex.facultyId === currentUserId));
        })
        .catch(() => setExams([]));
    // fetch proctor assignments
    fetch(`${BASE}/proctor-assignments`, { headers })
      .then(res => res.json())
      .then(data => setAllAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAllAssignments([]));

    // fetch TAs
    fetch(`${BASE}/ta`, { headers })
      .then(res => res.json())
      .then(data => setAllTAs(Array.isArray(data) ? data : []))
      .catch(() => setAllTAs([]));

    // fetch classrooms
    fetch(`${BASE}/classrooms`, { headers })
      .then(res => res.json())
      .then(data => setAllClassrooms(Array.isArray(data) ? data : []))
      .catch(() => setAllClassrooms([]));

    // fetch offerings
    fetch(`${BASE}/offerings`, { headers })
      .then(res => res.json())
      .then(data => setAllOfferings(Array.isArray(data) ? data : []))
      .catch(() => setAllOfferings([]));

    // fetch courses
    fetch(`${BASE}/courses`, { headers })
      .then(res => res.json())
      .then(data => setAllCourses(Array.isArray(data) ? data : []))
      .catch(() => setAllCourses([]));

    // fetch faculty
    fetch(`${BASE}/faculty-members`, { headers })
      .then(res => res.json())
      .then(data => setAllFaculty(Array.isArray(data) ? data : []))
      .catch(() => setAllFaculty([]));
  }, [BASE, currentUserId]);
  const token = localStorage.getItem("authToken");
  const deanId = allFaculty.find(f => f.userId === currentUserId)?.id;

  const openModal = (type, exam = null) => {
    setModalType(type);
    setSelectedExam(exam);

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
          ? exam.examRooms.map(r => r.classroomId.toString())
          : []
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
        classrooms: []
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setFormData({
      examName: "",
      department: "",
      examType: "Written",
      dateTime: "",
      duration: "",
      numProctors: "",
      offeringId: "",
      facultyId: "",
      classrooms: []
    });
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "classrooms") {
      setFormData(f => {
        const set = new Set(f.classrooms);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...f, classrooms: Array.from(set) };
      });
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSave = () => {
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const payload = {
      examName: formData.examName,
      department: formData.department,
      examType: formData.examType,
      dateTime: formData.dateTime,
      duration: parseFloat(formData.duration),
      numProctors: parseInt(formData.numProctors, 10),
      offeringId: formData.offeringId ? parseInt(formData.offeringId, 10) : null,
      facultyId: modalType === "create" ? deanId : (formData.facultyId ? parseInt(formData.facultyId, 10) : null),
      examRooms: formData.classrooms.map(id => ({ classroomId: parseInt(id, 10), numProctors: parseInt(formData.numProctors, 10) }))
    };
    const method = modalType === "create" ? "POST" : "PUT";
    const url =
      modalType === "create"
        ? `${BASE}/exams`
        : `${BASE}/exams/${selectedExam.id}`;

    fetch(url, { method, headers, body: JSON.stringify(payload) })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        setExams(es =>
          modalType === "create"
            ? [data, ...es]
            : es.map(ex => (ex.id === data.id ? data : ex))
        );
        closeModal();
      })
      .catch(() => alert("Error saving exam"));
  };

  const handleDelete = () => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${BASE}/dean/${deanId}/exams/${selectedExam.id}`, { method: "DELETE", headers })
      .then(res => { if (!res.ok) throw new Error(); })
      .then(() => {
        setExams(es => es.filter(ex => ex.id !== selectedExam.id));
        closeModal();
      })
      .catch(() => alert("Error deleting exam"));
  };

  return (
    <LayoutDean>
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between mb-4">
          <h3>Defines Exam</h3>
          <button
            className="btn btn-secondary"
            onClick={() => openModal("create")}
          >
            + Create Exam
          </button>
        </div>

        <div className="row g-4">
          {exams.map(ex => {
            const proctors = allAssignments.filter(
              a => a.examId === ex.id
            );
            return (
              <div className="col-md-6 col-lg-4" key={ex.id}>
                <div className="card shadow-sm mb-3">
                  <div className="card-body">
                    <h5>{ex.examName}</h5>
                    <p>
                      <strong>Type:</strong> {ex.examType}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(ex.dateTime).toLocaleString()}
                    </p>
                    <div className="mt-3">
                      <strong>Proctors:</strong>
                      <ul className="ps-3 mb-0">
                        {proctors.length > 0 ? (
                          proctors.map(a => {
                            const ta = allTAs.find(
                              t => t.id === a.taId
                            );
                            const taName = ta
                              ? `${ta.firstName} ${ta.lastName}`
                              : `TA #${a.taId}`;
                            const cls = allClassrooms.find(
                              c => c.id === a.classroomId
                            );
                            const roomName = cls
                              ? `${cls.building} ${cls.roomNumber}`
                              : `Room #${a.classroomId}`;
                            return (
                              <li key={a.id}>
                                {taName} – {roomName} <em>({a.status})</em>
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-muted">
                            No proctors assigned
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      {showModal && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "create"
                    ? "Create Exam"
                    : modalType === "edit"
                    ? "Edit Exam"
                    : "Confirm Delete"}
                </h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              {modalType === "delete" ? (
                <div className="modal-body">
                  <p>Are you sure you want to delete this exam?</p>
                </div>
              ) : (
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Exam Name</label>
                    <input
                      name="examName"
                      className="form-control"
                      value={formData.examName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">-- select dept --</option>
                      <option value="CS">CS</option>
                      <option value="EE">EE</option>
                      <option value="IE">IE</option>
                      <option value="ME">ME</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      name="examType"
                      className="form-select"
                      value={formData.examType}
                      onChange={handleChange}
                    >
                      <option>Midterm</option>
                      <option>Final</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      className="form-control"
                      value={formData.dateTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Proctors
                    </label>
                    <input
                      type="number"
                      name="numProctors"
                      className="form-control"
                      value={formData.numProctors}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Offering</label>
                    <select
                      name="offeringId"
                      className="form-select"
                      value={formData.offeringId}
                      onChange={handleChange}
                    >
                      <option value="">
                        -- select offering --
                      </option>
                      {allOfferings.map(o => {
                        const course = allCourses.find(
                          c => c.id === o.courseId
                        );
                        return (
                          <option key={o.id} value={o.id}>
                              ({o.semester} {o.year}) –{" "}
                            {course
                              ? course.courseCode
                              : `Course #${o.courseId}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Select Classrooms
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {allClassrooms.map((cls, i) => (
                        <div className="form-check me-3" key={i}>
                          <input
                            type="checkbox"
                            name="classrooms"
                            value={cls.id}
                            checked={formData.classrooms.includes(
                              cls.id.toString()
                            )}
                            onChange={handleChange}
                            className="form-check-input"
                            id={`cls-${i}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`cls-${i}`}
                          >
                            {cls.building} {cls.roomNumber}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button
                  className="btn btn-secondary me-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={
                    modalType === "delete" ? handleDelete : handleSave
                  }
                >
                  {modalType === "delete" ? "Delete" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutDean>
  );
};

export default ExamSchedulingDean;
