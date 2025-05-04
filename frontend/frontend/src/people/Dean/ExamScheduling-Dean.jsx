// src/people/Dean/ExamScheduling-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ExamSchedulingDean = () => {
  const [form, setForm] = useState({
    course: "",
    date: "",
    time: "",
    room: "",
  });
  const [schedules, setSchedules] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // load both schedules and available classrooms
    Promise.all([
      fetch("/api/exam-schedules"),
      fetch("/api/classrooms"),
    ])
      .then(async ([resSched, resRooms]) => {
        if (!resSched.ok) throw new Error("Failed to fetch schedules");
        if (!resRooms.ok) throw new Error("Failed to fetch classrooms");
        const schedData = await resSched.json();
        const roomData  = await resRooms.json();
        setSchedules(schedData);
        setClassrooms(roomData);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/exam-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network error");
      const created = await res.json();
      setSchedules((prev) => [created, ...prev]);
      setForm({ course: "", date: "", time: "", room: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to schedule exam");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LayoutDean>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <p>Loading exam schedules…</p>
          </div>
        </div>
      </LayoutDean>
    );
  }

  return (
    <LayoutDean>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Exam Scheduling</h4>
          <form onSubmit={handleSchedule} className="row g-3 mb-4">
            <div className="col-md-3">
              <label className="form-label">Course</label>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-3">
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
            <div className="col-md-2">
              <label className="form-label">Room</label>
              <select
                name="room"
                value={form.room}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Room</option>
                {classrooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 text-end">
              <button
                type="submit"
                className="btn btn-primary mt-4"
                disabled={saving}
              >
                {saving ? "Scheduling…" : "Schedule"}
              </button>
            </div>
          </form>

          <table className="table table-hover w-100">
            <thead>
              <tr>
                <th>Course</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No exam schedules found
                  </td>
                </tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s.id}>
                    <td>{s.course}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{s.time}</td>
                    <td>{s.room}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutDean>
  );
};

export default ExamSchedulingDean;
