import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { getBookingsByAdminId, cancelBooking, getHotelsByManagerEmail } from "../utils/ApiFunctions";
import { useAuth } from "../auth/AuthProvider";
import DateSlider from "../common/DateSlider";

const BookingsTableOneHotel = () => {
  const { user } = useAuth();
  const [bookingInfo, setBookingInfo] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const userEmail = user?.sub;
        const hotelList = await getHotelsByManagerEmail(userEmail);
        setHotels(hotelList);
        if (hotelList.length > 0) {
          setSelectedHotelId(hotelList[0].id);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, [user]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchBookings(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchBookings = async (adminId) => {
    try {
      const bookings = await getBookingsByAdminId(adminId);
      setBookingInfo(bookings);
      setFilteredBookings(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const filterBookings = (startDate, endDate) => {
    let filtered = bookingInfo;
    if (startDate && endDate) {
      filtered = bookingInfo.filter((booking) => {
        const bookingStartDate = parseISO(booking.checkInDate);
        const bookingEndDate = parseISO(booking.checkOutDate);
        return (
          bookingStartDate >= startDate &&
          bookingEndDate <= endDate &&
          bookingEndDate > startDate
        );
      });
    }
    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId) => {
    if (bookingId) {
      try {
        await cancelBooking(bookingId);
        fetchBookings(selectedHotelId);
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    } else {
      console.error("Invalid booking ID:", bookingId);
    }
  };

  return (
    <div className="container">
      <section className="table">
        <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
        <table className="table table-bordered table-hover shadow" style={{ backgroundColor: "red" }}>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Booking ID</th>
              <th>Room ID</th>
              <th>Room Type</th>
              <th>Check-In Date</th>
              <th>Check-Out Date</th>
              <th>Guest Name</th>
              <th>Guest Email</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Total Guests</th>
              <th>Confirmation Code</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredBookings.map((booking, index) => (
              <tr key={booking.bookingId}>
                <td>{index + 1}</td>
                <td>{booking.bookingId}</td>
                <td>{booking.room.id}</td>
                <td>{booking.room.roomType}</td>
                <td>{booking.checkInDate}</td>
                <td>{booking.checkOutDate}</td>
                <td>{booking.guestName}</td>
                <td>{booking.guestEmail}</td>
                <td>{booking.numOfAdults}</td>
                <td>{booking.numOfChildren}</td>
                <td>{booking.totalNumOfGuest}</td>
                <td>{booking.bookingConfirmationCode}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && <p>No booking found for the selected dates</p>}
      </section>
    </div>
  );
};

export default BookingsTableOneHotel;
