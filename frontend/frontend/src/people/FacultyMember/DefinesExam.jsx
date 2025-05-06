// import React, { useState } from "react";
// import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

// const initialExams = [
//   {
//     id: 1,
//     title: "CS102 Midterm Exam",
//     type: "Written",
//     duration: "90 mins",
//     start: "2025-05-20",
//     end: "14:00",
//     tAs: ["Cankutay D.", "Anıl Y."],
//     attachments: 2,
//     proctourCount: 3,
//     building: "Engineering Building",
//     classrooms: ["Room 101", "Lab A"]
//   },
//   {
//     id: 2,
//     title: "MATH101 Final",
//     type: "Online",
//     duration: "120 mins",
//     start: "2025-06-01",
//     end: "16:30",
//     tAs: ["Emre U."],
//     attachments: 1,
//     proctourCount: 2,
//     building: "Main Building",
//     classrooms: ["Room A2"]
//   }
// ];

// const allTAs = [
//   { name: "Cankutay D.", workload: 4 },
//   { name: "Anıl Y.", workload: 3 },
//   { name: "Emre U.", workload: 2 },
//   { name: "Zeynep K.", workload: 1 },
//   { name: "Fatih B.", workload: 0 }
// ];

// const allProctors = ["John Doe", "Jane Roe", "Mark Smith"];

// const buildingClassrooms = {
//   "Engineering Building": ["Room 101", "Room 102", "Lab A"],
//   "Science Block": ["Chem Lab", "Physics Lab", "Lecture Hall 1"],
//   "Main Building": ["Auditorium", "Room A1", "Room A2"]
// };

// const DefinesExamPage = () => {
//   const [exams, setExams] = useState(initialExams);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("create");
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "Written",
//     duration: "",
//     start: "",
//     end: "",
//     tAs: [],
//     attachments: "",
//     proctourCount: "",
//     building: "",
//     classrooms: [],
//     assignmentType: "manual"
//   });

//   const openModal = (type, exam = null) => {
//     setModalType(type);
//     setSelectedExam(exam);
//     setFormData(
//       exam
//         ? {
//             ...exam,
//             tAs: exam.tAs || [],
//             attachments: exam.attachments || "",
//             proctourCount: exam.proctourCount || "",
//             end: exam.end || "",
//             building: exam.building || "",
//             classrooms: exam.classrooms || [],
//             assignmentType: "manual"
//           }
//         : {
//             title: "",
//             type: "Written",
//             duration: "",
//             start: "",
//             end: "",
//             tAs: [],
//             attachments: "",
//             proctourCount: "",
//             building: "",
//             classrooms: [],
//             assignmentType: "manual"
//           }
//     );
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedExam(null);
//     setFormData({
//       title: "",
//       type: "Written",
//       duration: "",
//       start: "",
//       end: "",
//       tAs: [],
//       attachments: "",
//       proctourCount: "",
//       building: "",
//       classrooms: [],
//       assignmentType: "manual"
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value, multiple, options } = e.target;
//     if (multiple) {
//       const values = Array.from(options).filter(o => o.selected).map(o => o.value);
//       setFormData({ ...formData, [name]: values });
//     } else {
//       if (name === "building") {
//         setFormData({ ...formData, building: value, classrooms: [] });
//       } else {
//         setFormData({ ...formData, [name]: value });
//       }
//     }
//   };

//   const handleSave = () => {
//     if (formData.assignmentType === "automatic") {
//       assignTAsAutomatically();
//     }

//     const formattedExam = {
//       ...formData,
//       id: modalType === "create" ? exams.length + 1 : selectedExam.id,
//       tAs: formData.tAs,
//       attachments: parseInt(formData.attachments),
//       proctourCount: parseInt(formData.proctourCount)
//     };

//     if (modalType === "create") {
//       setExams([...exams, formattedExam]);
//     } else {
//       setExams(exams.map(exam => (exam.id === selectedExam.id ? formattedExam : exam)));
//     }
//     closeModal();
//   };

