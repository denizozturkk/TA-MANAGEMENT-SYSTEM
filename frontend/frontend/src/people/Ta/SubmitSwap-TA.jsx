// src/people/TA/SubmitSwapTA.jsx
import React, { useState, useEffect } from "react";
import LayoutTA from "./Layout-TA";

const SubmitSwapTA = () => {
  const [form, setForm] = useState({ taskId: "", toTA: "", comment: "" });
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const taId = /* your TA’s ID, e.g. from context */ 123;

    fetch("/api/swap-requests")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch swaps");
        return res.json();
      })
      .then((all) => {
        setOutgoing(all.filter((r) => r.fromTa?.id === taId));
        setIncoming(all.filter((r) => r.toTa?.id === taId));
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading swap requests");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taId = /* your TA’s ID */ 123;
    setSaving(true);
    try {
      const res = await fetch(`/api/swap-requests?taId=${taId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId:  form.taskId,
          toTaId:  form.toTA,
          comment: form.comment,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setOutgoing((prev) => [created, ...prev]);
      setForm({ taskId: "", toTA: "", comment: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit swap request");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LayoutTA>
        <p>Loading…</p>
      </LayoutTA>
    );
  }

  return (
    <LayoutTA>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-4 text-primary">Submit Swap Request</h4>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Task ID</label>
              <input
                name="taskId"
                className="form-control"
                value={form.taskId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Swap With (TA ID)</label>
              <input
                name="toTA"
                className="form-control"
                value={form.toTA}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Comment</label>
              <input
                name="comment"
                className="form-control"
                value={form.comment}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? "Sending…" : "Send Swap"}
              </button>
            </div>
          </form>

          <h5 className="fw-semibold">Outgoing Swap Requests</h5>
          <table className="table table-hover w-100 mb-4">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>To TA</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No outgoing swaps
                  </td>
                </tr>
              ) : (
                outgoing.map((o) => (
                  <tr key={o.id}>
                    <td>{o.taskId}</td>
                    <td>{o.toTa?.name || o.toTaId}</td>
                    <td>{o.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h5 className="fw-semibold">Incoming Swap Requests</h5>
          <table className="table table-hover w-100">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>From TA</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {incoming.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No incoming swaps
                  </td>
                </tr>
              ) : (
                incoming.map((i) => (
                  <tr key={i.id}>
                    <td>{i.taskId}</td>
                    <td>{i.fromTa?.name}</td>
                    <td>{i.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutTA>
  );
};

export default SubmitSwapTA;
