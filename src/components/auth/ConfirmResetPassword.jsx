import React, { useState, useEffect } from 'react';
import { confirmResetPassword } from '../utils/ApiFunctions';
import { Link } from 'react-router-dom';

const ConfirmResetPassword = () => {
    const [inputs, setInputs] = useState({
        email: '',
        otp: '',
        newPassword: ''
    });
    const [message, setMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(120); // 120 giây = 2 phút

    useEffect(() => {
        // Chỉ chạy đồng hồ đếm ngược khi timeLeft > 0
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await confirmResetPassword(inputs.email, inputs.otp, inputs.newPassword);
            setMessage('Password reset successful. You can now login with your new password');
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
        }
    };

    // Chuyển đổi thời gian đếm ngược thành phút:giây
    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                marginBottom: '20px'
            }}>Confirm Reset Password</h2>
            {timeLeft > 0 ? (
                <div>
                    <p style={{ textAlign: 'center' }}>Time left to enter OTP: {formatTimeLeft()}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{
                            marginBottom: '15px'
                        }}>
                            <label style={{ fontWeight: 'bold' }}>Email</label>
                            <input type="email" name="email" value={inputs.email} onChange={handleChange} required style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 'bold' }}>OTP</label>
                            <input type="text" name="otp" value={inputs.otp} onChange={handleChange} required style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 'bold' }}>New Password</label>
                            <input type="password" name="newPassword" value={inputs.newPassword} onChange={handleChange} required style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                transition: 'border-color 0.3s ease'
                            }} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{
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
                        }}>Reset Password</button>
                    </form>
                </div>
            ) : (
                <React.Fragment>
                  <p style={{ textAlign: 'center', marginTop: '20px' }}>Your OTP has expired. Please request a new one.</p>
                  <span style={{ marginLeft: "10px" }}>
                 <Link to={"/reset-password"}>Gửi lại OTP</Link>
                  </span>
                </React.Fragment>
            )}
            {message && <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        </div>
    );
};

export default ConfirmResetPassword;
