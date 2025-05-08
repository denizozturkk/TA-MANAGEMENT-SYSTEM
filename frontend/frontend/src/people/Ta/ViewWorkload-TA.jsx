import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const ViewWorkloadTA = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const taId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const BASE = "http://localhost:8080/api";

  useEffect(() => {
    const loadApprovedDuties = async () => {
      if (!taId) {
        alert("No TA ID found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE}/duty-logs?taId=${taId}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const all = await res.json();
        const approved = all.filter(d => d.status === "APPROVED");

        const enriched = await Promise.all(
          approved.map(async d => {
            const fRes = await fetch(`${BASE}/faculty-members/${d.facultyId}`, {
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
              }
            });
            if (!fRes.ok) throw new Error("Failed to load faculty");
            const faculty = await fRes.json();
            const dateStr = new Date(d.dateTime).toLocaleDateString();
            const facultyName = `${faculty.firstName} ${faculty.lastName}`;
            return `${d.taskType} — ${dateStr} — ${facultyName}`;
          })
        );

        setItems(enriched);
      } catch (err) {
        console.error("Error loading approved duties:", err);
        alert("Error loading approved duties");
      } finally {
        setLoading(false);
      }
    };

    loadApprovedDuties();
  }, [taId, token]);

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Sidebar */}
      <div className="w-100 w-lg-auto" style={{ maxWidth: "300px" }}>
        <LayoutTA />
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-4 text-primary">Approved Duties</h4>
            {loading ? (
              <p>Loading approved duties…</p>
            ) : (
              <ul className="list-group">
                {items.length > 0 ? (
                  items.map((desc, i) => (
                    <li key={i} className="list-group-item">
                      {desc}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-center">
                    No approved duties found
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkloadTA;
