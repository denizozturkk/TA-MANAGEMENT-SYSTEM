import React, { useEffect, useState } from "react";
import FacultyMemberLayout from "./FacultyMemberLayout"; // adjust as needed

const DutyTypes = ["LAB", "GRADING", "RECITATION", "OFFICE_HOUR", "PROCTORING"];
const DutyStatuses = ["PENDING", "APPROVED", "REJECTED"];

const UploadDutyLog = () => {
  const [tas, setTAs] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [form, setForm] = useState({
    taId: "",
    file: null,
    taskType: "",
    workload: "",
    offeringId: "",
    startTime: "",
    duration: "",
    status: "",
    classroomIds: [],
  });

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch("http://localhost:8080/api/ta", { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => setTAs(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/faculty-members/me/exams", { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => setOfferings(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/api/classrooms", { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => setClassrooms(Array.isArray(data) ? data : []));
  }, []);

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
    if (!form.taId || !form.file) {
      alert("Please select a TA and upload a file.");
      return;
    }

    const facultyId = localStorage.getItem("userId");
    const { taId, file, ...rest } = form;
    const body = new FormData();
    body.append("file", file);
    Object.entries(rest).forEach(([k, v]) => {
      if (k === "classroomIds") {
        v.forEach(id => body.append(k, id));
      } else {
        body.append(k, v);
      }
    });

    const res = await fetch(
      `http://localhost:8080/api/faculty-members/${facultyId}/tas/${taId}/duty-logs`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` }, body }
    );
    if (res.ok) {
      alert("Upload successful.");
      setForm({
        taId: "", file: null, taskType: "", workload: "",
        offeringId: "", startTime: "", duration: "", status: "", classroomIds: []
      });
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
            <div className="col-md-6">
              <label className="form-label">TA</label>
              <select name="taId" className="form-select" value={form.taId} onChange={handleChange} required>
                <option value="">-- Select TA --</option>
                {tas.map(ta => (
                  <option key={ta.id} value={ta.id}>{ta.firstName} {ta.lastName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Offering</label>
              <select name="offeringId" className="form-select" value={form.offeringId} onChange={handleChange} required>
                <option value="">-- Select Offering --</option>
                {offerings.map(off => (
                  <option key={off.id} value={off.id}>{off.courseCode} - {off.examName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Task Type</label>
              <select name="taskType" className="form-select" value={form.taskType} onChange={handleChange} required>
                <option value="">-- Choose Type --</option>
                {DutyTypes.map(dt => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={form.status} onChange={handleChange} required>
                <option value="">-- Choose Status --</option>
                {DutyStatuses.map(ds => <option key={ds} value={ds}>{ds}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Workload</label>
              <input type="number" name="workload" className="form-control" value={form.workload} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Duration (mins)</label>
              <input type="number" name="duration" className="form-control" value={form.duration} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Time</label>
              <input type="datetime-local" name="startTime" className="form-control" value={form.startTime} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label">Classrooms</label>
              <select multiple name="classroomIds" className="form-select" value={form.classroomIds} onChange={handleChange} required>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.building} {c.roomNumber}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Upload PDF</label>
              <input type="file" name="file" className="form-control" accept="application/pdf" onChange={handleChange} required />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">Upload Duty Log</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDutyLog;
