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
import React, { useState, useEffect } from "react";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const DefinesExamPage = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedExam, setSelectedExam] = useState(null);
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [allTAs, setAllTAs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    type: "Written",
    duration: "",
    start: "",
    end: "",
    tAs: [],
    attachments: "",
    proctourCount: "",
    classrooms: [],
    assignmentType: "manual"
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid or missing JWT token:", token);
      return;
    }

    // Sınıfları çek
    fetch("http://localhost:8080/api/classrooms", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setAllClassrooms(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Classrooms fetch error:", err);
        setAllClassrooms([]);
      });
// Sınavları çek
fetch("http://localhost:8080/api/exams", {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) {
      setExams(data);
    } else {
      console.error("Invalid exam data:", data);
    }
  })
  .catch(err => {
    console.error("Exams fetch error:", err);
    setExams([]);
  });

    // TA'leri çek
    fetch("http://localhost:8080/api/ta", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setAllTAs(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("TA fetch error:", err);
        setAllTAs([]);
      });

  }, []);

  const openModal = (type, exam = null) => {
    setModalType(type);
    setSelectedExam(exam);
    setFormData(
      exam
        ? {
            ...exam,
            tAs: exam.tAs || [],
            attachments: exam.attachments || "",
            proctourCount: exam.proctourCount || "",
            end: exam.end || "",
            classrooms: exam.classrooms || [],
            assignmentType: "manual"
          }
        : {
            title: "",
            type: "Written",
            duration: "",
            start: "",
            end: "",
            tAs: [],
            attachments: "",
            proctourCount: "",
            classrooms: [],
            assignmentType: "manual"
          }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setFormData({
      title: "",
      type: "Written",
      duration: "",
      start: "",
      end: "",
      tAs: [],
      attachments: "",
      proctourCount: "",
      classrooms: [],
      assignmentType: "manual"
    });
  };

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const values = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const assignTAsAutomatically = () => {
    const availableTAs = allTAs.filter(ta => ta.totalWorkload < 3);
    if (availableTAs.length < formData.proctourCount) {
      alert("Not enough TAs available. Notify the Dean.");
    } else {
      setFormData({ ...formData, tAs: availableTAs.map(ta => ta.fullName) });
    }
  };

  const handleSave = () => {
    if (formData.assignmentType === "automatic") {
      assignTAsAutomatically();
    }

    const formattedExam = {
      ...formData,
      id: modalType === "create" ? exams.length + 1 : selectedExam.id,
      tAs: formData.tAs,
      attachments: parseInt(formData.attachments),
      proctourCount: parseInt(formData.proctourCount)
    };

    if (modalType === "create") {
      setExams([...exams, formattedExam]);
    } else {
      setExams(exams.map(exam => (exam.id === selectedExam.id ? formattedExam : exam)));
    }
    closeModal();
  };

  const handleDelete = () => {
    setExams(exams.filter(exam => exam.id !== selectedExam.id));
    closeModal();
  };

  const notifyDean = () => {
    alert("Insufficient TAs. Dean notified.");
  };

  const assignedTAsCount = formData.tAs.length;
  const notifyDeanButton = assignedTAsCount > formData.proctourCount ? (
    <button className="btn btn-warning" onClick={notifyDean}>Notify Dean</button>
  ) : null;

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultyMemberLayout />
      </div>
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Defines Exam</h3>
          <button className="btn btn-secondary" onClick={() => openModal("create")}>
            + Create Exam
          </button>
        </div>

        <h4 className="fw-bold mb-3">All Exams in System</h4>
<div className="row g-4">
  {exams.length === 0 ? (
    <p>No exams found in the system.</p>
  ) : (
    exams.map((exam) => (
      <div className="col-md-6 col-lg-4" key={exam.id}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold">{exam.examName}</h5>
            <p><strong>Type:</strong> {exam.examType}</p>
            <p><strong>Department:</strong> {exam.department}</p>
            <p><strong>Date:</strong> {new Date(exam.dateTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> {exam.duration} mins</p>
            <p><strong>Total Proctors:</strong> {exam.numProctors}</p>
            <p><strong>Faculty ID:</strong> {exam.facultyId}</p>
            <p><strong>Offering ID:</strong> {exam.offeringId}</p>

            {exam.examRooms && exam.examRooms.length > 0 && (
  <div className="mt-3">
    <p><strong>Rooms:</strong></p>
    <ul className="ps-3">
      {exam.examRooms.map((room, idx) => {
        const matchedClassroom = allClassrooms.find(c => c.id === room.classroomId);
        return (
          <li key={idx}>
            {matchedClassroom
              ? `${matchedClassroom.building} ${matchedClassroom.roomNumber} (Cap: ${matchedClassroom.examCapacity}) - Proctors: ${room.numProctors}`
              : `Classroom ID: ${room.classroomId}, Capacity: ${room.capacity}, Proctors: ${room.numProctors}`
            }
          </li>
        );
      })}
    </ul>
  </div>
)}

          </div>
        </div>
      </div>
    ))
  )}
</div>


        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalType === "create" && "Create Exam"}
                    {modalType === "edit" && `Edit: ${selectedExam.title}`}
                    {modalType === "delete" && "Confirm Delete"}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  {modalType === "delete" ? (
                    <p>Are you sure you want to delete this exam?</p>
                  ) : (
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Exam Title</label>
                        <input name="title" className="form-control" value={formData.title} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                          <option>Written</option>
                          <option>Online</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Duration</label>
                        <input name="duration" className="form-control" value={formData.duration} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Start Date</label>
                        <input type="date" name="start" className="form-control" value={formData.start} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input type="time" name="end" className="form-control" value={formData.end} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">TA Assignment Type</label>
                        <select name="assignmentType" className="form-select" value={formData.assignmentType} onChange={handleChange}>
                          <option value="manual">Manual</option>
                          <option value="automatic">Automatic</option>
                        </select>
                      </div>
                      {formData.assignmentType === "manual" && (
                        <div className="mb-3">
                          <label className="form-label">Assigned TAs</label>
                          <select name="tAs" className="form-select" multiple value={formData.tAs} onChange={handleChange}>
                            {allTAs.map((ta) => (
                              <option key={ta.id} value={ta.fullName}>
                                {ta.fullName} – Workload: {ta.totalWorkload} – Dept: {ta.department}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Proctour Count</label>
                        <input type="number" name="proctourCount" className="form-control" value={formData.proctourCount} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Attachments Count</label>
                        <input type="number" name="attachments" className="form-control" value={formData.attachments} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Select Classrooms</label>
                        <div className="d-flex flex-wrap gap-2">
                          {allClassrooms.map((cls, idx) => {
                            const key = `${cls.building}-${cls.roomNumber}`;
                            const label = `${cls.building} ${cls.roomNumber} (Cap: ${cls.examCapacity})`;
                            return (
                              <div key={idx} className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`classroom-${idx}`}
                                  value={key}
                                  checked={formData.classrooms.includes(key)}
                                  onChange={(e) => {
                                    const { checked, value } = e.target;
                                    const updated = checked
                                      ? [...formData.classrooms, value]
                                      : formData.classrooms.filter(c => c !== value);
                                    setFormData({ ...formData, classrooms: updated });
                                  }}
                                />
                                <label className="form-check-label" htmlFor={`classroom-${idx}`}>
                                  {label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </form>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary me-2" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={modalType === "delete" ? handleDelete : handleSave}>
                    {modalType === "delete" ? "Delete" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {notifyDeanButton}
      </div>
    </div>
  );
};

export default DefinesExamPage;
