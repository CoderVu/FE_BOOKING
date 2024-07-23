import React, { useState } from 'react';
import { resetPassword } from '../utils/ApiFunctions';
import { useHistory } from 'react-router-dom'; // Import useHistory
import '../styles/index.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory(); // Tạo instance của useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email);
            setMessage('A link to reset your password has been sent to your email');
            history.push('/confirm-reset-password'); // Chuyển hướng sau khi gửi email thành công
        } catch (error) {
            setMessage('Failed to send reset password email. Please try again');
        }
    };

    return (
        <div className="container" style={{ 
            maxWidth: '500px',
            marginTop: '50px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '20px'}}
            >
                Reset Password
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{
                            marginBottom: '15px'
                        }}>
                    <label htmlFor="email" style={{marginBottom:'15px'}}>Email nhận OTP</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                </div>
                <button type="submit" className="btn btn-primary"style={{
                            display: 'block',
                            width: '100%',
                            padding: '12px',
                            marginTop: '20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease'
                        }}>Send Reset Link</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ResetPassword;