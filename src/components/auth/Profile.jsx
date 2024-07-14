import React, { useEffect, useState } from "react";
import { deleteUser, getUserBookingsByEmail, getUser, rateRoom } from "../utils/ApiFunctions";
import { useHistory } from "react-router-dom";
import moment from "moment";
import EditProfileForm from "./EditProfileForm";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [ratings, setRatings] = useState({});
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [currentRating, setCurrentRating] = useState({ bookingId: null, roomId: null, rating: 0, comment: "" });
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const token = localStorage.getItem("token");

                const userData = await getUser(userId, token);
                setUser(userData);

                const email = userData.email;
                if (email) {
                    const bookingData = await getUserBookingsByEmail(email);
                    setBookings(bookingData);

                    // Initialize ratings state from booking data
                    const initialRatings = bookingData.reduce((acc, booking) => {
                        if (booking.room) {
                            acc[booking.room.id] = acc[booking.room.id] || {};
                            acc[booking.room.id][booking.bookingId] = {
                                rating: booking.starRating || 0,
                                comment: booking.comment || "",
                                createdAt: booking.createdAt || "",
                                rated: booking.rated || false
                            };
                        }
                        return acc;
                    }, {});
                    setRatings(initialRatings);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setErrorMessage("Error fetching data: " + error.message);
            }
        };

        fetchData();
    }, []);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (confirmed) {
            try {
                const userId = localStorage.getItem("userId");
                await deleteUser(userId);

                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");

                history.push("/", { state: { message: "Your account has been deleted." } });
                window.location.reload();
            } catch (error) {
                console.error("Error deleting account:", error.message);
                setErrorMessage("Error deleting account: " + error.message);
            }
        }
    };

    const handleEditProfile = () => {
        setShowEditProfileModal(true);
    };

    const handleRatingChange = (bookingId, roomId, newRating) => {
        setRatings(prevRatings => {
            const roomRatings = prevRatings[roomId] || {};
            if (roomRatings[bookingId] && !roomRatings[bookingId].rated) {
                return {
                    ...prevRatings,
                    [roomId]: {
                        ...roomRatings,
                        [bookingId]: {
                            ...roomRatings[bookingId],
                            rating: newRating
                        }
                    }
                };
            }
            return prevRatings;
        });
    };

    const renderStarRatingSelector = (bookingId, roomId, rating) => {
        const handleStarClick = (newRating) => {
            handleRatingChange(bookingId, roomId, newRating);
        };

        const fullStars = Math.floor(rating);
        const canRate = !ratings[roomId]?.[bookingId]?.rated;

        return (
            <div className="star-rating-selector" style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => {
                    const starRating = i + 1;
                    return (
                        <FaStar
                            key={starRating}
                            style={{ color: starRating <= fullStars ? 'gold' : 'grey', cursor: canRate ? 'pointer' : 'not-allowed' }}
                            onClick={() => canRate && handleStarClick(starRating)}
                        />
                    );
                })}
            </div>
        );
    };

    const handleCommentChange = (bookingId, roomId, newComment) => {
        setRatings(prevRatings => {
            const roomRatings = prevRatings[roomId] || {};
            if (roomRatings[bookingId] && !roomRatings[bookingId].rated) {
                return {
                    ...prevRatings,
                    [roomId]: {
                        ...roomRatings,
                        [bookingId]: {
                            ...roomRatings[bookingId],
                            comment: newComment
                        }
                    }
                };
            }
            return prevRatings;
        });
    };

    const handleSubmitRating = async () => {
        const { bookingId, roomId, rating, comment } = currentRating;
        if (rating && bookingId && roomId && !ratings[roomId]?.[bookingId]?.rated) {
            try {
                await rateRoom(user.id, roomId, bookingId, rating, comment);
                setRatings(prevRatings => ({
                    ...prevRatings,
                    [roomId]: {
                        ...prevRatings[roomId],
                        [bookingId]: {
                            ...prevRatings[roomId][bookingId],
                            rated: true
                        }
                    }
                }));
                setMessage("Rating submitted successfully!");
                setErrorMessage("");
                setShowRatingModal(false);
            } catch (error) {
                console.error("Error submitting rating:", error.message);
                setErrorMessage("Failed to submit rating.");
                setMessage("");
            }
        }
    };

    const openRatingModal = (bookingId, roomId) => {
        const currentRoomRatings = ratings[roomId] || {};
        setCurrentRating({
            bookingId,
            roomId,
            rating: currentRoomRatings[bookingId]?.rating || 0,
            comment: currentRoomRatings[bookingId]?.comment || ""
        });
        setShowRatingModal(true);
    };

    const renderStarRating = (roomId, bookingId, rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.25;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="star-rating" style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} style={{ color: 'gold' }} />
                ))}
                {hasHalfStar && <FaStarHalfAlt style={{ color: 'gold' }} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaRegStar key={`empty-${i}`} style={{ color: 'gold' }} />
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {message && <p className="text-success">{message}</p>}
            {user ? (
                <div className="card p-5 mt-5" style={{ backgroundColor: "whitesmoke" }}>
                    <h4 className="card-title text-center">User Information</h4>
                    <div className="card-body">
                        <div className="col-md-10 mx-auto">
                            <div className="card mb-3 shadow">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-flex justify-content-center align-items-center mb-4">
                                            <img
                                                src={user.profileImage || "https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"}
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">ID:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.id}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">First Name:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.firstName}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Last Name:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.lastName}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Email:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.email}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Phone:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.phone}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary" onClick={handleEditProfile}>Edit Profile</button>
                            <button className="btn btn-danger ms-2" onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            <h4 className="text-center mt-4">Your Bookings</h4>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Room ID</th>
                        <th>Room Type</th>
                        <th>Check-in Date</th>
                        <th>Check-out Date</th>
                        <th>Confirmation Code</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date Rated</th>
                        <th>Rated</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={index}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.room ? booking.room.id : ""}</td>
                            <td>{booking.room ? booking.room.roomType : ""}</td>
                            <td>{moment(booking.checkInDate).format("MMM Do, YYYY")}</td>
                            <td>{moment(booking.checkOutDate).format("MMM Do, YYYY")}</td>
                            <td>{booking.bookingConfirmationCode}</td>
                            <td>
                                {renderStarRatingSelector(booking.bookingId, booking.room.id, ratings[booking.room.id]?.[booking.bookingId]?.rating || 0)}
                                <button
                                    className="btn btn-primary btn-sm mt-2"
                                    onClick={() => openRatingModal(booking.bookingId, booking.room.id)}
                                    disabled={ratings[booking.room.id]?.[booking.bookingId]?.rated}
                                >
                                    Vote
                                </button>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={ratings[booking.room.id]?.[booking.bookingId]?.comment || ""}
                                    onChange={(e) => handleCommentChange(booking.bookingId, booking.room.id, e.target.value)}
                                    placeholder="Leave a comment"
                                    disabled={ratings[booking.room.id]?.[booking.bookingId]?.rated}
                                />
                            </td>
                            <td>{moment(ratings[booking.room.id]?.[booking.bookingId]?.createdAt).format("MMM Do, YYYY HH:mm:ss") || ""}</td>
                            <td>{ratings[booking.room.id]?.[booking.bookingId]?.rated ? "YES" : "NO"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {renderStarRatingSelector(currentRating.bookingId, currentRating.roomId, currentRating.rating)}
                        <textarea
                            className="form-control mt-3"
                            rows="3"
                            value={currentRating.comment}
                            onChange={(e) => setCurrentRating(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Leave a comment (optional)"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRatingModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSubmitRating}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditProfileForm user={user} setUser={setUser} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;
