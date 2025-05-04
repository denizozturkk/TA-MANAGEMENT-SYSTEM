// src/people/Dean/Dean.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Dean = () => {
  const [open, setOpen] = useState({
    courses: false,
    scheduling: false,
    proctoring: false,
    department: false,
    report: false,
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
            className="sidebar px-4 py-4 py-md-5 me-0 d-flex flex-column"
            style={{ backgroundColor: "purple", minHeight: "100vh" }}
          >
            <a
              href="/dean"
              className="mb-4 brand-icon text-white d-flex align-items-center"
            >
              {/* Put your SVG here */}
              <span className="h5 mb-0">My-Task Dean</span>
            </a>

            <ul className="menu-list flex-grow-1">

              {/* Manage Course Data */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/dean/manage-courses" className={linkClass}>
                    Manage Course Data
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("courses")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.courses ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.courses && (
                  <ul className="ps-3 mt-2">
                    <li>
                      <NavLink
                        to="/dean/manage-courses"
                        className={linkClass}
                      >
                        View / Edit Courses
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Exam Scheduling */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink
                    to="/dean/exam-scheduling"
                    className={linkClass}
                  >
                    Exam Scheduling
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("scheduling")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.scheduling ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.scheduling && (
                  <ul className="ps-3 mt-2">
                    <li>
                      <NavLink
                        to="/dean/exam-scheduling"
                        className={linkClass}
                      >
                        Schedule Exams
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Assign Proctoring Duties */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink
                    to="/dean/assign-proctoring"
                    className={linkClass}
                  >
                    Assign Proctoring Duties
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("proctoring")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.proctoring ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.proctoring && (
                  <ul className="ps-3 mt-2">
                    <li>
                      <NavLink
                        to="/dean/assign-proctoring"
                        className={linkClass}
                      >
                        View / Assign
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>


              {/* Make Report Requests */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/dean/make-report" className={linkClass}>
                    Make Report Requests
                  </NavLink>
                  <button
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("report")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.report ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.report && (
                  <ul className="ps-3 mt-2">
                    <li>
                      <NavLink
                        to="/dean/make-report"
                        className={linkClass}
                      >
                        Generate Report
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-link sidebar-mini-btn text-light mt-auto"
            >
              <i className="icofont-bubble-right"></i>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="col-lg-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dean;
