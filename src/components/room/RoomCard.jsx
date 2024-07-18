import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RoomCard = ({ room }) => {
    const { averageRating = 0, ratingCount = 0 } = room;

    // Tính toán số sao đầy đủ, sao nửa và sao trống
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.25; // Hiển thị nửa sao nếu phần thập phân >= 0.25
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <Col key={room.id} className="mb-4" xs={12}>
            <Card>
                <Card.Body className="d-flex flex-wrap align-items-center">
                    <div className="flex-shrink-0 mr-3 mb-3 mb-md-0">
                        <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm" style={{ color: "darkgoldenrod", fontFamily: "'Courier New', Courier, monospace", fontSize: "medium" }}>
                            <Card.Img 
                                variant="top"
                                src={`data:image/png;base64,${room.photo}`} // Corrected interpolation
                                alt="Room Photo"
                                style={{ width: "100%", maxWidth: "200px", height: "140px" }}
                            />
                        </Link>
                    </div>
                    <div className="flex-grow-1 ml-3 px-5">
                        <Card.Title className="hotel-color">{room.roomType}</Card.Title>
                        <Card.Title className="room-price" style={{ color: "darkgoldenrod", fontFamily: "'Courier New', Courier, monospace", fontSize: "medium", position: "relative" }}>
                            {room.roomPrice}
                            <span style={{ position: "relative", top: "-1px" }}> VNĐ/night</span>
                        </Card.Title>

                        {/* Hiển thị sao và số lượng đánh giá */}
                        <div className="d-flex align-items-center">
                            <div className="star-rating">
                                {[...Array(fullStars)].map((_, i) => (
                                    <FaStar key={`full-${i}`} style={{ color: "gold" }} />
                                ))}
                                {hasHalfStar && <FaStarHalfAlt key="half" style={{ color: "gold" }} />}
                                {[...Array(emptyStars)].map((_, i) => (
                                    <FaRegStar key={`empty-${i}`} style={{ color: "gold" }} />
                                ))}
                            </div>
                            <div className="rating-count">
                                {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
                            </div>
                        </div>

                        <Card.Text>{room.description}</Card.Text>
                    </div>
                    <div className="flex-shrink-0 mt-3">
                        <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm" style={{ color: "darkgoldenrod", fontFamily: "'Courier New', Courier, monospace", fontSize: "medium" }}>View/ Book Now</Link>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default RoomCard;
