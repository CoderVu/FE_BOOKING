import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { bookRoom, getRoomById } from "../utils/ApiFunctions"; // Import getRoomById

const BookingSummary = ({ booking, isFormValid, onConfirm }) => {
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0); // Add state to store room price
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error messages
  const history = useHistory();
  const { roomId } = useParams();
  const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
  const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
  const numberOfDays = checkOutDate.diff(checkInDate, "days");

  // Calculate the total payment based on the room price and number of days
  const calculateTotalPayment = () => {
    return roomPrice * numberOfDays;
  }

  // Fetch room price when the component mounts
  useEffect(() => {
    const fetchRoomPrice = async () => {
      try {
        const response = await getRoomById(roomId);
        setRoomPrice(response.roomPrice); // Set room price in state
      } catch (error) {
        console.error("Error fetching room price:", error);
      }
    };

    fetchRoomPrice();
  }, [roomId]);

  const handleConfirmBooking = async () => {
    setIsProcessingPayment(true);
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsBookingConfirmed(true);
      history.push("/booking-success", { 
        message: `${confirmationCode}`,
        confirmationCode: confirmationCode
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
      setErrorMessage(error.message); // Set the error message for display
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isDateValid = checkOutDate.isSameOrAfter(checkInDate);

  return (
    <div className="card card-body mt-5">
      <h4>Reservation Summary</h4>
      <p>
        <strong>Full Name:</strong> {booking.guestName}
      </p>
      <p>
        <strong>Email:</strong> {booking.guestEmail}
      </p>
      <p>
        <strong>Phone Number:</strong> {booking.numberPhone}
      </p>
      <p>
        <strong>Check-In Date:</strong> {checkInDate.format("MM Do YYYY")}
      </p>
      <p>
        <strong>Check-Out Date:</strong> {checkOutDate.format("MM Do YYYY")}
      </p>
      <p>
        <strong>Number of Days:</strong> {numberOfDays}
      </p>
      <div>
        <h5>Number of Guests</h5>
        <p>
          <strong>
            Adult{booking.numOfAdults > 1 ? "s" : ""}: {booking.numOfAdults}
          </strong>
        </p>
        <p>
          <strong>Children:</strong> {booking.numOfChildren}
        </p>
      </div>
      {calculateTotalPayment() > 0 ? (
        <>
          <p>
            <strong>Total Payment:</strong> ${calculateTotalPayment()}
          </p>
          <Button
            variant="success"
            onClick={handleConfirmBooking}
            disabled={!isFormValid || !isDateValid || isBookingConfirmed}
          >
            {isProcessingPayment ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                <span>Processing Payment...</span>
              </>
            ) : (
              "Confirm Booking and Process Payment"
            )}
          </Button>
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>} {/* Display error message */}
        </>
      ) : (
        <p className="text-danger">Check-out date must be after check-in date.</p>
      )}
    </div>
  );
}

export default BookingSummary;
