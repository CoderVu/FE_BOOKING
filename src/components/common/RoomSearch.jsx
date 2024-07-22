import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { getAvailableRooms, getAllHotels } from "../utils/ApiFunctions";
import RoomSearchResults from "./RoomSearchResult";
import RoomTypeSelector from "./RoomTypeSelector";
import '../styles/RoomSearch.css';

const RoomSearch = () => {
	const [searchQuery, setSearchQuery] = useState({
	  checkInDate: "",
	  checkOutDate: "",
	  roomType: "",
	  address: ""
	});
  
	const [errorMessage, setErrorMessage] = useState("");
	const [availableRooms, setAvailableRooms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hotels, setHotels] = useState([]);
  
	useEffect(() => {
	  // Lấy danh sách khách sạn khi component được mount
	  getAllHotels()
		.then((data) => setHotels(data))
		.catch((error) => {
		  setErrorMessage("Error fetching hotels: " + error.message);
		});
	}, []);
  
	const handleSearch = (e) => {
	  e.preventDefault();
	  const checkInMoment = moment(searchQuery.checkInDate);
	  const checkOutMoment = moment(searchQuery.checkOutDate);
	  if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
		setErrorMessage("Please enter valid dates");
		return;
	  }
	  if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
		setErrorMessage("Check-out date must be after check-in date");
		return;
	  }
	  setIsLoading(true);
	  getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomType, searchQuery.address)
		.then((response) => {
		  if (response.data.length === 0) {
			setErrorMessage("No rooms available for the selected dates, room type, and address.");
		  } else {
			setErrorMessage("");
		  }
		  setAvailableRooms(response.data);
		})
		.catch((error) => {
		  setErrorMessage("Error fetching rooms: " + error.message);
		})
		.finally(() => {
		  setIsLoading(false);
		});
	};
  
	const handleInputChange = (e) => {
	  const { name, value } = e.target;
	  setSearchQuery({ ...searchQuery, [name]: value });
	  const checkInDate = moment(searchQuery.checkInDate);
	  const checkOutDate = moment(searchQuery.checkOutDate);
	  if (checkInDate.isValid() && checkOutDate.isValid()) {
		setErrorMessage("");
	  }
	};
  
	const handleClearSearch = () => {
	  setSearchQuery({
		checkInDate: "",
		checkOutDate: "",
		roomType: "",
		address: ""
	  });
	  setAvailableRooms([]);
	};
  
	return (
	  <>
		<Container className="room-search-container shadow mt-n5 mb-5 py-5">
		  <Form onSubmit={handleSearch}>
			<Row className="justify-content-center">
			  <Col xs={12} md={3}>
				<Form.Group controlId="checkInDate">
				  <Form.Label>Check-in Date</Form.Label>
				  <Form.Control
					type="date"
					name="checkInDate"
					value={searchQuery.checkInDate}
					onChange={handleInputChange}
					min={moment().format("YYYY-MM-DD")}
				  />
				</Form.Group>
			  </Col>
			  <Col xs={12} md={3}>
				<Form.Group controlId="checkOutDate">
				  <Form.Label>Check-out Date</Form.Label>
				  <Form.Control
					type="date"
					name="checkOutDate"
					value={searchQuery.checkOutDate}
					onChange={handleInputChange}
					min={moment().format("YYYY-MM-DD")}
				  />
				</Form.Group>
			  </Col>
			  <Col xs={12} md={3}>
				<Form.Group controlId="roomType">
				  <Form.Label>Room Type</Form.Label>
				  <div className="d-flex">
					<RoomTypeSelector
					  handleRoomInputChange={handleInputChange}
					  newRoom={searchQuery}
					/>
				  </div>
				</Form.Group>
			  </Col>
			  <Col xs={12} md={3}>
				<Form.Group controlId="address">
				  <Form.Label>Address</Form.Label>
				  <Form.Control
					as="select"
					name="address"
					value={searchQuery.address}
					onChange={handleInputChange}
				  >
					<option value="">Select Address</option>
					{
					hotels.reduce((unique, hotel) => {
						if (!unique.some(obj => obj.address === hotel.address)) {
							unique.push(hotel);
						}
						return unique;
						}, [])
						.map((hotel) => (
						<option key={hotel.id} value={hotel.address}>
							{hotel.address}
						</option>
						))
					}
	
				  </Form.Control>
				</Form.Group>
		  
			  </Col>
			  <Button variant="secondary" type="submit" className="ml-2 btn-search">
					  Search
					</Button>
			</Row>
		  </Form>
  
		  {isLoading ? (
			<p className="mt-4">Finding available rooms....</p>
		  ) : availableRooms.length > 0 ? (
			<RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
		  ) : (
			<p className="mt-4"></p>
		  )}
		  {errorMessage && <p className="text-danger">{errorMessage}</p>}
		</Container>
	  </>
	);
  };
  
  export default RoomSearch;
  