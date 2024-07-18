import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';

const BookingSuccess = () => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div className='container'>
            <div className='mt-5'>
                {message ? (
                    <div>
                        <h3 className='text-success'>Đặt phòng thành công !</h3>
                        <p className='text-success'>{message}</p>
                    </div>
                ) : (
                    <div>
                        <h3 className='text-danger'>Đặt phòng thất bại !</h3>
                        <p className='text-danger'>There was an error processing your booking.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSuccess;
