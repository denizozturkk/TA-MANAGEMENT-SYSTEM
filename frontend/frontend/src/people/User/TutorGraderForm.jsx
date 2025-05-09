import React, { useState } from "react";

const TutorGraderForm = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    classYear: "",
    cgpa: "",
    dept: "",
    email: "",
    mobilePhone: "",
    turkishCitizen: false,
    completedOneYear: false,
    cgpaAbove2: false,
    noDisciplinary: false,
    notOnLeave: false,
    labCourses: [],
    gradershipCourses: [],
    preferredSectionsByCourse: {},
    letterGradesByCourse: {},
    priorExperience: "",
    additionalNotes: "",
    infoConfirmed: false
  });
  const [transcript, setTranscript] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // JWT Token’ı localStorage’dan al
  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleArrayInput = (e, field) => {
    const items = e.target.value
      .split(",")
      .map(v => v.trim())
      .filter(v => v);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleMapInput = (e, field) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [name]: value.trim()
      }
    }));
  };

  const handleFileChange = (e) => {
    setTranscript(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript) {
      alert("Please enter a transcript file.");
      return;
    }

    setSubmitting(true);
    try {
      // classYear ve cgpa'yı sayıya çevir
      const payloadData = {
        ...formData,
        classYear: parseInt(formData.classYear, 10),
        cgpa: parseFloat(formData.cgpa)
      };

      const formPayload = new FormData();
      formPayload.append("data", JSON.stringify(payloadData));
      formPayload.append("transcript", transcript);

      const res = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formPayload
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(errText || "Error occurred while submitting the application.");
      }

      const created = await res.json();
      alert("Your application has been submitted successfully.");
      console.log("Application sent:", created);

      // formu sıfırla
      setFormData({
        studentId: "",
        fullName: "",
        classYear: "",
        cgpa: "",
        dept: "",
        email: "",
        mobilePhone: "",
        turkishCitizen: false,
        completedOneYear: false,
        cgpaAbove2: false,
        noDisciplinary: false,
        notOnLeave: false,
        labCourses: [],
        gradershipCourses: [],
        preferredSectionsByCourse: {},
        letterGradesByCourse: {},
        priorExperience: "",
        additionalNotes: "",
        infoConfirmed: false
      });
      setTranscript(null);
    } catch (err) {
      console.error("Error sending application:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5 p-4 bg-light rounded shadow" style={{ maxWidth: "800px" }}>
      <h3 className="mb-4">Tutor/Grader Application Form</h3>
      <form onSubmit={handleSubmit}>
        {/* Temel Bilgiler */}
        <input
          name="studentId"
          className="form-control mb-2"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
        <input
          name="fullName"
          className="form-control mb-2"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="classYear"
          type="number"
          className="form-control mb-2"
          placeholder="Class Year"
          value={formData.classYear}
          onChange={handleChange}
          required
        />
        <input
          name="cgpa"
          type="number"
          step="0.01"
          className="form-control mb-2"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleChange}
          required
        />
        <select
          name="dept"
          className="form-select mb-2"
          value={formData.dept}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="CS">CS</option>
          <option value="EE">EE</option>
          <option value="CHEM">CHEM</option>
          <option value="ME">ME</option>
        </select>
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="mobilePhone"
          className="form-control mb-2"
          placeholder="Mobile Phone"
          value={formData.mobilePhone}
          onChange={handleChange}
          required
        />

        {/* Checkbox kriterleri */}
        {[
          { name: "turkishCitizen", label: "Turkish Citizen" },
          { name: "completedOneYear", label: "Completed ≥1 Academic Year" },
          { name: "cgpaAbove2", label: "CGPA above 2.0" },
          { name: "noDisciplinary", label: "No Disciplinary Record" },
          { name: "notOnLeave", label: "Not Currently on Leave" }
        ].map(({ name, label }) => (
          <div className="form-check mb-2" key={name}>
            <input
              className="form-check-input"
              type="checkbox"
              name={name}
              checked={formData[name]}
              onChange={handleChange}
            />
            <label className="form-check-label">{label}</label>
          </div>
        ))}

        {/* Dizi Girdileri */}
        <input
          className="form-control mb-2"
          placeholder="Lab Courses (example: CS102, EE200)"
          onChange={e => handleArrayInput(e, "labCourses")}
          value={formData.labCourses.join(", ")}
        />
        <input
          className="form-control mb-2"
          placeholder="Gradership Courses (example: CS101, EE150)"
          onChange={e => handleArrayInput(e, "gradershipCourses")}
          value={formData.gradershipCourses.join(", ")}
        />

        {/* Harita Girdileri */}
        <h5 className="mt-3">Preferred Sections (Course → Section)</h5>
        <input
          className="form-control mb-2"
          name="CS102"
          placeholder="CS102 → Section"
          onChange={e => handleMapInput(e, "preferredSectionsByCourse")}
          value={formData.preferredSectionsByCourse["CS102"] || ""}
        />
        <input
          className="form-control mb-2"
          name="EE200"
          placeholder="EE200 → Section"
          onChange={e => handleMapInput(e, "preferredSectionsByCourse")}
          value={formData.preferredSectionsByCourse["EE200"] || ""}
        />

        <h5 className="mt-3">Letter Grades (Course → Grade)</h5>
        <input
          className="form-control mb-2"
          name="CS102"
          placeholder="CS102 → Grade (example: A-)"
          onChange={e => handleMapInput(e, "letterGradesByCourse")}
          value={formData.letterGradesByCourse["CS102"] || ""}
        />
        <input
          className="form-control mb-2"
          name="EE200"
          placeholder="EE200 → Grade (example: B+)"
          onChange={e => handleMapInput(e, "letterGradesByCourse")}
          value={formData.letterGradesByCourse["EE200"] || ""}
        />

        {/* Serbest Metin */}
        <textarea
          className="form-control mb-2"
          name="priorExperience"
          placeholder="Prior Experience"
          rows="3"
          value={formData.priorExperience}
          onChange={handleChange}
        />
        <textarea
          className="form-control mb-2"
          name="additionalNotes"
          placeholder="Additional Notes"
          rows="3"
          value={formData.additionalNotes}
          onChange={handleChange}
        />

        {/* Onay Checkbox */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="infoConfirmed"
            checked={formData.infoConfirmed}
            onChange={handleChange}
            required
          />
          <label className="form-check-label">I confirm all information is correct</label>
        </div>

        {/* Transkript Yükleme */}
        <div className="mb-3">
          <label className="form-label">Upload Transcript (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Sent"}
        </button>
      </form>
    </div>
  );
};

export default TutorGraderForm;
