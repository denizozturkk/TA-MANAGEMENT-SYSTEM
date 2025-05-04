// src/people/Admin/MakeReports-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const MakeReportsAdmin = () => {
  const reportOptions = [
    { key: "log",    label: "Login Reports",   icon: "lock" },
    { key: "swap",   label: "Swap Reports",    icon: "exchange-alt" },
    { key: "duty",   label: "Duty Reports",    icon: "check-alt" },
    { key: "proctor",label: "Proctor Reports", icon: "user-safety" },
  ];

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [today, setToday] = useState("");
  const [loadingKey, setLoadingKey] = useState(null);
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((p) => ({ ...p, [name]: value }));
  };

  const handleGenerate = async (key) => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return setToast({
        show: true,
        type: "danger",
        message: "Select both start and end dates.",
      });
    }

    setLoadingKey(key);
    const from = `${dateRange.startDate}T00:00:00`;
    const to   = `${dateRange.endDate}T23:59:59`;

    try {
      const res = await fetch(
        `/api/admin/reports/${key}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setReports(data);
      setToast({
        show: true,
        type: "success",
        message: `${reportOptions.find(r => r.key===key).label} loaded.`,
      });
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        type: "danger",
        message: `Failed to load ${key} reports.`,
      });
    } finally {
      setLoadingKey(null);
    }
  };

  const closeToast = () => setToast((t) => ({ ...t, show: false }));

  return (
    <LayoutAdmin>
      {toast.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className={`toast show text-white bg-${toast.type}`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button className="btn-close btn-close-white me-2 m-auto" onClick={closeToast} />
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">
            <i className="icofont-chart-histogram me-2" />
            Generate Admin Reports
          </h4>

          <div className="row gx-3 mb-4">
            {["startDate", "endDate"].map((f) => (
              <div className="col-md-6" key={f}>
                <label htmlFor={f} className="form-label text-capitalize">
                  {f === "startDate" ? "Start Date" : "End Date"}
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="icofont-ui-calendar" />
                  </span>
                  <input
                    type="date"
                    id={f}
                    name={f}
                    className="form-control"
                    max={today}
                    value={dateRange[f]}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="row gx-3 gy-3">
            {reportOptions.map((opt) => (
              <div className="col-sm-6 col-lg-3" key={opt.key}>
                <button
                  className="btn btn-outline-primary w-100 py-4 d-flex flex-column align-items-center"
                  onClick={() => handleGenerate(opt.key)}
                  disabled={loadingKey !== null}
                >
                  {loadingKey === opt.key ? (
                    <span className="spinner-border spinner-border-sm mb-2" />
                  ) : (
                    <i className={`icofont-${opt.icon} fs-2 mb-2`} />
                  )}
                  {opt.label}
                </button>
              </div>
            ))}
          </div>

          {/* Simple display of JSON results */}
          {reports.length > 0 && (
            <pre className="mt-4 bg-light p-3" style={{ maxHeight: 300, overflow: "auto" }}>
              {JSON.stringify(reports, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default MakeReportsAdmin;
