// src/people/Dean/MakeReport-Dean.jsx
import React, { useState, useEffect } from "react";
import LayoutDean from "./Layout-Dean";

const reportOptions = [
  { key: "courses",     label: "Course Data Report"      },
  { key: "scheduling",  label: "Exam Scheduling Report"   },
  { key: "proctoring",  label: "Proctoring Duties Report" },
  { key: "department",  label: "Department Pool Report"   },
];

const MakeReportDean = () => {
  const [dateRange,    setDateRange]    = useState({ startDate: "", endDate: "" });
  const [today,        setToday]        = useState("");
  const [requests,     setRequests]     = useState([]);
  const [loadingReqs,  setLoadingReqs]  = useState(true);
  const [actionKey,    setActionKey]    = useState(null);

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
    fetch("/api/dean/report-requests")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setRequests)
      .catch((err) => {
        console.error(err);
        alert("Error loading report requests");
      })
      .finally(() => setLoadingReqs(false));
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((p) => ({ ...p, [name]: value }));
  };

  const requestReport = async (key) => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) {
      return alert("Please select both start and end dates.");
    }
    setActionKey(key);
    try {
      const res = await fetch("/api/dean/report-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: key, from: startDate, to: endDate }),
      });
      if (!res.ok) throw new Error();
      const newReq = await res.json();
      setRequests((prev) => [newReq, ...prev]);
    } catch {
      alert(`Failed to request ${reportOptions.find(r => r.key === key).label}`);
    } finally {
      setActionKey(null);
    }
  };

  const downloadReport = async (key, from, to) => {
    setActionKey(key);
    try {
      const res = await fetch(
        `/api/dean/reports/${key}?from=${encodeURIComponent(from + "T00:00:00")}&to=${encodeURIComponent(to + "T23:59:59")}`,
        { headers: { Accept: "application/pdf" } }
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${key}-report-${from}-to-${to}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download report.");
    } finally {
      setActionKey(null);
    }
  };

  return (
    <LayoutDean>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Generate Dean’s Report</h4>

          {/* Date selectors */}
          <div className="row mb-4">
            {["startDate","endDate"].map((field) => (
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

          {/* Request buttons */}
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

          {/* Requested Reports Table */}
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
                    <tr>
                      <td colSpan="5" className="text-center">
                        No requests yet
                      </td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id}>
                        <td>{reportOptions.find(o => o.key === r.type)?.label}</td>
                        <td>{r.from}</td>
                        <td>{r.to}</td>
                        <td className={
                          r.status === "ACCEPTED" ? "text-success" :
                          r.status === "REJECTED" ? "text-danger" : ""
                        }>
                          {r.status}
                        </td>
                        <td>
                          {r.status === "ACCEPTED" && (
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={actionKey === r.type}
                              onClick={() => downloadReport(r.type, r.from, r.to)}
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </LayoutDean>
  );
};

export default MakeReportDean;
