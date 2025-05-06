// src/people/TA/ViewWorkloadTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const ViewWorkloadTA = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Grab TA ID & token from localStorage
  const taId  = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadWorkload = async () => {
      if (!taId) {
        alert("No TA ID found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:8080/api/proctor-assignments",
          {
            headers: {
              "Accept":        "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(res.statusText);
        const all = await res.json();

        // Filter down to only this TA’s assignments
        const mine = all
          .filter((pa) => String(pa.assignedTA?.id) === taId)
          .map((pa) =>
            `${pa.courseCode} — ${new Date(pa.date).toLocaleDateString()}`
          );

        setItems(mine);
      } catch (err) {
        console.error("Error loading workload:", err);
        alert("Error loading workload");
      } finally {
        setLoading(false);
      }
    };

    loadWorkload();
  }, [taId, token]);

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading workload…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Assist Courses / Workload</h4>
          <ul className="list-group">
            {items.length > 0 ? (
              items.map((desc, i) => (
                <li key={i} className="list-group-item">
                  {desc}
                </li>
              ))
            ) : (
              <li className="list-group-item text-center">
                No workload assigned
              </li>
            )}
          </ul>
        </div>
      </div>
    </LayoutTA>
  );
};

export default ViewWorkloadTA;
