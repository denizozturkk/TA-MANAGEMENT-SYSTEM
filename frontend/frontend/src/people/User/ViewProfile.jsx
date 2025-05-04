import React from "react";

const ClientProfile = () => {
  return (
    <div className="container py-4">
      <div className="card teacher-card mb-3 mx-auto shadow-sm" style={{ maxWidth: "600px" }}>
        <div className="card-body teacher-fulldeatil">
          {/* Üst Kısım: Avatar ve Ad */}
          <div className="text-center mb-4">
            <img
              src="assets/images/lg/avatar3.jpg"
              alt="Ryan Ogden"
              className="avatar xl rounded-circle img-thumbnail shadow-sm"
            />
            <div className="mt-3">
              <h5 className="fw-bold mb-0">Ryan Ogden</h5>
              <span className="text-muted small">CEO</span>
            </div>
          </div>

          {/* Bilgiler Bölümü */}
          <div className="teacher-info w-100 px-3">
            <h6 className="fw-bold mb-3 text-center">AgilSoft Tech</h6>

            <div className="mb-2">
              <strong className="text-muted d-block">Phone</strong>
              <span>202-555-0174</span>
            </div>
            <div className="mb-2">
              <strong className="text-muted d-block">Email</strong>
              <span>ryanogden@gmail.com</span>
            </div>
            <div className="mb-2">
              <strong className="text-muted d-block">Birth Date</strong>
              <span>19/03/1980</span>
            </div>
            <div className="mb-2">
              <strong className="text-muted d-block">Address</strong>
              <span>2734 West Fork Street, EASTON 02334</span>
            </div>

            {/* Açıklama */}
            <div className="mt-3">
              <strong className="text-muted d-block">About</strong>
              <p className="small mb-0">
                The purpose of lorem ipsum is to create a natural looking block of text that doesn't distract from the layout. A practice not without controversy.
              </p>
            </div>

            {/* Butonlar */}
            <div className="mt-4 d-flex flex-column flex-md-row justify-content-center gap-2">
              <button className="btn btn-outline-dark w-100 w-md-auto">Change Contact Information</button>
              <button className="btn btn-outline-dark w-100 w-md-auto">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
