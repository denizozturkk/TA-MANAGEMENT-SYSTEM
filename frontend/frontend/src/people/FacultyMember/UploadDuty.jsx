// src/people/FacultyMember/UploadDutyLogPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const UploadDutyLogPage = () => {
  const dutyTypes = [
    "LAB",
    "GRADING",
    "RECITATION",
    "OFFICE_HOUR",
    "PROCTORING",
  ];

  const [facultyId, setFacultyId] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [availableTAs, setAvailableTAs] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [form, setForm] = useState({
    offeringId: "",
    taskType: "",
    workload: "",
    startTime: "",
    endTime: "",
    classroomIds: [],
    assignmentMode: "MANUAL",
    taId: "",
    file: null,
    status: "PENDING",
  });

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const jsonHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // fetch current user
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(u => setFacultyId(u.id))
      .catch(console.error);
  }, [token]);

  // load offerings
  useEffect(() => {
    fetch(`${BASE}/offerings`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(data => setOfferings(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // load classrooms
  useEffect(() => {
    fetch(`${BASE}/classrooms`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // load TAs when offering changes
  useEffect(() => {
    if (!form.offeringId) {
      setAvailableTAs([]);
      return;
    }
    fetch(`${BASE}/ta?offeringId=${form.offeringId}`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(data => setAvailableTAs(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [form.offeringId]);

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      setForm(f => ({
        ...f,
        [name]: Array.from(selectedOptions).map(o => o.value),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = e => {
    setForm(f => ({ ...f, file: e.target.files[0] || null }));
  };

  const handleSubmit = async () => {
    if (!facultyId) return alert("❌ Faculty ID hasn’t loaded yet.");
    if (!form.offeringId) return alert("❌ Please select an offering.");
    if (!form.taskType) return alert("❌ Please select a task type.");
    if (form.assignmentMode === "MANUAL" && !form.taId)
      return alert("❌ Please select a TA for manual assignment.");

    const workloadFloat = parseFloat(form.workload);
    if (isNaN(workloadFloat) || workloadFloat <= 0) {
      return alert("❌ Please enter a valid workload in hours.");
    }

    // —————————————
    // UPDATED: round duration to whole hours (Java Long)
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const rawHours = (end - start) / (1000 * 60 * 60);
    const duration = Math.round(rawHours);
    if (isNaN(duration) || duration <= 0) {
      return alert("❌ Please enter valid start and end times.");
    }
    // —————————————

    const fd = new FormData();
    if (form.file) {
      fd.append("file", form.file);
    }
    fd.append("taskType", form.taskType);
    fd.append("workload", workloadFloat);
    fd.append("offeringId", form.offeringId);
    fd.append("startTime", form.startTime);
    fd.append("endTime", form.endTime);
    fd.append("duration", duration);
    fd.append("status", form.status);

    form.classroomIds.forEach(id => fd.append("classroomIds", id));

    const url =
      form.assignmentMode === "AUTOMATIC"
        ? `${BASE}/faculty-members/${facultyId}/duty-logs/automatic`
        : `${BASE}/faculty-members/${facultyId}/tas/${form.taId}/duty-logs`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Upload error:", err);
        throw new Error(res.statusText);
      }
      await res.json();
      alert("✅ Duty log uploaded successfully");
      setForm(f => ({
        ...f,
        taskType: "",
        workload: "",
        startTime: "",
        endTime: "",
        classroomIds: [],
        taId: "",
        file: null,
        status: "PENDING",
      }));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload duty log. Please check your inputs.");
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">Upload Duty Log</h3>

        {/* Offering */}
        <div className="mb-3">
          <label className="form-label">Select Offering</label>
          <select
            className="form-select"
            name="offeringId"
            value={form.offeringId}
            onChange={handleChange}
          >
            <option value="">-- choose offering --</option>
            {offerings.map(o => (
              <option key={o.id} value={o.id}>
                {o.courseCode} – {o.semester} {o.year}
              </option>
            ))}
          </select>
        </div>

        {/* Task Details */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Task Type</label>
            <select
              className="form-select"
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
            >
              <option value="">-- select type --</option>
              {dutyTypes.map(dt => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Workload (hours)</label>
            <input
              type="number"
              className="form-control"
              name="workload"
              step="any"
              min="0"
              value={form.workload}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Classrooms (only for LAB) */}
        {form.taskType === "LAB" && (
          <div className="mb-4">
            <label className="form-label">Classrooms</label>
            <select
              className="form-select"
              name="classroomIds"
              multiple
              value={form.classroomIds}
              onChange={handleChange}
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>
                  {c.building} {c.roomNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* File Upload (optional) */}
        <div className="mb-4">
          <label className="form-label">Upload PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* Assignment Mode */}
        <div className="mb-4">
          <label className="form-label me-3">Assignment Mode:</label>
          {["MANUAL", "AUTOMATIC"].map(mode => (
            <div className="form-check form-check-inline" key={mode}>
              <input
                className="form-check-input"
                type="radio"
                name="assignmentMode"
                value={mode}
                checked={form.assignmentMode === mode}
                onChange={handleChange}
              />
              <label className="form-check-label">{mode}</label>
            </div>
          ))}
        </div>

        {/* Select TA for Manual */}
        {form.assignmentMode === "MANUAL" && (
          <div className="mb-4">
            <label className="form-label">Select TA</label>
            <select
              className="form-select"
              name="taId"
              value={form.taId}
              onChange={handleChange}
            >
              <option value="">-- choose TA --</option>
              {availableTAs.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!facultyId}
        >
          Upload Duty Log
        </button>
      </div>
    </div>
  );
};

export default UploadDutyLogPage;
