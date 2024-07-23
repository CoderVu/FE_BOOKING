import React, { useState } from "react";
import { registerAdmin } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import '../styles/index.css'

const RegistrationOwer= () => {
    const [registration, setRegistration] = useState({
        firstName: "",
        lastName: "",
        email: "",
		phone: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        setRegistration({ ...registration, [e.target.name]: e.target.value });
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const result = await registerAdmin(registration);
            setSuccessMessage(result);
            setErrorMessage("");
            setRegistration({ firstName: "", lastName: "", email: "",phone: "", password: "" });
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(`Registration error: ${error.message}`);
        }
        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    return (
        <section className="registration-container">
            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
            {successMessage && <p className="alert alert-success">{successMessage}</p>}

            <h2 className="registration-title">Đăng kí</h2>
            <form onSubmit={handleRegistration} className="registration-form">
                <div className="form-group row">
                    <label htmlFor="firstName" className="col-sm-2 col-form-label">
                        <FaUser className="icon" />
                        First Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className="form-control"
                            value={registration.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="lastName" className="col-sm-2 col-form-label">
                        <FaUser className="icon" />
                        Last Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className="form-control"
                            value={registration.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">
                        <FaEnvelope className="icon" />
                        Email
                    </label>
                    <div className="col-sm-10">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={registration.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
				<div className="form-group row">
					<label htmlFor="phone" className="col-sm-2 col-form-label">
						<FaPhone className="icon" />
						Phone
					</label>
					<div className="col-sm-10">
						<input
							id="phone"
							name="phone"
							type="text"
							className="form-control"
							value={registration.phone}
							onChange={handleInputChange}
							required
						/>
					</div>

				</div>

                <div className="form-group row">
                    <label htmlFor="password" className="col-sm-2 col-form-label">
                        <FaLock className="icon" />
                        Password
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={registration.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary submit-btn">
                        Đăng kí
                    </button>
                    <span className="additional-links">
                        Already have an account? <Link to={"/login"}>Login</Link>
                    </span>
                </div>
            </form>
        </section>
    );
};

export default RegistrationOwer;
