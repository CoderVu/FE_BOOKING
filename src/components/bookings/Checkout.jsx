import React, { useEffect, useState } from "react";
import BookingForm from "../bookings/BookingForm";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
  FaStar,FaStarHalfAlt, FaRegStar
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import { getRoomById, getRoomReviews } from "../utils/ApiFunctions";
import RoomCarousel from "../common/RoomCarousel";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
	  booked: "",
    
  });
  const { roomId } = useParams();
  const [reviews, setReviews] = useState([]);

  const renderStars = (rating) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.25; // Hiển thị nửa sao nếu phần thập phân >= 0.25
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

		return (
			<div className="star-rating">
				{[...Array(fullStars)].map((_, i) => (
					<FaStar key={`full-${i}`} style={{ color: "gold" }} />
				))}
				{hasHalfStar && <FaStarHalfAlt key="half" style={{ color: "gold" }} />}
				{[...Array(emptyStars)].map((_, i) => (
					<FaRegStar key={`empty-${i}`} style={{ color: "gold" }} />
				))}
			</div>
		);
	};


  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfo(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });

      getRoomReviews(roomId)
        .then((response) => {
          setReviews(response);
        })
        .catch((error) => {
          setError(error.message);
        });
    }, 1000);
  }, [roomId]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <section className="container" style={{ marginBottom: '50px' }}>
        <div className="row">
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading room information...</p>
            ) : error ? (
              <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            ) : (
              <div className="room-info">
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt=""
                  style={{ width: "100%", height: "200px", objectFit: 'cover', borderRadius: '5px' }}
                />
                <table className="table table-bordered" style={{ marginTop: '20px' }}>
                  <tbody>
                    <tr>
                      <th>Room Type:</th>
                      <td>{roomInfo.roomType}</td>
                    </tr>
                    <tr>
                      <th>Price per night:</th>
                      <td>${roomInfo.roomPrice}</td>
                    </tr>
                    <tr>
                      <th>Rating:</th>
                      <td>{renderStars(roomInfo.averageRating)}</td>
                    </tr>
					<tr>
				
					</tr>
                    <tr>
                      <th>Room Service:</th>
                      <td>
                        <ul className="list-unstyled" style={{ padding: '0', listStyleType: 'none' }}>
                          <li><FaWifi /> Wifi</li>
                          <li><FaTv /> Netflix Premium</li>
                          <li><FaUtensils /> Breakfast</li>
                          <li><FaWineGlassAlt /> Mini bar refreshment</li>
                          <li><FaCar /> Car Service</li>
                          <li><FaParking /> Parking Space</li>
                          <li><FaTshirt /> Laundry</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>

      <div className="container mt-5">
        <hr style={{ borderColor: '#ddd' }} />
        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review" style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: 'bold' }}>
                <strong>{review.userEmail}</strong>
                <strong>{renderStars(review.stars)}</strong>
              </p>
              <p>{review.comment}</p>
              <hr />
            </div>
          ))
        )}
      </div>

      <div className="container">
        <RoomCarousel />
      </div>
    </div>
  );
};

export default Checkout;
