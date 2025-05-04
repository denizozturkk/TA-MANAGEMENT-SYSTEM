import React from 'react';

const EmployeePage = () => {
  return (
    <>
      {/* Topbar Section */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl">
            {/* Search Input (remains) */}
            <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0">
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
              </div>
            </div>
            {/* Header Right Bar */}
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
                <div
                  id="NotificationsDiv"
                  className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0"
                >
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
                              <img
                                className="avatar rounded-circle"
                                src="https://i.pravatar.cc/150?img=16"
                                alt="Notification User"
                              />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">John Doe</span>
                                  <small>Info</small>
                                </p>
                                <span>Notification message</span>
                              </div>
                            </a>
                          </li>
                          {/* Other notifications can be added here */}
                        </ul>
                      </div>
                    </div>
                    <a className="card-footer text-center border-top-0" href="#">
                      View all notifications
                    </a>
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
                  <img
                    className="avatar lg rounded-circle img-thumbnail"
                    src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                    alt="profile"
                  />
                </a>
                <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                  <div className="card border-0 w280">
                    <div className="card-body pb-0">
                      <div className="d-flex py-1">
                        <img className="avatar rounded-circle" src="https://i.pravatar.cc/150?img=17" alt="profile" />
                        <div className="flex-fill ms-3">
                          <p className="mb-0">
                            <span className="font-weight-bold">Anıl Yeşil</span>
                          </p>
                          <small>anil.yesil@example.com</small>
                        </div>
                      </div>
                      <hr className="dropdown-divider border-dark" />
                    </div>
                    <div className="list-group m-2">
                      <a href="task.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-tasks fs-5 me-3"></i>My Task
                      </a>
                      <a href="members.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-ui-user-group fs-6 me-3"></i>Members
                      </a>
                      <a href="auth-signin.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-logout fs-6 me-3"></i>Signout
                      </a>
                      <hr className="dropdown-divider border-dark" />
                      <a href="auth-signup.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-contact-add fs-5 me-3"></i>Add Personal Account
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-md-1">
                <a href="#offcanvas_setting" data-bs-toggle="offcanvas" aria-expanded="false" title="Template Setting">
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
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* End Topbar */}

      {/* Body: Employee Section */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row clearfix">
            <div className="col-md-12">
              <div className="card border-0 mb-4 no-bg">
                <div className="card-header py-3 px-0 d-sm-flex align-items-center justify-content-between border-bottom">
                  <h3 className="fw-bold flex-fill mb-0 mt-sm-0">Employee</h3>
                  <button
                    type="button"
                    className="btn btn-dark me-1 mt-1 w-sm-100"
                    data-bs-toggle="modal"
                    data-bs-target="#createemp"
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>
                    Add Employee
                  </button>
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle mt-1 w-sm-100"
                      type="button"
                      id="dropdownMenuButton2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Status
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton2">
                      <li>
                        <a className="dropdown-item" href="#">
                          All
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Task Assign Members
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Not Assign Members
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Row End */}

          <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
            {/* Employee Card: Cankutay Dündar (TA) */}
            <div className="col">
              <div className="card teacher-card">
                <div className="card-body d-flex">
                  <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                    <img
                      src="https://i.pravatar.cc/150?img=11"
                      alt="Cankutay Dündar"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                      <div className="followers me-2">
                        <i className="icofont-tasks color-careys-pink fs-4"></i>
                        <span>10</span>
                      </div>
                      {/* Star rating removed */}
                      <div className="own-video">
                        <i className="icofont-data color-light-orange fs-4"></i>
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Cankutay Dündar</h6>
                    <span className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                      TA
                    </span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                      <p>
                        Responsible for assisting in teaching, supporting professors, and facilitating student learning experiences.
                      </p>
                    </div>
                    <a href="task.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                      Add Task
                    </a>
                    <a href="employee-profile.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-invisible me-2 fs-6"></i>
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Employee Card: Deniz Öztürk (Faculty Member) */}
            <div className="col">
              <div className="card teacher-card">
                <div className="card-body d-flex">
                  <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="Deniz Öztürk"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                      <div className="followers me-2">
                        <i className="icofont-tasks color-careys-pink fs-4"></i>
                        <span>8</span>
                      </div>
                      {/* Star rating removed */}
                      <div className="own-video">
                        <i className="icofont-data color-light-orange fs-4"></i>
                        <span>9</span>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Deniz Öztürk</h6>
                    <span className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                      Faculty Member
                    </span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                      <p>
                        Experienced in academic research, curriculum development, and student mentorship.
                      </p>
                    </div>
                    <a href="task.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                      Add Task
                    </a>
                    <a href="employee-profile.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-invisible me-2 fs-6"></i>
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Employee Card: Barkın Baydar (Dean) */}
            <div className="col">
              <div className="card teacher-card">
                <div className="card-body d-flex">
                  <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                    <img
                      src="https://i.pravatar.cc/150?img=13"
                      alt="Barkın Baydar"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                      <div className="followers me-2">
                        <i className="icofont-tasks color-careys-pink fs-4"></i>
                        <span>7</span>
                      </div>
                      {/* Star rating removed */}
                      <div className="own-video">
                        <i className="icofont-data color-light-orange fs-4"></i>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Barkın Baydar</h6>
                    <span className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                      Dean
                    </span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                      <p>
                        Provides visionary leadership, oversees academic programs, and ensures excellence in education and research.
                      </p>
                    </div>
                    <a href="task.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                      Add Task
                    </a>
                    <a href="employee-profile.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-invisible me-2 fs-6"></i>
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Employee Card: Anıl Yeşil (Office Member) */}
            <div className="col">
              <div className="card teacher-card">
                <div className="card-body d-flex">
                  <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                    <img
                    src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                    alt="Anıl Yeşil"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                      <div className="followers me-2">
                        <i className="icofont-tasks color-careys-pink fs-4"></i>
                        <span>6</span>
                      </div>
                      {/* Star rating removed */}
                      <div className="own-video">
                        <i className="icofont-data color-light-orange fs-4"></i>
                        <span>11</span>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Anıl Yeşil</h6>
                    <span className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                      TA
                    </span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                      <p>
                        Manages administrative operations and supports daily departmental functions to ensure a seamless academic environment.
                      </p>
                    </div>
                    <a href="task.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                      First Task
                    </a>
                    <a href="employee-profile.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-invisible me-2 fs-6"></i>
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Employee Card: Emre Uçar (Faculty Member) */}
            <div className="col">
              <div className="card teacher-card">
                <div className="card-body d-flex">
                  <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                    <img
                      src="https://i.pravatar.cc/150?img=2"
                      alt="Emre Uçar"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                      <div className="followers me-2">
                        <i className="icofont-tasks color-careys-pink fs-4"></i>
                        <span>5</span>
                      </div>
                      {/* Star rating removed */}
                      <div className="own-video">
                        <i className="icofont-data color-light-orange fs-4"></i>
                        <span>8</span>
                      </div>
                    </div>
                  </div>
                  <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">Emre Uçar</h6>
                    <span className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                      Faculty Member
                    </span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                      <p>
                        Committed to advancing research, teaching, and academic innovation in his field.
                      </p>
                    </div>
                    <a href="task.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                      Add Task
                    </a>
                    <a href="employee-profile.html" className="btn btn-dark btn-sm mt-1">
                      <i className="icofont-invisible me-2 fs-6"></i>
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Employee Cards Row */}
        </div>
      </div>

      {/* Modal Members */}
      <div className="modal fade" id="addUser" tabIndex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="addUserLabel">
                Employee Invitation
              </h5>
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
                                <i className="icofont-ui-password fs-6 me-2"></i>
                                ResetPassword
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-chart-line fs-6 me-2"></i>
                                ActivityReport
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
                          Lucas Baker
                          <a href="#" className="link-secondary ms-2">
                            (Resend invitation)
                          </a>
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
                                <i className="icofont-delete-alt fs-6 me-2"></i>
                                Delete Member
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
                        <img className="avatar lg rounded-circle" src="assets/images/xs/avatar8.jpg" alt="" />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0 fw-bold">Una Coleman</h6>
                        <span className="text-muted">una.coleman@gmail.com</span>
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
                                  <i className="icofont-ui-password fs-6 me-2"></i>
                                  ResetPassword
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-chart-line fs-6 me-2"></i>
                                  ActivityReport
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-delete-alt fs-6 me-2"></i>
                                  Suspend member
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-not-allowed fs-6 me-2"></i>
                                  Delete Member
                                </a>
                              </li>
                            </ul>
                          </div>
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

      {/* Template Setting Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvas_setting" aria-labelledby="offcanvas_setting">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Template Setting</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <div className="mb-4">
            <h6>Set Theme Color</h6>
            <ul className="choose-skin list-unstyled mb-0">
              <li data-theme="ValenciaRed">
                <div style={{ "--mytask-theme-color": "#D63B38" }} />
              </li>
              <li data-theme="SunOrange">
                <div style={{ "--mytask-theme-color": "#F7A614" }} />
              </li>
              <li data-theme="AppleGreen">
                <div style={{ "--mytask-theme-color": "#5BC43A" }} />
              </li>
              <li data-theme="CeruleanBlue">
                <div style={{ "--mytask-theme-color": "#00B8D6" }} />
              </li>
              <li data-theme="Mariner">
                <div style={{ "--mytask-theme-color": "#0066FE" }} />
              </li>
              <li data-theme="PurpleHeart" className="active">
                <div style={{ "--mytask-theme-color": "#6238B3" }} />
              </li>
              <li data-theme="FrenchRose">
                <div style={{ "--mytask-theme-color": "#EB5393" }} />
              </li>
            </ul>
          </div>
          <div className="mb-4 flex-grow-1">
            <h6>Set Theme Light/Dark/RTL</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <div className="form-check form-switch theme-switch">
                  <input className="form-check-input fs-6" type="checkbox" role="switch" id="theme-switch" />
                  <label className="form-check-label mx-2" htmlFor="theme-switch">
                    Enable Dark Mode!
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check form-switch theme-rtl">
                  <input className="form-check-input fs-6" type="checkbox" role="switch" id="theme-rtl" />
                  <label className="form-check-label mx-2" htmlFor="theme-rtl">
                    Enable RTL Mode!
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check form-switch monochrome-toggle">
                  <input className="form-check-input fs-6" type="checkbox" role="switch" id="monochrome" />
                  <label className="form-check-label mx-2" htmlFor="monochrome">
                    Monochrome Mode
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div className="d-flex">
            <a
              href="https://themeforest.net/item/mytask-hr-project-management-admin-template/31974551"
              className="btn w-100 me-1 py-2 btn-primary"
            >
              Buy Now
            </a>
            <a
              href="https://themeforest.net/user/pixelwibes/portfolio"
              className="btn w-100 ms-1 py-2 btn-dark"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeePage;
