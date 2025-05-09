import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ExamSchedulingDean = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allOfferings, setAllOfferings] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);

  const [formData, setFormData] = useState({
    examName: "",
    department: "",
    examType: "Written",
    dateTime: "",
    duration: "",
    offeringId: "",
    classrooms: [], // { classroomId, numProctors }
  });
  const [formErrors, setFormErrors] = useState({});

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    fetch(`${BASE}/users/me`, { headers })
      .then((r) => r.json())
      .then((u) => setCurrentUserId(u.id))
      .catch(() => {});

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
  }, [token]);

  const deanId = allFaculty.find((f) => f.userId === currentUserId)?.id;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "classrooms") {
      setFormData((f) => {
        const exists = f.classrooms.find((c) => c.classroomId === value);
        if (checked && !exists) {
          return { ...f, classrooms: [...f.classrooms, { classroomId: value, numProctors: "" }] };
        } else if (!checked && exists) {
          return { ...f, classrooms: f.classrooms.filter((c) => c.classroomId !== value) };
        }
        return f;
      });
    } else if (name.startsWith("proctors-")) {
      const id = name.split("-")[1];
      setFormData((f) => ({
        ...f,
        classrooms: f.classrooms.map((c) =>
          c.classroomId === id ? { ...c, numProctors: value } : c
        ),
      }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.examName.trim()) errs.examName = "Required";
    if (!formData.department) errs.department = "Required";
    if (!formData.dateTime) errs.dateTime = "Required";
    if (formData.duration === "" || parseFloat(formData.duration) < 0)
      errs.duration = "Non-negative";
    if (!formData.offeringId) errs.offeringId = "Required";
    if (formData.classrooms.length === 0) errs.classrooms = "Select ≥1";
    formData.classrooms.forEach((c) => {
      if (!c.numProctors || parseInt(c.numProctors, 10) < 0)
        errs[`proctors-${c.classroomId}`] = "Non-negative";
    });
    setFormErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const payload = {
      examName: formData.examName,
      department: formData.department,
      examType: formData.examType,
      dateTime: formData.dateTime,
      duration: parseFloat(formData.duration),
      offeringId: parseInt(formData.offeringId, 10),
      facultyId: deanId,
      examRooms: formData.classrooms.map((c) => ({
        classroomId: parseInt(c.classroomId, 10),
        numProctors: parseInt(c.numProctors, 10),
      })),
    };

    fetch(`${BASE}/exams`, { method: "POST", headers, body: JSON.stringify(payload) })
      .then((r) => {
        if (!r.ok) throw new Error();
        alert("Created!");
        setFormData({
          examName: "",
          department: "",
          examType: "Written",
          dateTime: "",
          duration: "",
          offeringId: "",
          classrooms: [],
        });
        setFormErrors({});
      })
      .catch(() => alert("Failed"));
  };

  return (
    <div className="d-flex">
      <aside style={{ width: 280 }}>
        <LayoutDean />
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="mb-4">Create New Exam</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Exam Name</label>
                  <input
                    type="text"
                    name="examName"
                    className="form-control"
                    value={formData.examName}
                    onChange={handleChange}
                  />
                  {formErrors.examName && (
                    <small className="text-danger">{formErrors.examName}</small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Choose…</option>
                    <option value="CS">CS</option>
                    <option value="EE">EE</option>
                    <option value="IE">IE</option>
                    <option value="ME">ME</option>
                  </select>
                  {formErrors.department && (
                    <small className="text-danger">{formErrors.department}</small>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="form-control"
                    value={formData.dateTime}
                    onChange={handleChange}
                  />
                  {formErrors.dateTime && (
                    <small className="text-danger">{formErrors.dateTime}</small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Duration (hrs)</label>
                  <input
                    type="number"
                    name="duration"
                    lang="tr"
                    min="0"
                    step="0.1"
                    className="form-control"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                  {formErrors.duration && (
                    <small className="text-danger">{formErrors.duration}</small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Exam Type</label>
                  <select
                    name="examType"
                    className="form-select"
                    value={formData.examType}
                    onChange={handleChange}
                  >
                    <option value="Written">Written</option>
                    <option value="Oral">Oral</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Offering</label>
                  <select
                    name="offeringId"
                    className="form-select"
                    value={formData.offeringId}
                    onChange={handleChange}
                  >
                    <option value="">Choose…</option>
                    {allOfferings.map((o) => {
                      const course = allCourses.find((c) => c.id === o.courseId);
                      return (
                        <option key={o.id} value={o.id}>
                          {o.semester} {o.year} – {course?.courseCode}
                        </option>
                      );
                    })}
                  </select>
                  {formErrors.offeringId && (
                    <small className="text-danger">{formErrors.offeringId}</small>
                  )}
                </div>
              </div>

              {/* Classrooms table */}
              <div className="mt-4">
                <h5>Classrooms & Proctors</h5>
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "1%" }}></th>
                      <th>Room</th>
                      <th style={{ width: "20%" }}># Proctors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allClassrooms.map((cls) => {
                      const sel = formData.classrooms.find(
                        (c) => c.classroomId === cls.id.toString()
                      );
                      return (
                        <tr key={cls.id}>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              name="classrooms"
                              value={cls.id}
                              checked={!!sel}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            {cls.building} {cls.roomNumber}
                          </td>
                          <td>
                            <input
                              type="number"
                              name={`proctors-${cls.id}`}
                              min="0"
                              step="1"
                              className="form-control form-control-sm"
                              disabled={!sel}
                              placeholder="0"
                              value={sel?.numProctors || ""}
                              onChange={handleChange}
                            />
                            {formErrors[`proctors-${cls.id}`] && (
                              <small className="text-danger">
                                {formErrors[`proctors-${cls.id}`]}
                              </small>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {formErrors.classrooms && (
                  <small className="text-danger">{formErrors.classrooms}</small>
                )}
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary px-4">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamSchedulingDean;
