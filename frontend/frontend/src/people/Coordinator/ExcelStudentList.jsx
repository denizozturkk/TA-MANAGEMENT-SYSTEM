// src/people/Coordinator/ImportStudents.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout";

const SEMESTERS = ["FALL", "SPRING", "SUMMER"];
const API_COURSES   = "http://localhost:8080/api/courses";
const API_SEARCH    = "http://localhost:8080/api/offerings/search";
const API_UPLOAD    = "http://localhost:8080/api/coordinators/imp-students";

export default function ImportStudents() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [courseCode,  setCourseCode]  = useState("");
  const [semester,    setSemester]    = useState("");
  const [year,        setYear]        = useState("");
  const [offeringId,  setOfferingId]  = useState(null);
  const [searching,   setSearching]   = useState(false);

  const [file,      setFile]      = useState(null);
  const [fileName,  setFileName]  = useState("");
  const [excelData, setExcelData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const token = localStorage.getItem("authToken");
  const hdrs  = { Authorization: `Bearer ${token}` };

  // show a toast message
  const showToast = (message, isError = false, timeout = 5000) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(t => ({ ...t, show: false })), timeout);
  };

  // 1️⃣ load course codes once
  useEffect(() => {
    fetch(API_COURSES, { headers: { ...hdrs, Accept: "application/json" } })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load courses");
        return res.json();
      })
      .then(list => {
        // extract unique course codes
        const codes = Array.from(new Set(list.map(c => c.courseCode))).sort();
        setCourseCodes(codes);
      })
      .catch(err => {
        console.error(err);
        showToast("Could not load course codes", true);
      });
  }, []);

  // 2️⃣ search for the offering
  const handleSearch = () => {
    if (!courseCode || !semester || !year) {
      return showToast("Please select course, semester & year", true);
    }
    setSearching(true);
    fetch(
      `${API_SEARCH}` +
        `?courseCode=${encodeURIComponent(courseCode)}` +
        `&semester=${encodeURIComponent(semester)}` +
        `&year=${encodeURIComponent(year)}`,
      { headers: { ...hdrs, Accept: "application/json" } }
    )
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t || res.statusText); });
        return res.json();
      })
      .then(dto => {
        setOfferingId(dto.id);
        showToast(`Found offering #${dto.id}`, false);
      })
      .catch(err => {
        console.error(err);
        showToast(
          err.message.includes("not found")
            ? "No offering matches your selection"
            : "Error searching for offering",
          true
        );
      })
      .finally(() => setSearching(false));
  };

  // 3️⃣ parse the Excel for preview
  const handleFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = evt => {
      const data = new Uint8Array(evt.target.result);
      const wb   = XLSX.read(data, { type: "array" });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      setExcelData(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsArrayBuffer(f);
  };

  // 4️⃣ upload the Excel under the found offeringId
  const handleUpload = async () => {
    if (!offeringId)     return showToast("Please search and select an offering first", true);
    if (!file)           return showToast("Please select an Excel file", true);

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("offeringId", offeringId);

      const res = await fetch(
        `${API_UPLOAD}?offeringId=${offeringId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        let msg = txt;
        try { msg = JSON.parse(txt).message || txt; } catch {}
        throw new Error(msg);
      }
      showToast("Students imported successfully!", false);
      // reset
      setFile(null);
      setFileName("");
      setExcelData([]);
    } catch (err) {
      console.error(err);
      showToast(err.message, true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div style={{ width: 300 }}>
        <CoordinatorLayout />
      </div>
      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Import Students via Excel</h4>

            {/* search panel */}
            <div className="row g-2 mb-3">
              <div className="col">
                <select
                  className="form-select"
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    setOfferingId(null);
                  }}
                >
                  <option value="">-- Select Course Code --</option>
                  {courseCodes.map(cc => (
                    <option key={cc} value={cc}>{cc}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={semester}
                  onChange={e => {
                    setSemester(e.target.value);
                    setOfferingId(null);
                  }}
                >
                  <option value="">-- Select Semester --</option>
                  {SEMESTERS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Year"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={e => {
                    setYear(e.target.value);
                    setOfferingId(null);
                  }}
                />
              </div>
              <div className="col-auto d-grid">
                <button
                  className="btn btn-outline-secondary"
                  disabled={searching}
                  onClick={handleSearch}
                >
                  {searching ? "Searching…" : "Search Offering"}
                </button>
              </div>
            </div>

            {offeringId && (
              <div className="alert alert-success mb-3">
                Selected Offering ID: <strong>#{offeringId}</strong>
              </div>
            )}

            {/* file picker */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Excel File</label>
              <input
                type="file"
                accept=".xls,.xlsx"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            {fileName && (
              <div className="alert alert-info">
                <strong>File:</strong> {fileName}
              </div>
            )}

            {/* preview + upload */}
            {excelData.length > 0 && (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Importing…" : "Import Students"}
                  </button>
                </div>
                <div
                  className="table-responsive"
                  style={{ maxHeight: 300, overflowY: "auto" }}
                >
                  <table className="table table-striped table-bordered text-nowrap">
                    <thead className="table-light sticky-top">
                      <tr>
                        {excelData[0].map((h, i) => <th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.slice(1).map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* toast */}
      {toast.show && (
        <div
          className={`toast position-fixed bottom-0 end-0 m-4 show ${
            toast.isError ? "bg-danger text-white" : "bg-light text-dark"
          }`}
          style={{ minWidth: 250 }}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <strong>Bilkent TA Management System</strong>
              <div>{toast.message}</div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => setToast(t => ({ ...t, show: false }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
