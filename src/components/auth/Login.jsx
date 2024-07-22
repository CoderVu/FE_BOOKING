import React, { useState } from "react";
import { loginUser } from "../utils/ApiFunctions";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const history = useHistory();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.from?.pathname || "/";

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await loginUser(login);

      if (success) {
        const token = success.token;
        auth.handleLogin(token);
        history.push(redirectUrl, { replace: true });
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login. Please try again later.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  return (
    <section
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {errorMessage && (
        <p
          style={{
            color: '#d9534f',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </p>
      )}
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '1.5rem'
        }}
      >
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: '15px'
          }}
        >
          <label
            htmlFor="email"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px'
            }}
          >
            <FaEnvelope
              style={{
                marginRight: '10px'
              }}
            />
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={login.email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div
          style={{
            marginBottom: '15px'
          }}
        >
          <label
            htmlFor="password"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px'
            }}
          >
            <FaLock
              style={{
                marginRight: '10px'
              }}
            />
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={login.password}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Đăng nhập
          </button>
          <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <span>
            Don't have an account user yet? <Link to="/register">Register</Link>
          </span>
          <span>
            Don't have an account owner hotel yet? <Link to="/register-admin">Register</Link>
          </span>
          <span>
            Forgot your password? <Link to="/reset-password">Reset password</Link>
          </span>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;
