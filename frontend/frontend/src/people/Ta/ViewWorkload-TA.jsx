// src/people/TA/ViewWorkloadTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const ViewWorkloadTA = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // obtain current TA’s ID however your app provides it
    const taId = /* e.g. from context or props */ 123;

    fetch("/api/proctor-assignments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((all) => {
        // keep only this TA’s assignments
        const mine = all
          .filter((pa) => pa.assignedTA?.id === taId)
          .map((pa) =>
            `${pa.courseCode} — ${new Date(pa.date).toLocaleDateString()}`
          );
        setItems(mine);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading workload");
      })
      .finally(() => setLoading(false));
  }, []);

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
          <h4 className="fw-bold mb-4 text-primary">
            Assist Courses / Workload
          </h4>
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
