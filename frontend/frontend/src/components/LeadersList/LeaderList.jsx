import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="main px-lg-4 px-md-4">
      {/* Header */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl">
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
                              {/* Kadın avatar için Begüm Çınar */}
                              <img
                                className="avatar rounded-circle"
                                src="https://static.vecteezy.com/system/resources/previews/014/212/681/non_2x/female-user-profile-avatar-is-a-woman-a-character-for-a-screen-saver-with-emotions-for-website-and-mobile-app-design-illustration-on-a-white-isolated-background-vector.jpg"
                                alt="Female Avatar"
                              />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Begüm Çınar</span>
                                  <small>Bilkent CS Faculty</small>
                                </p>
                                <span>Please upload Lab's scores</span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              {/* Erkek avatar için Eray Tüzün */}
                              <img
                                className="avatar rounded-circle"
                                src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                                alt="Male Avatar"
                              />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Eray Tüzün</span>
                                  <small>Bilkent CS Dept.</small>
                                </p>
                                <span>Please check the deadline</span>
                              </div>
                            </a>
                          </li>
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
                  <small>TA Profile</small>
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
                        <img className="avatar rounded-circle" src="assets/images/profile_av.png" alt="profile" />
                        <div className="flex-fill ms-3">
                          <p className="mb-0">
                            <span className="font-weight-bold">Dylan Hunter</span>
                          </p>
                          <small>Dylan.hunter@gmail.com</small>
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
                      <a href="ui-elements/auth-signin.html" className="list-group-item list-group-item-action border-0">
                        <i className="icofont-logout fs-6 me-3"></i>Signout
                      </a>
                      <hr className="dropdown-divider border-dark" />
                      <a href="ui-elements/auth-signup.html" className="list-group-item list-group-item-action border-0">
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

            {/* Menu Toggler */}
            <button
              className="navbar-toggler p-0 border-0 menu-toggle order-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainHeader"
            >
              <span className="fa fa-bars"></span>
            </button>

            {/* Main Menu Search */}
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

      {/* Body */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          {/* LeaderList Header */}
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">Course Instructors</h3>
              </div>
            </div>
          </div>
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table id="myProjectTable" className="table table-hover align-middle mb-0" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Leader Name</th>
                        <th>Course</th>
                        <th>Total Task</th>
                        <th>Email</th>
                        <th>Project Assigned</th>
                        <th>Assigned Staff</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1: Begüm Çınar */}
                      <tr>
                        <td>
                          <img
                            className="avatar rounded-circle"
                            src="https://static.vecteezy.com/system/resources/previews/014/212/681/non_2x/female-user-profile-avatar-is-a-woman-a-character-for-a-screen-saver-with-emotions-for-website-and-mobile-app-design-illustration-on-a-white-isolated-background-vector.jpg"
                            alt="Begüm Çınar"
                          />
                          <span className="fw-bold ms-1">Eray Tüzün</span>
                        </td>
                        <td>
                          <a href="projects.html">Distributed Systems</a>
                        </td>
                        <td>
                          <a href="task.html">5 Task</a>
                        </td>
                        <td>
                          <a href="mailto:">eraytuzun@bilkent.edu.tr</a>
                        </td>
                        <td>23/02/23</td>
                        <td>
                          <div className="avatar-list avatar-list-stacked px-3">
                            {/* Assigned staff: using female avatar and first male avatar */}
                            <img
                              className="avatar rounded-circle sm"
                              src="https://static.vecteezy.com/system/resources/previews/014/212/681/non_2x/female-user-profile-avatar-is-a-woman-a-character-for-a-screen-saver-with-emotions-for-website-and-mobile-app-design-illustration-on-a-white-isolated-background-vector.jpg"
                              alt="Staff 1"
                            />
                            <img
                              className="avatar rounded-circle sm"
                              src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                              alt="Staff 2"
                            />
                            <span
                              className="avatar rounded-circle text-center pointer sm"
                              data-bs-toggle="modal"
                              data-bs-target="#addUser"
                            >
                              <i className="icofont-ui-add"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success">Working</span>
                        </td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-outline-secondary">
                              <i className="icofont-edit text-success"></i>
                            </button>
                            <button type="button" className="btn btn-outline-secondary deleterow">
                              <i className="icofont-ui-delete text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 2: Eray Tüzün */}
                      <tr>
                        <td>
                          <img
                            className="avatar rounded-circle"
                            src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                            alt="Eray Tüzün"
                          />
                          <span className="fw-bold ms-1">Eray Tüzün</span>
                        </td>
                        <td>
                          <a href="projects.html">Computer Networks</a>
                        </td>
                        <td>
                          <a href="task.html">8 Task</a>
                        </td>
                        <td>
                          <a href="mailto:">eraytuzun@bilkent.edu.tr</a>
                        </td>
                        <td>14/04/23</td>
                        <td>
                          <div className="avatar-list avatar-list-stacked px-3">
                            {/* Assigned staff: using freepik male avatar */}
                            <img
                              className="avatar rounded-circle sm"
                              src="https://img.freepik.com/premium-vector/man-avatar-drawing-vector_828267-1762.jpg"
                              alt="Staff 1"
                            />
                            <span
                              className="avatar rounded-circle text-center pointer sm"
                              data-bs-toggle="modal"
                              data-bs-target="#addUser"
                            >
                              <i className="icofont-ui-add"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success">Working</span>
                        </td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-outline-secondary">
                              <i className="icofont-edit text-success"></i>
                            </button>
                            <button type="button" className="btn btn-outline-secondary deleterow">
                              <i className="icofont-ui-delete text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 3: Selim Aksoy */}
                      <tr>
                        <td>
                          <img
                            className="avatar rounded-circle"
                            src="https://img.freepik.com/premium-vector/man-avatar-drawing-vector_828267-1762.jpg"
                            alt="Selim Aksoy"
                          />
                          <span className="fw-bold ms-1">Selim Aksoy</span>
                        </td>
                        <td>
                          <a href="projects.html">Artificial Intelligence</a>
                        </td>
                        <td>
                          <a href="task.html">2 Task</a>
                        </td>
                        <td>
                          <a href="mailto:">saksoy@bilkent.edu.tr</a>
                        </td>
                        <td>18/03/23</td>
                        <td>
                          <div className="avatar-list avatar-list-stacked px-3">
                            {/* Assigned staff: using male avatar from vecteezy and freepik */}
                            <img
                              className="avatar rounded-circle sm"
                              src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                              alt="Staff 1"
                            />
                            <img
                              className="avatar rounded-circle sm"
                              src="https://img.freepik.com/premium-vector/man-avatar-drawing-vector_828267-1762.jpg"
                              alt="Staff 2"
                            />
                            <span
                              className="avatar rounded-circle text-center pointer sm"
                              data-bs-toggle="modal"
                              data-bs-target="#addUser"
                            >
                              <i className="icofont-ui-add"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success">Working</span>
                        </td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-outline-secondary">
                              <i className="icofont-edit text-success"></i>
                            </button>
                            <button type="button" className="btn btn-outline-secondary deleterow">
                              <i className="icofont-ui-delete text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Row End */}
        </div>
      </div>

      {/* Modals (Add User, Leave, etc.) remain unchanged */}
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
