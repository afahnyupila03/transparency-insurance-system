import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import "../App.css";

function Navbar() {
  // const { isAuthenticated, logout } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   // logout();
  //   navigate("/login");
  // };

  return (
    <nav className="navbar">
      <div>
        <Link to="/dashboard" className="navbar-title">Transparency Insurance</Link>
      </div>
      <div className="navbar-links">
        {/* {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/car/new">Add Car</Link>
            <Link to="/insurance">Insurance Calculator</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )} */}
      </div>
    </nav>
  );
}

export default Navbar;