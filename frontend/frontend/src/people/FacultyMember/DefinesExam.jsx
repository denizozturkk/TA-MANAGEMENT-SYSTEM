import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const DefinesExamPage = () => {
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
    offeringId: "",
    facultyId: "",
    // replaced numProctors + classrooms with a dynamic list:
    examRooms: [{ classroomId: "", numProctors: "" }],
  });

  const BASE = "http://localhost:8080/api";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // fetch profile and then your exams
    fetch(`${BASE}/users/me`, { headers })
      .then((res) => res.json())
      .then((user) => {
        setCurrentUserId(user.id);
        return fetch(`${BASE}/exams`, { headers });
      })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setExams(arr.filter((ex) => ex.facultyId === currentUserId));
      })
      .catch(() => setExams([]));

    // fetch lookups in parallel
    fetch(`${BASE}/proctor-assignments`, { headers })
      .then((r) => r.json())
      .then((d) => setAllAssignments(Array.isArray(d) ? d : []))
      .catch(() => setAllAssignments([]));

    fetch(`${BASE}/ta`, { headers })
      .then((r) => r.json())
      .then((d) => setAllTAs(Array.isArray(d) ? d : []))
      .catch(() => setAllTAs([]));

    fetch(`${BASE}/classrooms`, { headers })
      .then((r) => r.json())
      .then((d) => setAllClassrooms(Array.isArray(d) ? d : []))
      .catch(() => setAllClassrooms([]));

    fetch(`${BASE}/offerings`, { headers })
      .then((r) => r.json())
      .then((d) => setAllOfferings(Array.isArray(d) ? d : []))
      .catch(() => setAllOfferings([]));

    fetch(`${BASE}/courses`, { headers })
      .then((r) => r.json())
      .then((d) => setAllCourses(Array.isArray(d) ? d : []))
      .catch(() => setAllCourses([]));

    fetch(`${BASE}/faculty-members`, { headers })
      .then((r) => r.json())
      .then((d) => setAllFaculty(Array.isArray(d) ? d : []))
      .catch(() => setAllFaculty([]));
  }, [currentUserId]);

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
        offeringId: exam.offeringId?.toString() || "",
        facultyId: exam.facultyId?.toString() || "",
        examRooms:
          Array.isArray(exam.examRooms) && exam.examRooms.length > 0
            ? exam.examRooms.map((r) => ({
                classroomId: r.classroomId.toString(),
                numProctors: r.numProctors.toString(),
              }))
            : [{ classroomId: "", numProctors: "" }],
      });
    } else {
      setFormData({
        examName: "",
        department: "",
        examType: "Written",
        dateTime: "",
        duration: "",
        offeringId: "",
        facultyId: "",
        examRooms: [{ classroomId: "", numProctors: "" }],
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
      offeringId: "",
      facultyId: "",
      examRooms: [{ classroomId: "", numProctors: "" }],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // NEW: handle changes in the dynamic examRooms array
  const handleRoomChange = (idx, field, value) => {
    setFormData((f) => {
      const rooms = f.examRooms.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      );
      // if last row is now fully filled, append a new blank one
      const last = rooms[rooms.length - 1];
      if (last.classroomId && last.numProctors) {
        rooms.push({ classroomId: "", numProctors: "" });
      }
      return { ...f, examRooms: rooms };
    });
  };

  // NEW: remove a row
  const removeRoom = (idx) => {
    setFormData((f) => {
      const rooms = f.examRooms.filter((_, i) => i !== idx);
      return {
        ...f,
        examRooms: rooms.length
          ? rooms
          : [{ classroomId: "", numProctors: "" }],
      };
    });
  };

  const handleSave = () => {
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // build room assignments and total proctors
    const roomAssignments = formData.examRooms
      .filter((r) => r.classroomId && r.numProctors)
      .map((r) => ({
        classroomId: parseInt(r.classroomId, 10),
        numProctors: parseInt(r.numProctors, 10),
      }));
    const totalProctors = roomAssignments.reduce(
      (sum, r) => sum + r.numProctors,
      0
    );

    // automatically assign your user ID as faculty on create
    const facultyIdValue =
      modalType === "create"
        ? currentUserId
        : formData.facultyId
        ? parseInt(formData.facultyId, 10)
        : null;

    const payload = {
      examName: formData.examName,
      department: formData.department,
      examType: formData.examType,
      dateTime: formData.dateTime,
      duration: parseFloat(formData.duration),
      numProctors: totalProctors,
      offeringId: formData.offeringId
        ? parseInt(formData.offeringId, 10)
        : null,
      facultyId: facultyIdValue,
      examRooms: roomAssignments,
    };

    const method = modalType === "create" ? "POST" : "PUT";
    const url =
      modalType === "create"
        ? `${BASE}/exams`
        : `${BASE}/exams/${selectedExam.id}`;

    fetch(url, { method, headers, body: JSON.stringify(payload) })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setExams((es) =>
          modalType === "create"
            ? [data, ...es]
            : es.map((ex) => (ex.id === data.id ? data : ex))
        );
        closeModal();
      })
      .catch(() => alert("Error saving exam"));
  };

  const handleDelete = () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${BASE}/exams/${selectedExam.id}`, {
      method: "DELETE",
      headers,
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setExams((es) =>
          es.filter((ex) => ex.id !== selectedExam.id)
        );
        closeModal();
      })
      .catch(() => alert("Error deleting exam"));
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
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
          {exams.map((ex) => {
            const proctors = allAssignments.filter(
              (a) => a.examId === ex.id
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
                    <p>
                      <strong>Duration:</strong> {ex.duration} minutes
                    </p>
                    <div className="mt-3">
                      <strong>Proctors:</strong>
                      <ul className="ps-3 mb-0">
                        {proctors.length > 0 ? (
                          proctors.map((a) => {
                            const ta = allTAs.find(
                              (t) => t.id === a.taId
                            );
                            const taName = ta
                              ? `${ta.firstName} ${ta.lastName}`
                              : `TA #${a.taId}`;
                            const cls = allClassrooms.find(
                              (c) => c.id === a.classroomId
                            );
                            const roomName = cls
                              ? `${cls.building} ${cls.roomNumber}`
                              : `Room #${a.classroomId}`;
                            return (
                              <li key={a.id}>
                                {taName} – {roomName}{" "}
                                <em>({a.status})</em>
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
                    {/* other fields unchanged */}
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
                        {allOfferings.map((o) => {
                          const course = allCourses.find(
                            (c) => c.id === o.courseId
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

                    {/* NEW dynamic classroom + proctor rows */}
                    <div className="mb-3">
                      <label className="form-label">
                        Classroom Assignments
                      </label>
                      {formData.examRooms.map((r, i) => (
                        <div
                          className="d-flex mb-2 align-items-center"
                          key={i}
                        >
                          <select
                            className="form-select me-2"
                            style={{ flex: 1 }}
                            value={r.classroomId}
                            onChange={(e) =>
                              handleRoomChange(
                                i,
                                "classroomId",
                                e.target.value
                              )
                            }
                          >
                            <option value="">
                              -- select classroom --
                            </option>
                            {allClassrooms.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.building} {c.roomNumber}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            className="form-control me-2"
                            style={{ width: 100 }}
                            placeholder="# proctors"
                            value={r.numProctors}
                            onChange={(e) =>
                              handleRoomChange(
                                i,
                                "numProctors",
                                e.target.value
                              )
                            }
                          />
                          {formData.examRooms.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeRoom(i)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                      <small className="text-muted">
                        Total Proctors:{" "}
                        {formData.examRooms
                          .filter((r) => r.classroomId && r.numProctors)
                          .reduce(
                            (sum, r) =>
                              sum + parseInt(r.numProctors, 10),
                            0
                          )}
                      </small>
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
                      modalType === "delete"
                        ? handleDelete
                        : handleSave
                    }
                  >
                    {modalType === "delete" ? "Delete" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefinesExamPage;
