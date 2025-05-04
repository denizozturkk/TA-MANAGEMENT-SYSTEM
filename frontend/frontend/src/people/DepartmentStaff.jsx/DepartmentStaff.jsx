import React, { useState } from "react";
import DepartmentStaffLayout from "./DepartmentStaffLayout";

const initialEvaluations = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@uni.edu",
    course: "CS102",
    tutorName: "John Doe",
    communication: "Excellent",
    gradingFairness: "Very Fair",
    feedback: "Always available and fair grading."
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@uni.edu",
    course: "MATH203",
    tutorName: "Jane Roe",
    communication: "Good",
    gradingFairness: "Fair",
    feedback: "Could improve feedback timing."
  }
];

const TutorGraderEvaluations = () => {
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  return (
    <div className="d-flex">
      <div style={{ width: '300px' }}>
        <DepartmentStaffLayout />
      </div>
      <div className="container py-5 flex-grow-1">
        <div className="row align-items-center">
          <div className="border-0 mb-4">
            <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
              <h3 className="fw-bold mb-0">Tutor/Grader Evaluations</h3>
            </div>
          </div>
        </div>

        <div className="row clearfix g-3">
          <div className="col-sm-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table table-hover align-middle mb-0" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Tutor</th>
                      <th>Communication</th>
                      <th>Fairness</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluations.map((evalItem) => (
                      <tr key={evalItem.id}>
                        <td>{evalItem.name}</td>
                        <td>{evalItem.course}</td>
                        <td>{evalItem.tutorName}</td>
                        <td>{evalItem.communication}</td>
                        <td>{evalItem.gradingFairness}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#viewEvalModal"
                              onClick={() => setSelectedEvaluation(evalItem)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#approveModal"
                              onClick={() => setSelectedEvaluation(evalItem)}
                            >
                              <i className="icofont-check-circled"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#rejectModal"
                              onClick={() => setSelectedEvaluation(evalItem)}
                            >
                              <i className="icofont-close-circled"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <div className="modal fade" id="viewEvalModal" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Evaluation Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {selectedEvaluation && (
                  <>
                    <p><strong>Student:</strong> {selectedEvaluation.name} ({selectedEvaluation.email})</p>
                    <p><strong>Course:</strong> {selectedEvaluation.course}</p>
                    <p><strong>Tutor:</strong> {selectedEvaluation.tutorName}</p>
                    <p><strong>Communication:</strong> {selectedEvaluation.communication}</p>
                    <p><strong>Grading Fairness:</strong> {selectedEvaluation.gradingFairness}</p>
                    <p><strong>Feedback:</strong></p>
                    <blockquote className="blockquote border-start border-3 ps-3">
                      {selectedEvaluation.feedback}
                    </blockquote>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Approve Modal */}
        <div className="modal fade" id="approveModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve Evaluation</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to approve the evaluation for <strong>{selectedEvaluation?.tutorName}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-success">Approve</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        <div className="modal fade" id="rejectModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Evaluation</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject the evaluation for <strong>{selectedEvaluation?.tutorName}</strong>?</p>
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">Please provide a reason:</label>
                  <textarea
                    className="form-control"
                    id="rejectionReason"
                    rows="3"
                    placeholder="e.g. Inappropriate language, not valid feedback, etc."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TutorGraderEvaluations;
