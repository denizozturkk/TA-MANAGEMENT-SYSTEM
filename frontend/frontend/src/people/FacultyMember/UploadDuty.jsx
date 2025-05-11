import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const UploadDutyLogPage = () => {
  const dutyTypes = ["LAB", "GRADING", "RECITATION", "PROCTORING"];

  const [facultyId, setFacultyId] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [availableTAs, setAvailableTAs] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [toast, setToast] = useState(null); // Toast state
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

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(u => setFacultyId(u.id))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!facultyId) return;
    fetch(`${BASE}/offerings/faculty/${facultyId}`, { headers: jsonHeaders })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setOfferings(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Failed to load offerings:", err);
        setOfferings([]);
      });
  }, [facultyId]);

  useEffect(() => {
    fetch(`${BASE}/classrooms`, { headers: jsonHeaders })
      .then(res => res.json())
      .then(data => setClassrooms(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.offeringId) {
      setAvailableTAs([]);
      return;
    }
    fetch(`${BASE}/ta/by-offering/${form.offeringId}`, { headers: jsonHeaders })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setAvailableTAs(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Failed to load TAs for offering:", err);
        setAvailableTAs([]);
      });
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
    if (!facultyId) return showToast("Faculty ID hasn’t loaded yet.");
    if (!form.offeringId) return showToast("Please select an offering.");
    if (!form.taskType) return showToast("Please select a task type.");
    if (form.assignmentMode === "MANUAL" && !form.taId)
      return showToast("Please select a TA for manual assignment.");

    const workloadFloat = parseFloat(form.workload);
    if (isNaN(workloadFloat) || workloadFloat <= 0) {
      return showToast("Please enter a valid workload in hours.");
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const rawHours = (end - start) / (1000 * 60 * 60);
    const duration = Math.round(rawHours);
    if (isNaN(duration) || duration <= 0) {
      return showToast("Please enter valid start and end times.");
    }

    const fd = new FormData();
    if (form.file) fd.append("file", form.file);
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
        let backendMessage = await res.text();
        try {
          const json = JSON.parse(backendMessage);
          backendMessage = json.message || backendMessage;
        } catch (_) {}
        console.error("Upload error:", backendMessage);
        return showToast(`${backendMessage}`);
      }

      await res.json();
      showToast("✅ Duty log uploaded successfully", "success");
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
      showToast("Failed to upload duty log. Please check your inputs.");
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">Upload Duty Log</h3>

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "12px 20px",
              backgroundColor: toast.type === "success" ? "#28a745" : "#dc3545",
              color: "white",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              zIndex: 9999,
              maxWidth: "300px",
            }}
          >
            {toast.message}
          </div>
        )}

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

        {(form.taskType === "LAB" || form.taskType === "RECITATION") && (
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

        <div className="mb-4">
          <label className="form-label">Upload PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

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