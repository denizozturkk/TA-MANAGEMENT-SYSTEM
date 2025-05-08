import React, { useEffect, useState } from "react";
import FacultyMemberLayout from "./FacultyMemberLayout"; // adjust path

const DutyTypes = ["LAB", "GRADING", "RECITATION", "OFFICE_HOUR", "PROCTORING"];

const UploadDutyLog = () => {
  const [offerings, setOfferings] = useState([]);
  const [tas, setTAs] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [form, setForm] = useState({
    offeringId: "",
    taId: "",
    file: null,
    taskType: "",
    workload: "",
    startTime: "",
    duration: "",
    classroomIds: [],
  });

  const BASE = "http://localhost:8080/api";
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  // 1) load offerings & classrooms
  useEffect(() => {
    fetch(`${BASE}/offerings`, { headers })
      .then(r => (r.ok ? r.json() : []))
      .then(data => setOfferings(Array.isArray(data) ? data : []));

    fetch(`${BASE}/classrooms`, { headers })
      .then(r => (r.ok ? r.json() : []))
      .then(data => setClassrooms(Array.isArray(data) ? data : []));
  }, []);

  // 2) when offering changes, fetch that offering's TA set
  useEffect(() => {
    if (!form.offeringId) {
      setTAs([]);
      setForm(f => ({ ...f, taId: "" }));
      return;
    }
    fetch(`${BASE}/offerings/${form.offeringId}`, { headers })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(offDto => {
        // offDto.tas should be array of TA DTOs
        setTAs(Array.isArray(offDto.tas) ? offDto.tas : []);
      })
      .catch(() => setTAs([]));
    setForm(f => ({ ...f, taId: "" }));
  }, [form.offeringId]);

  const handleChange = e => {
    const { name, value, files, options } = e.target;
    if (name === "file") {
      setForm(f => ({ ...f, file: files[0] }));
    } else if (name === "classroomIds") {
      const selected = Array.from(options)
        .filter(o => o.selected)
        .map(o => o.value);
      setForm(f => ({ ...f, classroomIds: selected }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.offeringId || !form.taId || !form.file) {
      alert("Please select offering, TA, and upload a file.");
      return;
    }
    const facultyId = localStorage.getItem("userId");
    const { taId, file, offeringId, ...rest } = form;

    const body = new FormData();
    body.append("file", file);
    body.append("status", "PENDING");
    body.append("offeringId", offeringId);
    Object.entries(rest).forEach(([k, v]) => {
      if (k === "classroomIds") {
        v.forEach(id => body.append(k, id));
      } else {
        body.append(k, v);
      }
    });

    const res = await fetch(
      `${BASE}/faculty-members/${facultyId}/tas/${taId}/duty-logs`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );
    if (res.ok) {
      alert("Upload successful.");
      setForm({
        offeringId: "",
        taId: "",
        file: null,
        taskType: "",
        workload: "",
        startTime: "",
        duration: "",
        classroomIds: [],
      });
      setTAs([]);
    } else {
      const err = await res.text();
      alert("Error: " + err);
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <h3 className="mb-4">Upload Duty Log</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Offering */}
            <div className="col-md-6">
              <label className="form-label">Offering</label>
              <select
                name="offeringId"
                className="form-select"
                value={form.offeringId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Offering --</option>
                {offerings.map(off => (
                  <option key={off.id} value={off.id}>
                    ({off.semester} {off.year}) – {off.courseCode}
                  </option>
                ))}
              </select>
            </div>

            {/* TA */}
            <div className="col-md-6">
              <label className="form-label">TA</label>
              <select
                name="taId"
                className="form-select"
                value={form.taId}
                onChange={handleChange}
                required
                disabled={!tas.length}
              >
                <option value="">-- Select TA --</option>
                {tas.map(ta => (
                  <option key={ta.id} value={ta.id}>
                    {ta.firstName} {ta.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div className="col-md-6">
              <label className="form-label">Task Type</label>
              <select
                name="taskType"
                className="form-select"
                value={form.taskType}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Type --</option>
                {DutyTypes.map(dt => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            {/* Workload */}
            <div className="col-md-4">
              <label className="form-label">Workload</label>
              <input
                type="number"
                name="workload"
                className="form-control"
                value={form.workload}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}
            <div className="col-md-4">
              <label className="form-label">Duration (mins)</label>
              <input
                type="number"
                name="duration"
                className="form-control"
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>

            {/* Start Time */}
            <div className="col-md-4">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                className="form-control"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Classrooms */}
            <div className="col-12">
              <label className="form-label">Classrooms</label>
              <select
                multiple
                name="classroomIds"
                className="form-select"
                value={form.classroomIds}
                onChange={handleChange}
                required
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.building} {c.roomNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload PDF */}
            <div className="col-12">
              <label className="form-label">Upload PDF</label>
              <input
                type="file"
                name="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">
                Upload Duty Log
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDutyLog;
