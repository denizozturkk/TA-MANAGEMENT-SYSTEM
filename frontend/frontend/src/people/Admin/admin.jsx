import React from 'react';
import PeopleList from "../../components/PeopleList/PeopleList.jsx";
import LeaveRequest from "../../components/LeaveRequest/LeaveRequest.jsx";
import LeaderList from "../../components/LeadersList/LeaderList.jsx";
import Departments from "../../components/Departments/Departments.jsx";
import PeopleProfileFromOthers from "../../components/PeopleProfileFromOthers/PeopleProfileFromOthers.jsx";
import Workload from "../../components/WorkLoad/Workload.jsx";
import Calender from "../../components/Calender/calender.jsx";
import Attandence from "../../components/Attandence/Attandance.jsx";
import TimeSheet from "../../components/TimeSheet/TimeSheet.jsx";
import AssignProctors from '../../components/AssignProctors/AssignProctors.jsx';
const DashboardLayout = () => {
  return (
    <div className="container-xxl">
      <div className="row">
        {/* Sol taraf: Sidebar */}
        <div className="col-lg-3">
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
              {/* Menu: main ul */}
              <ul className="menu-list flex-grow-1 mt-3">
                <li className="collapsed">
                  <a
                    className="m-link active"
                    data-bs-toggle="collapse"
                    data-bs-target="#dashboard-Components"
                    href="#"
                  >
                    <i className="icofont-home fs-5"></i>{' '}
                    <span>Dashboard</span>{' '}
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {/* Menu: Sub menu ul */}
                  <ul className="sub-menu collapse show" id="dashboard-Components">
                  
                  </ul>
                </li>
                <li className="collapsed">
                  <a
                    className="m-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#project-Components"
                    href="#"
                  >
                    <i className="icofont-briefcase"></i>
                    <span>Tasks</span>{' '}
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {/* Menu: Sub menu ul */}
                  <ul className="sub-menu collapse" id="project-Components">
                    <li>
                      <a className="ms-link" href="projects.html">
                        <span>Tasks</span>
                      </a>
                    </li>
                   
                    <li>
                      <a className="ms-link" href="timesheet.html">
                        <span>Timesheet</span>
                      </a>
                    </li>
                    <li>
                      <a className="ms-link" href="team-leader.html">
                        <span>Leaders</span>
                      </a>
                    </li>
                  </ul>
                </li>
               
                <li className="collapsed">
                  <a
                    className="m-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#client-Components"
                    href="#"
                  >
                    <i className="icofont-user-male"></i>{' '}
                    <span>Faculty Members</span>{' '}
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {/* Menu: Sub menu ul */}
                  <ul className="sub-menu collapse" id="client-Components">
                    <li>
                      <a className="ms-link" href="ourclients.html">
                        <span>Faculty Members</span>
                      </a>
                    </li>
                    <li>
                      <a className="ms-link" href="profile.html">
                        <span>Faculty Member's Profile</span>
                      </a>
                    </li>
                  </ul>
                </li>
                
                <li className="collapsed">
                  <a
                    className="m-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#extra-Components"
                    href="#"
                  >
                    <i className="icofont-code-alt"></i>{' '}
                    <span>Other Pages</span>{' '}
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {/* Menu: Sub menu ul */}
                  <ul className="sub-menu collapse" id="extra-Components">
                    
                    <li>
                      <a className="ms-link" href="todo-list.html">
                        <span>Attandence</span>
                      </a>
                      <a className="ms-link" href="todo-list.html">
                        <span>Leave Request</span>
                      </a>
                      <a className="ms-link" href="todo-list.html">
                        <span>Swap Request</span>
                      </a>
                      <a className="ms-link" href="todo-list.html">
                        <span>Departments</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <button type="button" className="btn btn-link sidebar-mini-btn text-light">
                <span className="ms-2">
                  <i className="icofont-bubble-right"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Sağ taraf: PeopleList */}
        <div className="col-lg-9">
        <Departments />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
