// src/people/Dean/ExamScheduling-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ExamSchedulingDean = () => {
  // form state (unchanged)
  const [form, setForm] = useState({
    offeringId:   "",
    classroomId:  "",
    date:         "",
    time:         "",
    numProctors:  1,
  });

  // data state
  const [offerings, setOfferings]   = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  // popup state for Assign Proctors
  const [showModal, setShowModal]     = useState(false);
  const [modalExam, setModalExam]     = useState(null);
  const [availableTas, setAvailableTas] = useState([]);
  const [selectedTas, setSelectedTas]   = useState([]);

  const token  = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  // initial data fetch (offerings, classrooms, exams) — unchanged
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch("http://localhost:8080/api/offerings", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:8080/api/classrooms", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:8080/api/exams",      { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([oRes, cRes, eRes]) => {
        if (!oRes.ok) throw new Error("Offerings failed");
        if (!cRes.ok) throw new Error("Classrooms failed");
        if (!eRes.ok) throw new Error("Exams failed");
        const [off, cls, exs] = await Promise.all([oRes.json(), cRes.json(), eRes.json()]);
        setOfferings(off);
        setClassrooms(cls);
        setSchedules(exs);
      })
      .catch((err) => { console.error(err); alert("Error loading data"); })
      .finally(() => setLoading(false));
  }, [token]);

  // form handlers (unchanged)
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      offeringId:      Number(form.offeringId),
      dateTime:        `${form.date}T${form.time}`,
      duration:        120,
      department:      "Computer Engineering",
      definedById:     Number(deanId),
      facultyMemberId: Number(deanId),
      examName:        offerings.find(o => o.id === Number(form.offeringId))?.courseName + " Exam",
      examType:        "MIDTERM",
      numProctors:     Number(form.numProctors),
      examRooms:       [{
        roomId:      Number(form.classroomId),
        numProctors: Number(form.numProctors)
      }]
    };

    try {
      const res = await fetch("http://localhost:8080/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${errText}`);
      }
      const created = await res.json();
      setSchedules((prev) => [created, ...prev]);
      setForm({ offeringId: "", classroomId: "", date: "", time: "", numProctors: 1 });
    } catch (err) {
      console.error(err);
      alert("Failed to schedule exam: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // open the Assign Proctors modal
  const openModal = async (exam) => {
    setModalExam(exam);
    // remaining slots = total minus already assigned
    const res = await fetch(
      `http://localhost:8080/api/dean/${deanId}/available-tas?examId=${exam.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      alert("Failed to load available TAs");
      return;
    }
    const tas = await res.json();
    setAvailableTas(tas);
    setSelectedTas([]);
    setShowModal(true);
  };

  // toggle TA selection up to remaining slots
  const remaining = modalExam ? (modalExam.numProctors - modalExam.assignedCount) : 0;
  const toggleTa = (taId) => {
    setSelectedTas((prev) => {
      if (prev.includes(taId)) return prev.filter((x) => x !== taId);
      if (prev.length < remaining) return [...prev, taId];
      return prev;
    });
  };

  // confirm assignments
  const confirmAssign = async () => {
    const query = selectedTas.join(",");
    const res = await fetch(
      `http://localhost:8080/api/dean/${deanId}/assign-proctors?examId=${modalExam.id}&taIds=${query}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      alert("Failed to assign proctors");
    } else {
      const assigned = await res.json(); // array of ProctorAssignment
      setSchedules((prev) =>
        prev.map((e) =>
          e.id === modalExam.id
            ? { ...e, assignedCount: assigned.length }
            : e
        )
      );
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <LayoutDean>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body"><p>Loading data…</p></div>
        </div>
      </LayoutDean>
    );
  }

  return (
    <LayoutDean>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Schedule a New Exam</h4>
          <form onSubmit={handleSchedule} className="row g-3 mb-5">
            {/* Course Offering */}
            <div className="col-md-3">
              <label className="form-label">Course</label>
              <select
                name="offeringId"
                value={form.offeringId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Course</option>
                {offerings.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.courseCode} – {o.section}
                  </option>
                ))}
              </select>
            </div>

            {/* Classroom */}
            <div className="col-md-3">
              <label className="form-label">Classroom</label>
              <select
                name="classroomId"
                value={form.classroomId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Room</option>
                {classrooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Time */}
            <div className="col-md-2">
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* # Proctors */}
            <div className="col-md-2">
              <label className="form-label">Proctors</label>
              <input
                type="number"
                name="numProctors"
                value={form.numProctors}
                min={1}
                max={5}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Submit */}
            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Scheduling…" : "Schedule Exam"}
              </button>
            </div>
          </form>

          {/* Existing schedules table (unchanged) */}
          <h4 className="fw-bold mb-3">Existing Exam Schedules</h4>
          <table className="table table-hover w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date &amp; Time</th>
                <th>Proctors</th>
                <th>Rooms</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No exam schedules found
                  </td>
                </tr>
              ) : (
                schedules.map((s) => {
                  const full = s.assignedCount >= s.numProctors;
                  return (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.examName}</td>
                      <td>{new Date(s.dateTime).toLocaleString()}</td>
                      <td>{s.assignedCount}/{s.numProctors}</td>
                      <td>{s.examRooms?.map((er) => er.roomName).join(", ")}</td>
                      <td>
                        {!full ? (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openModal(s)}
                          >
                            Assign Proctors
                          </button>
                        ) : (
                          <span className="badge bg-success">Full</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Assign Proctors Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-dialog">
                <div className="modal-content p-3">
                  <h5>Select Proctors ({selectedTas.length}/{remaining})</h5>
                  <ul className="list-group mb-3">
                    {availableTas.map((ta) => (
                      <li
                        key={ta.id}
                        className={`list-group-item ${
                          selectedTas.includes(ta.id) ? "active" : ""
                        }`}
                        onClick={() => toggleTa(ta.id)}
                      >
                        {ta.name}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-primary me-2"
                    disabled={selectedTas.length === 0}
                    onClick={confirmAssign}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </LayoutDean>
  );
};

export default ExamSchedulingDean;
