// src/people/TA/ViewWorkloadTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const ViewWorkloadTA = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const taId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    const loadApprovedDuties = async () => {
      if (!taId) {
        alert("No TA ID found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${BASE_URL}/duty-logs?taId=${taId}`,
          {
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const all = await res.json();
        const approved = all
          .filter((d) => d.status === "APPROVED")
          .map((d) =>
            `${d.taskType} — ${new Date(d.dateTime).toLocaleDateString()}`
          );
        setItems(approved);
      } catch (err) {
        console.error("Error loading approved duties:", err);
        alert("Error loading approved duties");
      } finally {
        setLoading(false);
      }
    };
    loadApprovedDuties();
  }, [taId, token]);

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading approved duties…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Approved Duties</h4>
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
        </div>
      </div>
    </LayoutTA>
  );
};

export default ViewWorkloadTA;
