// src/people/Admin/MakeReports-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const MakeReportsAdmin = () => {
  const reportOptions = [
    { key: "log",     label: "Login Reports",   icon: "lock"         },
    { key: "swap",    label: "Swap Reports",    icon: "exchange-alt" },
    { key: "duty",    label: "Duty Reports",    icon: "check-alt"    },
    { key: "proctor", label: "Proctor Reports", icon: "user-safety"  },
  ];

  const [dateRange,  setDateRange]  = useState({ startDate:"", endDate:"" });
  const [today,      setToday]      = useState("");
  const [loadingKey, setLoadingKey] = useState(null);
  const [reports,    setReports]    = useState([]);
  const [toast,      setToast]      = useState({ show:false, message:"", type:"" });

  useEffect(() => {
    setToday(new Date().toISOString().slice(0,10));
  }, []);

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(dr => ({ ...dr, [name]: value }));
  };

  const handleGenerate = async key => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return setToast({ show:true, type:"danger", message:"Select both dates" });
    }
    setLoadingKey(key);

    const from  = `${dateRange.startDate}T00:00:00`;
    const to    = `${dateRange.endDate}T23:59:59`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      setToast({ show:true, type:"danger", message:"Not logged in." });
      setLoadingKey(null);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/reports/${key}`
        + `?from=${encodeURIComponent(from)}`
        + `&to=${encodeURIComponent(to)}`,
        { headers: { Authorization:`Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status===401) throw new Error("Session expired, please log in again.");
        throw new Error("Failed to load reports");
      }

      const data = await res.json();
      setReports(data);
      setToast({
        show: true,
        type: "success",
        message: `${reportOptions.find(o=>o.key===key).label} loaded`
      });
    } catch(err) {
      console.error(err);
      setToast({ show:true, type:"danger", message:err.message });
    } finally {
      setLoadingKey(null);
    }
  };

  // derive columns from the first report object
  const columns = reports.length > 0
    ? Object.keys(reports[0])
    : [];

  return (
    <LayoutAdmin>
      {toast.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex:11 }}>
          <div className={`toast show bg-${toast.type} text-white`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                className="btn-close btn-close-white me-2 m-auto"
                onClick={()=>setToast(t=>({...t,show:false}))}
              />
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm my-4">
        <div className="card-body">
          <h4 className="mb-4">
            <i className="icofont-chart-histogram me-2"/>Generate Admin Reports
          </h4>

          {/* Date pickers */}
          <div className="row g-3 mb-4">
            {["startDate","endDate"].map(f => (
              <div className="col-md-6" key={f}>
                <label className="form-label text-capitalize">
                  {f==="startDate" ? "Start Date" : "End Date"}
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="icofont-ui-calendar"/>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    name={f}
                    max={today}
                    value={dateRange[f]}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Report buttons */}
          <div className="row g-3">
            {reportOptions.map(opt => (
              <div className="col-sm-6 col-lg-3" key={opt.key}>
                <button
                  className="btn btn-outline-primary w-100 py-4 d-flex flex-column align-items-center"
                  disabled={loadingKey!==null}
                  onClick={()=>handleGenerate(opt.key)}
                >
                  { loadingKey===opt.key
                    ? <span className="spinner-border spinner-border-sm mb-2"/>
                    : <i className={`icofont-${opt.icon} fs-2 mb-2`}/>
                  }
                  {opt.label}
                </button>
              </div>
            ))}
          </div>

          {/* Render results as a table */}
          {reports.length > 0 && (
            <div className="table-responsive mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {columns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map(col => (
                        <td key={col}>
                          {
                            // if it's a date string, format it:
                            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(row[col])
                              ? new Date(row[col]).toLocaleString()
                              : String(row[col])
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default MakeReportsAdmin;