//   const handleDelete = () => {
//     setExams(exams.filter(exam => exam.id !== selectedExam.id));
//     closeModal();
//   };

//   const assignTAsAutomatically = () => {
//     const availableTAs = allTAs.filter(ta => ta.workload < 3); // Assuming max workload is 3
//     if (availableTAs.length < formData.proctourCount) {
//       alert("Not enough TAs available for this exam. Please contact the Dean.");
//     } else {
//       setFormData({ ...formData, tAs: availableTAs.map(ta => ta.name) });
//     }
//   };

//   const notifyDean = () => {
//     alert("Insufficient TAs available. Sending notification to Dean...");
//     // Here, you could implement email or messaging API to notify the Dean.
//   };

//   const assignedTAsCount = formData.tAs.length;
//   const notifyDeanButton = assignedTAsCount > formData.proctourCount ? (
//     <button className="btn btn-warning" onClick={notifyDean}>Notify Dean</button>
//   ) : null;

//   return (
//     <div className="d-flex">
//       <div style={{ width: "300px" }}>
//         <FacultyMemberLayout />
//       </div>
//       <div className="container py-4 flex-grow-1">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h3 className="fw-bold">Defines Exam</h3>
//           <button className="btn btn-secondary me-2" onClick={() => openModal("create")}>
//             + Create Exam
//           </button>
//         </div>

