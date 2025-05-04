import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="main px-lg-4 px-md-4">
      {/* Body: Header */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl">
            {/* header rightbar icon */}
            <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
              <div className="d-flex">
               
                <div className="avatar-list avatar-list-stacked px-3">
               
                  <span
                    className="avatar rounded-circle text-center pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#addUser"
                  >
                    <i className="icofont-ui-add"></i>
                  </span>
                </div>
              </div>
              <div className="dropdown notifications">
                <a className="nav-link dropdown-toggle pulse" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="icofont-alarm fs-5"></i>
                  <span className="pulse-ring"></span>
                </a>
                <div id="NotificationsDiv" className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0">
                  <div className="card border-0 w380">
                    <div className="card-header border-0 p-3">
                      <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                        <span>Notifications</span>
                        <span className="badge text-white">11</span>
                      </h5>
                    </div>
                    <div className="tab-content card-body">
                      <div className="tab-pane fade show active">
                        <ul className="list-unstyled list mb-0">
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar1.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Dylan Hunter</span> <small>2MIN</small>
                                </p>
                                <span>
                                  Added 2021-02-19 my-Task ui/ux Design{' '}
                                  <span className="badge bg-success">Review</span>
                                </span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              <div className="avatar rounded-circle no-thumbnail">DF</div>
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Diane Fisher</span> <small>13MIN</small>
                                </p>
                                <span>Task added Get Started with Fast Cad project</span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar3.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Andrea Gill</span> <small>1HR</small>
                                </p>
                                <span>Quality Assurance Task Completed</span>
                              </div>
                            </a>
                          </li>
                          {/* Diğer notification örnekleri */}
                        </ul>
                      </div>
                    </div>
                    <a className="card-footer text-center border-top-0" href="#">View all notifications</a>
                  </div>
                </div>
              </div>
              <div className="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center">
                <div className="u-info me-2">
                  <p className="mb-0 text-end line-height-sm">
                    <span className="font-weight-bold">Anıl Yeşil</span>
                  </p>
                  <small>TA</small>
                </div>
                <a
                  className="nav-link dropdown-toggle pulse p-0"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                >
                  <img className="avatar lg rounded-circle img-thumbnail"                                 src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
alt="profile" />
                </a>
                <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                  <div className="card border-0 w280">
                    <div className="card-body pb-0">
                      <div className="d-flex py-1">
                        <img className="avatar rounded-circle" src="assets/images/profile_av.png" alt="profile" />
                        <div className="flex-fill ms-3">
                          <p className="mb-0">
                            <span className="font-weight-bold">Dylan Hunter</span>
                          </p>
                          <small>Dylan.hunter@gmail.com</small>
                        </div>
                      </div>
                      <div>
                        <hr className="dropdown-divider border-dark" />
                      </div>
                    </div>
                    <div className="list-group m-2">
                      <a href="task.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-tasks fs-5 me-3"></i>My Task
                      </a>
                      <a href="members.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-ui-user-group fs-6 me-3"></i>members
                      </a>
                      <a href="ui-elements/auth-signin.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-logout fs-6 me-3"></i>Signout
                      </a>
                      <div>
                        <hr className="dropdown-divider border-dark" />
                      </div>
                      <a href="ui-elements/auth-signup.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-contact-add fs-5 me-3"></i>Add personal account
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-md-1">
                <a href="#offcanvas_setting" data-bs-toggle="offcanvas" aria-expanded="false" title="template setting">
                  <svg
                    className="svg-stroke"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  </svg>
                </a>
              </div>
            </div>
    
            {/* menu toggler */}
            <button className="navbar-toggler p-0 border-0 menu-toggle order-3" type="button" data-bs-toggle="collapse" data-bs-target="#mainHeader">
              <span className="fa fa-bars"></span>
            </button>
    
            {/* main menu Search*/}
            <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
              <div className="input-group flex-nowrap input-group-lg">
                <button type="button" className="input-group-text" id="addon-wrapping">
                  <i className="fa fa-search"></i>
                </button>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  aria-label="search"
                  aria-describedby="addon-wrapping"
                />
                <button
                  type="button"
                  className="input-group-text add-member-top"
                  id="addon-wrappingone"
                  data-bs-toggle="modal"
                  data-bs-target="#addUser"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
    
          </div>
        </nav>
      </div>
    
      {/* Body: Body */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          {/* Employee Profile Header */}
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card border-0 mb-4 no-bg">
                <div className="card-header py-3 px-0 d-flex align-items-center justify-content-between border-bottom">
                  <h3 className="fw-bold mb-0">Employee Profile</h3>
                </div>
              </div>
            </div>
          </div>
    
          {/* Employee Profile and Calendar Row */}
          <div className="row g-3">
            {/* Personal Information Column */}
            <div className="col-xl-8 col-lg-12 col-md-12">
              <div className="card teacher-card mb-3">
                <div className="card-body d-flex teacher-fulldeatil">
                  <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-0 text-center w220 mx-sm-0 mx-auto">
                    <a href="#">
                      <img
                              src="https://img.freepik.com/premium-vector/man-avatar-drawing-vector_828267-1762.jpg"
                              alt=""
                        className="avatar xl rounded-circle img-thumbnail shadow-sm"
                      />
                    </a>
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
                      <h6 className="mb-0 fw-bold d-block fs-6">Third Year Computer Science Student</h6>
                      <span className="text-muted small">Employee Id : 22103284</span>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Cankutay Dündar</h6>
                    <span className="py-1 fw-bold small-11 mb-0 mt-1 text-muted">
                      Cs102 TA
                    </span>
                    <p className="mt-2 small">
                    Evaluating assignments, labs, and quizzes while providing constructive feedback to help students improve.                    </p>
                    <div className="row g-2 pt-2">
                      <div className="col-xl-5">
                        <div className="d-flex align-items-center">
                          <i className="icofont-ui-touch-phone"></i>
                          <span className="ms-2 small">+90 0538 036 0365</span>
                        </div>
                      </div>
                      <div className="col-xl-5">
                        <div className="d-flex align-items-center">
                          <i className="icofont-email"></i>
                          <span className="ms-2 small">cankutay.dundar@ug.bilkent.edu.tr</span>
                        </div>
                      </div>
                      <div className="col-xl-5">
                        <div className="d-flex align-items-center">
                          <i className="icofont-birthday-cake"></i>
                          <span className="ms-2 small">07/01/2003</span>
                        </div>
                      </div>
                      <div className="col-xl-5">
                        <div className="d-flex align-items-center">
                          <i className="icofont-address-book"></i>
                          <span className="ms-2 small">
                            Bilkent 81/82. Dormitory
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
    
          {/* Current Work Project */}
          <h6 className="fw-bold py-3 mb-3">Current Work Project</h6>
          <div className="teachercourse-list">
            <div className="row g-3 gy-5 py-3 row-deck">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mt-5">
                      <div className="lesson_name">
                        <div className="project-block light-info-bg">
                          <i className="icofont-paint"></i>
                        </div>
                        <span className="small text-muted project_name fw-bold">
                          C224
                        </span>
                        <h6 className="mb-0 fw-bold fs-6 mb-2">Lab Work </h6>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      
                    </div>
                    <div className="row g-2 pt-4">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-paper-clip"></i>
                          <span className="ms-2">5 Attach</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-sand-clock"></i>
                          <span className="ms-2">4 Month</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-group-students"></i>
                          <span className="ms-2">5 Members</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-ui-text-chat"></i>
                          <span className="ms-2">10</span>
                        </div>
                      </div>
                    </div>
                    <div className="dividers-block"></div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h4 className="small fw-bold mb-0">Progress</h4>
                      <span className="small light-danger-bg p-1 rounded">
                        <i className="icofont-ui-clock"></i> 35 Days Left
                      </span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-secondary"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <div
                        className="progress-bar bg-secondary ms-1"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <div
                        className="progress-bar bg-secondary ms-1"
                        role="progressbar"
                        style={{ width: "10%" }}
                        aria-valuenow="10"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ekstra bir Current Project Kartı */}
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mt-5">
                      <div className="lesson_name">
                        <div className="project-block bg-warning">
                          <i className="icofont-rocket"></i>
                        </div>
                        <span className="small text-muted project_name fw-bold">
                          CS202
                        </span>
                        <h6 className="mb-0 fw-bold fs-6 mb-2">TA Homework Grading</h6>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      
                    </div>
                    <div className="row g-2 pt-4">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-paper-clip"></i>
                          <span className="ms-2">3 Attach</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-sand-clock"></i>
                          <span className="ms-2">2 Month</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-group-students"></i>
                          <span className="ms-2">3 Members</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="icofont-ui-text-chat"></i>
                          <span className="ms-2">5</span>
                        </div>
                      </div>
                    </div>
                    <div className="dividers-block"></div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h4 className="small fw-bold mb-0">Progress</h4>
                      <span className="small light-danger-bg p-1 rounded">
                        <i className="icofont-ui-clock"></i> 20 Days Left
                      </span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-secondary"
                        role="progressbar"
                        style={{ width: "30%" }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <div
                        className="progress-bar bg-secondary ms-1"
                        role="progressbar"
                        style={{ width: "20%" }}
                        aria-valuenow="20"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Row End */}
          </div>
        </div>
      </div>
    
      {/* Modal Members */}
      <div className="modal fade" id="addUser" tabIndex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="addUserLabel">Employee Invitation</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="inviteby_email">
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email address"
                    id="exampleInputEmail1"
                    aria-describedby="exampleInputEmail1"
                  />
                  <button className="btn btn-dark" type="button" id="button-addon2">
                    Sent
                  </button>
                </div>
              </div>
              <div className="members_list">
                <h6 className="fw-bold">Employee</h6>
                <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
                  <li className="list-group-item py-3 text-center text-md-start">
                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-column flex-lg-row">
                      <div className="no-thumbnail mb-2 mb-md-0">
                        <img className="avatar lg rounded-circle" src="assets/images/xs/avatar2.jpg" alt="" />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0 fw-bold">Rachel Carr(you)</h6>
                        <span className="text-muted">rachel.carr@gmail.com</span>
                      </div>
                      <div className="members-action">
                        <span className="members-role">Admin</span>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="icofont-ui-settings fs-6"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-ui-password fs-6 me-2"></i>ResetPassword
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-chart-line fs-6 me-2"></i>ActivityReport
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item py-3 text-center text-md-start">
                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-column flex-lg-row">
                      <div className="no-thumbnail mb-2 mb-md-0">
                        <img className="avatar lg rounded-circle" src="assets/images/xs/avatar3.jpg" alt="" />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0 fw-bold">
                          Lucas Baker<a href="#" className="link-secondary ms-2">(Resend invitation)</a>
                        </h6>
                        <span className="text-muted">lucas.baker@gmail.com</span>
                      </div>
                      <div className="members-action">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Members
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-check-circled"></i>
                                <span>All operations permission</span>
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fs-6 p-2 me-1"></i>
                                <span>Only Invite & manage team</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="icofont-ui-settings fs-6"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-delete-alt fs-6 me-2"></i>Delete Member
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Leave Add Modal */}
      <div className="modal fade" id="leaveadd" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="leaveaddLabel">Leave Add</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Leave type</label>
                <select className="form-select">
                  <option selected>Medical Leave</option>
                  <option value="1">Casual Leave</option>
                  <option value="2">Maternity Leave</option>
                </select>
              </div>
              <div className="deadline-form">
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="datepickerdedass" className="form-label">
                        Leave From Date
                      </label>
                      <input type="date" className="form-control" id="datepickerdedass" />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="datepickerdedoneddsd" className="form-label">
                        Leave to Date
                      </label>
                      <input type="date" className="form-control" id="datepickerdedoneddsd" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea78d" className="form-label">
                  Leave Reason
                </label>
                <textarea className="form-control" id="exampleFormControlTextarea78d" rows="3"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Done
              </button>
              <button type="submit" className="btn btn-primary">
                Sent
              </button>
            </div>
          </div>
        </div>
      </div>
    
      {/* Leave Approve Modal */}
      <div className="modal fade" id="leaveapprove" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="dremovetaskLabel">Leave Approve</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body justify-content-center flex-column d-flex">
              <i className="icofont-simple-smile text-success display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">Leave Approve Successfully</p>
            </div>
          </div>
        </div>
      </div>
    
      {/* Leave Reject Modal */}
      <div className="modal fade" id="leavereject" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="leaverejectLabel">Leave Reject</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body justify-content-center flex-column d-flex">
              <i className="icofont-sad text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">Leave Reject</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
