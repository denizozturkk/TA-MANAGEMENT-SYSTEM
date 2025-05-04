// src/people/Dean/ManageCourseData-Dean.jsx
import React, { useState } from "react";
import LayoutDean from "./Layout-Dean";

const ManageCourseDataDean = () => {
  const [courses, setCourses] = useState([
    { id: 1, code: "CS101", name: "Intro to CS", credits: 3 },
  ]);
  const [form, setForm] = useState({ code: "", name: "", credits: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = (e) => {
    e.preventDefault();
    setCourses([{ id: Date.now(), ...form }, ...courses]);
    setForm({ code: "", name: "", credits: "" });
  };

  return (
    <LayoutDean>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Manage Course Data</h4>
          <form onSubmit={handleAdd} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Course Code</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Course Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Credits</label>
              <input
                name="credits"
                type="number"
                value={form.credits}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-2 text-end">
              <button type="submit" className="btn btn-primary mt-4">
                Add / Update
              </button>
            </div>
          </form>

          <table className="table table-hover w-100">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutDean>
  );
};

export default ManageCourseDataDean;
