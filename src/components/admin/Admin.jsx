import React from "react";
import { Link } from "react-router-dom";
import { FaHotel, FaBook } from "react-icons/fa";
import "../styles/Admin.css"; // Ensure you create and import the appropriate CSS file

const Admin = () => {
    return (
        <div className="admin-page">
            <header className="admin-header">
                <h2>Admin Dashboard</h2>
            </header>
            <main className="admin-main">
                <div className="admin-card">
                    <Link to="/existing-rooms" className="admin-link">
                        <FaHotel className="admin-icon" />
                        <div className="admin-text">
                            <h3>Manage Rooms</h3>
                            <p>View and manage all hotel rooms</p>
                        </div>
                    </Link>
                </div>
                <div className="admin-card">
                    <Link to="/existing-bookings" className="admin-link">
                        <FaBook className="admin-icon" />
                        <div className="admin-text">
                            <h3>Manage Bookings</h3>
                            <p>View and manage all bookings</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Admin;
