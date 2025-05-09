// // src/people/Dean/ManageCourseData-Dean.jsx
// import React, { useState, useEffect } from "react";
// import LayoutDean from "./Layout-Dean";

// const ManageCourseDataDean = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // modal state
//   const [showModal, setShowModal] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null); // null = adding new
//   const [form, setForm] = useState({ code: "", name: "", credits: "" });

//   const token = localStorage.getItem("authToken");

//   // Fetch all courses
//   const loadCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8080/api/courses", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to load courses");
//       setCourses(await res.json());
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCourses();
//   }, []);

//   // Open modal for add or edit
//   const openModal = (course = null) => {
//     if (course) {
//       setEditingCourse(course);
//       setForm({ code: course.courseCode, name: course.courseName, credits: course.credits });
//     } else {
//       setEditingCourse(null);
//       setForm({ code: "", name: "", credits: "" });
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingCourse(null);
//   };

//   // Handle create or update
//   const handleSave = async (e) => {
//     e.preventDefault();
//     const payload = {
//       courseCode: form.code,
//       courseName: form.name,
//       credits: Number(form.credits),
//     };
//     try {
//       let res;
//       if (editingCourse) {
//         res = await fetch(`http://localhost:8080/api/courses/${editingCourse.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         res = await fetch("http://localhost:8080/api/courses", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         });
//       }
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`${res.status}: ${txt}`);
//       }
//       await loadCourses();
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert("Save failed: " + err.message);
//     }
//   };

//   // Delete a course
//   const handleDelete = async () => {
//     if (!editingCourse) return;
//     if (!window.confirm(`Delete course ${editingCourse.courseCode}?`)) return;
//     try {
//       const res = await fetch(`http://localhost:8080/api/courses/${editingCourse.id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Delete failed");
//       await loadCourses();
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   };

//   // Form field updates
//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   return (
//     <LayoutDean>
//       <div className="card shadow-sm border-0 mb-4">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h4 className="fw-bold mb-0">Manage Courses</h4>
//             <button
//               className="btn btn-success"
//               onClick={() => openModal(null)}
//             >
//               Add Course
//             </button>
//           </div>

