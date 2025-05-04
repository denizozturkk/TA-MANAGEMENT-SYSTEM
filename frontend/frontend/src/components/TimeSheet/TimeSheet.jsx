import React, { useRef } from 'react';

const ProjectTimesheet = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="main px-lg-4 px-md-4">
      {/* Body: Header */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl">
            {/* header rightbar icon */}
            <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
              <div className="d-flex">
                <a className="nav-link text-primary collapsed" href="help.html" title="Get Help">
                  <i className="icofont-info-square fs-5"></i>
                </a>
                <div className="avatar-list avatar-list-stacked px-3">
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar2.jpg" alt="" />
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar1.jpg" alt="" />
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar3.jpg" alt="" />
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar4.jpg" alt="" />
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar7.jpg" alt="" />
                  <img className="avatar rounded-circle" src="assets/images/xs/avatar8.jpg" alt="" />
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
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar1.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Dylan Hunter</span> <small>2MIN</small>
                                </p>
                                <span className="">
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
                                <span className="">Task added Get Started with Fast Cad project</span>
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
                                <span className="">Quality Assurance Task Completed</span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar5.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Diane Fisher</span> <small>13MIN</small>
                                </p>
                                <span className="">Add New Project for App Developemnt</span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2 mb-1 border-bottom">
                            <a href="javascript:void(0);" className="d-flex">
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar6.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Andrea Gill</span> <small>1HR</small>
                                </p>
                                <span className="">Add Timesheet For Rhinestone project</span>
                              </div>
                            </a>
                          </li>
                          <li className="py-2">
                            <a href="javascript:void(0);" className="d-flex">
                              <img className="avatar rounded-circle" src="assets/images/xs/avatar7.jpg" alt="" />
                              <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                  <span className="font-weight-bold">Zoe Wright</span> <small>1DAY</small>
                                </p>
                                <span className="">Add Calander Event</span>
                              </div>
                            </a>
                          </li>
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
                    <span className="font-weight-bold">Dylan Hunter</span>
                  </p>
                  <small>Admin Profile</small>
                </div>
                <a
                  className="nav-link dropdown-toggle pulse p-0"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                >
                  <img className="avatar lg rounded-circle img-thumbnail" src="assets/images/profile_av.png" alt="profile" />
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
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1.608 1 2.296.07 2.572-1.065z" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
                  </svg>
                </a>
              </div>
            </div>
    
            {/* menu toggler */}
            <button
              className="navbar-toggler p-0 border-0 menu-toggle order-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainHeader"
            >
              <span className="fa fa-bars"></span>
            </button>
    
            {/* main menu Search */}
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
    
      {/* Body: Main Content */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">Project Timesheet</h3>
                <div className="col-auto d-flex w-sm-100">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task w-sm-100"
                    data-bs-toggle="modal"
                    data-bs-target="#sendsheet"
                  >
                    <i className="icofont-file-spreadsheet me-2 fs-6"></i>Sheets Sent
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
                  {/* Kaydırılabilir tablo kapsayıcısı */}
                  <div style={{ overflowX: 'auto' }} ref={scrollContainerRef}>
                    <table id="myProjectTable" className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Project Name</th>
                          <th>Mon</th>
                          <th>Tue</th>
                          <th>Wed</th>
                          <th>Thur</th>
                          <th>Fri</th>
                          <th>Sat</th>
                          <th>Sun</th>
                          <th>Total</th>
                          <th>
                            <i className="icofont-gear fs-5"></i>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <select className="form-select" aria-label="Default select Project Category" defaultValue="Rhinestone">
                              <option value="Rhinestone">Rhinestone</option>
                              <option value="1">Fast Cad</option>
                              <option value="2">Box of Crayons</option>
                              <option value="3">Gob Geeklords</option>
                              <option value="4">Java Dalia</option>
                              <option value="5">Practice to Perfect</option>
                              <option value="6">Rhinestone</option>
                              <option value="7">Social Geek Made</option>
                            </select>
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded1" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded2" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded3" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded4" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded5" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded6" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded7" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <button type="button" className="btn light-success-bg">56</button>
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
                        <tr>
                          <td>
                            <select className="form-select" aria-label="Default select Project Category" defaultValue="Practice to Perfect">
                              <option value="Practice to Perfect">Practice to Perfect</option>
                              <option value="1">Fast Cad</option>
                              <option value="2">Box of Crayons</option>
                              <option value="3">Gob Geeklords</option>
                              <option value="4">Java Dalia</option>
                              <option value="5">Practice to Perfect</option>
                              <option value="6">Rhinestone</option>
                              <option value="7">Social Geek Made</option>
                            </select>
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded8" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded9" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded10" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded11" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded12" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded13" defaultValue="06:20:00" />
                          </td>
                          <td>
                            <input type="time" className="form-control" id="timepickerded14" defaultValue="08:00:00" />
                          </td>
                          <td>
                            <button type="button" className="btn light-success-bg">54.20</button>
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
                  {/* Slider butonları */}
                  <div className="scroll-buttons" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button onClick={scrollLeft} style={{ marginRight: '10px' }}>
                      &#8592;
                    </button>
                    <button onClick={scrollRight}>&#8594;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Row End */}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimesheet;
