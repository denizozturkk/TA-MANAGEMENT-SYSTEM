// src/people/TA/PrintStudentDistribution.jsx
import React, { useState, useEffect } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const PrintStudentDistribution = () => {
  const facultyId = Number(localStorage.getItem("userId"));
  const token     = localStorage.getItem("authToken");
  const BASE      = "http://localhost:8080/api";

  // common headers *for JSON*
  const jsonHdrs  = {
    "Accept":        "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // ---- state ----
  const [exams, setExams]              = useState([]);
  const [studentsById, setStudentsById] = useState({});
  const [examId, setExamId]            = useState("");
  const [distributionType, setDistributionType] = useState("random");
  const [classA, setClassA]            = useState([]);
  const [classB, setClassB]            = useState([]);

  // load exams
  useEffect(() => {
    fetch(`${BASE}/faculty-members/${facultyId}/exams`, { headers: jsonHdrs })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setExams)
      .catch(e => {
        console.error("Could not load exams:", e);
        alert("Failed to load your exams");
      });
  }, [facultyId]);

  // load all students for name lookup
  useEffect(() => {
    fetch(`${BASE}/students`, { headers: jsonHdrs })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const map = {};
        data.forEach(s => map[s.id] = s);
        setStudentsById(map);
      })
      .catch(e => {
        console.error("Could not load students:", e);
      });
  }, []);

  // preview generation (ID + isim)
  const handleGenerate = () => {
    if (!examId) return alert("Please select an exam");

    fetch(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution?random=${distributionType === "random"}`,
      { headers: jsonHdrs }
    )
    .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
    .then(dto => {
      console.log("distribution DTO:", dto);
      // dto.distributions: [ { classroomId, studentIds: [ id, … ] }, … ]
      const rawIds = Array.isArray(dto.distributions)
        ? dto.distributions.flatMap(d => d.studentIds)
        : [];

      // map to "ID – First Last"
      const allNames = rawIds.map(id => {
        const s = studentsById[id];
        return s
          ? `${id} – ${s.firstName} ${s.lastName}`
          : `${id}`;
      });

      // sort or shuffle
      if (distributionType === "alphabetical") {
        allNames.sort((a,b) => a.localeCompare(b));
      } else {
        allNames.sort(() => Math.random() - 0.5);
      }

      // split evenly
      const half = Math.ceil(allNames.length / 2);
      setClassA(allNames.slice(0, half));
      setClassB(allNames.slice(half));
    })
    .catch(e => {
      console.error("Preview fetch failed:", e);
      alert("Failed to load distribution preview");
    });
  };

  // PDF download: Accept: application/pdf
  const handleDownloadPdf = () => {
    if (!examId) return alert("Select an exam first");
    const rand = distributionType === "random";

    // derive filename from selected exam
    const selExam = exams.find(e => e.id === +examId) || {};
    const filename = `${selExam.courseCode || "exam"}_${selExam.examName || ""}.pdf`;

    fetch(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution/pdf?random=${rand}`,
      {
        method: "GET",
        headers: {
          "Accept":        "application/pdf",
          "Authorization": `Bearer ${token}`
        }
      }
    )
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch(e => {
      console.error("PDF download failed:", e);
      alert("Failed to download PDF");
    });
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout/>
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">

            <h4 className="fw-bold mb-4 text-primary">
              Print Student Distribution
            </h4>

            {/* Exam Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Exam</label>
              <select
                className="form-select"
                value={examId}
                onChange={e => {
                  setExamId(e.target.value);
                  setClassA([]);
                  setClassB([]);
                }}
              >
                <option value="">-- Choose an Exam --</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.courseCode} – {ex.examName}
                  </option>
                ))}
              </select>
            </div>

            {/* Distribution Type */}
            {examId && (
              <div className="mb-4">
                <label className="form-label fw-semibold">Distribution Type</label>
                <div className="form-check">
                  <input
                    id="random"
                    type="radio"
                    className="form-check-input"
                    checked={distributionType === "random"}
                    onChange={() => setDistributionType("random")}
                  />
                  <label htmlFor="random" className="form-check-label">Random</label>
                </div>
                <div className="form-check">
                  <input
                    id="alphabetical"
                    type="radio"
                    className="form-check-input"
                    checked={distributionType === "alphabetical"}
                    onChange={() => setDistributionType("alphabetical")}
                  />
                  <label htmlFor="alphabetical" className="form-check-label">Alphabetical</label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex justify-content-end mb-4">
              <button
                className="btn btn-outline-primary me-2"
                onClick={handleGenerate}
                disabled={!examId}
              >
                Preview
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDownloadPdf}
                disabled={!examId}
              >
                Download PDF
              </button>
            </div>

            {/* Preview Lists */}
            {(classA.length + classB.length) > 0 && (
              <div className="row">
                <div className="col-md-6">
                  <h5>Class A</h5>
                  <ul className="list-group">
                    {classA.map((name,i) => (
                      <li key={i} className="list-group-item">{name}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Class B</h5>
                  <ul className="list-group">
                    {classB.map((name,i) => (
                      <li key={i} className="list-group-item">{name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintStudentDistribution;
