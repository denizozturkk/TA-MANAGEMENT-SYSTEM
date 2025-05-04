import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const TA = () => {
  const [open, setOpen] = useState({
    workload: false,
    leave: false,
    swap: false,
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
            {/* Brand */}
            <a
              href="/ta"
              className="mb-4 brand-icon text-white d-flex align-items-center"
            >
              <svg
                width="35"
                height="35"
                fill="currentColor"
                className="me-2"
                viewBox="0 0 16 16"
              >
                {/* …SVG paths… */}
              </svg>
              <span className="h5 mb-0">My-Task TA</span>
            </a>

            <ul className="menu-list flex-grow-1">
              {/* ─────────── Workload ─────────── */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/ta/workload/view" className={linkClass}>
                    <i className="icofont-hour-glass fs-5 me-2"></i>
                    Workload
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("workload")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.workload ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.workload && (
                  <ul className="ps-3 mt-2">
                    <li className="mb-1">
                      <NavLink to="/ta/workload/view" className={linkClass}>
                        View Workload
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/ta/workload/report" className={linkClass}>
                        Report Workload
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* ─────────── Leave ─────────── */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/ta/leave" className={linkClass}>
                    <i className="icofont-leave fs-5 me-2"></i>
                    Leave
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("leave")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.leave ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.leave && (
                  <ul className="ps-3 mt-2">
                    <li className="mb-1">
                      <NavLink to="/ta/leave" className={linkClass}>
                        Submit Leave
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/ta/leave" className={linkClass}>
                        View Leave Requests
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* ─────────── Swap ─────────── */}
              <li className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/ta/swap" className={linkClass}>
                    <i className="icofont-exchange fs-5 me-2"></i>
                    Swap
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-link text-light p-0"
                    onClick={() => toggle("swap")}
                  >
                    <i
                      className={`icofont-rounded-${
                        open.swap ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {open.swap && (
                  <ul className="ps-3 mt-2">
                    <li className="mb-1">
                      <NavLink to="/ta/swap" className={linkClass}>
                        Submit Swap
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/ta/swap" className={linkClass}>
                        View Swap Requests
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* ─────────── Past Tasks ─────────── */}
              <li className="mb-3">
                <NavLink to="/ta/past-tasks" className={linkClass}>
                  <i className="icofont-history fs-5 me-2"></i>
                  Past Tasks
                </NavLink>
              </li>

              {/* ─────────── Calendar ─────────── */}
              <li className="mb-3">
                <NavLink to="/ta/calendar" className={linkClass}>
                  <i className="icofont-calendar fs-5 me-2"></i>
                  Calendar
                </NavLink>
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

export default TA;
