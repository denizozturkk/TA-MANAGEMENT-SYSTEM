// src/people/Coordinator/ImportCourses.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import CoordinatorLayout from "../Coordinator/CoordinatorLayout";

const ImportCourses = () => {
  const [fileName,  setFileName]  = useState("");
  const [excelData, setExcelData] = useState([]);
  const [file,      setFile]      = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast,     setToast]     = useState({ show: false, message: "", isError: false });

  const token = localStorage.getItem("authToken");
  const BASE  = "http://localhost:8080/api/coordinators";
  const hdrs  = { Authorization: `Bearer ${token}` };

  const handleFileUpload = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = evt => {
      const data      = new Uint8Array(evt.target.result);
      const wb        = XLSX.read(data, { type: "array" });
      const ws        = wb.Sheets[wb.SheetNames[0]];
      setExcelData(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsArrayBuffer(f);
  };

  const showToast = (message, isError = false, timeout = 5000) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(t => ({ ...t, show: false })), timeout);
  };

  const handleUploadClick = async () => {
    if (!file) return showToast("Please select a file first.", true);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/imp-courses`, {
        method:  "POST",
        headers: hdrs,
        body:    form
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          msg = JSON.parse(text).message || text;
        } catch {}
        throw new Error(msg);
      }
      showToast("Courses imported successfully!", false);
      setFile(null);
      setFileName("");
      setExcelData([]);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div style={{ width: 300 }}><CoordinatorLayout /></div>
      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Import Courses via Excel</h4>
            <div className="mb-3">
              <label className="form-label">Select Excel File</label>
              <input
                type="file"
                accept=".xls,.xlsx"
                className="form-control"
                onChange={handleFileUpload}
              />
            </div>
            {fileName && (
              <div className="alert alert-info">
                <strong>Selected File:</strong> {fileName}
              </div>
            )}
            {excelData.length > 0 && (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadClick}
                    disabled={uploading}
                  >
                    {uploading ? "Importing…" : "Import Courses"}
                  </button>
                </div>
                <div className="table-responsive" style={{ maxHeight: 400, overflowY: "auto" }}>
                  <table className="table table-striped table-bordered">
                    <thead className="table-light sticky-top">
                      <tr>{excelData[0].map((h,i) => <th key={i}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {excelData.slice(1).map((row,r) => (
                        <tr key={r}>{row.map((c,cidx)=><td key={cidx}>{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
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
              onClick={() => setToast(t=>({ ...t, show:false }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCourses;
