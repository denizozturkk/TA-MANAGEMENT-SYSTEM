// src/people/Admin/MakeReports-Admin.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../Admin/Layout-Admin";

const reportOptions = [
  { key: "log", label: "Login Reports" },
  { key: "swap", label: "Swap Reports" },
  { key: "duty", label: "Duty Reports" },
  { key: "proctor", label: "Proctor Reports" },
];

const MakeReportsAdmin = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [today, setToday] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((dr) => ({ ...dr, [name]: value }));
  };

  const baseUrl = "http://localhost:8080/api/admin";
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const loadReport = async () => {
    const { startDate, endDate } = dateRange;
    if (!type || !startDate || !endDate) {
      return setToast({
        show: true,
        type: "danger",
        message: "Select report type and both dates",
      });
    }
    setLoading(true);
    const from = `${startDate}T00:00:00`;
    const to = `${endDate}T23:59:59`;
    try {
      const res = await fetch(
        `${baseUrl}/reports/${type}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { headers }
      );
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data = await res.json();
      setReports(data);
      setToast({
        show: true,
        type: "success",
        message: `${reportOptions.find((o) => o.key === type).label} loaded`,
      });
    } catch (err) {
      console.error(err);
      setToast({ show: true, type: "danger", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    const { startDate, endDate } = dateRange;
    const from = `${startDate}T00:00:00`;
    const to = `${endDate}T23:59:59`;
    try {
      const res = await fetch(
        `${baseUrl}/reports/${type}/pdf?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { headers: { ...headers, Accept: "application/pdf" } }
      );
      if (!res.ok) throw new Error(`Failed to download PDF: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report-${startDate}-to-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setToast({ show: true, type: "success", message: "PDF downloaded" });
    } catch (err) {
      console.error(err);
      setToast({ show: true, type: "danger", message: err.message });
    }
  };

  const columns = reports.length > 0 ? Object.keys(reports[0]) : [];

  return (
    <div className="d-flex flex-column flex-lg-row">
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <Sidebar />
      </div>

      <div className="container-fluid py-4">
        {toast.show && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
            <div className={`toast show bg-${toast.type} text-white`}>
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setToast((t) => ({ ...t, show: false }))}
                />
              </div>
            </div>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-4 text-primary text-center text-lg-start">
                  Generate Admin Reports
                </h4>

                <div className="mb-4">
                  <label className="form-label">Report Type</label>
                  <select
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">-- Select a Report --</option>
                    {reportOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row mb-4">
                  {["startDate", "endDate"].map((f) => (
                    <div className="col-md-6" key={f}>
                      <label className="form-label text-capitalize">
                        {f === "startDate" ? "Start Date" : "End Date"}
                      </label>
                      <input
                        type="date"
                        name={f}
                        className="form-control"
                        max={today}
                        value={dateRange[f]}
                        onChange={handleDateChange}
                      />
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-2 mb-4">
                  <button
                    className="btn btn-outline-primary"
                    disabled={!type || !dateRange.startDate || !dateRange.endDate || loading}
                    onClick={loadReport}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm" /> : "Load Report"}
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={!reports.length}
                    onClick={downloadPdf}
                  >
                    Download PDF
                  </button>
                </div>

                {reports.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {reports.map((row, i) => (
                          <tr key={i}>
                            {columns.map((c) => (
                              <td key={c}>
                                {/\d{4}-\d{2}-\d{2}T/.test(row[c])
                                  ? new Date(row[c]).toLocaleString()
                                  : String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !loading && <p className="text-center text-muted">No data loaded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeReportsAdmin;
