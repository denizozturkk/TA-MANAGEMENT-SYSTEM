// src/people/Admin/MakeReports-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const reportOptions = [
  { key: "log",     label: "Login Reports"   },
  { key: "swap",    label: "Swap Reports"    },
  { key: "duty",    label: "Duty Reports"    },
  { key: "proctor", label: "Proctor Reports" },
];

const MakeReportsAdmin = () => {
  const [dateRange,   setDateRange]   = useState({ startDate:"", endDate:"" });
  const [today,       setToday]       = useState("");
  const [loadingKey,  setLoadingKey]  = useState(null);
  const [reports,     setReports]     = useState([]);
  const [toast,       setToast]       = useState({ show:false, message:"", type:"" });

  useEffect(() => {
    setToday(new Date().toISOString().slice(0,10));
  }, []);

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(dr => ({ ...dr, [name]: value }));
  };

  const generateAndDownload = async key => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) {
      return setToast({ show:true, type:"danger", message:"Please select both dates" });
    }

    setLoadingKey(key);
    const from  = `${startDate}T00:00:00`;
    const to    = `${endDate}T23:59:59`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      setToast({ show:true, type:"danger", message:"Not logged in." });
      setLoadingKey(null);
      return;
    }

    try {
      // 1) fetch JSON data
      const resJson = await fetch(
        `http://localhost:8080/api/admin/reports/${key}` +
        `?from=${encodeURIComponent(from)}` +
        `&to=${encodeURIComponent(to)}`,
        { headers: { Authorization:`Bearer ${token}` } }
      );
      if (!resJson.ok) throw new Error(`JSON load failed: ${resJson.status}`);
      const data = await resJson.json();
      setReports(data);

      // 2) fetch PDF and trigger download
      const resPdf = await fetch(
        `http://localhost:8080/api/admin/reports/${key}/pdf` +
        `?from=${encodeURIComponent(from)}` +
        `&to=${encodeURIComponent(to)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:        "application/pdf"
          }
        }
      );
      if (!resPdf.ok) throw new Error(`PDF download failed: ${resPdf.status}`);
      const blob = await resPdf.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${key}-report-${startDate}-to-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setToast({
        show:    true,
        type:    "success",
        message: `${reportOptions.find(o=>o.key===key).label} loaded & downloaded`
      });
    } catch(err) {
      console.error(err);
      setToast({ show:true, type:"danger", message: err.message });
    } finally {
      setLoadingKey(null);
    }
  };

  const columns = reports.length > 0 ? Object.keys(reports[0]) : [];

  return (
    <LayoutAdmin>
      {toast.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex:11 }}>
          <div className={`toast show bg-${toast.type} text-white`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast(t=>({ ...t, show:false }))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm my-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Generate & Download Admin Reports</h4>

          {/* Date selectors */}
          <div className="row mb-4">
            {["startDate","endDate"].map(f => (
              <div className="col" key={f}>
                <label className="form-label text-capitalize">
                  {f==="startDate" ? "Start Date" : "End Date"}
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

          {/* ONE button per report: loads JSON & downloads PDF */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {reportOptions.map(opt => (
              <button
                key={opt.key}
                className="btn btn-outline-primary"
                disabled={loadingKey === opt.key}
                onClick={() => generateAndDownload(opt.key)}
              >
                {loadingKey === opt.key
                  ? <span className="spinner-border spinner-border-sm"/> 
                  : opt.label
                }
              </button>
            ))}
          </div>

          {/* Render JSON results */}
          {reports.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {reports.map((row,i) => (
                    <tr key={i}>
                      {columns.map(c => (
                        <td key={c}>
                          {/\d{4}-\d{2}-\d{2}T/.test(row[c])
                            ? new Date(row[c]).toLocaleString()
                            : String(row[c])
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!reports.length && loadingKey === null && (
            <p className="text-center text-muted">No data loaded yet</p>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default MakeReportsAdmin;
