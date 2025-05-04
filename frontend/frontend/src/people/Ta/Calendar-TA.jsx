// src/people/TA/Calendar-TA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";
// your FullCalendar imports if you still need them (you can remove if unused)
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

import "../../pages/assets/plugin/fullcalendar/main.min.css";
import "../../pages/assets/css/my-task.style.min.css";

const semesters = [
  "Fall / 2023-2024",
  "Spring / 2024-2025",
  "Summer / 2024-2025",
  "Winter / 2024-2025",
];

const courses = [
  { id: 1, code: "CS101", name: "Intro to Programming" },
  { id: 2, code: "MATH201", name: "Calculus II" },
  { id: 3, code: "PHYS150", name: "Mechanics" },
  { id: 4, code: "CHEM110", name: "General Chemistry" },
];

const TOTAL_DAYS = 7;
const TOTAL_HOURS = 14; // 8:30 → 21:30

// Inline Schedule grid component (unchanged)
const Schedule = ({
  courses,
  timeslots,
  excludedTimeslots,
  onCellClick,
}) => {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hourLabels = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const h = 8 + i;
    return `${h.toString().padStart(2, "0")}:30`;
  });

  return (
    <div className="table-responsive mb-4">
      <table className="table table-bordered text-center" style={{ tableLayout: "fixed", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Time</th>
            {dayLabels.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hourLabels.map((label, hi) => (
            <tr key={hi}>
              <th className="align-middle">{label}</th>
              {dayLabels.map((_, di) => {
                const idx = hi * TOTAL_DAYS + di;
                const courseId = timeslots[idx];
                const course = courses.find((c) => c.id === courseId);
                const isExcluded = !!excludedTimeslots[idx];
                const cellStyle = {
                  cursor: isExcluded ? "not-allowed" : "pointer",
                  verticalAlign: "middle",
                  minWidth: 80,
                  height: 50,
                  backgroundColor: isExcluded
                    ? "#6c757d"
                    : course
                    ? "#6238B3"
                    : undefined,
                  color: (isExcluded || course) ? "#ffffff" : undefined,
                };
                return (
                  <td
                    key={di}
                    style={cellStyle}
                    title={course ? `${course.code} – ${course.name}` : undefined}
                    onClick={() => !isExcluded && onCellClick(idx)}
                  >
                    {course && (
                      <>
                        <div className="fw-bold">{course.code}</div>
                        <div className="small">{course.name}</div>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CalendarTA = () => {
  const taId = /* your TA’s ID, e.g. from context or props */ 123;
  const [semester, setSemester] = useState(semesters[0]);
  const [timeslots, setTimeslots] = useState({});
  const [excluded, setExcluded] = useState({});
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [cellIdx, setCellIdx] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/ta/${taId}/timeslots`),
      fetch(`/api/ta/${taId}/excluded-timeslots`)
    ])
      .then(async ([resSlots, resEx]) => {
        if (!resSlots.ok || !resEx.ok) throw new Error();
        const slots = await resSlots.json();         // e.g. { "0":1, "5":2, ... }
        const exList = await resEx.json();          // e.g. [0, 12, 20]
        setTimeslots(slots);
        const exMap = {};
        exList.forEach((i) => { exMap[i] = true; });
        setExcluded(exMap);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load schedule");
      })
      .finally(() => setLoading(false));
  }, [taId]);

  const onCellClick = (idx) => {
    setCellIdx(idx);
    const existing = timeslots[idx];
    const pre = courses.find((c) => c.id === existing) || courses[0];
    setSelectedCourse(pre);
    setModalOpen(true);
  };

  const saveSlot = async () => {
    const courseId = selectedCourse.id;
    setTimeslots((prev) => ({ ...prev, [cellIdx]: courseId }));
    setModalOpen(false);
    try {
      await fetch(`/api/ta/${taId}/timeslots/${cellIdx}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save slot");
    }
  };

  const toggleExclude = async () => {
    const newVal = !excluded[cellIdx];
    setExcluded((prev) => ({ ...prev, [cellIdx]: newVal }));
    try {
      await fetch(`/api/ta/${taId}/excluded-timeslots/${cellIdx}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exclude: newVal }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update exclusion");
    }
  };

  if (loading) {
    return (
      <LayoutTA>
        <div className="container-xxl py-4">
          <p>Loading schedule…</p>
        </div>
      </LayoutTA>
    );
  }

  return (
    <div className="container-xxl py-4">
      <LayoutTA> 
        <div className="d-flex align-items-center mb-3">
          <h5 className="me-3 mb-0">Semester:</h5>
          <select
            className="form-select me-4"
            style={{ maxWidth: 200 }}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {semesters.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      

        <Schedule
          courses={courses}
          timeslots={timeslots}
          excludedTimeslots={excluded}
          onCellClick={onCellClick}
        />

        {modalOpen && (
          <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Slot #{cellIdx}{" "}
                    {timeslots[cellIdx] && (
                      <small className="text-muted">
                        – {courses.find((c) => c.id === timeslots[cellIdx]).code} –
                        {courses.find((c) => c.id === timeslots[cellIdx]).name}
                      </small>
                    )}
                  </h5>
                  <button className="btn-close" onClick={() => setModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Course</label>
                    <select
                      className="form-select"
                      value={selectedCourse.id}
                      onChange={(e) =>
                        setSelectedCourse(courses.find((c) => c.id === +e.target.value))
                      }
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} – {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-check">
                    <input
                      id="exclude"
                      type="checkbox"
                      className="form-check-input"
                      checked={!!excluded[cellIdx]}
                      onChange={toggleExclude}
                    />
                    <label className="form-check-label" htmlFor="exclude">
                      Exclude this slot
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={saveSlot}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </LayoutTA>
    </div>
    
  );
};

export default CalendarTA;
