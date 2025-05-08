import React, { useState, useEffect } from "react";
import FacultymemberLayout from "./FacultyMemberLayout";

const PrintStudentDistribution = () => {
  const facultyId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";

  const jsonHdrs = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [exams, setExams] = useState([]);
  const [studentsById, setStudentsById] = useState({});
  const [examId, setExamId] = useState("");
  const [distributionType, setDistributionType] = useState("random");
  const [classA, setClassA] = useState([]);
  const [classB, setClassB] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/faculty-members/${facultyId}/exams`, { headers: jsonHdrs })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setExams)
      .catch((e) => {
        console.error("Could not load exams:", e);
        alert("Failed to load your exams");
      });
  }, [facultyId]);

  useEffect(() => {
    fetch(`${BASE}/students`, { headers: jsonHdrs })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        const map = {};
        data.forEach((s) => (map[s.id] = s));
        setStudentsById(map);
      })
      .catch((e) => {
        console.error("Could not load students:", e);
      });
  }, []);

  const handleGenerate = () => {
    if (!examId) return alert("Please select an exam");

    fetch(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution?random=${distributionType === "random"}`,
      { headers: jsonHdrs }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((dto) => {
        const rawIds = Array.isArray(dto.distributions)
          ? dto.distributions.flatMap((d) => d.studentIds)
          : [];

        const allNames = rawIds.map((id) => {
          const s = studentsById[id];
          return s ? `${id} – ${s.firstName} ${s.lastName}` : `${id}`;
        });

        if (distributionType === "alphabetical") {
          allNames.sort((a, b) => a.localeCompare(b));
        } else {
          allNames.sort(() => Math.random() - 0.5);
        }

        const half = Math.ceil(allNames.length / 2);
        setClassA(allNames.slice(0, half));
        setClassB(allNames.slice(half));
      })
      .catch((e) => {
        console.error("Preview fetch failed:", e);
        alert("Failed to load distribution preview");
      });
  };

  const handleDownloadPdf = () => {
    if (!examId) return alert("Select an exam first");
    const rand = distributionType === "random";

    const selExam = exams.find((e) => e.id === +examId) || {};
    const filename = `${selExam.courseCode || "exam"}_${selExam.examName || ""}.pdf`;

    fetch(
      `${BASE}/faculty-members/${facultyId}/exams/${examId}/distribution/pdf?random=${rand}`,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch((e) => {
        console.error("PDF download failed:", e);
        alert("Failed to download PDF");
      });
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <FacultymemberLayout />
      </div>
  
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-9">
            <div className="card shadow border-0">
              <div className="card-body">
                <h3 className="fw-bold mb-4 text-primary text-center text-lg-start border-bottom pb-2">
                  Print Student Distribution
                </h3>
  
                {/* Exam Selector */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Select Exam</label>
                  <select
                    className="form-select"
                    value={examId}
                    onChange={(e) => {
                      setExamId(e.target.value);
                      setClassA([]);
                      setClassB([]);
                    }}
                  >
                    <option value="">-- Choose an Exam --</option>
                    {exams.map((ex) => (
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
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          id="random"
                          type="radio"
                          className="form-check-input"
                          checked={distributionType === "random"}
                          onChange={() => setDistributionType("random")}
                        />
                        <label htmlFor="random" className="form-check-label">
                          Random
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          id="alphabetical"
                          type="radio"
                          className="form-check-input"
                          checked={distributionType === "alphabetical"}
                          onChange={() => setDistributionType("alphabetical")}
                        />
                        <label htmlFor="alphabetical" className="form-check-label">
                          Alphabetical
                        </label>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mb-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleGenerate}
                    disabled={!examId}
                  >
                    Preview
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleDownloadPdf}
                    disabled={!examId}
                  >
                    Download PDF
                  </button>
                </div>
  
                {/* Preview Lists */}
                {(classA.length + classB.length) > 0 && (
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <div className="border rounded p-3 bg-light h-100">
                        <h5 className="fw-bold border-bottom pb-2">Class A</h5>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <ul className="list-group list-group-flush">
                            {classA.map((name, i) => (
                              <li key={i} className="list-group-item py-2 px-3">
                                {name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="border rounded p-3 bg-light h-100">
                        <h5 className="fw-bold border-bottom pb-2">Class B</h5>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <ul className="list-group list-group-flush">
                            {classB.map((name, i) => (
                              <li key={i} className="list-group-item py-2 px-3">
                                {name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintStudentDistribution;
