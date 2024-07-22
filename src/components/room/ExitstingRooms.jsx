import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { deleteRoom, getHotelsByManagerEmail, getAllRoomsByHotelId, addHotel } from "../utils/ApiFunctions";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import '../styles/index.css';

const ExistingRooms = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');

  const userEmail = user?.sub;
  const userRole = user?.roles[0];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const response = await addHotel(hotelName, hotelAddress);
      console.log(response.message); // In thông báo thành công ra console
      handleCloseModal();
      setHotelName('');
      setHotelAddress('');
      fetchHotels(userEmail); // Làm mới danh sách khách sạn sau khi thêm mới
    } catch (error) {
      console.error('Failed to add hotel:', error);
    }
  };
  

  useEffect(() => {
    if (userRole === "ROLE_ADMIN" && userEmail) {
      fetchHotels(userEmail);
    }
  }, [userRole, userEmail]);

  const fetchHotels = async (managerEmail) => {
    setIsLoading(true);
    try {
      const hotelList = await getHotelsByManagerEmail(managerEmail);
      setHotels(hotelList);
      fetchRoomsForHotels(hotelList);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const fetchRoomsForHotels = async (hotels) => {
    try {
      const allRooms = [];
      for (const hotel of hotels) {
        const rooms = await getAllRoomsByHotelId(hotel.id);
        rooms.forEach(room => room.hotel = hotel);
        allRooms.push(...rooms);
      }
      setRooms(allRooms);
      setFilteredRooms(allRooms);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === selectedRoomType);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete room ${roomId}?`);
    if (confirmDelete) {
      try {
        const result = await deleteRoom(roomId);
        if (result === "") {
          setSuccessMessage(`Room No ${roomId} successfully deleted`);
          fetchHotels(userEmail);
        } else {
          console.error("Error deleting room: " + result.message);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  const calculateTotalPages = (filteredRooms, roomsPerPage) => {
    const totalRooms = filteredRooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <>
      <Button variant="primary" onClick={handleShowModal} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px',
              marginLeft: '20px', 
              marginTop: '20px'}}>
        Thêm khách sạn
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddHotel}>
            <Form.Group className="mb-3" controlId="hotelName">
              <Form.Label>Tên khách sạn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="hotelAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                required
              />
            </Form.Group>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px', 
              marginTop: '20px'
            }}>
              <Button 
                variant="secondary" 
                onClick={handleCloseModal} 
                style={{ flex: '1', marginRight: '10px' }}
              >
                Đóng
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                style={{ flex: '1', marginLeft: '10px' }}
              >
                Thêm
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    
      {isLoading ? (
        <p className="text-center">Loading existing rooms</p>
      ) : (
        <section className="mt-5 mb-5 container">
             <h2>Danh sách phòng </h2>
          <div className="d-flex justify-content-between mb-3 mt-5">
         
          </div>
          <div className="d-flex justify-content-end mb-3 mt-5">
            <Link to={"/add-room"}>
              {/* <FaPlus />  */}
              <Button variant="primary">Thêm phòng</Button>
            </Link>
          </div>

          <div className="mb-3 mb-md-0">
            <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="text-center">
                <tr>
                  <th>ID</th>
                  <th>Hotel ID</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.hotel ? room.hotel.id : 'N/A'}</td>
                  <td>{room.roomType}</td>
                  <td>{room.roomPrice}</td>
                  <td>{room.description}</td>
                  <td className="gap-2 text-center">
                    <Link to={`/edit-room/${room.id}`} className="btn btn-info btn-sm me-2">
                      <FaEye /> View
                    </Link>
                    <Link to={`/edit-room/${room.id}`} className="btn btn-warning btn-sm me-2">
                      <FaEdit /> Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <RoomPaginator
            currentPage={currentPage}
            totalPages={calculateTotalPages(filteredRooms, roomsPerPage)}
            onPageChange={handlePaginationClick}
          />
        </section>
      )}
      {successMessage && (
        <div className="alert alert-success fade show mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger fade show mt-3">{errorMessage}</div>
      )}
    </>
  );
};

export default ExistingRooms;
