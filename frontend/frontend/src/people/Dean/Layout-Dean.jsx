import React from "react";

/**
 * LayoutDean is only responsible for wrapping page content.
 * The Dean sidebar is rendered once by the <Dean> route component.
 */
const LayoutDean = ({ children }) => (
  <div className="container-xxl py-5">
    {children}
  </div>
);

export default LayoutDean;
