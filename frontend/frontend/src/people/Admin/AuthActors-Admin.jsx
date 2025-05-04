// src/people/Admin/AuthActors-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

const AuthActorsAdmin = () => {
  const [actors, setActors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all actors on mount
  useEffect(() => {
    const loadActors = async () => {
      try {
        const res = await fetch("/api/admin/actors");
        if (!res.ok) throw new Error("Failed to fetch actors");
        const data = await res.json();
        setActors(data);
      } catch (err) {
        console.error(err);
        alert("Error loading actors");
      }
    };
    loadActors();
  }, []);

  const toggleAuth = async (actor) => {
    setLoadingId(actor.id);
    try {
      await fetch("/api/admin/system/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actorId: actor.id,
          authorize: !actor.authorized,
        }),
      });
      // Flip locally
      setActors((prev) =>
        prev.map((a) =>
          a.id === actor.id ? { ...a, authorized: !a.authorized } : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update authorization");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <LayoutAdmin>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Authorize Actors</h4>
          <table className="table table-hover align-middle w-100">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Authorization</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((actor) => (
                <tr key={actor.id}>
                  <td>{actor.name}</td>
                  <td>{actor.role}</td>
                  <td>
                    <button
                      className={
                        actor.authorized
                          ? "btn btn-sm btn-success"
                          : "btn btn-sm btn-outline-secondary"
                      }
                      disabled={loadingId === actor.id}
                      onClick={() => toggleAuth(actor)}
                    >
                      {loadingId === actor.id
                        ? "..."
                        : actor.authorized
                        ? "Revoke"
                        : "Authorize"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AuthActorsAdmin;
