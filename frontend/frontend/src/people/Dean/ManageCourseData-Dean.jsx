// src/people/Dean/ManageCourseData-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ManageCourseDataDean = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // null = adding new
  const [form, setForm] = useState({ code: "", name: "", credits: "" });

  const token = localStorage.getItem("authToken");

  // Fetch all courses
  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load courses");
      setCourses(await res.json());
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Open modal for add or edit
  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setForm({ code: course.courseCode, name: course.courseName, credits: course.credits });
    } else {
      setEditingCourse(null);
      setForm({ code: "", name: "", credits: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  // Handle create or update
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      courseCode: form.code,
      courseName: form.name,
      credits: Number(form.credits),
    };
    try {
      let res;
      if (editingCourse) {
        res = await fetch(`http://localhost:8080/api/courses/${editingCourse.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:8080/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status}: ${txt}`);
      }
      await loadCourses();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    }
  };

  // Delete a course
  const handleDelete = async () => {
    if (!editingCourse) return;
    if (!window.confirm(`Delete course ${editingCourse.courseCode}?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${editingCourse.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      await loadCourses();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Form field updates
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <LayoutDean>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Manage Courses</h4>
            <button
              className="btn btn-success"
              onClick={() => openModal(null)}
            >
              Add Course
            </button>
          </div>

          {loading ? (
            <p>Loading courses…</p>
          ) : (
            <table className="table table-hover w-100">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Credits</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.courseCode}</td>
                    <td>{c.courseName}</td>
                    <td>{c.credits}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (window.confirm(`Delete ${c.courseCode}?`)) {
                            try {
                              const res = await fetch(`http://localhost:8080/api/courses/${c.id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              if (!res.ok) throw new Error("Delete failed");
                              setCourses((prev) => prev.filter(x => x.id !== c.id));
                            } catch (err) {
                              console.error(err);
                              alert(err.message);
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1050 }}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div
              className="modal-content p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "8px" }}
            >
              <h5 className="mb-3">{editingCourse ? "Edit Course" : "Add Course"}</h5>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label">Course Code</label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Course Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Credits</label>
                  <input
                    name="credits"
                    type="number"
                    value={form.credits}
                    onChange={handleChange}
                    className="form-control"
                    required
                    min={0}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  {editingCourse && (
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCourse ? "Save" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LayoutDean>
  );
};

export default ManageCourseDataDean;
