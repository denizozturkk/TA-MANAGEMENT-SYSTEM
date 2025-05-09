// src/people/Dean/MakeReportDean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const reportOptions = [
  { key: "LOG", label: "Login Reports" },
  { key: "SWAP", label: "Swap Reports" },
  { key: "DUTY", label: "Duty Reports" },
  { key: "PROCTOR", label: "Proctor Reports" },
];

const baseUrl = "http://localhost:8080/api/admin";

const MakeReportDean = () => {
  const deanId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [today, setToday] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [actionKey, setActionKey] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!deanId) return alert("No deanId found—please log in again.");
    setToday(new Date().toISOString().split("T")[0]);

    fetch(`http://localhost:8080/api/dean/${deanId}/report-requests`, {
      headers: { ...headers, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(setRequests)
      .catch((err) => {
        console.error("Error loading report requests:", err);
        alert("Error loading report requests");
      })
      .finally(() => setLoadingReqs(false));
  }, [deanId]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((p) => ({ ...p, [name]: value }));
  };

  const requestReport = async (key) => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return alert("Please select both dates.");
    setActionKey(key);

    const payload = {
      reportType: key,
      fromTime: `${startDate}T00:00:00`,
      toTime: `${endDate}T23:59:59`,
      details: "",
      status: "PENDING",
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/dean/${deanId}/report-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify(payload),
        }
      );

      const bodyText = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newReq = JSON.parse(bodyText);
      setRequests((prev) => [newReq, ...prev]);
    } catch (err) {
      console.error(`Failed to request ${key}:`, err);
      alert(`Failed to request report: ${key}`);
    } finally {
      setActionKey(null);
    }
  };

  const downloadReport = async (reportType, fromTime, toTime) => {
    try {
      const pdfType = reportType.toLowerCase();
      const url = `${baseUrl}/reports/${pdfType}/pdf?from=${fromTime}&to=${toTime}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      if (!res.ok) throw new Error(`Failed to download PDF: ${res.status}`);
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${pdfType}-report-${fromTime.split("T")[0]}-to-${toTime.split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(downloadUrl);
      setToast({ show: true, type: "success", message: "PDF downloaded" });
    } catch (err) {
      console.error("Download failed:", err);
      setToast({ show: true, type: "danger", message: err.message });
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="flex-shrink-0" style={{ width: "300px" }}>
        <LayoutDean />
      </div>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
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

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-4">Generate Dean’s Report</h4>

            {/* Date selectors */}
            <div className="row mb-4">
              {["startDate", "endDate"].map((field) => (
                <div className="col" key={field}>
                  <label htmlFor={field} className="form-label text-capitalize">
                    {field === "startDate" ? "Start Date" : "End Date"}
                  </label>
                  <input
                    type="date"
                    id={field}
                    name={field}
                    className="form-control"
                    max={today}
                    value={dateRange[field]}
                    onChange={handleDateChange}
                  />
                </div>
              ))}
            </div>

            {/* Report buttons */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {reportOptions.map((opt) => (
                <button
                  key={opt.key}
                  className="btn btn-outline-primary"
                  disabled={actionKey === opt.key}
                  onClick={() => requestReport(opt.key)}
                >
                  {actionKey === opt.key ? "Requesting…" : opt.label}
                </button>
              ))}
            </div>

            {/* Report Table */}
            <div className="mt-4">
              <h5 className="fw-semibold mb-3">Your Report Requests</h5>
              {loadingReqs ? (
                <p>Loading…</p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Report Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No requests yet</td></tr>
                    ) : (
                      requests.map((r) => {
                        const { id, reportType, fromTime, toTime, status } = r;
                        const label = reportOptions.find(o => o.key === reportType)?.label || reportType;
                        const start = fromTime.split("T")[0];
                        const end = toTime.split("T")[0];
                        return (
                          <tr key={id}>
                            <td>{label}</td>
                            <td>{start}</td>
                            <td>{end}</td>
                            <td className={status === "APPROVED" ? "text-success" : status === "REJECTED" ? "text-danger" : ""}>{status}</td>
                            <td>
                              {status === "APPROVED" && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  disabled={actionKey === reportType}
                                  onClick={() => downloadReport(reportType, fromTime, toTime)}
                                >
                                  {actionKey === reportType ? "Downloading…" : "Download"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeReportDean;
