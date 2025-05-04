// src/people/TA/Layout-TA.jsx
import React from "react";

/**
 * LayoutTA is only responsible for wrapping page content.
 * The TA sidebar is rendered once by the <TA> route component.
 */
const LayoutTA = ({ children }) => (
  <div className="container-xxl py-5">
    {children}
  </div>
);

export default LayoutTA;
