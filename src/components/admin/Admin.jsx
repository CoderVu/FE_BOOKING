import React from "react";
import { Link } from "react-router-dom";
const Admin = () => {
    return (
        <section className="container mt-5">
        <h2>Welcome to Admin Page</h2>
        <hr/>
        <Link to="/add-room">Manager room </Link>
        </section>
    )
}
export default Admin;