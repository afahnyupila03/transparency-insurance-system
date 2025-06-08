import React from "react";
import { Link } from "react-router-dom";
// import "../App.css";

function Navbar() {


  return (
    <nav className="navbar">
      <div>
        <Link to="/dashboard" className="navbar-title">Transparency Insurance</Link>
      </div>
      <div className="navbar-links">
       
      </div>
    </nav>
  );
}

export default Navbar;