import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const ExamSchedulingDean = () => {
  // form state for scheduling popup
  const [form, setForm] = useState({
    offeringId:   "",
    classroomId:  "",
    date:         "",
    time:         "",
    numProctors:  1,
    examType:     "MIDTERM",
    examName:     "",
  });

  // data state
  const [offerings, setOfferings]   = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules]   = useState([]);
  const [courses, setCourses]       = useState([]);
  const [courseMap, setCourseMap]   = useState({});
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  // popup visibility flags
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showAssignModal, setShowAssignModal]     = useState(false);

  // assign proctors state
  const [modalExam, setModalExam]       = useState(null);
  const [availableTas, setAvailableTas] = useState([]);
  const [selectedTas, setSelectedTas]   = useState([]);

  const token  = localStorage.getItem("authToken");
  const deanId = localStorage.getItem("userId");

  // fetch initial data
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch("http://localhost:8080/api/offerings",  { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:8080/api/classrooms", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:8080/api/exams",      { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:8080/api/courses",    { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([oRes, cRes, eRes, crRes]) => {
        if (!oRes.ok)   throw new Error("Offerings failed");
        if (!cRes.ok)   throw new Error("Classrooms failed");
        if (!eRes.ok)   throw new Error("Exams failed");
        if (!crRes.ok)  throw new Error("Courses failed");

        const [off, cls, exs, crs] = await Promise.all([
          oRes.json(), cRes.json(), eRes.json(), crRes.json()
        ]);

        setOfferings(off);
        setClassrooms(cls);
        setSchedules(exs);
        setCourses(crs);
        setCourseMap(Object.fromEntries(crs.map(c => [c.id, c.courseCode])));
      })
      .catch(err => { console.error(err); alert("Error loading data"); })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openSchedule = () => setShowSchedulePopup(true);

  const handleSchedule = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      offeringId:      Number(form.offeringId),
      dateTime:        `${form.date}T${form.time}`,
      duration:        120,
      department:      "Computer Engineering",
      definedById:     Number(deanId),
      facultyMemberId: Number(deanId),
      examName:        form.examName,
      examType:        form.examType,
      numProctors:     Number(form.numProctors),
      examRooms:       [{ roomId: Number(form.classroomId), numProctors: Number(form.numProctors) }]
    };

    try {
      const res = await fetch("http://localhost:8080/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const newExam = await res.json();
      setSchedules(prev => [newExam, ...prev]);
      setShowSchedulePopup(false);
      setForm({ offeringId: "", classroomId: "", date: "", time: "", numProctors: 1, examType: "MIDTERM", examName: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to schedule exam: " + err.message);
    } finally { setSaving(false); }
  };

// Opens the “Assign Proctors” modal by fetching available TAs for the given exam
const openAssign = async (exam) => {
  // Store the exam we’re assigning to
  setModalExam(exam);

  // Convert the exam’s dateTime into an ISO string for the query
  const startTime = encodeURIComponent(new Date(exam.dateTime).toISOString());
  // Use the exam’s duration (in minutes) for the request
  const duration = exam.duration;

  try {
    // Fetch from the TA availability endpoint
    const res = await fetch(
      `http://localhost:8080/api/ta/available?startTime=${startTime}&duration=${duration}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      // Handle HTTP errors
      const errText = await res.text();
      throw new Error(`Failed to load TAs: ${res.status} ${errText}`);
    }

    // Parse the TA list from JSON
    const tas = await res.json();

    // Populate state and open the modal
    setAvailableTas(tas);
    setSelectedTas([]);
    setShowAssignModal(true);

  } catch (err) {
    console.error("Error fetching available TAs:", err);
    alert(err.message || "Unexpected error loading TAs");
  }
};
  // How many more TAs can still be assigned to this exam
  const remaining = modalExam
    ? modalExam.numProctors - modalExam.assignedCount
    : 0;

  // Toggle a TA’s selection in the modal
  const toggleTa = (taId) => {
    setSelectedTas((prev) => {
      if (prev.includes(taId)) {
        return prev.filter((x) => x !== taId);
      }
      if (prev.length < remaining) {
        return [...prev, taId];
      }
      return prev;
    });
  };

  // Send the selected TA IDs back to the server and update the schedule
  const confirmAssign = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/dean/${deanId}/assign-proctors` +
        `?examId=${modalExam.id}&taIds=${selectedTas.join(",")}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Assignment failed: " + res.statusText);
      const assignedList = await res.json();
      setSchedules((prev) =>
        prev.map((e) =>
          e.id === modalExam.id
            ? { ...e, assignedCount: assignedList.length }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setShowAssignModal(false);
    }
  };

  

  if (loading) return <LayoutDean><div className="card"><div className="card-body">Loading data…</div></div></LayoutDean>;

  return (
    <LayoutDean>
      <button onClick={openSchedule} className="btn btn-success mb-3">Add Exam</button>

      {/* Schedule Popup */}
      {showSchedulePopup && (
        <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.3)', display:'flex', justifyContent:'center', alignItems:'center', padding:'2rem' }}>
          <div style={{ backgroundColor:'rgba(255,255,255,1)', borderRadius:'8px', padding:'1.5rem', minWidth:'600px' }}>
            <h5 className="mb-4">Schedule Exam</h5>
            <form onSubmit={handleSchedule} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Course Offering</label>
                <select name="offeringId" value={form.offeringId} onChange={handleChange} className="form-select" required>
                  <option value="">Select Course</option>
                  {offerings.map(o => <option key={o.id} value={o.id}>{courseMap[o.courseId]} – {o.section}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Exam Name</label>
                <input name="examName" value={form.examName} onChange={handleChange} className="form-control" placeholder="e.g. CENG101 Final" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Exam Type</label>
                <select name="examType" value={form.examType} onChange={handleChange} className="form-select">
                  <option value="MIDTERM">Midterm</option>
                  <option value="FINAL">Final</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Classroom</label>
                <select
                  name="classroomId"
                  value={form.classroomId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Room</option>
                  {classrooms.map(r => (
                    <option
                      key={r.id}
                      value={r.id}            // keep the id as the form value
                    >
                      {r.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Proctors</label>
                <input type="number" name="numProctors" min={1} max={5} value={form.numProctors} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success mb-3" disabled={saving}>{saving ? "Scheduling…" : "Schedule"}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSchedulePopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedules Table */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Date & Time</th>
            <th>Proctors</th>
            <th>Rooms</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(s => {
            const full = s.assignedCount >= s.numProctors;
            return (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.examName}</td>
                <td>{s.examType}</td>
                <td>{new Date(s.dateTime).toLocaleString()}</td>
                <td>{s.assignedCount}/{s.numProctors}</td>
                <td>
                  {s.examRooms && s.examRooms.length > 0
                    ? s.examRooms
                        .map(er =>
                          // First try a flat roomNumber
                          er.roomNumber
                          // Then try roomName
                          || er.roomName
                          // Then nested classroom.roomNumber
                          || er.classroom?.roomNumber
                          // Then nested classroom.name
                          || er.classroom?.name
                          // Finally nothing
                          || "—"
                        )
                        .join(", ")
                    : "—"
                  }
                </td>
                <td>
                  {!full
                    ? <button className="btn btn-sm btn-outline-primary" onClick={() => openAssign(s)}>Assign Proctors</button>
                    : <span className="badge bg-success">Full</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Assign Proctors Modal */}
      {showAssignModal && modalExam && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1050 }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '400px', width: '100%', margin: '0 1rem' }}
          >
            <div
              className="modal-content p-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px' }}
            >
              {/* Header */}
              <h5 className="mb-3 text-center">
                Select Proctors
              </h5>

              {/* Summary */}
              <p className="text-center mb-4">
                Assigned: {modalExam.assignedCount} / {modalExam.numProctors} | 
                Remaining: {modalExam.numProctors - modalExam.assignedCount}
              </p>

              {/* List of available TAs */}
              <ul
                className="list-group mb-4"
                style={{ maxHeight: '250px', overflowY: 'auto' }}
              >
                {availableTas.map(ta => {
                  const isSelected = selectedTas.includes(ta.id);
                  return (
                    <li
                      key={ta.id}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        isSelected ? 'active' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleTa(ta.id)}
                    >
                      <span>{ta.name}</span>
                      {isSelected && <span className="badge bg-light text-dark">✓</span>}
                    </li>
                  );
                })}
                {availableTas.length === 0 && (
                  <li className="list-group-item text-center text-muted">
                    No available TAs
                  </li>
                )}
              </ul>

              {/* Action buttons */}
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary me-2"
                  disabled={selectedTas.length === 0}
                  onClick={confirmAssign}
                >
                  Confirm
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutDean>
  );
};

export default ExamSchedulingDean;
