import React, { useState } from "react";
import InstructorLayout from "./InstructorLayout";

const allCoursesByFaculty = {
  "Computer Engineering": ["CS102", "CS315", "CS224"],
  "Mathematics": ["MATH101", "MATH203"],
  "Physics": ["PHYS112", "PHYS210"],
  "Electrical Engineering": ["EE202", "EE300"]
};

const initialTAs = [
  { name: "Alice Johnson", email: "alice@university.edu", department: "Computer Engineering", courses: ["CS102"] },
  { name: "Bob Smith", email: "bob@university.edu", department: "Mathematics", courses: ["MATH101", "PHYS112"] }
];

const TAList = () => {
  const [tas, setTAs] = useState(initialTAs);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedTAIndex, setSelectedTAIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    courses: []
  });

  const openModal = (type, index = null) => {
    setModalType(type);
    setSelectedTAIndex(index);

    if (type === "edit" && index !== null) {
      setFormData({ ...tas[index] });
    } else {
      setFormData({ name: "", email: "", department: "", courses: [] });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", email: "", department: "", courses: [] });
    setSelectedTAIndex(null);
  };

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      if (name === "department") {
        // Reset courses when faculty (department) changes
        setFormData(prev => ({ ...prev, department: value, courses: [] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSave = () => {
    if (modalType === "create") {
      setTAs(prev => [...prev, formData]);
    } else if (modalType === "edit" && selectedTAIndex !== null) {
      const updated = [...tas];
      updated[selectedTAIndex] = formData;
      setTAs(updated);
    }
    closeModal();
  };

  const handleDelete = (index) => {
    const updated = tas.filter((_, i) => i !== index);
    setTAs(updated);
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <InstructorLayout />
      </div>

      <div className="container py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Teaching Assistants</h2>
          <button className="btn btn-secondary" onClick={() => openModal("create")}>
            + Add TA
          </button>
        </div>

        <div className="card p-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tas.map((ta, idx) => (
                <tr key={idx}>
                  <td>{ta.name}</td>
                  <td>{ta.email}</td>
                  <td>{ta.department}</td>
                  <td>{ta.courses.join(", ")}</td>
                  <td>
                    <button className="btn btn-outline-success btn-sm me-2" onClick={() => openModal("edit", idx)}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(idx)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalType === "create" ? "Add New TA" : `Edit TA`}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input name="name" className="form-control" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Faculty</label>
                      <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                        <option value="">-- Select Faculty --</option>
                        {Object.keys(allCoursesByFaculty).map((faculty, idx) => (
                          <option key={idx} value={faculty}>{faculty}</option>
                        ))}
                      </select>
                    </div>
                    {formData.department && (
                      <div className="mb-3">
                        <label className="form-label">Courses</label>
                        <select
                          name="courses"
                          className="form-select"
                          multiple
                          value={formData.courses}
                          onChange={handleChange}
                        >
                          {allCoursesByFaculty[formData.department].map((course, idx) => (
                            <option key={idx} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </form>
                </div>
                <div className="modal-footer d-flex justify-content-end">
                  <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    {modalType === "create" ? "Save TA" : "Save Changes"}
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

export default TAList;
