import React, { useState } from "react"
import moment from "moment"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"
import { Button, Form } from "react-bootstrap";

const FindBooking = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [bookingInfo, setBookingInfo] = useState({
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	})

	const emptyBookingInfo = {
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	}
	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		try {
			const data = await getBookingByConfirmationCode(confirmationCode)
			setBookingInfo(data)
			setError(null)
		} catch (error) {
			setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}

		setTimeout(() => setIsLoading(false), 2000)
	}

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id)
			setIsDeleted(true)
			setSuccessMessage("Booking has been cancelled successfully!")
			setBookingInfo(emptyBookingInfo)
			setConfirmationCode("")
			setError(null)
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}

	return (
		<>
		  <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
			<h2 className="text-center mb-4">Find My Booking</h2>
			<Form onSubmit={handleFormSubmit} className="col-md-6">
			  <Form.Group className="mb-3" controlId="confirmationCode">
				<Form.Control
				  type="text"
				  placeholder="Enter the booking confirmation code"
				  value={confirmationCode}
				  onChange={handleInputChange}
				/>
			  </Form.Group>
			  <Button type="submit" variant="hotel" className="w-100">
				Find booking
			  </Button>
			</Form>
	
			{isLoading ? (
			  <div className="text-success">Finding your booking...</div>
			) : error ? (
			  <div className="text-danger">Error: {error}</div>
			) : bookingInfo.bookingConfirmationCode ? (
			  <div className="col-md-6 mt-4 mb-5">
				<h3>Booking Information</h3>
				<p className="text-success">Confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
				<p>Room Number: {bookingInfo.room.id}</p>
				<p>Room Type: {bookingInfo.room.roomType}</p>
				<p>Check-in Date: {moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}</p>
				<p>Check-out Date: {moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}</p>
				<p>Full Name: {bookingInfo.guestFullName}</p>
				<p>Email Address: {bookingInfo.guestEmail}</p>
				<p>Adults: {bookingInfo.numOfAdults}</p>
				<p>Children: {bookingInfo.numOfChildren}</p>
				<p>Total Guest: {bookingInfo.totalNumOfGuest}</p>
	
				{!isDeleted && (
				  <Button onClick={() => handleBookingCancellation(bookingInfo.id)} variant="danger">
					Cancel Booking
				  </Button>
				)}
			  </div>
			) : (
			  <div></div>
			)}
	
			{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
		  </div>
		</>
	  );
	};
	
	export default FindBooking;