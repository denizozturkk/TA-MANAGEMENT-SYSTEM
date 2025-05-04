import React, { useState } from "react";

const TutorGraderForm = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    classYear: 1,
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleArrayInput = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value.split(",").map(v => v.trim())
    }));
  };

  const handleMapInput = (e, field) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [name]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    setTranscript(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!transcript) {
      alert("Please upload your transcript.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("data", JSON.stringify(formData));
    formPayload.append("transcript", transcript);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formPayload
      });

      if (!res.ok) throw new Error("Failed to submit application");

      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission error.");
    }
  };

  return (
    <div className="container my-5 p-4 bg-light rounded shadow" style={{ maxWidth: "800px" }}>
      <h3 className="mb-4">Tutor/Grader Application Form</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="studentId" placeholder="Student ID" onChange={handleChange} required />
        <input className="form-control mb-2" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input className="form-control mb-2" name="classYear" type="number" placeholder="Class Year" onChange={handleChange} required />
        <input className="form-control mb-2" name="cgpa" type="number" step="0.01" placeholder="CGPA" onChange={handleChange} required />
        <select className="form-select mb-2" name="dept" onChange={handleChange} required>
          <option value="">Select Department</option>
          <option value="CS">CS</option>
          <option value="EE">EE</option>
          <option value="CHEM">CHEM</option>
          <option value="ME">ME</option>
          {/* Ek departmanlar */}
        </select>
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="form-control mb-2" name="mobilePhone" placeholder="Mobile Phone" onChange={handleChange} required />

        <div className="form-check mb-1">
          <input className="form-check-input" type="checkbox" name="turkishCitizen" onChange={handleChange} />
          <label className="form-check-label">Turkish Citizen</label>
        </div>
        <div className="form-check mb-1">
          <input className="form-check-input" type="checkbox" name="completedOneYear" onChange={handleChange} />
          <label className="form-check-label">Completed at least one academic year</label>
        </div>
        <div className="form-check mb-1">
          <input className="form-check-input" type="checkbox" name="cgpaAbove2" onChange={handleChange} />
          <label className="form-check-label">CGPA above 2.0</label>
        </div>
        <div className="form-check mb-1">
          <input className="form-check-input" type="checkbox" name="noDisciplinary" onChange={handleChange} />
          <label className="form-check-label">No disciplinary record</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="notOnLeave" onChange={handleChange} />
          <label className="form-check-label">Not currently on leave</label>
        </div>

        <input className="form-control mb-2" placeholder="Lab Courses (e.g. CS102,EE200)" onChange={(e) => handleArrayInput(e, "labCourses")} />
        <input className="form-control mb-2" placeholder="Gradership Courses (e.g. CS101,EE150)" onChange={(e) => handleArrayInput(e, "gradershipCourses")} />

        <h5 className="mt-3">Preferred Sections (Course → Section)</h5>
        <input className="form-control mb-2" name="CS102" placeholder="CS102 → Section" onChange={(e) => handleMapInput(e, "preferredSectionsByCourse")} />
        <input className="form-control mb-2" name="EE200" placeholder="EE200 → Section" onChange={(e) => handleMapInput(e, "preferredSectionsByCourse")} />

        <h5 className="mt-3">Letter Grades (Course → Grade)</h5>
        <input className="form-control mb-2" name="CS102" placeholder="CS102 → Grade (e.g. A-)" onChange={(e) => handleMapInput(e, "letterGradesByCourse")} />
        <input className="form-control mb-2" name="EE200" placeholder="EE200 → Grade (e.g. B+)" onChange={(e) => handleMapInput(e, "letterGradesByCourse")} />

        <textarea className="form-control mb-2" name="priorExperience" placeholder="Prior Experience" rows="3" onChange={handleChange}></textarea>
        <textarea className="form-control mb-2" name="additionalNotes" placeholder="Additional Notes" rows="3" onChange={handleChange}></textarea>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="infoConfirmed" onChange={handleChange} required />
          <label className="form-check-label">I confirm all information is correct</label>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Transcript (PDF)</label>
          <input type="file" className="form-control" accept=".pdf" onChange={handleFileChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Submit Application</button>
      </form>
    </div>
  );
};

export default TutorGraderForm;
