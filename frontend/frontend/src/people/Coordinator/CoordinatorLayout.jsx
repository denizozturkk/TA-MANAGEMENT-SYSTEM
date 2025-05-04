// Sidebar.jsx
import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar px-4 py-4 py-md-5 me-0" style={{ backgroundColor: 'purple' }}>
      <div className="d-flex flex-column h-100">
        <a href="index.html" className="mb-0 brand-icon">
          <span className="logo-icon">
            <svg
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-clipboard-check"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
              />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
            </svg>
          </span>
          <span className="logo-text">My-Task</span>
        </a>
        <ul className="menu-list flex-grow-1 mt-3">
          
          
          <li className="collapsed">
            <a className="m-link" data-bs-toggle="collapse" data-bs-target="#client-Components" href="#">
              <i className="icofont-user-male"></i>
              <span>Coordinator</span>
              <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
            </a>
            <ul className="sub-menu collapse" id="client-Components">
              <li><a className="ms-link" href="ourclients.html"><span>Replace Ta</span></a></li>
            </ul>
          </li>
          <li className="collapsed">
            <a className="m-link" data-bs-toggle="collapse" data-bs-target="#extra-Components" href="#">
            <i className="icofont-user-male"></i>
            <span>Profil</span>
              <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
            </a>
            <ul className="sub-menu collapse" id="extra-Components">
              <li><a className="ms-link" href="todo-list.html"><span>Change Contact Information</span></a></li>
              <li><a className="ms-link" href="todo-list.html"><span>Change Password</span></a></li>
              <li><a className="ms-link" href="todo-list.html"><span>Notifications</span></a></li>
              <li><a className="ms-link" href="todo-list.html"><span>ViewProfile</span></a></li>
            </ul>
          </li>
        </ul>
        <button type="button" className="btn btn-link sidebar-mini-btn text-light">
          <span className="ms-2"><i className="icofont-bubble-right"></i></span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
