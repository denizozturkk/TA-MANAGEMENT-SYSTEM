import React, { useState, useEffect } from "react";
import InstructorLayout from "./InstructorLayout";

const AssignDutyPage = () => {
  const [tas, setTAs] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    assignmentType: "manual", // <-- yeni alan
    taId: "",
    taskType: "EXAM_PROCTORING",
    workload: "",
    startTime: "",
    duration: "",
    status: "PENDING",
    file: null,
    classroomIds: []
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/tas")
      .then((res) => res.json())
      .then((data) => setTAs(data));

    fetch("/api/classrooms")
      .then((res) => res.json())
      .then((data) => setClassrooms(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (id) => {
    const updated = formData.classroomIds.includes(id)
      ? formData.classroomIds.filter((x) => x !== id)
      : [...formData.classroomIds, id];
    setFormData({ ...formData, classroomIds: updated });
  };

  const handleSubmit = async () => {
    const facultyId = 1;

    // otomatikse uygun TA'yı seç
    if (formData.assignmentType === "automatic") {
      const availableTA = tas.find((ta) => ta.workload < 3);
      if (!availableTA) {
        alert("No suitable TA available. Please notify the Dean.");
        return;
      }
      formData.taId = availableTA.id;
    }

    const form = new FormData();
    form.append("file", formData.file);
    form.append("taskType", formData.taskType);
    form.append("workload", formData.workload);
    form.append("startTime", formData.startTime);
    form.append("duration", formData.duration);
    form.append("status", formData.status);
    formData.classroomIds.forEach((id) => form.append("classroomIds", id));

    const response = await fetch(`/api/faculty-members/${facultyId}/tas/${formData.taId}/duty-logs`, {
      method: "POST",
      body: form
    });

    if (response.ok) {
      alert("Duty assigned successfully");
      setShowModal(false);
    } else {
      alert("Failed to assign duty");
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <InstructorLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Assign Duty</h3>
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            + Assign New Duty
          </button>
        </div>

        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assign Duty to TA</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">TA Assignment Type</label>
                      <select
                        name="assignmentType"
                        className="form-select"
                        value={formData.assignmentType}
                        onChange={handleChange}
                      >
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                      </select>
                    </div>

                    {formData.assignmentType === "manual" && (
                      <div className="mb-3">
                        <label className="form-label">Select TA</label>
                        <select
                          name="taId"
                          className="form-select"
                          value={formData.taId}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          {tas.map((ta) => (
                            <option key={ta.id} value={ta.id}>
                              {ta.fullName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Duty Type</label>
                      <select name="taskType" className="form-select" value={formData.taskType} onChange={handleChange}>
                        <option value="EXAM_PROCTORING">Exam Proctoring</option>
                        <option value="GRADING">Grading</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Workload</label>
                      <input
                        name="workload"
                        className="form-control"
                        type="number"
                        value={formData.workload}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Start Time</label>
                      <input
                        name="startTime"
                        type="datetime-local"
                        className="form-control"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        name="duration"
                        className="form-control"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Upload File</label>
                      <input type="file" className="form-control" onChange={handleChange} name="file" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Select Classrooms</label>
                      <div className="d-flex flex-wrap gap-2">
                        {classrooms.map((cls) => (
                          <div className="form-check me-3" key={cls.id}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`classroom-${cls.id}`}
                              checked={formData.classroomIds.includes(cls.id)}
                              onChange={() => handleCheckboxChange(cls.id)}
                            />
                            <label className="form-check-label" htmlFor={`classroom-${cls.id}`}>
                              {cls.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Assign
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

export default AssignDutyPage;
