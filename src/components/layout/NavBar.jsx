import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logout from "../auth/Logout";
import "../styles/index.css";

const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const currentUser = localStorage.getItem("userId");
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const handleAccountClick = (e) => {
    e.preventDefault();
    setShowAccount(!showAccount);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5 shadow mt-5 sticky-top custom-navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <span className="hotel-color">Tranquil Shores Hotel</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarScroll"
          aria-expanded={navbarOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/browse-all-rooms">
                View Rooms
              </NavLink>
            </li>

            {isLoggedIn && userRole === "ROLE_ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/admin">
                  Manager Hotels
                </NavLink>
              </li>
            )}
            {isLoggedIn && userRole === "ROLE_SUPPERUSER" && (
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/supperuser">
                  SUPER ADMIN
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className="nav-link" to="/find-booking">
                Find my booking
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle text-success ${showAccount ? "active" : ""}`}
                href="/"
                role="button"
                aria-expanded={showAccount}
                onClick={handleAccountClick}
              >
                {isLoggedIn ? (
                  <span className="text-success">{currentUser}</span>
                ) : (
                  <span className="text-success">Account</span>
                )}
              </a>

              <ul className={`dropdown-menu ${showAccount ? "show" : ""}`} aria-labelledby="navbarDropdown">
                {isLoggedIn ? (
                  <li>
                    <Logout />
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
