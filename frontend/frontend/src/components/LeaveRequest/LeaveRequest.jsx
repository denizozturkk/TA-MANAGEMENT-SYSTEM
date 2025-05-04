import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="main px-lg-4 px-md-4">
      {/* Body: Header – Önceki header entegre edildi */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl">
            {/* Header Rightbar Icon */}
            <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
              <div className="d-flex">
                <div className="avatar-list avatar-list-stacked px-3">
                  <span
                    className="avatar rounded-circle text-center pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#addUser"
                  >
                  </span>
                </div>
              </div>
              <div className="dropdown notifications">
                <a
                  className="nav-link dropdown-toggle pulse"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
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
                                src="assets/images/xs/avatar1.jpg"
                                alt=""
                              />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Dylan Hunter</span>
                                  <small>2MIN</small>
                                </p>
                                <span>
                                  Added 2021-02-19 my-Task ui/ux Design{' '}
                                  <span className="badge bg-success">Review</span>
                                </span>
                              </div>
                            </a>
                          </li>
                          {/* Diğer notification örnekleri */}
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
                    <span className="font-weight-bold">Eray Tüzün</span>
                  </p>
                  <small>Instructer</small>
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
                        <img
                          className="avatar rounded-circle"
                          src="assets/images/profile_av.png"
                          alt="profile"
                        />
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
                      <a
                        href="task.html"
                        className="list-group-item list-group-item-action border-0"
                      >
                        <i className="icofont-tasks fs-5 me-3"></i>My Task
                      </a>
                      <a
                        href="members.html"
                        className="list-group-item list-group-item-action border-0"
                      >
                        <i className="icofont-ui-user-group fs-6 me-3"></i>members
                      </a>
                      <a
                        href="ui-elements/auth-signin.html"
                        className="list-group-item list-group-item-action border-0"
                      >
                        <i className="icofont-logout fs-6 me-3"></i>Signout
                      </a>
                      <div>
                        <hr className="dropdown-divider border-dark" />
                      </div>
                      <a
                        href="ui-elements/auth-signup.html"
                        className="list-group-item list-group-item-action border-0"
                      >
                        <i className="icofont-contact-add fs-5 me-3"></i>Add personal account
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-md-1">
                <a
                  href="#offcanvas_setting"
                  data-bs-toggle="offcanvas"
                  aria-expanded="false"
                  title="template setting"
                >
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
    
      {/* Body: Body – Leave Request içeriği */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              {/* Kart Header: "Leave Request" başlığı solda, buton sağda */}
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">Leave Request</h3>
                <div className="col-auto d-flex w-sm-100">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task w-sm-100"
                    data-bs-toggle="modal"
                    data-bs-target="#leaveadd"
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Row End */}
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <div className="card mb-3">
                <div className="card-body">
                  <table
                    id="myProjectTable"
                    className="table table-hover align-middle mb-0"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Leave Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Birinci satır: Medical Leave, çalışan adı Deniz Öztürk */}
                      <tr>
                        <td>
                          <a href="employee-profile.html" className="fw-bold text-secondary">
                            #EMP : 00001
                          </a>
                        </td>
                        <td>
                          <img
                            className="avatar rounded-circle"
                            src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                            alt=""
                          />
                          <span className="fw-bold ms-1">Deniz Öztürk</span>
                        </td>
                        <td>Medical Leave</td>
                        <td>12/03/2021</td>
                        <td>14/03/2021</td>
                        <td>Medical Check-up</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#leaveapprove"
                            >
                              <i className="icofont-check-circled text-success"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary deleterow"
                              data-bs-toggle="modal"
                              data-bs-target="#leavereject"
                            >
                              <i className="icofont-close-circled text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* İkinci satır: Casual Leave, çalışan adı Barkın Baydar */}
                      <tr>
                        <td>
                          <a href="employee-profile.html" className="fw-bold text-secondary">
                            #EMP : 00038
                          </a>
                        </td>
                        <td>
                          <img
                            className="avatar rounded-circle"
                            src="https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
                            alt=""
                          />
                          <span className="fw-bold ms-1">Barkın Baydar</span>
                        </td>
                        <td>Casual Leave</td>
                        <td>11/04/2021</td>
                        <td>12/04/2021</td>
                        <td>Going to Holiday</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#leaveapprove"
                            >
                              <i className="icofont-check-circled text-success"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary deleterow"
                              data-bs-toggle="modal"
                              data-bs-target="#leavereject"
                            >
                              <i className="icofont-close-circled text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* İki örnek satır yeterli */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
