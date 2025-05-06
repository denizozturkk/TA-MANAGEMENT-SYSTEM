// src/people/Admin/AuthActors-Admin.jsx
import React, { useState, useEffect } from "react";
import LayoutAdmin from "./Layout-Admin";

// Rol seçenekleri enum’dan birebir çekilebilir; burada örnek olarak sabit liste kullandım.
const ROLE_OPTIONS = [
  "ROLE_TA",
  "ROLE_FACULTY_MEMBER",
  "ROLE_COORDINATOR",
  "ROLE_DEAN",
  "ROLE_ADMIN",
  "ROLE_DEPARTMENT_STAFF"
];

const AuthActorsAdmin = () => {
  const [actorId,   setActorId]   = useState("");
  const [newRole,   setNewRole]   = useState(ROLE_OPTIONS[0]);
  const [deleteId,  setDeleteId]  = useState("");
  const [loading,   setLoading]   = useState({ auth: false, del: false });
  const token = localStorage.getItem("authToken");
  const base  = "http://localhost:8080/api/admin";

  if (!token) {
    return (
      <LayoutAdmin>
        <p className="text-danger">
          ⚠️ Admin olarak giriş yapmalısınız.
        </p>
      </LayoutAdmin>
    );
  }

  const parseError = async res => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const json = await res.json();
      return json.message ?? JSON.stringify(json);
    }
    return await res.text();
  };

  const handleAuthorize = async () => {
    if (!actorId) {
      alert("Lütfen Actor ID girin.");
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
          userId:  Number(actorId),
          newRole: newRole
        }),
      });
      if (!res.ok) {
        const msg = await parseError(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      alert(`✅ Actor #${actorId} rolü '${newRole}' olarak güncellendi.`);
      setActorId("");
    } catch (err) {
      console.error(err);
      alert(`❌ Yetkilendirme başarısız: ${err.message}`);
    } finally {
      setLoading(l => ({ ...l, auth: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) {
      alert("Lütfen silinecek User ID girin.");
      return;
    }
    if (!window.confirm(`User #${deleteId} gerçekten silinsin mi?`)) {
      return;
    }
    setLoading(l => ({ ...l, del: true }));
    try {
      const res = await fetch(`${base}/users/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await parseError(res);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      alert(`✅ User #${deleteId} başarıyla silindi.`);
      setDeleteId("");
    } catch (err) {
      console.error(err);
      alert(`❌ Silme başarısız: ${err.message}`);
    } finally {
      setLoading(l => ({ ...l, del: false }));
    }
  };

  return (
    <LayoutAdmin>
      {/* Yetkilendirme */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-primary">Actor Yetkilendir / Rol Değiştir</h4>
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
              <label className="form-label">Yeni Rol</label>
              <select
                className="form-select"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                disabled={loading.auth}
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r} value={r}>{r.replace("ROLE_", "")}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-primary w-100"
                onClick={handleAuthorize}
                disabled={loading.auth}
              >
                {loading.auth ? "İşleniyor…" : "Gönder"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kullanıcı Silme */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-primary">User Sil</h4>
          <div className="row g-2 align-items-end">
            <div className="col-md-8">
              <label className="form-label">User ID</label>
              <input
                type="number"
                className="form-control"
                value={deleteId}
                onChange={e => setDeleteId(e.target.value)}
                disabled={loading.del}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-danger w-100"
                onClick={handleDelete}
                disabled={loading.del}
              >
                {loading.del ? "Siliniyor…" : "Sil"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AuthActorsAdmin;
