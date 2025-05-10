// src/people/Dean/DeanLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const DeanLayout = () => (
  <>
    {/* Mobile toggle button (right side, custom color) */}
    <button
      className="btn btn-link d-md-none p-2 position-fixed"
      style={{
        top: '1rem',
        right: '1rem',
        zIndex: 1050,
        color: '#2a2d62',
      }}
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#mobileSidebar"
      aria-controls="mobileSidebar"
      aria-label="Toggle sidebar"
    >
      <i className="icofont-navigation-menu fs-3"></i>
    </button>

    {/* Mobile Sidebar */}
    <div
      className="offcanvas offcanvas-start d-md-none text-light"
      tabIndex="-1"
      id="mobileSidebar"
      aria-labelledby="mobileSidebarLabel"
      style={{ backgroundColor: '#2D2A62', width: '240px' }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-light" id="mobileSidebarLabel">
          Dean Panel
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body p-0">
        <ul className="menu-list list-unstyled mb-0">
          <li>
            <Link
              className="ms-link text-light d-block py-3 px-3"
              to="/manage-course-data"
            >
              Manage Course Data
            </Link>
          </li>
          <li>
            <Link
              className="ms-link text-light d-block py-3 px-3"
              to="/exam-scheduling"
            >
              Exam Scheduling
            </Link>
          </li>
          <li>
            <Link
              className="ms-link text-light d-block py-3 px-3"
              to="/assign-proctoring"
            >
              Assign Proctoring
            </Link>
          </li>
          <li>
            <Link
              className="ms-link text-light d-block py-3 px-3"
              to="/make-report"
            >
              Make Report
            </Link>
          </li>
          <li>
            <Link
              className="ms-link text-light d-block py-3 px-3"
              to="/reschedule-exam"
            >
              Reschedule Exam
            </Link>
          </li>

          <li className="border-top">
            <button
              className="m-link text-light d-flex align-items-center px-3 py-3 w-100 bg-transparent border-0 text-start"
              data-bs-toggle="collapse"
              data-bs-target="#profileMenuMobile"
              aria-expanded="false"
              aria-controls="profileMenuMobile"
              type="button"
            >
              <i className="icofont-user-alt-2 me-2"></i>My Profile
              <i className="icofont-dotted-down ms-auto"></i>
            </button>
            <ul className="collapse ms-4" id="profileMenuMobile">
              <li>
                <Link
                  className="ms-link text-light d-block py-2"
                  to="/changecontactinformation"
                >
                  Change Contact Info
                </Link>
              </li>
              <li>
                <Link
                  className="ms-link text-light d-block py-2"
                  to="/changepassword"
                >
                  Change Password
                </Link>
              </li>
              <li>
                <Link
                  className="ms-link text-light d-block py-2"
                  to="/notification"
                >
                  Notifications
                </Link>
              </li>
              <li>
                <Link
                  className="ms-link text-light d-block py-2"
                  to="/viewprofile"
                >
                  View Profile
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    {/* Desktop Sidebar */}
    <aside
      className="sidebar d-none d-md-flex flex-column px-4 py-4 py-md-5"
      style={{ backgroundColor: '#2D2A62', width: '240px' }}
    >
      <style>{`
        .sidebar .menu-list .ms-link:hover {
          background-color: #E31B23 !important;
          color: #FFFFFF !important;
        }
        .sidebar .m-link:hover {
          color: #E31B23 !important;
        }
        .sidebar .ms-link,
        .sidebar .m-link {
          transition: background-color 0.2s, color 0.2s;
        }
      `}</style>

      <Link to="/" className="mb-4 text-light d-flex align-items-center">
        <span className="logo-icon me-2">
          <svg
            width="35"
            height="35"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
            />
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          </svg>
        </span>
        <span className="logo-text fs-5">Dean Panel</span>
      </Link>

      <ul className="menu-list flex-grow-1 list-unstyled">
        <li>
          <Link
            className="ms-link text-light d-block py-2 px-2"
            to="/manage-course-data"
          >
            Manage Course Data
          </Link>
        </li>
        <li>
          <Link
            className="ms-link text-light d-block py-2 px-2"
            to="/exam-scheduling"
          >
            Exam Scheduling
          </Link>
        </li>
        <li>
          <Link
            className="ms-link text-light d-block py-2 px-2"
            to="/assign-proctoring"
          >
            Assign Proctoring
          </Link>
        </li>
        <li>
          <Link
            className="ms-link text-light d-block py-2 px-2"
            to="/make-report"
          >
            Make Report
          </Link>
        </li>
        <li>
          <Link
            className="ms-link text-light d-block py-2 px-2"
            to="/reschedule-exam"
          >
            Reschedule Exam
          </Link>
        </li>

        <li className="mt-3">
          <button
            className="m-link text-light d-flex align-items-center mb-2 w-100 bg-transparent border-0 text-start"
            data-bs-toggle="collapse"
            data-bs-target="#profileMenuDesktop"
            aria-expanded="false"
            aria-controls="profileMenuDesktop"
            type="button"
          >
            <i className="icofont-user-alt-2 me-2"></i>My Profile
            <span className="arrow icofont-dotted-down ms-auto fs-5"></span>
          </button>
          <ul className="collapse sub-menu" id="profileMenuDesktop">
            <li>
              <Link
                className="ms-link text-light d-block py-1 px-2"
                to="/changecontactinformation"
              >
                Change Contact Info
              </Link>
            </li>
            <li>
              <Link
                className="ms-link text-light d-block py-1 px-2"
                to="/changepassword"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link
                className="ms-link text-light d-block py-1 px-2"
                to="/notification"
              >
                Notifications
              </Link>
            </li>
            <li>
              <Link
                className="ms-link text-light d-block py-1 px-2"
                to="/viewprofile"
              >
                View Profile
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      <button
        type="button"
        className="btn btn-link sidebar-mini-btn text-light mt-auto"
        onClick={() => {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }}
      >
        <i className="icofont-bubble-right"></i>
      </button>
    </aside>
  </>
);

export default DeanLayout;
