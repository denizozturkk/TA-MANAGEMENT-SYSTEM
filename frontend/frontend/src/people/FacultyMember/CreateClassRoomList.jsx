import React, { useState, useEffect } from "react";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    id: "", // backend'de bu Long değil; frontend'de kullanılmıyor
    name: "",
    type: "",
    capacity: "",
    location: ""
  });
  const [showForm, setShowForm] = useState(false);

  // Backend'den classroom verilerini çek
  const fetchClassrooms = async () => {
    try {
      const res = await fetch("/api/classrooms");
      const data = await res.json();
      setClassrooms(data);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchClassrooms(); // Listeyi güncelle
        setFormData({ id: "", name: "", type: "", capacity: "", location: "" });
        setShowForm(false); // Formu kapat
      } else {
        console.error("Failed to create classroom");
      }
    } catch (err) {
      console.error("Error creating classroom:", err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Classroom Management</h2>

      <button className="btn btn-success mt-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add Classroom"}
      </button>

      {showForm && (
        <div className="card p-4 mb-5">
          <h4 className="mb-3">Create New Classroom</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Seminar Room">Seminar Room</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-9">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-4">
              Save Classroom
            </button>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h5 className="mb-3">All Classrooms</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No classrooms added yet.
                </td>
              </tr>
            ) : (
              classrooms.map((cls, index) => (
                <tr key={index}>
                  <td>{cls.name}</td>
                  <td>{cls.type}</td>
                  <td>{cls.capacity}</td>
                  <td>{cls.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassroomList;
