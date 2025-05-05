// src/people/Admin/Layout-Admin.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LayoutAdmin = ({ children }) => {
  const [open, setOpen] = useState({
    actors:   false,
    requests: false,
    reports:  false,
    pending:  false,
  });
  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white fw-bold d-inline-block"
      : "text-light d-inline-block";

  return (
    <div className="container-xxl">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div
            className="sidebar px-4 py-4 py-md-5 d-flex flex-column"
            style={{ backgroundColor: "purple", minHeight: "100vh" }}
          >
            {/* Brand */}
            <NavLink
              to="/authorize-actors"
              className="mb-4 brand-icon text-white d-flex align-items-center"
            >
              <svg width="35" height="35" fill="currentColor" className="me-2">
                {/* … your SVG paths … */}
              </svg>
              <span className="h5 mb-0">My-Task Admin</span>
            </NavLink>

            <ul className="menu-list flex-grow-1">
              {/* Authorize Actors */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/authorize-actors" className={linkClass}>
                    <i className="icofont-ui-user fs-5 me-2" />
                    Authorize Actors
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("actors")}
                  >
                    <i className={`icofont-rounded-${open.actors ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Review Requests */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/review-requests" className={linkClass}>
                    <i className="icofont-file-text fs-5 me-2" />
                    Review Requests
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("requests")}
                  >
                    <i className={`icofont-rounded-${open.requests ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Generate Reports */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/make-reports" className={linkClass}>
                    <i className="icofont-chart-histogram fs-5 me-2" />
                    Generate Reports
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("reports")}
                  >
                    <i className={`icofont-rounded-${open.reports ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Pending Reports */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/pending-reports" className={linkClass}>
                    <i className="icofont-hour-glass fs-5 me-2" />
                    Pending Reports
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("pending")}
                  >
                    <i className={`icofont-rounded-${open.pending ? "up" : "down"}`} />
                  </button>
                </div>
              </li>
            </ul>

            <button className="btn btn-link sidebar-mini-btn text-light mt-auto">
              <i className="icofont-bubble-right" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="col-lg-9">
          <div className="container-xxl py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
