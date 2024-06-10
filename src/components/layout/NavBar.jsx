import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logout from "../auth/Logout";

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false);
    const currentUser = localStorage.getItem("userId");

    const handleAccountClick = (e) => {
        e.preventDefault();
        setShowAccount(!showAccount);
    };

    const isLoggedIn = !!localStorage.getItem("token"); // Ensure isLoggedIn is a boolean
    const userRole = localStorage.getItem("userRole");

    // CSS definitions
    const navbarStyle = {
        padding: 0,
    };

    const navLinkStyle = {
        padding: "1em",
    };

    const navItemStyle = {
        position: "relative",
    };

    const navItemAfterStyle = {
        position: "relative",
        bottom: 0,
        left: 100,
        right: 0,
        content: '',
        backgroundColor: "rgb(169, 77, 123)",
        width: 0,
        margin: "0 auto",
        height: "4px",
        transition: "all .5s",
    };

    const dropdownMenuStyle = {
        display: showAccount ? "block" : "none",
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-5 shadow mt-5 sticky-top" style={navbarStyle}>
            <div className="container-fluid">
                <Link to={"/"} className="navbar-brand">
                    <span className="hotel-color">Tranquil Shores Hotel</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item" style={navItemStyle}>
                            <NavLink className="nav-link" aria-current="page" to={"/browse-all-rooms"} style={navLinkStyle}>
                                View Rooms
                            </NavLink>
                            <span style={navItemAfterStyle}></span>
                        </li>

                        {isLoggedIn && userRole === "ROLE_ADMIN" && (
                            <li className="nav-item" style={navItemStyle}>
                                <NavLink className="nav-link" aria-current="page" to={"/admin"} style={navLinkStyle}>
                                    Admin
                                </NavLink>
                                <span style={navItemAfterStyle}></span>
                            </li>
                        )}

                        <li className="nav-item" style={navItemStyle}>
                            <NavLink className="nav-link" to={"/find-booking"} style={navLinkStyle}>
                                Find my booking
                            </NavLink>
                            <span style={navItemAfterStyle}></span>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle text-success ${showAccount ? "active" : ""}`}
                                href="."
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                onClick={handleAccountClick}
                            >
                                {isLoggedIn ? (
                                    <span className="text-success">{currentUser}</span>
                                ) : (
                                    <span className="text-success">Account</span>
                                )}
                            </a>

                            <ul className={`dropdown-menu`} aria-labelledby="navbarDropdown" style={dropdownMenuStyle}>
                                {isLoggedIn ? (
                                    <li>
                                        <Logout />
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link className="dropdown-item" to={"/login"}>
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to={"/register"}>
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
