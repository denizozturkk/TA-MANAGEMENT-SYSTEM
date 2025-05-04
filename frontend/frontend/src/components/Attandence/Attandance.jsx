import React from 'react';

const AttendanceAdmin = () => {
  return (
    <div className="main px-lg-4 px-md-4">
      {/* Header */}
      <div className="header">
        <nav className="navbar py-4">
          <div className="container-xxl d-flex justify-content-between">
            <div></div>
            <div className="h-right d-flex align-items-center">
              <div className="dropdown user-profile d-flex align-items-center">
                <a className="nav-link dropdown-toggle pulse p-0" href="#">
                  <img
                    className="avatar lg rounded-circle img-thumbnail"
                    src="https://img.freepik.com/premium-vector/man-avatar-drawing-vector_828267-1762.jpg"
                    alt="profile"
                  />
                </a>
                <div className="u-info ms-2">
                  <p className="mb-0 line-height-sm">
                    <span className="font-weight-bold">Eray Tüzün</span>
                  </p>
                  <small>Admin Profile</small>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">TA Task Completion Status Page</h3>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>TA Name</th>
                          <th>Course</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Deniz Öztürk</td>
                          <td>CS319</td>
                          <td>2025-04-01</td>
                          <td><span className="badge bg-success">Present</span></td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Mehmet Anıl Yeşil</td>
                          <td>CS101</td>
                          <td>2025-04-01</td>
                          <td><span className="badge bg-warning">Half-day</span></td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Cankutay Dündar</td>
                          <td>CS202</td>
                          <td>2025-04-01</td>
                          <td><span className="badge bg-danger">Absent</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Attendance Table */}
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdmin;