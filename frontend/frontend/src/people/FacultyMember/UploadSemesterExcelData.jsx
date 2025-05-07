// src/people/Admin/ImportStudents.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import FacultyMemberLayout from "../FacultyMember/FacultyMemberLayout";

const ImportStudents = () => {
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);    // 2D array of rows
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // returns array of arrays
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(rows);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:8080/api/excel-import/imp-students", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Upload failed");
      }

      alert("Student data imported successfully!");
      // reset
      setFile(null);
      setFileName("");
      setExcelData([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultyMemberLayout />
      </div>

      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Import Students via Excel</h4>

            <div className="mb-3">
              <label htmlFor="studentFile" className="form-label fw-semibold">
                Select Student Excel File
              </label>
              <input
                type="file"
                className="form-control"
                id="studentFile"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </div>

            {fileName && (
              <div className="alert alert-info mt-3">
                <strong>Selected File:</strong> {fileName}
              </div>
            )}

            {excelData.length > 0 && (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleUploadClick}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Import Students"}
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        {excelData[0].map((header, idx) => (
                          <th key={idx}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.slice(1).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>{cell}</td>
                          ))}
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
    </div>
  );
};

export default ImportStudents;
