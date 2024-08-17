import React, { useContext } from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { FaHotel, FaBook } from "react-icons/fa";
import { AuthContext } from "../auth/AuthProvider";
import "../styles/Admin.css"; // Ensure you create and import the appropriate CSS file


const SuperAdmin = () => {
    const { user } = useContext(AuthContext);

    // Kiểm tra xem người dùng có phải là ROLE_ADMIN không
    const isSupperUser = user && user.roles && user.roles.includes('ROLE_ADMIN');

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h2>Supper Admin Dashboard</h2>
            </header>
            <main className="admin-main">
                <div className="admin-card">
                    <Link to="/existing-roomss" className="admin-link">
                        <FaHotel className="admin-icon" />
                        <div className="admin-text">
                            <h3>Manage Rooms</h3>
                            <p>View and manage all hotel rooms</p>
                        </div>
                    </Link>
                </div>
                <div className="admin-card">
                    <Link to="/existing-bookingss" className="admin-link">
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

export default SuperAdmin;