//         <div className="row g-4">
//           {exams.map((exam) => (
//             <div className="col-md-6 col-lg-4" key={exam.id}>
//               <div className="card shadow-sm">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between">
//                     <div>
//                       <span className="badge bg-primary mb-2">{exam.type}</span>
//                       <h5 className="fw-bold">{exam.title}</h5>
//                       <p className="mb-1 small">Duration: {exam.duration}</p>
//                       <p className="mb-1 small">Date: {exam.start}</p>
//                       <p className="mb-1 small">End Time: {exam.end}</p>
//                       <p className="mb-1 small">Assigned TAs: {exam.tAs.join(", ")}</p>
//                       <p className="mb-1 small">Proctour Count: {exam.proctourCount}</p>
//                       <p className="mb-1 small">Attachments: {exam.attachments}</p>
//                       <p className="mb-1 small">Building: {exam.building}</p>
//                       <p className="mb-1 small">Classrooms: {exam.classrooms.join(", ")}</p>
//                     </div>
//                     <div>
//                       <button className="btn btn-outline-success btn-sm me-1" onClick={() => openModal("edit", exam)}>
//                         Edit
//                       </button>
//                       <button className="btn btn-outline-danger btn-sm" onClick={() => openModal("delete", exam)}>
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {showModal && (
//           <div className="modal d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered modal-lg">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {modalType === "create" && "Create Exam"}
//                     {modalType === "edit" && `Edit: ${selectedExam.title}`}
//                     {modalType === "delete" && "Confirm Delete"}
//                   </h5>
//                   <button type="button" className="btn-close" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   {modalType === "delete" ? (
//                     <p>Are you sure you want to delete this exam?</p>
//                   ) : (
//                     <form>
//                       <div className="mb-3">
//                         <label className="form-label">Exam Title</label>
//                         <input name="title" className="form-control" value={formData.title} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Type</label>
//                         <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
//                           <option>Written</option>
//                           <option>Online</option>
//                         </select>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Duration</label>
//                         <input name="duration" className="form-control" value={formData.duration} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Start Date</label>
//                         <input type="date" name="start" className="form-control" value={formData.start} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">End Time</label>
//                         <input type="time" name="end" className="form-control" value={formData.end} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//   <label className="form-label">TA Assignment Type</label>
//   <select
//     name="assignmentType"
//     className="form-select"
//     value={formData.assignmentType}
//     onChange={handleChange}
//   >
//     <option value="manual">Manual</option>
//     <option value="automatic">Automatic</option>
//   </select>
// </div>

// {formData.assignmentType === "manual" && (
//   <div className="mb-3">
//     <label className="form-label">Assigned TAs</label>
//     <select
//       name="tAs"
//       className="form-select"
//       multiple
//       value={formData.tAs}
//       onChange={handleChange}
//     >
//       {allTAs.map((ta, idx) => (
//         <option key={idx} value={ta.name}>
//           {ta.name} - Workload: {ta.workload}
//         </option>
//       ))}
//     </select>
//   </div>
// )}

//                       <div className="mb-3">
//                         <label className="form-label">Proctour Count</label>
//                         <input type="number" name="proctourCount" className="form-control" value={formData.proctourCount} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Attachments Count</label>
//                         <input type="number" name="attachments" className="form-control" value={formData.attachments} onChange={handleChange} />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Select Building</label>
//                         <select
//                           name="building"
//                           className="form-select"
//                           value={formData.building}
//                           onChange={(e) => setFormData({
//                             ...formData,
//                             building: e.target.value
//                           })}
//                         >
//                           <option value="">-- Choose a building --</option>
//                           {Object.keys(buildingClassrooms).map((bldg, idx) => (
//                             <option key={idx} value={bldg}>{bldg}</option>
//                           ))}
//                         </select>
//                       </div>
//                       {formData.building && (
//                         <div className="mb-3">
//                           <label className="form-label">Select Classrooms (Checkbox)</label>
//                           <div className="d-flex flex-wrap gap-2">
//                             {buildingClassrooms[formData.building].map((cls, idx) => (
//                               <div key={idx} className="form-check me-3">
//                                 <input
//                                   className="form-check-input"
//                                   type="checkbox"
//                                   id={`classroom-${idx}`}
//                                   value={cls}
//                                   checked={formData.classrooms.includes(cls)}
//                                   onChange={(e) => {
//                                     const checked = e.target.checked;
//                                     const value = e.target.value;
//                                     const newClassrooms = checked
//                                       ? [...formData.classrooms, value]
//                                       : formData.classrooms.filter(c => c !== value);
//                                     setFormData({ ...formData, classrooms: newClassrooms });
//                                   }}
//                                 />
//                                 <label className="form-check-label" htmlFor={`classroom-${idx}`}>
//                                   {cls}
//                                 </label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                       {formData.classrooms.length > 0 && (
//                         <div className="mb-3">
//                           <label className="form-label">Selected Classrooms</label>
//                           <div className="d-flex flex-wrap gap-2">
//                             {formData.classrooms.map((cls, idx) => (
//                               <span key={idx} className="badge bg-info text-dark">
//                                 {cls}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </form>
//                   )}
//                 </div>
//                 <div className="modal-footer d-flex justify-content-end">
//                   <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
//                   <button className="btn btn-secondary me-2" onClick={modalType === "delete" ? handleDelete : handleSave}>
//                     {modalType === "delete" ? "Delete" : "Save"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {notifyDeanButton}
//       </div>
//     </div>
//   );
// };

// export default DefinesExamPage;
// src/people/TA/DefinesExamPage.jsx
// src/people/TA/DefinesExamPage.jsx
// src/people/TA/DefinesExamPage.jsx
// src/people/FacultyMember/DefinesExamPage.jsx
// src/people/FacultyMember/DefinesExamPage.jsx
// src/people/FacultyMember/DefinesExamPage.jsx
// src/people/FacultyMember/DefinesExamPage.jsx
// src/people/FacultyMember/DefinesExamPage.jsx
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const DefinesExamPage = () => {
  const [exams, setExams] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allTAs, setAllTAs] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allOfferings, setAllOfferings] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedExam, setSelectedExam] = useState(null);

  const [formData, setFormData] = useState({
    examName: "",
    department: "",
    examType: "Written",
    dateTime: "",
    duration: "",
    numProctors: "",
    offeringId: "",
    facultyId: "",
    classrooms: []
  });

  const BASE = "http://localhost:8080/api";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // fetch exams
    fetch(`${BASE}/exams`, { headers })
      .then(res => res.json())
      .then(data => setExams(Array.isArray(data) ? data : []))
      .catch(() => setExams([]));

    // fetch proctor assignments
    fetch(`${BASE}/proctor-assignments`, { headers })
      .then(res => res.json())
      .then(data => setAllAssignments(Array.isArray(data) ? data : []))
      .catch(() => setAllAssignments([]));

    // fetch TAs
    fetch(`${BASE}/ta`, { headers })
      .then(res => res.json())
      .then(data => setAllTAs(Array.isArray(data) ? data : []))
      .catch(() => setAllTAs([]));

    // fetch classrooms
    fetch(`${BASE}/classrooms`, { headers })
      .then(res => res.json())
      .then(data => setAllClassrooms(Array.isArray(data) ? data : []))
      .catch(() => setAllClassrooms([]));

    // fetch offerings
    fetch(`${BASE}/offerings`, { headers })
      .then(res => res.json())
      .then(data => setAllOfferings(Array.isArray(data) ? data : []))
      .catch(() => setAllOfferings([]));

    // fetch faculty
    fetch(`${BASE}/faculty-members`, { headers })
      .then(res => res.json())
      .then(data => setAllFaculty(Array.isArray(data) ? data : []))
      .catch(() => setAllFaculty([]));
  }, []);

  const openModal = (type, exam = null) => {
    setModalType(type);
    setSelectedExam(exam);
    if (exam) {
      setFormData({
        examName: exam.examName || "",
        department: exam.department || "",
        examType: exam.examType || "Written",
        dateTime: exam.dateTime?.slice(0, 16) || "",
        duration: exam.duration?.toString() || "",
        numProctors: exam.numProctors?.toString() || "",
        offeringId: exam.offeringId?.toString() || "",
        facultyId: exam.facultyId?.toString() || "",
        classrooms: Array.isArray(exam.examRooms)
          ? exam.examRooms.map(r => r.classroomId.toString())
          : []
      });
    } else {
      setFormData({
        examName: "",
        department: "",
        examType: "Written",
        dateTime: "",
        duration: "",
        numProctors: "",
        offeringId: "",
        facultyId: "",
        classrooms: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setFormData({
      examName: "",
      department: "",
      examType: "Written",
      dateTime: "",
      duration: "",
      numProctors: "",
      offeringId: "",
      facultyId: "",
      classrooms: []
    });
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "classrooms") {
      setFormData(f => {
        const set = new Set(f.classrooms);
        if (checked) set.add(value);
        else set.delete(value);
        return { ...f, classrooms: Array.from(set) };
      });
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    const payload = {
      examName: formData.examName,
      department: formData.department,
      examType: formData.examType,
      dateTime: formData.dateTime,
      duration: parseFloat(formData.duration),
      numProctors: parseInt(formData.numProctors, 10),
      offeringId: formData.offeringId
        ? parseInt(formData.offeringId, 10)
        : null,
      facultyId: formData.facultyId
        ? parseInt(formData.facultyId, 10)
        : null,
      examRooms: formData.classrooms.map(id => ({
        classroomId: parseInt(id, 10),
        numProctors: parseInt(formData.numProctors, 10)
      }))
    };

    const method = modalType === "create" ? "POST" : "PUT";
    const url =
      modalType === "create"
        ? `${BASE}/exams`
        : `${BASE}/exams/${selectedExam.id}`;

    fetch(url, { method, headers, body: JSON.stringify(payload) })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setExams(es =>
          modalType === "create"
            ? [data, ...es]
            : es.map(ex => (ex.id === data.id ? data : ex))
        );
        closeModal();
      })
      .catch(() => alert("Error saving exam"));
  };

  const handleDelete = () => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${BASE}/exams/${selectedExam.id}`, {
      method: "DELETE",
      headers
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setExams(es => es.filter(ex => ex.id !== selectedExam.id));
        closeModal();
      })
      .catch(() => alert("Error deleting exam"));
  };

  return (
    <div className="d-flex">
      <div style={{ width: 300 }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between mb-4">
          <h3>Defines Exam</h3>
          <button
            className="btn btn-secondary"
            onClick={() => openModal("create")}
          >
            + Create Exam
          </button>
        </div>

        <div className="row g-4">
          {exams.map(ex => {
            // only proctors for this exam
            const proctors = allAssignments.filter(a => a.examId === ex.id);

            return (
              <div className="col-md-6 col-lg-4" key={ex.id}>
                <div className="card shadow-sm mb-3">
                  <div className="card-body">
                    <h5>{ex.examName}</h5>
                    <p>
                      <strong>Type:</strong> {ex.examType}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(ex.dateTime).toLocaleString()}
                    </p>
                    <div className="mt-3">
                      <strong>Proctors:</strong>
                      <ul className="ps-3 mb-0">
                        {proctors.length > 0
                          ? proctors.map(a => {
                              const ta = allTAs.find(t => t.id === a.taId);
                              const taName = ta
                                ? `${ta.firstName} ${ta.lastName}`
                                : `TA #${a.taId}`;
                              const cls = allClassrooms.find(
                                c => c.id === a.classroomId
                              );
                              const roomName = cls
                                ? `${cls.building} ${cls.roomNumber}`
                                : `Room #${a.classroomId}`;
                              return (
                                <li key={a.id}>
                                  {taName} – {roomName} <em>({a.status})</em>
                                </li>
                              );
                            })
                          : <li className="text-muted">No proctors assigned</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalType === "create"
                      ? "Create Exam"
                      : modalType === "edit"
                      ? "Edit Exam"
                      : "Confirm Delete"}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>
                {modalType === "delete" ? (
                  <div className="modal-body">
                    <p>Are you sure you want to delete this exam?</p>
                  </div>
                ) : (
                  <div className="modal-body">
                    {/* original form inputs */}
                    <div className="mb-3">
                      <label className="form-label">Exam Name</label>
                      <input
                        name="examName"
                        className="form-control"
                        value={formData.examName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <input
                        name="department"
                        className="form-control"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        name="examType"
                        className="form-select"
                        value={formData.examType}
                        onChange={handleChange}
                      >
                        <option>Written</option>
                        <option>Online</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date & Time</label>
                      <input
                        type="datetime-local"
                        name="dateTime"
                        className="form-control"
                        value={formData.dateTime}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration (mins)</label>
                      <input
                        type="number"
                        name="duration"
                        className="form-control"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Number of Proctors
                      </label>
                      <input
                        type="number"
                        name="numProctors"
                        className="form-control"
                        value={formData.numProctors}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Offering</label>
                      <select
                        name="offeringId"
                        className="form-select"
                        value={formData.offeringId}
                        onChange={handleChange}
                      >
                        <option value="">-- select offering --</option>
                        {allOfferings.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.section} ({o.semester} {o.year})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Faculty Member</label>
                      <select
                        name="facultyId"
                        className="form-select"
                        value={formData.facultyId}
                        onChange={handleChange}
                      >
                        <option value="">-- select faculty --</option>
                        {allFaculty.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.firstName} {f.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Select Classrooms
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {allClassrooms.map((cls, i) => (
                          <div className="form-check me-3" key={i}>
                            <input
                              type="checkbox"
                              name="classrooms"
                              value={cls.id}
                              checked={formData.classrooms.includes(
                                cls.id.toString()
                              )}
                              onChange={handleChange}
                              className="form-check-input"
                              id={`cls-${i}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`cls-${i}`}
                            >
                              {cls.building} {cls.roomNumber}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={
                      modalType === "delete" ? handleDelete : handleSave
                    }
                  >
                    {modalType === "delete" ? "Delete" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefinesExamPage;