//           {loading ? (
//             <p>Loading courses…</p>
//           ) : (
//             <table className="table table-hover w-100">
//               <thead>
//                 <tr>
//                   <th>Code</th>
//                   <th>Name</th>
//                   <th>Credits</th>
//                   <th style={{ width: "120px" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {courses.map((c) => (
//                   <tr key={c.id}>
//                     <td>{c.courseCode}</td>
//                     <td>{c.courseName}</td>
//                     <td>{c.credits}</td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary me-2"
//                         onClick={() => openModal(c)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={async () => {
//                           if (window.confirm(`Delete ${c.courseCode}?`)) {
//                             try {
//                               const res = await fetch(`http://localhost:8080/api/courses/${c.id}`, {
//                                 method: "DELETE",
//                                 headers: { Authorization: `Bearer ${token}` },
//                               });
//                               if (!res.ok) throw new Error("Delete failed");
//                               setCourses((prev) => prev.filter(x => x.id !== c.id));
//                             } catch (err) {
//                               console.error(err);
//                               alert(err.message);
//                             }
//                           }
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {courses.length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="text-center text-muted">
//                       No courses found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Add / Edit Course Modal */}
//       {showModal && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//           style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1050 }}
//         >
//           <div
//             className="modal-dialog"
//             style={{ maxWidth: "500px", width: "100%" }}
//           >
//             <div
//               className="modal-content p-4"
//               style={{ backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "8px" }}
//             >
//               <h5 className="mb-3">{editingCourse ? "Edit Course" : "Add Course"}</h5>
//               <form onSubmit={handleSave}>
//                 <div className="mb-3">
//                   <label className="form-label">Course Code</label>
//                   <input
//                     name="code"
//                     value={form.code}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Course Name</label>
//                   <input
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="form-label">Credits</label>
//                   <input
//                     name="credits"
//                     type="number"
//                     value={form.credits}
//                     onChange={handleChange}
//                     className="form-control"
//                     required
//                     min={0}
//                   />
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   {editingCourse && (
//                     <button
//                       type="button"
//                       className="btn btn-outline-danger me-2"
//                       onClick={handleDelete}
//                     >
//                       Delete
//                     </button>
//                   )}
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary me-2"
//                     onClick={closeModal}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     {editingCourse ? "Save" : "Add"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </LayoutDean>
//   );
// };

// export default ManageCourseDataDean;
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const reportOptions = [
  { key: "LOG", label: "Login Reports" },
  { key: "SWAP", label: "Swap Reports" },
  { key: "DUTY", label: "Duty Reports" },
  { key: "PROCTOR", label: "Proctor Reports" }
];

const baseUrl = "http://localhost:8080/api/admin";

const MakeReportDean = () => {
  const deanId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [today, setToday] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [actionKey, setActionKey] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
    fetch(`http://localhost:8080/api/dean/${deanId}/report-requests`, {
      method: "GET",
      headers
    })
      .then(res => res.json())
      .then(setRequests)
      .catch(err => {
        console.error("Load failed:", err);
        alert("Failed to load requests.");
      })
      .finally(() => setLoadingReqs(false));
  }, [deanId]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const requestReport = async (key) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return alert("Please select both dates.");
    }
    setActionKey(key);
    try {
      const res = await fetch(
        `http://localhost:8080/api/dean/${deanId}/report-requests`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            reportType: key,
            fromTime: `${dateRange.startDate}T00:00:00`,
            toTime: `${dateRange.endDate}T23:59:59`,
            status: "PENDING"
          })
        }
      );
      const newReq = await res.json();
      setRequests(prev => [newReq, ...prev]);
    } catch (err) {
      alert("Error requesting report");
    } finally {
      setActionKey(null);
    }
  };

  const downloadReport = async (reportType, fromTime, toTime) => {
    try {
      const url = `${baseUrl}/reports/${reportType.toLowerCase()}/pdf?from=${fromTime}&to=${toTime}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf"
        }
      });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${reportType}-${fromTime.split("T")[0]}-to-${toTime.split("T")[0]}.pdf`;
      a.click();
    } catch (err) {
      alert("Download failed.");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="flex-shrink-0" style={{ width: "300px" }}>
        <LayoutDean />
      </div>

      <div className="container py-4 flex-grow-1">
        <h3 className="fw-bold mb-4">Generate Dean Reports</h3>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row mb-3">
              {["startDate", "endDate"].map(field => (
                <div className="col" key={field}>
                  <label className="form-label">{field === "startDate" ? "Start Date" : "End Date"}</label>
                  <input
                    type="date"
                    name={field}
                    className="form-control"
                    max={today}
                    value={dateRange[field]}
                    onChange={handleDateChange}
                  />
                </div>
              ))}
            </div>

            <div className="mb-3">
              {reportOptions.map(opt => (
                <button
                  key={opt.key}
                  className="btn btn-outline-primary me-2"
                  disabled={actionKey === opt.key}
                  onClick={() => requestReport(opt.key)}
                >
                  {actionKey === opt.key ? "Requesting…" : opt.label}
                </button>
              ))}
            </div>

            <h5 className="mt-4">Your Report Requests</h5>
            {loadingReqs ? (
              <p>Loading…</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No requests yet
                      </td>
                    </tr>
                  ) : (
                    requests.map(r => (
                      <tr key={r.id}>
                        <td>{r.reportType}</td>
                        <td>{r.fromTime.split("T")[0]}</td>
                        <td>{r.toTime.split("T")[0]}</td>
                        <td>{r.status}</td>
                        <td>
                          {r.status === "APPROVED" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                downloadReport(r.reportType, r.fromTime, r.toTime)
                              }
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeReportDean;
