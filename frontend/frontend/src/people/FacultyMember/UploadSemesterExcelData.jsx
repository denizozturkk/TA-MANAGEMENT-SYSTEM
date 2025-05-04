import React, { useState } from "react";
import * as XLSX from "xlsx";
import FacultymemberLayout from "./FacultyMemberLayout";

const UploadSemesterExcelData = () => {
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);

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
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUploadClick = () => {
    if (!excelData.length) {
      alert("Please select a file first.");
      return;
    }
    console.log("Uploading data...", excelData);
    alert("Excel data uploaded successfully!");
    // API'ye gönderme işlemi burada yapılabilir
  };

  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <FacultymemberLayout />
      </div>

      <div className="container py-5 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Upload Semester Excel Data</h4>

            <div className="mb-3">
              <label htmlFor="excelFile" className="form-label fw-semibold">Select Excel File</label>
              <input
                type="file"
                className="form-control"
                id="excelFile"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </div>

            {fileName && (
              <div className="alert alert-info mt-3">
                <strong>Uploaded File:</strong> {fileName}
              </div>
            )}

            {excelData.length > 0 && (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={handleUploadClick}>
                    Upload
                  </button>
                </div>

                <div className="table-responsive mt-4">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        {excelData[0].map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
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

export default UploadSemesterExcelData;
