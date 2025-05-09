// // src/people/Dean/AssignProctoring-Dean.jsx
// import React, { useState, useEffect } from "react";
// import LayoutDean from "./Layout-Dean";

// const AssignProctoringDean = () => {
//   const [exams, setExams] = useState([]);
//   const [tas, setTAs] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectedTAs, setSelectedTAs] = useState([]);
//   const [saving, setSaving] = useState(false);

//   // load exams, TAs, and existing assignments
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([

//       fetch("http://localhost:8080/api/ta").then((r) => r.json()),
//       fetch("http://localhost:8080/api/exams").then((r) => r.json()),
//       fetch("http://localhost:8080/api/proctor-assignments").then((r) => r.json()),
//     ])
//       .then(([examData, taData, paData]) => {
//         setExams(examData);
//         setTAs(taData);
//         setAssignments(paData);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Error loading proctoring data");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const openModal = (exam) => {
//     setSelectedExam(exam);
//     setSelectedTAs([]);
//     setModalOpen(true);
//   };

//   const closeModal = () => setModalOpen(false);

//   const handleTAsChange = (e) => {
//     const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
//     const max = (selectedExam.requiredProctors || 1) 
//       - assignments.filter((a) => a.exam.id === selectedExam.id).length;
//     setSelectedTAs(opts.slice(0, max));
//   };

//   const submitAssignments = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const created = [];
//       for (const taId of selectedTAs) {
//         const res = await fetch("http://localhost:8080/api/proctor-assignments", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             examId: selectedExam.id,
//             taId: Number(taId),
//           }),
//         });
//         if (!res.ok) throw new Error();
//         const pa = await res.json();
//         created.push(pa);
//       }
//       setAssignments((prev) => [...prev, ...created]);
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign proctors");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <LayoutDean>
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body">
//             <p>Loading proctoring data…</p>
//           </div>
//         </div>
//       </LayoutDean>
//     );
//   }

//   return (
//     <LayoutDean>
//       <div className="card shadow-sm border-0 mb-4">
//         <div className="card-body">
//           <h4 className="fw-bold mb-4">Assign Proctoring Duties</h4>
//           <table className="table table-hover w-100">
//             <thead>
//               <tr>
//                 <th>Exam ID</th>
//                 <th>Course</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Required</th>
//                 <th>Assigned</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {exams.map((ex) => {
//                 const assignedCount = assignments.filter((a) => a.exam.id === ex.id).length;
//                 const required = ex.requiredProctors ?? 1;
//                 const remaining = Math.max(required - assignedCount, 0);
//                 return (
//                   <tr key={ex.id}>
//                     <td>{ex.id}</td>
//                     <td>{ex.courseCode}</td>
//                     <td>{ex.date ? new Date(ex.date).toLocaleDateString() : ""}</td>
//                     <td>{ex.time ?? ""}</td>
//                     <td>{required}</td>
//                     <td>{assignedCount}</td>
//                     <td>
//                       {remaining > 0 ? (
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => openModal(ex)}
//                         >
//                           Assign ({remaining})
//                         </button>
//                       ) : (
//                         <span className="text-muted">Full</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {modalOpen && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog">
//             <form onSubmit={submitAssignments} className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Assign Proctors for Exam {selectedExam.id}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={closeModal}
//                 />
//               </div>
//               <div className="modal-body">
//                 <p>
//                   Select up to{" "}
//                   {(selectedExam.requiredProctors ?? 1) -
//                     assignments.filter((a) => a.exam.id === selectedExam.id)
//                       .length}{" "}
//                   TA(s):
//                 </p>
//                 <select
//                   multiple
//                   size={5}
//                   className="form-select"
//                   value={selectedTAs}
//                   onChange={handleTAsChange}
//                 >
//                   {tas.map((ta) => (
//                     <option key={ta.id} value={ta.id}>
//                       {ta.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={closeModal}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={saving || selectedTAs.length === 0}
//                 >
//                   {saving ? "Assigning…" : "Assign"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </LayoutDean>
//   );
// };

// export default AssignProctoringDean;
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const AssignProctoringDean = () => {
  const [exams, setExams] = useState([]);
  const [tas, setTAs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTAs, setSelectedTAs] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  setLoading(true);
  Promise.all([
    fetch("http://localhost:8080/api/ta").then((r) => r.json()),
    fetch("http://localhost:8080/api/exams").then((r) => r.json()),
    fetch("http://localhost:8080/api/proctor-assignments").then((r) => r.json()),
  ])
    .then(([examData, taData, paData]) => {
      setExams(Array.isArray(examData) ? examData : []);
      setTAs(Array.isArray(taData) ? taData : []);
      setAssignments(Array.isArray(paData) ? paData : []);
    })
    .catch((err) => {
      console.error(err);
      alert("Error loading proctoring data");
      setExams([]); // fallback
      setTAs([]);
      setAssignments([]);
    })
    .finally(() => setLoading(false));
}, []);


  const openModal = (exam) => {
    setSelectedExam(exam);
    setSelectedTAs([]);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleTAsChange = (e) => {
    const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
    const max = (selectedExam.requiredProctors || 1) -
      assignments.filter((a) => a.exam.id === selectedExam.id).length;
    setSelectedTAs(opts.slice(0, max));
  };

  const submitAssignments = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = [];
      for (const taId of selectedTAs) {
        const res = await fetch("http://localhost:8080/api/proctor-assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: selectedExam.id,
            taId: Number(taId),
          }),
        });
        if (!res.ok) throw new Error();
        const pa = await res.json();
        created.push(pa);
      }
      setAssignments((prev) => [...prev, ...created]);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to assign proctors");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: "300px" }}>
        <LayoutDean />
      </div>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Assign Proctoring Duties</h4>
            {loading ? (
              <p>Loading proctoring data…</p>
            ) : (
              <table className="table table-hover w-100">
                <thead>
                  <tr>
                    <th>Exam ID</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Required</th>
                    <th>Assigned</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((ex) => {
                    const assignedCount = assignments.filter((a) => a.exam.id === ex.id).length;
                    const required = ex.requiredProctors ?? 1;
                    const remaining = Math.max(required - assignedCount, 0);
                    return (
                      <tr key={ex.id}>
                        <td>{ex.id}</td>
                        <td>{ex.courseCode}</td>
                        <td>{ex.date ? new Date(ex.date).toLocaleDateString() : ""}</td>
                        <td>{ex.time ?? ""}</td>
                        <td>{required}</td>
                        <td>{assignedCount}</td>
                        <td>
                          {remaining > 0 ? (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openModal(ex)}
                            >
                              Assign ({remaining})
                            </button>
                          ) : (
                            <span className="text-muted">Full</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1055,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <form onSubmit={submitAssignments} className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Assign Proctors for Exam {selectedExam.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Select up to{" "}
                    {(selectedExam.requiredProctors ?? 1) -
                      assignments.filter((a) => a.exam.id === selectedExam.id)
                        .length}{" "}
                    TA(s):
                  </p>
                  <select
                    multiple
                    size={5}
                    className="form-select"
                    value={selectedTAs}
                    onChange={handleTAsChange}
                  >
                    {tas.map((ta) => (
                      <option key={ta.id} value={ta.id}>
                        {ta.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving || selectedTAs.length === 0}
                  >
                    {saving ? "Assigning…" : "Assign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignProctoringDean;
