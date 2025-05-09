// src/people/User/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <>
    {/* Mobile toggle button */}
    <button
      className="btn btn-link text-light d-md-none p-2 position-fixed"
      style={{ top: '1rem', left: '1rem', zIndex: 1050 }}
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#mobileSidebar"
      aria-controls="mobileSidebar"
      aria-label="Toggle sidebar"
    >
      <i className="icofont-navigation-menu fs-3"></i>
    </button>

    {/* Mobile Offcanvas Sidebar */}
    <div
      className="offcanvas offcanvas-start d-md-none text-light"
      tabIndex="-1"
      id="mobileSidebar"
      aria-labelledby="mobileSidebarLabel"
      style={{ backgroundColor: '#2D2A62', width: '240px' }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-light" id="mobileSidebarLabel">My-Task</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body p-0">
        <ul className="menu-list list-unstyled mb-0">

          {/* Coordinator Panel - Mobile */}
          <li className="border-bottom">
            <a
              className="m-link text-light d-flex align-items-center p-3"
              data-bs-toggle="collapse"
              data-bs-target="#coordinatorMenuMobile"
              href="#"
            >
              <i className="icofont-briefcase me-2"></i>Coordinator Panel
              <i className="icofont-dotted-down ms-auto"></i>
            </a>
            <ul className="collapse ms-4" id="coordinatorMenuMobile">
              <li><Link className="ms-link text-light d-block py-2" to="/manageexamclassroom">Manage Exam Classrooms</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/swapduties">Swap Duties</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/replaceduties">Replace Duties</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/swapprocturing">Swap Proctor</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/replaceprocturing">Replace Proctor</Link></li>
            </ul>
          </li>

          {/* Excel Upload Panel - Mobile */}
          <li className="border-bottom">
            <a
              className="m-link text-light d-flex align-items-center p-3"
              data-bs-toggle="collapse"
              data-bs-target="#excelMenuMobile"
              href="#"
            >
              <i className="icofont-upload me-2"></i>Upload Excel Files
              <i className="icofont-dotted-down ms-auto"></i>
            </a>
            <ul className="collapse ms-4" id="excelMenuMobile">
              <li><Link className="ms-link text-light d-block py-2" to="/excelta">TA Excel</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/excelfacultymember">Faculty Member Excel</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/excelstudent">Student Excel</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/excelofferings">Offerings Excel</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/excelcourse">Course Excel</Link></li>
            </ul>
          </li>

          {/* My Profile - Mobile */}
          <li className="border-bottom">
            <a
              className="m-link text-light d-flex align-items-center p-3"
              data-bs-toggle="collapse"
              data-bs-target="#profileMenuMobile"
              href="#"
            >
              <i className="icofont-user-alt-2 me-2"></i>My Profile
              <i className="icofont-dotted-down ms-auto"></i>
            </a>
            <ul className="collapse ms-4" id="profileMenuMobile">
              <li><Link className="ms-link text-light d-block py-2" to="/changecontactinformation">Change Contact Info</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/changepassword">Change Password</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/notification">Notifications</Link></li>
              <li><Link className="ms-link text-light d-block py-2" to="/viewprofile">View Profile</Link></li>
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
          <svg width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
          </svg>
        </span>
        <span className="logo-text fs-5">My-Task</span>
      </Link>

      <ul className="menu-list flex-grow-1 list-unstyled">
        {/* Coordinator Panel - Desktop */}
        <li className="collapsed mt-3">
          <a className="m-link text-light d-flex align-items-center mb-2" data-bs-toggle="collapse" data-bs-target="#coordinatorMenuDesktop" href="#">
            <i className="icofont-briefcase me-2"></i>Coordinator Panel
            <span className="arrow icofont-dotted-down ms-auto fs-5"></span>
          </a>
          <ul className="collapse sub-menu" id="coordinatorMenuDesktop">
            <li><Link className="ms-link text-light d-block py-2" to="/manageexamclassroom">Manage Exam Classrooms</Link></li>
            <li><Link className="ms-link text-light d-block py-2" to="/swapduties">Swap Duties</Link></li>
            <li><Link className="ms-link text-light d-block py-2" to="/replaceduties">Replace Duties</Link></li>
            <li><Link className="ms-link text-light d-block py-2" to="/swapprocturing">Swap Proctor</Link></li>
            <li><Link className="ms-link text-light d-block py-2" to="/replaceprocturing">Replace Proctor</Link></li>
          </ul>
        </li>

        {/* Upload Excel Panel - Desktop */}
        <li className="collapsed mt-3">
          <a className="m-link text-light d-flex align-items-center mb-2" data-bs-toggle="collapse" data-bs-target="#excelMenuDesktop" href="#">
            <i className="icofont-upload me-2"></i>Upload Excel Files
            <span className="arrow icofont-dotted-down ms-auto fs-5"></span>
          </a>
          <ul className="collapse sub-menu" id="excelMenuDesktop">
            <li><Link className="ms-link text-light d-block py-1 px-3" to="/excelta">TA Excel</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-3" to="/excelfacultymember">Faculty Member Excel</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-3" to="/excelstudent">Student Excel</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-3" to="/excelofferings">Offerings Excel</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-3" to="/excelcourse">Course Excel</Link></li>
          </ul>
        </li>

        {/* My Profile - Desktop */}
        <li className="collapsed mt-3">
          <a className="m-link text-light d-flex align-items-center mb-2" data-bs-toggle="collapse" data-bs-target="#profileMenuDesktop" href="#">
            <i className="icofont-user-alt-2 me-2"></i>My Profile
            <span className="arrow icofont-dotted-down ms-auto fs-5"></span>
          </a>
          <ul className="collapse sub-menu" id="profileMenuDesktop">
            <li><Link className="ms-link text-light d-block py-1 px-2" to="/changecontactinformation">Change Contact Info</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-2" to="/changepassword">Change Password</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-2" to="/notification">Notifications</Link></li>
            <li><Link className="ms-link text-light d-block py-1 px-2" to="/viewprofile">View Profile</Link></li>
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

export default Sidebar;
