import React from "react";
import InstructorLayout from "./InstructorLayout";

const workloadData = [
  {
    id: "EMP-00001",
    name: "Joan Dyer",
    avatar: "assets/images/xs/avatar1.jpg",
    task: "Lecture Planning",
    from: "12/03/2024",
    to: "14/03/2024",
    reason: "Content Revision for Midterm"
  },
  {
    id: "EMP-00038",
    name: "Ryan Randall",
    avatar: "assets/images/xs/avatar2.jpg",
    task: "Grading",
    from: "11/04/2024",
    to: "12/04/2024",
    reason: "Quiz 3 Assessment"
  },
  {
    id: "EMP-00007",
    name: "Phil Glover",
    avatar: "assets/images/xs/avatar3.jpg",
    task: "Project Review",
    from: "11/04/2024",
    to: "12/04/2024",
    reason: "Final Project Evaluations"
  },
  {
    id: "EMP-00010",
    name: "Victor Rampling",
    avatar: "assets/images/xs/avatar4.jpg",
    task: "Research",
    from: "28/04/2024",
    to: "30/04/2024",
    reason: "Conference Paper Preparation"
  },
  {
    id: "EMP-00002",
    name: "Sally Graham",
    avatar: "assets/images/xs/avatar5.jpg",
    task: "Mentorship",
    from: "01/05/2024",
    to: "06/05/2024",
    reason: "Student Thesis Mentoring"
  }
];

const ReviewWorkload = () => {
  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <InstructorLayout />
      </div>

      <div className="container-xxl py-4 flex-grow-1">
        <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold mb-0">Review Workload</h3>
          <div className="col-auto d-flex w-sm-100">
            <button type="button" className="btn btn-dark w-sm-100" data-bs-toggle="modal" data-bs-target="#addTaskModal">
              <i className="icofont-plus-circle me-2 fs-6"></i>Add Workload
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <table className="table table-hover align-middle mb-0" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Task</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workloadData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <a href="#" className="fw-bold text-secondary">
                        #{item.id}
                      </a>
                    </td>
                    <td>
                      <img className="avatar rounded-circle" src={item.avatar} alt="" />
                      <span className="fw-bold ms-1">{item.name}</span>
                    </td>
                    <td>{item.task}</td>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                    <td>{item.reason}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          data-bs-toggle="modal"
                          data-bs-target="#approveModal"
                        >
                          <i className="icofont-check-circled"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#rejectModal"
                        >
                          <i className="icofont-close-circled"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Approve Modal */}
            <div className="modal fade" id="approveModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Approve Workload</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">Are you sure you want to approve this workload?</div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button className="btn btn-success">Approve</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reject Modal */}
            <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="rejectModalLabel">Reject Workload</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to reject this workload?</p>
                    <div className="mb-3">
                      <label htmlFor="rejectionReason" className="form-label">Please provide a reason:</label>
                      <textarea
                        className="form-control"
                        id="rejectionReason"
                        rows="3"
                        placeholder="e.g. Task timing conflict, insufficient justification, etc."
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
      </div>
    </div>
  );
};

export default ReviewWorkload;
