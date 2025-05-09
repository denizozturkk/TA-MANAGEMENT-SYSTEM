// src/people/FacultyMember/UploadDutyLogPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const UploadDutyLogPage = () => {
  const dutyTypes = ["LAB", "GRADING", "RECITATION", "OFFICE_HOUR", "PROCTORING"];

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

  // 1) Who am I?
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers: jsonHeaders })
      .then(r => r.json())
      .then(u => setFacultyId(u.id))
      .catch(console.error);
  }, [token]);

  // 2) Load offerings
  useEffect(() => {
    fetch(`${BASE}/offerings`, { headers: jsonHeaders })
      .then(r => r.json())
      .then(data => setOfferings(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 3) Load classrooms
  useEffect(() => {
    fetch(`${BASE}/classrooms`, { headers: jsonHeaders })
      .then(r => r.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 4) Fetch only the TAs for the selected offering
  useEffect(() => {
    if (!form.offeringId) {
      setAvailableTAs([]);
      return;
    }
    fetch(`${BASE}/ta?offeringId=${form.offeringId}`, { headers: jsonHeaders })
      .then(r => r.json())
      .then(data => setAvailableTAs(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [form.offeringId]);

  // handle text & select inputs
  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const vals = Array.from(selectedOptions).map(o => o.value);
      setForm(f => ({ ...f, [name]: vals }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // handle file input separately
  const handleFileChange = e => {
    const selected = e.target.files[0] || null;
    console.log("📄 selected file:", selected);
    setForm(f => ({ ...f, file: selected }));
  };

  const handleSubmit = async () => {
    // 1) basic validation
    if (!facultyId) {
      return alert("❌ Faculty ID hasn’t loaded yet.");
    }
    if (!form.offeringId) {
      return alert("❌ Please select an offering.");
    }
    if (!form.taskType) {
      return alert("❌ Please select a task type.");
    }
    if (form.assignmentMode === "MANUAL" && !form.taId) {
      return alert("❌ Please select a TA for manual assignment.");
    }

    // 2) calculate duration in minutes
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const duration = Math.round((end - start) / 60000);
    if (isNaN(duration) || duration <= 0) {
      return alert("❌ Please enter valid start and end times.");
    }

    // 3) build FormData
    const fd = new FormData();
    // append file if present, otherwise explicit null
    if (form.file) {
      fd.append("file", form.file);
    } else {
      fd.append("file", null);
    }
    fd.append("taskType", form.taskType);
    fd.append("workload", form.workload);
    fd.append("offeringId", form.offeringId);
    fd.append("startTime", form.startTime);
    fd.append("endTime", form.endTime);
    fd.append("duration", duration);
    fd.append("status", form.status);

    if (form.taskType === "LAB") {
      if (form.classroomIds.length === 0) {
        return alert("❌ Please select at least one classroom for LAB tasks.");
      }
    }
    // if there are any selected rooms, append them…
    if (form.classroomIds.length > 0) {
      form.classroomIds.forEach(id => fd.append("classroomIds", id));
    } else {
      // …otherwise append a dummy empty value so the param exists
      fd.append("classroomIds", "");
    }

    // 4) choose URL
    const url =
      form.assignmentMode === "AUTOMATIC"
        ? `${BASE}/faculty-members/${facultyId}/duty-logs/automatic`
        : `${BASE}/faculty-members/${facultyId}/tas/${form.taId}/duty-logs`;

    // 5) submit
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // leave out content-type for multipart
        body: fd,
      });
      if (!res.ok) {
        const errorBody = await res.text();
        console.error("Upload error:", errorBody);
        throw new Error(res.statusText);
      }
      await res.json();
      alert("✅ Duty log uploaded successfully");
      // reset form (preserve assignmentMode)
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
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Workload (min)</label>
            <input
              type="number"
              className="form-control"
              name="workload"
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

        {/* Submit */}
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
