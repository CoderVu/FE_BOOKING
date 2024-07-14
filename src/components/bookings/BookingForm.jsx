import React, { useState, useEffect } from "react";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useParams, useHistory } from 'react-router-dom';
import { Form, Button, Col, Row } from "react-bootstrap";
import BookingSummary from "./BookingSumary"
import moment from "moment";

const BookingForm = () => {
    const [isValidated, setIsValidated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");
    const [roomPrice, setRoomPrice] = useState(0);
    const [booking, setBooking] = useState({
        guestName: "",
        guestEmail: "",
        checkInDate: "",
        checkOutDate: "",
        numOfAdults: "",
        numOfChildren: "",   
    });
    const { roomId } = useParams();
    const history = useHistory();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
        setErrorMessages("");
    }

    const getRoomPriceById = async (roomId) => {
        try {
            const response = await getRoomById(roomId);
            setRoomPrice(response.roomPrice);
        }
        catch (err) {
            console.error("Error fetching room price:", err);
        }
    }

    useEffect(() => {
        getRoomPriceById(roomId);
    }, [roomId]);

    const calculatePayment = () => {
        const paymentPerDay = roomPrice ? roomPrice : 0;
        const diffInDays = moment(booking.checkOutDate).diff(moment(booking.checkInDate), 'days');
        return diffInDays * paymentPerDay;
    }

    const isGuestCountValid = () => {
        const adultCount = parseInt(booking.numOfAdults);
        const childrenCount = parseInt(booking.numOfChildren);
        const totalCount = adultCount + childrenCount;
        return totalCount >= 1 && childrenCount >=1;
    }

    const isCheckOutDateValid = () => {
        return moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
            e.stopPropagation();
        }
        else {
            setIsSubmitted(true);
        }
        setIsValidated(true);
    }

    const handleBooking = async () => {
        try {
            const confirmationCode = await bookRoom(roomId, booking);
            setIsSubmitted(true);
            history.push("/", { message: confirmationCode });
        } catch (error) {
            setErrorMessages(error.message);
            history.push("/", { error: errorMessages });
        }
    }
    

    return (
        <>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card card-body mt-5">
                            <h4 className="card-title" style={{textAlign:'center'}}>Reserve Room</h4>
                            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label htmlFor="guestName">Full Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="guestName"
                                        name="guestName"
                                        value={booking.guestName}
                                        placeholder="Enter your full name here"
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your full name
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label htmlFor="guestEmail">Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        id="guestEmail"
                                        name="guestEmail"
                                        value={booking.guestEmail}
                                        placeholder="Enter your email address"
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your email address
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Form.Group as={Col}>
                                        <Form.Label htmlFor="checkInDate">Check-In Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            id="checkInDate"
                                            name="checkInDate"
                                            value={booking.checkInDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-in date
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label htmlFor="checkOutDate">Check-Out Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            id="checkOutDate"
                                            name="checkOutDate"
                                            value={booking.checkOutDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a check-out date
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col}>
                                        <Form.Label htmlFor="numOfAdults">Adults:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            id="numOfAdults"
                                            name="numOfAdults"
                                            value={booking.numOfAdults}
                                            placeholder="0"
                                            min={1}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select at least 1 adult
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label htmlFor="numberOfChildren">Children:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            id="numOfChildren"
                                            name="numOfChildren"
                                            value={booking.numOfChildren}
                                            placeholder="0"
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Row>

                                <div className="form-group mt-2 mb-2">
                                    <Button type="submit" className="btn btn-hotel">
                                        Continue
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>

                    <div className="col-md-6">
                        {isSubmitted && (
                            <BookingSummary
                                booking={booking}
                                payment={calculatePayment()}
                                isFormValid={isValidated}
                                onConfirm={handleBooking}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingForm;
