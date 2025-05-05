// src/people/Dean/Layout-Dean.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LayoutDean = ({ children }) => {
  const [open, setOpen] = useState({
    courses:    false,
    scheduling: false,
    proctoring: false,
    report:     false,
  });

  const toggle = (key) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));

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
            <NavLink to="/manage-course-data" className="mb-4 brand-icon text-white d-flex align-items-center">
              {/* …SVG here… */}
              <span className="h5 mb-0">My-Task Dean</span>
            </NavLink>

            <ul className="menu-list flex-grow-1">
              {/* Manage Course Data */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/manage-course-data" className={linkClass}>
                    Manage Course Data
                  </NavLink>
                  <button className="btn btn-link text-light p-0" onClick={() => toggle("courses")}>
                    <i className={`icofont-rounded-${open.courses ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Exam Scheduling */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/exam-scheduling" className={linkClass}>
                    Exam Scheduling
                  </NavLink>
                  <button className="btn btn-link text-light p-0" onClick={() => toggle("scheduling")}>
                    <i className={`icofont-rounded-${open.scheduling ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Assign Proctoring */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/assign-proctoring" className={linkClass}>
                    Assign Proctoring Duties
                  </NavLink>
                  <button className="btn btn-link text-light p-0" onClick={() => toggle("proctoring")}>
                    <i className={`icofont-rounded-${open.proctoring ? "up" : "down"}`} />
                  </button>
                </div>
              </li>

              {/* Make Report */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/make-report" className={linkClass}>
                    Make Report Requests
                  </NavLink>
                  <button className="btn btn-link text-light p-0" onClick={() => toggle("report")}>
                    <i className={`icofont-rounded-${open.report ? "up" : "down"}`} />
                  </button>
                </div>
              </li>
            </ul>

            <button className="btn btn-link sidebar-mini-btn text-light mt-auto">
              <i className="icofont-bubble-right" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="col-lg-9">
          <div className="container-xxl py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutDean;
