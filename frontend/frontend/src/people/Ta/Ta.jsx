import React from "react";
import avatar from "../User/avatar3.jpg"; // <- avatar3.jpg yolu

const EmployeeHeader = () => {
  return (
    <div className="header">
      <nav className="navbar py-4">
        <div className="container-xxl">
          {/* Sağ taraftaki ikonlar */}
          <div className="h-right d-flex align-items-center order-1">

            {/* Bildirimler */}
            <div className="dropdown notifications">
              <a className="nav-link dropdown-toggle pulse" href="#" data-bs-toggle="dropdown">
                <i className="icofont-alarm fs-5"></i>
                <span className="pulse-ring"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-sm-end p-0 m-0 shadow border-0">
                <div className="card border-0 w380">
                  <div className="card-header p-3">
                    <h5 className="mb-0 d-flex justify-content-between">
                      <span>Notifications</span>
                      <span className="badge text-white">11</span>
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="py-2 mb-1 border-bottom">
                        <a href="/viewnotification" className="d-flex">
                          <img className="avatar rounded-circle" src={avatar} alt="User Avatar" />
                          <div className="flex-fill ms-2">
                            <p className="d-flex justify-content-between mb-0">
                              <span className="fw-bold">Anıl Yeşil</span>
                              <small>New Notification</small>
                            </p>
                            <span>You've been assigned a task</span>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <a className="card-footer text-center" href="/viewnotification">View all notifications</a>
                </div>
              </div>
            </div>

            {/* Kullanıcı Menüsü */}
            <div className="dropdown user-profile d-flex align-items-center ms-3">
              <div className="u-info me-2 text-end">
                <p className="mb-0">
                  <span className="fw-bold">Anıl Yeşil</span>
                </p>
                <small>TA Profile</small>
              </div>
              <a className="nav-link dropdown-toggle p-0" href="#" data-bs-toggle="dropdown">
                <img className="avatar lg rounded-circle img-thumbnail" src={avatar} alt="profile" />
              </a>
              <div className="dropdown-menu dropdown-menu-end shadow border-0 p-0">
                <div className="card w280 border-0">
                  <div className="card-body pb-0">
                    <div className="d-flex py-1">
                      <img className="avatar rounded-circle" src={avatar} alt="profile" />
                      <div className="ms-3">
                        <p className="mb-0 fw-bold">Anıl Yeşil</p>
                        <small>anil.yesil@bilkent.edu.tr</small>
                      </div>
                    </div>
                    <hr className="dropdown-divider border-dark" />
                  </div>
                  <div className="list-group m-2">
                    <a href="/viewprofile" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-user me-2"></i> View Profile
                    </a>
                    <a href="/changepassword" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-lock me-2"></i> Change Password
                    </a>
                    <a href="/changecontactinformation" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-address-book me-2"></i> Update Contact Info
                    </a>
                    <a href="/logout" className="list-group-item list-group-item-action border-0">
                      <i className="icofont-logout me-2"></i> Sign Out
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ayar simgesi */}
            <div className="ms-3">
              <a href="#offcanvas_setting" data-bs-toggle="offcanvas" aria-expanded="false">
                <i className="icofont-gear fs-5 text-white"></i>
              </a>
            </div>
          </div>

          {/* Arama çubuğu */}
          <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0">
            
          </div>

          {/* Menü Toggler */}
          <button className="navbar-toggler p-0 border-0 menu-toggle order-3" type="button" data-bs-toggle="collapse" data-bs-target="#mainHeader">
            <span className="fa fa-bars"></span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default EmployeeHeader;
