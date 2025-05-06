// src/people/Admin/AuthActors-Admin.jsx
import React, { useState } from "react";
import LayoutAdmin from "./Layout-Admin";

const AuthActorsAdmin = () => {
  const [actorId,      setActorId]      = useState("");
  const [authorize,    setAuthorize]    = useState(true);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [loading,      setLoading]      = useState({ auth: false, del: false });

  const token = localStorage.getItem("authToken");
  const base  = "http://localhost:8080/api/admin";

  if (!token) {
    return (
      <LayoutAdmin>
        <p className="text-danger">
          ⚠️ You must be logged in as Admin to manage actors.
        </p>
      </LayoutAdmin>
    );
  }

  // Parse JSON or text error body
  const parseError = async res => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const json = await res.json();
      return json.message ?? JSON.stringify(json);
    }
    return await res.text();
  };

  // Authorize or revoke an actor
  const handleAuthorize = async () => {
    if (!actorId) {
      alert("Please enter an Actor ID.");
      return;
    }
    setLoading(l => ({ ...l, auth: true }));
    try {
      const res = await fetch(`${base}/system/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          actorId:   Number(actorId),
          authorize: Boolean(authorize),
        }),
      });
      if (!res.ok) {
        const msg = await parseError(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      alert(`✅ Actor #${actorId} ${authorize ? "authorized" : "revoked"}.`);
      setActorId("");
    } catch (err) {
      console.error(err);
      alert(`❌ Authorization failed: ${err.message}`);
    } finally {
      setLoading(l => ({ ...l, auth: false }));
    }
  };

  // Delete a user
  const handleDelete = async () => {
    if (!deleteUserId) {
      alert("Please enter a User ID to delete.");
      return;
    }
    if (!window.confirm(`Really delete user #${deleteUserId}?`)) {
      return;
    }
    setLoading(l => ({ ...l, del: true }));
    try {
      const res = await fetch(`${base}/users/${deleteUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await parseError(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      alert(`✅ User #${deleteUserId} deleted successfully.`);
      setDeleteUserId("");
    } catch (err) {
      console.error(err);
      alert(`❌ Delete failed: ${err.message}`);
    } finally {
      setLoading(l => ({ ...l, del: false }));
    }
  };

  return (
    <LayoutAdmin>
      {/* Authorize / Revoke Actor */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-primary">Authorize Actor</h4>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Actor ID</label>
              <input
                type="number"
                className="form-control"
                value={actorId}
                onChange={e => setActorId(e.target.value)}
                disabled={loading.auth}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Action</label>
              <select
                className="form-select"
                value={authorize}
                onChange={e => setAuthorize(e.target.value === "true")}
                disabled={loading.auth}
              >
                <option value="true">Authorize</option>
                <option value="false">Revoke</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-primary w-100"
                onClick={handleAuthorize}
                disabled={loading.auth}
              >
                {loading.auth ? "Processing…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete User */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-primary">Delete User</h4>
          <div className="row g-2 align-items-end">
            <div className="col-md-8">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control"
                value={deleteUserId}
                onChange={e => setDeleteUserId(e.target.value)}
                disabled={loading.del}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleDelete}
                disabled={loading.del}
              >
                {loading.del ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AuthActorsAdmin;
